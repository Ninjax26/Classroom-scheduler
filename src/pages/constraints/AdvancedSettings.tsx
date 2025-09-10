import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdvancedSettings() {
  const [electivesOverlap, setElectivesOverlap] = useState<boolean>(false);
  const [departmentPriority, setDepartmentPriority] = useState<string>("balanced");
  const [multiShift, setMultiShift] = useState<boolean>(false);
  const [fairWorkload, setFairWorkload] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Advanced Settings</h1>
        <p className="text-muted-foreground mt-2">Fine-tune scheduling behavior and priorities.</p>
      </div>

      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Scheduling Options</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electives">Electives overlap</Label>
            <div className="flex items-center gap-2">
              <Switch id="electives" checked={electivesOverlap} onCheckedChange={setElectivesOverlap} />
              <span className="text-sm text-muted-foreground">Allow overlapping elective classes</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Department priority</Label>
            <Select value={departmentPriority} onValueChange={setDepartmentPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="research">Research-first</SelectItem>
                <SelectItem value="teaching">Teaching-first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multi-shift">Multi-shift scheduling</Label>
            <div className="flex items-center gap-2">
              <Switch id="multi-shift" checked={multiShift} onCheckedChange={setMultiShift} />
              <span className="text-sm text-muted-foreground">Enable morning and evening shifts</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fair">Fair workload distribution</Label>
            <div className="flex items-center gap-2">
              <Switch id="fair" checked={fairWorkload} onCheckedChange={setFairWorkload} />
              <span className="text-sm text-muted-foreground">Balance assignments among faculty</span>
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


