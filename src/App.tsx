import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/data/Rooms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-subtle">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/data/rooms" element={<Rooms />} />
                  {/* Placeholder routes for other pages */}
                  <Route path="/data/faculty" element={<div className="p-8 text-center text-muted-foreground">Faculty management coming soon...</div>} />
                  <Route path="/data/subjects" element={<div className="p-8 text-center text-muted-foreground">Subject management coming soon...</div>} />
                  <Route path="/data/batches" element={<div className="p-8 text-center text-muted-foreground">Batch management coming soon...</div>} />
                  <Route path="/constraints" element={<div className="p-8 text-center text-muted-foreground">Constraints setup coming soon...</div>} />
                  <Route path="/scheduler" element={<div className="p-8 text-center text-muted-foreground">Scheduler coming soon...</div>} />
                  <Route path="/review" element={<div className="p-8 text-center text-muted-foreground">Review workflow coming soon...</div>} />
                  <Route path="/timetable" element={<div className="p-8 text-center text-muted-foreground">Published timetables coming soon...</div>} />
                  <Route path="/reports" element={<div className="p-8 text-center text-muted-foreground">Reports coming soon...</div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
