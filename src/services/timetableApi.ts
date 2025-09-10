// Timetable API service for calling Python backend

export interface Room {
  id: string;
  room_type: 'classroom' | 'lab';
  capacity: number;
}

export interface Event {
  id: number;
  batch: string;
  subject: string;
  teacher: string;
  room_type_required?: 'classroom' | 'lab';
  min_capacity?: number;
  span_slots?: number;
}

export interface TimetableRequest {
  events: Event[];
  rooms: Room[];
  num_days?: number;
  periods_per_day?: number;
  max_classes_per_day_per_batch?: Record<string, number>;
  one_subject_per_day?: boolean;
  rotate_start?: boolean;
  randomize_within_day?: boolean;
  rng_seed?: number;
}

export interface TimetableResponse {
  time_assignment: Record<number, number>; // event_id -> slot
  room_assignment: Record<number, string>; // event_id -> room_id
  unassigned: number[]; // event_ids that couldn't be placed
  success: boolean;
  message: string;
}

export interface TimetableSlot {
  event_id: number;
  batch: string;
  subject: string;
  teacher: string;
  room_id: string;
  room_type: 'classroom' | 'lab';
  day: number;
  period: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class TimetableApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async generateTimetable(request: TimetableRequest): Promise<TimetableResponse> {
    return this.request<TimetableResponse>('/generate-timetable', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  // Helper to convert timetable response to display format
  static convertToDisplayFormat(
    response: TimetableResponse,
    events: Event[],
    rooms: Room[],
    num_days: number,
    periods_per_day: number
  ): {
    timetable: TimetableSlot[][][]; // [day][period][slot]
    unassigned: Event[];
    roomUtilization: Record<string, { used: number; total: number; percentage: number }>;
  } {
    const eventMap = new Map(events.map(e => [e.id, e]));
    const roomMap = new Map(rooms.map(r => [r.id, r]));
    
    // Initialize timetable grid
    const timetable: TimetableSlot[][][] = Array(num_days)
      .fill(null)
      .map(() => Array(periods_per_day).fill(null).map(() => []));

    // Fill timetable with assigned events
    Object.entries(response.time_assignment).forEach(([eventIdStr, slot]) => {
      const eventId = parseInt(eventIdStr);
      const event = eventMap.get(eventId);
      const roomId = response.room_assignment[eventId];
      const room = roomMap.get(roomId);
      
      if (event && room) {
        const day = Math.floor(slot / periods_per_day);
        const period = slot % periods_per_day;
        
        timetable[day][period].push({
          event_id: eventId,
          batch: event.batch,
          subject: event.subject,
          teacher: event.teacher,
          room_id: roomId,
          room_type: room.room_type,
          day,
          period,
        });
      }
    });

    // Get unassigned events
    const unassigned = response.unassigned
      .map(id => eventMap.get(id))
      .filter((event): event is Event => event !== undefined);

    // Calculate room utilization
    const totalSlots = num_days * periods_per_day;
    const roomUsage = new Map<string, number>();
    
    Object.values(response.room_assignment).forEach(roomId => {
      roomUsage.set(roomId, (roomUsage.get(roomId) || 0) + 1);
    });

    const roomUtilization: Record<string, { used: number; total: number; percentage: number }> = {};
    rooms.forEach(room => {
      const used = roomUsage.get(room.id) || 0;
      roomUtilization[room.id] = {
        used,
        total: totalSlots,
        percentage: (used / totalSlots) * 100,
      };
    });

    return {
      timetable,
      unassigned,
      roomUtilization,
    };
  }
}
