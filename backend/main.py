from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Set, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import random
from collections import defaultdict

app = FastAPI(title="Timetable Generator API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Data Models ----------
class RoomType(str, Enum):
    CLASSROOM = "classroom"
    LAB = "lab"

class Room(BaseModel):
    id: str
    room_type: RoomType
    capacity: int

class Event(BaseModel):
    id: int
    batch: str
    subject: str
    teacher: str
    room_type_required: RoomType = RoomType.CLASSROOM
    min_capacity: int = 30
    span_slots: int = 1

class TimetableRequest(BaseModel):
    events: List[Event]
    rooms: List[Room]
    num_days: int = 5
    periods_per_day: int = 6
    max_classes_per_day_per_batch: Optional[Dict[str, int]] = None
    one_subject_per_day: bool = True
    rotate_start: bool = True
    randomize_within_day: bool = False
    rng_seed: Optional[int] = 42

class TimetableResponse(BaseModel):
    time_assignment: Dict[int, int]  # event_id -> slot
    room_assignment: Dict[int, str]  # event_id -> room_id
    unassigned: List[int]  # event_ids that couldn't be placed
    success: bool
    message: str

# ---------- Algorithm Implementation ----------
def total_slots(num_days: int, periods_per_day: int) -> int:
    return num_days * periods_per_day

def day_period_from_slot(slot: int, periods_per_day: int) -> Tuple[int, int]:
    """Return (day_index, period_index), 0-based."""
    return divmod(slot, periods_per_day)

def slot_from_day_period(day: int, period: int, periods_per_day: int) -> int:
    return day * periods_per_day + period

def build_conflict_graph(events: List[Event]) -> Dict[int, Set[int]]:
    """Edge between events if they share batch OR teacher."""
    graph: Dict[int, Set[int]] = {e.id: set() for e in events}
    
    by_batch: Dict[str, List[int]] = defaultdict(list)
    by_teacher: Dict[str, List[int]] = defaultdict(list)
    
    for e in events:
        by_batch[e.batch].append(e.id)
        by_teacher[e.teacher].append(e.id)
    
    # Connect all pairs that share the same batch
    for _, ids in by_batch.items():
        for i in range(len(ids)):
            for j in range(i + 1, len(ids)):
                u, v = ids[i], ids[j]
                graph[u].add(v)
                graph[v].add(u)
    
    # Connect all pairs that share the same teacher
    for _, ids in by_teacher.items():
        for i in range(len(ids)):
            for j in range(i + 1, len(ids)):
                u, v = ids[i], ids[j]
                graph[u].add(v)
                graph[v].add(u)
    
    return graph

def is_room_available(room: Room, slot: int, room_assignments: Dict[Tuple[str, int], int]) -> bool:
    """Check if a room is available at a given slot."""
    return (room.id, slot) not in room_assignments

def find_suitable_rooms(event: Event, rooms: List[Room]) -> List[Room]:
    """Find rooms that match event requirements."""
    suitable = []
    for room in rooms:
        if (room.room_type == event.room_type_required and room.capacity >= event.min_capacity):
            suitable.append(room)
    return suitable

def assign_slots_and_rooms_greedy(
    events: List[Event],
    rooms: List[Room],
    graph: Dict[int, Set[int]],
    num_days: int,
    periods_per_day: int,
    max_classes_per_day_per_batch: Optional[Dict[str, int]] = None,
    one_subject_per_day: bool = True,
    rotate_start: bool = True,
    randomize_within_day: bool = False,
    rng_seed: Optional[int] = 42
) -> Tuple[Dict[int, int], Dict[int, str], List[int]]:
    """Main timetable generation algorithm."""
    if rng_seed is not None:
        random.seed(rng_seed)
    
    T = total_slots(num_days, periods_per_day)
    
    # Order events by difficulty
    degree = {e.id: len(graph[e.id]) for e in events}
    ordered = sorted(events, key=lambda e: (
        -degree[e.id],  # higher degree first
        e.room_type_required == RoomType.LAB,  # labs second
        -e.min_capacity,  # higher capacity needs first
        e.subject,
        e.batch
    ))
    
    # Tracking structures
    time_assignment: Dict[int, int] = {}
    room_assignment: Dict[int, str] = {}
    room_occupancy: Dict[Tuple[str, int], int] = {}
    classes_per_day: Dict[Tuple[str, int], int] = defaultdict(int)
    subject_on_day: Set[Tuple[str, str, int]] = set()
    
    # Prebuild slot orders
    base_slot_order = list(range(T))
    
    def slot_iter_for_index(idx: int):
        """Yield slots in a fair order for event #idx."""
        if rotate_start:
            start = idx % T
            order = base_slot_order[start:] + base_slot_order[:start]
        else:
            order = base_slot_order[:]
        
        if randomize_within_day:
            mixed = []
            for d in range(num_days):
                day_slots = [slot_from_day_period(d, p, periods_per_day) for p in range(periods_per_day)]
                random.shuffle(day_slots)
                mixed.extend(day_slots)
            
            if rotate_start:
                start = idx % T
                order = mixed[start:] + mixed[:start]
            else:
                order = mixed
        
        return order
    
    event_by_id = {e.id: e for e in events}
    unassigned: List[int] = []
    
    for idx, e in enumerate(ordered):
        placed = False
        slots_to_try = slot_iter_for_index(idx)
        suitable_rooms = find_suitable_rooms(e, rooms)
        
        if not suitable_rooms:
            unassigned.append(e.id)
            continue
        
        for s in slots_to_try:
            day, _period = day_period_from_slot(s, periods_per_day)
            
            # Check daily cap for the batch
            if max_classes_per_day_per_batch is not None:
                cap = max_classes_per_day_per_batch.get(e.batch, None)
                if cap is not None and classes_per_day[(e.batch, day)] >= cap:
                    continue
            
            # One subject per day per batch
            if one_subject_per_day and (e.batch, e.subject, day) in subject_on_day:
                continue
            
            # Check neighbor clashes
            neighbors = graph[e.id]
            if any((n in time_assignment and time_assignment[n] == s) for n in neighbors):
                continue
            
            # Try to find an available room
            available_room = None
            suitable_rooms_sorted = sorted(suitable_rooms, key=lambda r: r.capacity)
            
            for room in suitable_rooms_sorted:
                if is_room_available(room, s, room_occupancy):
                    available_room = room
                    break
            
            if available_room is None:
                continue
            
            # All checks passed → assign time and room
            time_assignment[e.id] = s
            room_assignment[e.id] = available_room.id
            room_occupancy[(available_room.id, s)] = e.id
            classes_per_day[(e.batch, day)] += 1
            
            if one_subject_per_day:
                subject_on_day.add((e.batch, e.subject, day))
            
            placed = True
            break
        
        if not placed:
            unassigned.append(e.id)
    
    return time_assignment, room_assignment, unassigned

# ---------- API Endpoints ----------
@app.get("/")
async def root():
    return {"message": "Timetable Generator API", "version": "1.0.0"}

@app.post("/generate-timetable", response_model=TimetableResponse)
async def generate_timetable(request: TimetableRequest):
    try:
        # Convert Pydantic models to dataclasses for algorithm
        events = [Event(**event.dict()) for event in request.events]
        rooms = [Room(**room.dict()) for room in request.rooms]
        
        # Build conflict graph
        graph = build_conflict_graph(events)
        
        # Generate timetable
        time_assignment, room_assignment, unassigned = assign_slots_and_rooms_greedy(
            events=events,
            rooms=rooms,
            graph=graph,
            num_days=request.num_days,
            periods_per_day=request.periods_per_day,
            max_classes_per_day_per_batch=request.max_classes_per_day_per_batch,
            one_subject_per_day=request.one_subject_per_day,
            rotate_start=request.rotate_start,
            randomize_within_day=request.randomize_within_day,
            rng_seed=request.rng_seed
        )
        
        success = len(unassigned) == 0
        message = f"Generated timetable with {len(time_assignment)} assignments" + (
            f" and {len(unassigned)} unassigned events" if unassigned else ""
        )
        
        return TimetableResponse(
            time_assignment=time_assignment,
            room_assignment=room_assignment,
            unassigned=unassigned,
            success=success,
            message=message
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timetable generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
