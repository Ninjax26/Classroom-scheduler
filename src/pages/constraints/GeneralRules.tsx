import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function GeneralRules() {
  const [maxClassesPerDayFaculty, setMaxClassesPerDayFaculty] = useState<number>(3);
  const [maxClassesPerDayBatch, setMaxClassesPerDayBatch] = useState<number>(5);
  const [maxContinuousClasses, setMaxContinuousClasses] = useState<number>(2);
  const [breakTiming, setBreakTiming] = useState<string>("12:30");
  const [breakDuration, setBreakDuration] = useState<string>("30");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">General Rules</h1>
        <p className="text-muted-foreground mt-2">Configure global scheduling constraints.</p>
      </div>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Daily Limits</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-faculty">Max classes per day (Faculty)</Label>
            <Input id="max-faculty" type="number" value={maxClassesPerDayFaculty} onChange={(e) => setMaxClassesPerDayFaculty(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-batch">Max classes per day (Batch)</Label>
            <Input id="max-batch" type="number" value={maxClassesPerDayBatch} onChange={(e) => setMaxClassesPerDayBatch(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-continuous">Max continuous classes</Label>
            <Input id="max-continuous" type="number" value={maxContinuousClasses} onChange={(e) => setMaxContinuousClasses(parseInt(e.target.value) || 0)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Break Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="break-time">Break start time</Label>
            <Input id="break-time" type="time" value={breakTiming} onChange={(e) => setBreakTiming(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-duration">Break duration (mins)</Label>
            <Select value={breakDuration} onValueChange={setBreakDuration}>
              <SelectTrigger id="break-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-gradient-primary">Save</Button>
      </div>
    </div>
  );
}


