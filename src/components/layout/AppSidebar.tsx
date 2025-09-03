import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  BookOpen,
  MapPin,
  Clock,
  ClipboardCheck,
  UserCheck,
  FileText
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Data Management",
    items: [
      { title: "Rooms", url: "/data/rooms", icon: MapPin },
      { title: "Faculty", url: "/data/faculty", icon: Users },
      { title: "Subjects", url: "/data/subjects", icon: BookOpen },
      { title: "Batches", url: "/data/batches", icon: UserCheck },
    ]
  },
  {
    title: "Scheduling",
    items: [
      { title: "Constraints", url: "/constraints", icon: Settings },
      { title: "Scheduler", url: "/scheduler", icon: Clock },
      { title: "Review", url: "/review", icon: ClipboardCheck },
    ]
  },
  {
    title: "Timetables",
    items: [
      { title: "Published", url: "/timetable", icon: Calendar },
      { title: "Reports", url: "/reports", icon: FileText },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="px-3 py-4">
        <div className="mb-8 px-3">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/image.png" 
              alt="Class Schedule Zen Logo" 
              className={`${state === "collapsed" ? "h-8 w-8" : "h-10 w-10"} rounded-lg object-contain`}
            />
            {state !== "collapsed" && (
              <div>
                <h1 className="font-bold text-sidebar-primary-foreground text-xl">
                  Smart Classroom
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Timetable Scheduler
                </p>
              </div>
            )}
          </div>
          {state === "collapsed" && (
            <h1 className="font-bold text-sidebar-primary-foreground text-sm text-center">
              SC
            </h1>
          )}
        </div>

        {navigation.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            {state !== "collapsed" && (
              <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 mb-2">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}