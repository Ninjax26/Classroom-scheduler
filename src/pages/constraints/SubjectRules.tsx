import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SubjectRules() {
  const [classesPerWeek, setClassesPerWeek] = useState<number>(3);
  const [minPerDay, setMinPerDay] = useState<number>(0);
  const [maxPerDay, setMaxPerDay] = useState<number>(2);
  const [labDuration, setLabDuration] = useState<string>("2");
  const [fixedSlot, setFixedSlot] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subject Rules</h1>
        <p className="text-muted-foreground mt-2">Define scheduling rules for subjects.</p>
      </div>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Class Frequency</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classes-week">Classes per week</Label>
            <Input id="classes-week" type="number" value={classesPerWeek} onChange={(e) => setClassesPerWeek(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-day">Min per day</Label>
            <Input id="min-day" type="number" value={minPerDay} onChange={(e) => setMinPerDay(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-day">Max per day</Label>
            <Input id="max-day" type="number" value={maxPerDay} onChange={(e) => setMaxPerDay(parseInt(e.target.value) || 0)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Lab Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lab-duration">Lab duration (consecutive slots)</Label>
            <Select value={labDuration} onValueChange={setLabDuration}>
              <SelectTrigger id="lab-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fixed-slot">Fixed slot</Label>
            <div className="flex items-center gap-2">
              <Switch id="fixed-slot" checked={fixedSlot} onCheckedChange={setFixedSlot} />
              <span className="text-sm text-muted-foreground">Allocate a fixed weekly slot</span>
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


