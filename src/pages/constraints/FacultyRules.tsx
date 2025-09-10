import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function FacultyRules() {
  const [maxWeeklyLoad, setMaxWeeklyLoad] = useState<number>(20);
  const [preferredDay, setPreferredDay] = useState<string>("monday");
  const [preferredTime, setPreferredTime] = useState<string>("10:00");
  const [avgLeaves, setAvgLeaves] = useState<number>(2);
  const [gridEnabled, setGridEnabled] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Faculty Rules</h1>
        <p className="text-muted-foreground mt-2">Set constraints for faculty workload and availability.</p>
      </div>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Workload</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-weekly">Max weekly load (hours)</Label>
            <Input id="max-weekly" type="number" value={maxWeeklyLoad} onChange={(e) => setMaxWeeklyLoad(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avg-leaves">Average leaves per semester</Label>
            <Input id="avg-leaves" type="number" value={avgLeaves} onChange={(e) => setAvgLeaves(parseInt(e.target.value) || 0)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Availability & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred-day">Preferred day</Label>
            <Select value={preferredDay} onValueChange={setPreferredDay}>
              <SelectTrigger id="preferred-day">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred start time</Label>
            <Input id="preferred-time" type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grid-toggle">Availability grid</Label>
            <div className="flex items-center gap-2">
              <Switch id="grid-toggle" checked={gridEnabled} onCheckedChange={setGridEnabled} />
              <span className="text-sm text-muted-foreground">Enable weekday × time grid</span>
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


