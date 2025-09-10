import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, MapPin, Users, Monitor, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddRoomDialog } from "@/components/rooms/AddRoomDialog";
import { supabase, Database } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Room = Database['public']['Tables']['rooms']['Row'];

const statusColors = {
  available: "bg-success/10 text-success border-success/20",
  occupied: "bg-warning/10 text-warning border-warning/20",
  maintenance: "bg-destructive/10 text-destructive border-destructive/20"
};

const typeColors = {
  classroom: "bg-primary/10 text-primary border-primary/20",
  lab: "bg-accent/10 text-accent border-accent/20",
  auditorium: "bg-success/10 text-success border-success/20",
  seminar: "bg-warning/10 text-warning border-warning/20"
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch rooms from Supabase
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Error",
          description: "Failed to fetch rooms. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new room
  const handleAddRoom = async (roomData: Database['public']['Tables']['rooms']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) {
        console.error('Error adding room:', error);
        toast({
          title: "Error",
          description: "Failed to add room. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRooms(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Room added successfully!",
      });
    } catch (error) {
      console.error('Error adding room:', error);
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete room
  const handleDeleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) {
        console.error('Error deleting room:', error);
        toast({
          title: "Error",
          description: "Failed to delete room. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast({
        title: "Success",
        description: "Room deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Manage classrooms, labs, and other learning spaces
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-academic">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rooms or buildings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="classroom">Classroom</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="auditorium">Auditorium</SelectItem>
                <SelectItem value="seminar">Seminar Room</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Rooms ({filteredRooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading rooms...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No rooms found. Click "Add Room" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {room.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[room.type]}>
                      {room.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{room.building}</div>
                      <div className="text-sm text-muted-foreground">Floor {room.floor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {room.capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.equipment.slice(0, 2).map((item) => (
                        <Badge key={item} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {room.equipment.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{room.equipment.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[room.status]}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Room</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          Delete Room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Room Dialog */}
      <AddRoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onRoomAdded={handleAddRoom}
      />
    </div>
  );
}