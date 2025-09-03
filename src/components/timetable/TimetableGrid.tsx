import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimetableSession {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  batch: string;
  time: string;
  duration: number;
  type: "lecture" | "lab" | "tutorial";
  hasConflict?: boolean;
}

interface TimeSlot {
  time: string;
  sessions: Record<string, TimetableSession | null>; // day -> session
}

interface TimetableGridProps {
  timeSlots: TimeSlot[];
  days: string[];
  title?: string;
  className?: string;
}

const sessionTypeColors = {
  lecture: "bg-primary/10 text-primary border-primary/20",
  lab: "bg-accent/10 text-accent border-accent/20",
  tutorial: "bg-success/10 text-success border-success/20"
};

export function TimetableGrid({ 
  timeSlots, 
  days, 
  title = "Weekly Timetable",
  className 
}: TimetableGridProps) {
  return (
    <Card className={cn("shadow-academic", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[800px]">
            {/* Header */}
            <div className="p-3 font-semibold text-center bg-muted rounded-lg">
              Time
            </div>
            {days.map((day) => (
              <div key={day} className="p-3 font-semibold text-center bg-muted rounded-lg">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((slot) => (
              <>
                <div key={`time-${slot.time}`} className="p-3 text-center font-medium text-muted-foreground bg-secondary/50 rounded-lg flex items-center justify-center">
                  {slot.time}
                </div>
                {days.map((day) => {
                  const session = slot.sessions[day];
                  return (
                    <div
                      key={`${slot.time}-${day}`}
                      className={cn(
                        "p-2 min-h-[80px] rounded-lg border-2 border-dashed border-border",
                        session ? "border-solid" : "hover:border-primary/30"
                      )}
                    >
                      {session && (
                        <div
                          className={cn(
                            "h-full p-3 rounded-md border",
                            sessionTypeColors[session.type],
                            session.hasConflict && "ring-2 ring-destructive"
                          )}
                        >
                          <div className="space-y-1">
                            <div className="font-semibold text-sm truncate">
                              {session.subject}
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-80">
                              <Users className="h-3 w-3" />
                              {session.faculty}
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-80">
                              <MapPin className="h-3 w-3" />
                              {session.room}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {session.batch}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}