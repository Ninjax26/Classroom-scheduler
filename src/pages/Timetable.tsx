import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle } from "lucide-react";
import { TimetableApiService, Event, Room, TimetableSlot } from "@/services/timetableApi";
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
  const { toast } = useToast();

  // Sample data - in real app, this would come from your Supabase data
  const sampleEvents: Event[] = [
    { id: 1, batch: "CS2024A", subject: "Mathematics", teacher: "Dr. Smith", room_type_required: "classroom", min_capacity: 35 },
    { id: 2, batch: "CS2024A", subject: "Mathematics", teacher: "Dr. Smith", room_type_required: "classroom", min_capacity: 35 },
    { id: 3, batch: "CS2024A", subject: "Programming", teacher: "Prof. Johnson", room_type_required: "lab", min_capacity: 25 },
    { id: 4, batch: "CS2024A", subject: "Physics", teacher: "Dr. Brown", room_type_required: "lab", min_capacity: 30 },
    { id: 5, batch: "CS2024B", subject: "Mathematics", teacher: "Dr. Smith", room_type_required: "classroom", min_capacity: 30 },
    { id: 6, batch: "CS2024B", subject: "Chemistry", teacher: "Dr. Wilson", room_type_required: "lab", min_capacity: 25 },
    { id: 7, batch: "CS2024B", subject: "English", teacher: "Ms. Davis", room_type_required: "classroom", min_capacity: 30 },
  ];

  const sampleRooms: Room[] = [
    { id: "CR-101", room_type: "classroom", capacity: 40 },
    { id: "CR-102", room_type: "classroom", capacity: 35 },
    { id: "CR-103", room_type: "classroom", capacity: 30 },
    { id: "LAB-201", room_type: "lab", capacity: 25 },
    { id: "LAB-202", room_type: "lab", capacity: 30 },
  ];

  const generateTimetable = async () => {
    setLoading(true);
    try {
      const response = await TimetableApiService.generateTimetable({
        events: sampleEvents,
        rooms: sampleRooms,
        num_days: 5,
        periods_per_day: 6,
        max_classes_per_day_per_batch: { "CS2024A": 3, "CS2024B": 3 },
        one_subject_per_day: true,
        rotate_start: true,
        randomize_within_day: true,
        rng_seed: 42,
      });

      const displayData = TimetableApiService.convertToDisplayFormat(
        response,
        sampleEvents,
        sampleRooms,
        5,
        6
      );

      setTimetable(displayData.timetable);
      setUnassigned(displayData.unassigned);
      setRoomUtilization(displayData.roomUtilization);
      setSuccess(response.success);
      setMessage(response.message);

      toast({
        title: response.success ? "Timetable Generated!" : "Partial Success",
        description: response.message,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Timetable generation failed:", error);
      toast({
        title: "Error",
        description: "Failed to generate timetable. Please check if the backend is running.",
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
                                    {slot.room_id}
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
                    <span className="font-medium">{roomId}</span>
                    <Badge className={getRoomTypeColor(
                      sampleRooms.find(r => r.id === roomId)?.room_type || 'classroom'
                    )}>
                      {sampleRooms.find(r => r.id === roomId)?.room_type || 'classroom'}
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
