import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/data/Rooms";
import Faculty from "./pages/data/Faculty";
import Subjects from "./pages/data/Subjects";
import Batches from "./pages/data/Batches";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GeneralRules from "./pages/constraints/GeneralRules";
import FacultyRules from "./pages/constraints/FacultyRules";
import SubjectRules from "./pages/constraints/SubjectRules";
import RoomRules from "./pages/constraints/RoomRules";
import AdvancedSettings from "./pages/constraints/AdvancedSettings";

const queryClient = new QueryClient();

// Main app component with authentication
function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-subtle">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/data/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
                <Route path="/data/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
                <Route path="/data/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
                <Route path="/data/batches" element={<ProtectedRoute><Batches /></ProtectedRoute>} />
                
                {/* Constraints nested routes */}
                <Route path="/constraints" element={<Navigate to="/constraints/general" replace />} />
                <Route path="/constraints/general" element={<ProtectedRoute><GeneralRules /></ProtectedRoute>} />
                <Route path="/constraints/faculty" element={<ProtectedRoute><FacultyRules /></ProtectedRoute>} />
                <Route path="/constraints/subjects" element={<ProtectedRoute><SubjectRules /></ProtectedRoute>} />
                <Route path="/constraints/rooms" element={<ProtectedRoute><RoomRules /></ProtectedRoute>} />
                <Route path="/constraints/advanced" element={<ProtectedRoute><AdvancedSettings /></ProtectedRoute>} />
                
                {/* Placeholder routes for other pages */}
                <Route path="/scheduler" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground">Scheduler coming soon...</div></ProtectedRoute>} />
                <Route path="/review" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground">Review workflow coming soon...</div></ProtectedRoute>} />
                <Route path="/timetable" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground">Published timetables coming soon...</div></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><div className="p-8 text-center text-muted-foreground">Reports coming soon...</div></ProtectedRoute>} />
                
                {/* Auth routes - redirect to dashboard if already logged in */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
