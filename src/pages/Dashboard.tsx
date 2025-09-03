import { 
  Calendar, 
  Users, 
  MapPin, 
  BookOpen, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockTimeSlots = [
  {
    time: "09:00",
    sessions: {
      Monday: {
        id: "1",
        subject: "Data Structures",
        faculty: "Dr. Smith",
        room: "Room A-101",
        batch: "CS-A",
        time: "09:00",
        duration: 60,
        type: "lecture" as const
      },
      Tuesday: null,
      Wednesday: {
        id: "2",
        subject: "Database Systems",
        faculty: "Prof. Johnson",
        room: "Lab B-203",
        batch: "CS-B",
        time: "09:00",
        duration: 120,
        type: "lab" as const
      },
      Thursday: null,
      Friday: {
        id: "3",
        subject: "Algorithms",
        faculty: "Dr. Wilson",
        room: "Room A-102",
        batch: "CS-A",
        time: "09:00",
        duration: 60,
        type: "tutorial" as const
      }
    }
  },
  {
    time: "11:00",
    sessions: {
      Monday: null,
      Tuesday: {
        id: "4",
        subject: "Machine Learning",
        faculty: "Dr. Brown",
        room: "Room A-105",
        batch: "CS-B",
        time: "11:00",
        duration: 90,
        type: "lecture" as const
      },
      Wednesday: null,
      Thursday: {
        id: "5",
        subject: "Web Development",
        faculty: "Prof. Davis",
        room: "Lab C-301",
        batch: "CS-A",
        time: "11:00",
        duration: 120,
        type: "lab" as const
      },
      Friday: null
    }
  }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const recentActivities = [
  {
    id: 1,
    action: "Timetable Generated",
    description: "New timetable for CS Department - Fall 2024",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: 2,
    action: "Conflict Detected",
    description: "Room A-101 double booking on Monday 2PM",
    time: "4 hours ago",
    status: "warning"
  },
  {
    id: 3,
    action: "Faculty Updated",
    description: "Dr. Smith availability changed",
    time: "1 day ago",
    status: "info"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your timetable scheduling system
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Rooms"
          value={45}
          change="+2 this month"
          changeType="positive"
          icon={MapPin}
          description="Active classrooms"
        />
        <KPICard
          title="Faculty Members"
          value={128}
          change="+5 this semester"
          changeType="positive"
          icon={Users}
          description="Teaching staff"
        />
        <KPICard
          title="Active Subjects"
          value={89}
          change="No change"
          changeType="neutral"
          icon={BookOpen}
          description="Current semester"
        />
        <KPICard
          title="Utilization Rate"
          value="87%"
          change="+3% from last week"
          changeType="positive"
          icon={TrendingUp}
          description="Room efficiency"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-academic lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-primary hover:opacity-90">
              Generate New Timetable
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Import Faculty Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Manage Constraints
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-1">
                    {activity.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {activity.status === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    {activity.status === "info" && (
                      <Clock className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Timetable Preview */}
      <TimetableGrid 
        timeSlots={mockTimeSlots}
        days={days}
        title="Current Week Preview - CS Department"
        className="mt-8"
      />
    </div>
  );
}