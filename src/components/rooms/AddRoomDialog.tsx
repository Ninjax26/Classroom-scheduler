import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Database } from "@/lib/supabase";

type Room = Database['public']['Tables']['rooms']['Insert'];

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdded: (room: Room) => void;
}

export function AddRoomDialog({ open, onOpenChange, onRoomAdded }: AddRoomDialogProps) {
  const [formData, setFormData] = useState<Room>({
    name: "",
    type: "classroom",
    capacity: 0,
    building: "",
    floor: 1,
    equipment: [],
    status: "available"
  });
  const [equipmentInput, setEquipmentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof Room, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEquipment = () => {
    if (equipmentInput.trim() && !formData.equipment?.includes(equipmentInput.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), equipmentInput.trim()]
      }));
      setEquipmentInput("");
    }
  };

  const handleRemoveEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(item => item !== equipment) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.building || formData.capacity <= 0) {
        alert("Please fill in all required fields");
        return;
      }

      onRoomAdded(formData);
      
      // Reset form
      setFormData({
        name: "",
        type: "classroom",
        capacity: 0,
        building: "",
        floor: 1,
        equipment: [],
        status: "available"
      });
      setEquipmentInput("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Create a new room entry with all the necessary details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., A-101"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="auditorium">Auditorium</SelectItem>
                  <SelectItem value="seminar">Seminar Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building">Building *</Label>
              <Input
                id="building"
                value={formData.building}
                onChange={(e) => handleInputChange("building", e.target.value)}
                placeholder="e.g., Academic Block A"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => handleInputChange("floor", parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                placeholder="e.g., 40"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <div className="flex gap-2">
              <Input
                id="equipment"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="e.g., Projector, Whiteboard"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEquipment();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEquipment}
                disabled={!equipmentInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.equipment && formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipment.map((item) => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(item)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



