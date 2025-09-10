import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function RoomRules() {
  const [minCapacity, setMinCapacity] = useState<number>(30);
  const [roomType, setRoomType] = useState<string>("classroom");
  const [equipmentRequired, setEquipmentRequired] = useState<string>("Projector");
  const [roomAvailability, setRoomAvailability] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Room Rules</h1>
        <p className="text-muted-foreground mt-2">Define rules for assigning rooms.</p>
      </div>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Capacity & Type</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Minimum capacity</Label>
            <Input id="capacity" type="number" value={minCapacity} onChange={(e) => setMinCapacity(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-type">Room type</Label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger id="room-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classroom">Classroom</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="seminar">Seminar Hall</SelectItem>
                <SelectItem value="auditorium">Auditorium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment requirement</Label>
            <Input id="equipment" value={equipmentRequired} onChange={(e) => setEquipmentRequired(e.target.value)} placeholder="e.g., Projector, Smart Board" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="availability">Room availability</Label>
            <div className="flex items-center gap-2">
              <Switch id="availability" checked={roomAvailability} onCheckedChange={setRoomAvailability} />
              <span className="text-sm text-muted-foreground">Consider room availability calendar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-gradient-primary">Save</Button>
      </div>
    </div>
  );
}


