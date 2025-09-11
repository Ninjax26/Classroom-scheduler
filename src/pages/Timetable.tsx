import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle } from "lucide-react";
import { TimetableApiService, Event, Room, TimetableSlot } from "@/services/timetableApi";
import { useFaculty, useSubjects, useBatches, useRooms } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

export default function Timetable() {
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState<TimetableSlot[][][]>([]);
  const [unassigned, setUnassigned] = useState<Event[]>([]);
  const [roomUtilization, setRoomUtilization] = useState<Record<string, { used: number; total: number; percentage: number }>>({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [roomNameById, setRoomNameById] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { faculty } = useFaculty();
  const { subjects } = useSubjects();
  const { batches } = useBatches();
  const { rooms } = useRooms();

  // Build API payloads from DB data
  const buildRooms = (): Room[] => {
    return rooms
      .filter(r => r.status !== 'maintenance')
      .map<Room>(r => ({ id: r.id, room_type: r.type === 'lab' ? 'lab' : 'classroom', capacity: r.capacity }));
  };

  // Build events for all batches and subjects. If a batch has no assignedSubjects,
  // generate events for all subjects (cross-product fallback).
  // Teacher assignment: round-robin per department, fallback to any faculty or 'TBD'.
  const buildEvents = (): Event[] => {
    const subjectById = new Map(subjects.map(s => [s.id, s]));
    const subjectByCode = new Map(subjects.map(s => [s.subjectCode, s]));
    const subjectByName = new Map(subjects.map(s => [s.subjectName, s]));
    const facultyByDept = new Map<string, string[]>();
    faculty.forEach(f => {
      const list = facultyByDept.get(f.department) || [];
      list.push(f.name);
      facultyByDept.set(f.department, list);
    });
    const rrIndexByDept = new Map<string, number>();

    const pickTeacher = (department: string): string => {
      const list = facultyByDept.get(department) || [];
      if (list.length === 0) return faculty[0]?.name || 'TBD';
      const idx = rrIndexByDept.get(department) || 0;
      const teacher = list[idx % list.length];
      rrIndexByDept.set(department, (idx + 1) % list.length);
      return teacher;
    };

    const events: Event[] = [];
    // Compute max capacity available per room type to cap min_capacity
    const classroomMax = rooms.filter(r => r.type !== 'lab').reduce((m, r) => Math.max(m, r.capacity), 0);
    const labMax = rooms.filter(r => r.type === 'lab').reduce((m, r) => Math.max(m, r.capacity), 0);
    let nextId = 1;
    batches.forEach(b => {
      const subjectIds = (b.assignedSubjects && b.assignedSubjects.length > 0)
        ? b.assignedSubjects
        : // Fallback: all subjects if none assigned
          subjects.map(s => s.id);

      subjectIds.forEach(subId => {
        // Resolve subject via id, then code, then name
        const subj = subjectById.get(subId) || subjectByCode.get(subId) || subjectByName.get(subId);
        if (!subj) return;
        const teacherName = pickTeacher(subj.department);
        const weekly = subj.weeklyHours || 1;
        const subjectTitle = subj.subjectName || subj.subjectCode || 'Subject';
        const maybeLabStrings = [subjectTitle, subj.description || '', subj.subjectCode || ''];
        const requiresLab = maybeLabStrings.some(s => (s || '').toLowerCase().includes('lab'));
        for (let i = 0; i < weekly; i++) {
          const requiredLab = requiresLab;
          const maxCap = requiredLab ? labMax : classroomMax;
          const desired = (b.size as number) || 30;
          const minCap = maxCap > 0 ? Math.min(desired, maxCap) : desired;
          events.push({
            id: nextId++,
            batch: b.batchId,
            subject: subjectTitle,
            teacher: teacherName,
            room_type_required: requiredLab ? 'lab' : 'classroom',
            min_capacity: minCap,
            span_slots: 1,
          });
        }
      });
    });
    return events;
  };

  const generateTimetable = async () => {
    setLoading(true);
    try {
      // Ensure backend is reachable
      try {
        await TimetableApiService.healthCheck();
      } catch (e: any) {
        toast({
          title: "Backend unavailable",
          description: "Cannot reach timetable service. Check VITE_API_URL and backend server.",
          variant: "destructive",
        });
        return;
      }

      const apiEvents = buildEvents();
      const apiRooms = buildRooms();

      if (apiRooms.length === 0) {
        toast({ title: "No rooms available", description: "Add rooms in Data > Rooms.", variant: "destructive" });
        return;
      }
      if (apiEvents.length === 0) {
        toast({ title: "No events to schedule", description: "Ensure batches have assigned subjects.", variant: "destructive" });
        return;
      }

      const response = await TimetableApiService.generateTimetable({
        events: apiEvents,
        rooms: apiRooms,
        num_days: 5,
        periods_per_day: 6,
        max_classes_per_day_per_batch: Object.fromEntries(batches.map(b => [b.batchId, 3])),
        one_subject_per_day: true,
        rotate_start: true,
        randomize_within_day: true,
        // Use a dynamic seed so successive generations differ. Remove to let backend be fully random
        rng_seed: Date.now(),
      });

      const displayData = TimetableApiService.convertToDisplayFormat(
        response,
        apiEvents,
        apiRooms,
        5,
        6
      );

      setTimetable(displayData.timetable);
      setUnassigned(displayData.unassigned);
      setRoomUtilization(displayData.roomUtilization);
      setRoomNameById(Object.fromEntries(rooms.map(r => [r.id, r.name])));
      setSuccess(response.success);
      setMessage(response.message);

      toast({
        title: response.success ? "Timetable Generated!" : "Partial Success",
        description: response.message,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Timetable generation failed:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to generate timetable.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoomTypeColor = (roomType: string) => {
    return roomType === 'lab' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getBatchColor = (batch: string) => {
    const colors = ['bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800', 'bg-pink-100 text-pink-800'];
    const index = batch.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate optimized timetables using AI-powered scheduling
          </p>
        </div>
        <Button 
          onClick={generateTimetable} 
          disabled={loading}
          className="bg-gradient-primary hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Generate Timetable
            </>
          )}
        </Button>
      </div>

      {/* Status Alert */}
      {message && (
        <Alert className={success ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          {success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          )}
          <AlertDescription className={success ? "text-green-800" : "text-yellow-800"}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Unassigned Events */}
      {unassigned.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Unassigned Events ({unassigned.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unassigned.map((event) => (
                <div key={event.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    {event.batch}
                  </Badge>
                  <span className="font-medium">{event.subject}</span>
                  <span className="text-muted-foreground">- {event.teacher}</span>
                  <Badge className={getRoomTypeColor(event.room_type_required || 'classroom')}>
                    {event.room_type_required || 'classroom'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid */}
      {timetable.length > 0 && (
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Generated Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-50 font-medium text-left w-20">
                      Period
                    </th>
                    {DAYS.map((day, index) => (
                      <th key={day} className="border border-gray-300 p-2 bg-gray-50 font-medium text-center min-w-48">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period, periodIndex) => (
                    <tr key={period}>
                      <td className="border border-gray-300 p-2 bg-gray-50 font-medium text-center">
                        {period}
                      </td>
                      {DAYS.map((day, dayIndex) => (
                        <td key={`${day}-${periodIndex}`} className="border border-gray-300 p-2 min-h-16">
                          <div className="space-y-1">
                            {timetable[dayIndex]?.[periodIndex]?.map((slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="p-2 rounded border text-xs space-y-1"
                              >
                                <div className="flex items-center gap-1">
                                  <Badge className={getBatchColor(slot.batch)}>
                                    {slot.batch}
                                  </Badge>
                                  <Badge className={getRoomTypeColor(slot.room_type)}>
                                    {roomNameById[slot.room_id] || slot.room_id}
                                  </Badge>
                                </div>
                                <div className="font-medium">{slot.subject}</div>
                                <div className="text-muted-foreground">{slot.teacher}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Utilization */}
      {Object.keys(roomUtilization).length > 0 && (
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Room Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(roomUtilization).map(([roomId, stats]) => (
                <div key={roomId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{rooms.find(r => r.id === roomId)?.name || roomId}</span>
                    <Badge className={getRoomTypeColor(
                      (rooms.find(r => r.id === roomId)?.type === 'lab') ? 'lab' : 'classroom'
                    )}>
                      {(rooms.find(r => r.id === roomId)?.type === 'lab') ? 'lab' : 'classroom'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Used:</span>
                      <span>{stats.used}/{stats.total} slots</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {stats.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
