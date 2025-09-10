import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, BookOpen, GraduationCap, Clock, Hash, Tag } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Subject, SubjectFormData } from "@/types";
import { useSubjects } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

// Removed mockSubjects; using Supabase

const typeColors = {
  core: "bg-primary/10 text-primary border-primary/20",
  elective: "bg-accent/10 text-accent border-accent/20"
};

const departments = [
  "Computer Science",
  "Mathematics", 
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business",
  "Literature"
];

export default function Subjects() {
  const { subjects, loading, error, addSubject, updateSubject, deleteSubject } = useSubjects();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<SubjectFormData>({
    subjectCode: "",
    subjectName: "",
    department: "",
    weeklyHours: 3,
    type: "core",
    credits: 3,
    prerequisites: [],
    description: ""
  });

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || subject.department === departmentFilter;
    const matchesType = typeFilter === "all" || subject.type === typeFilter;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const handleAddSubject = async () => {
    try {
      await addSubject({
        subjectCode: formData.subjectCode,
        subjectName: formData.subjectName,
        department: formData.department,
        weeklyHours: formData.weeklyHours,
        type: formData.type,
        credits: formData.credits,
        prerequisites: formData.prerequisites,
        description: formData.description,
      });
      toast({ title: "Success", description: "Subject added" });
      setIsAddModalOpen(false);
      resetForm();
    } catch (e) {
      toast({ title: "Error", description: "Failed to add subject", variant: "destructive" });
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      department: subject.department,
      weeklyHours: subject.weeklyHours,
      type: subject.type,
      credits: subject.credits || 3,
      prerequisites: subject.prerequisites || [],
      description: subject.description || ""
    });
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    try {
      await updateSubject(editingSubject.id, {
        subjectCode: formData.subjectCode,
        subjectName: formData.subjectName,
        department: formData.department,
        weeklyHours: formData.weeklyHours,
        type: formData.type,
        credits: formData.credits,
        prerequisites: formData.prerequisites,
        description: formData.description,
      });
      toast({ title: "Success", description: "Subject updated" });
      setEditingSubject(null);
      resetForm();
    } catch (e) {
      toast({ title: "Error", description: "Failed to update subject", variant: "destructive" });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      toast({ title: "Success", description: "Subject deleted" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete subject", variant: "destructive" });
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading subjects...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Error: {error}</div>;
  }

  const resetForm = () => {
    setFormData({
      subjectCode: "",
      subjectName: "",
      department: "",
      weeklyHours: 3,
      type: "core",
      credits: 3,
      prerequisites: [],
      description: ""
    });
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""]
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((p, i) => i === index ? value : p)
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-2">
            Manage course subjects and their details
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Enter the details for the new subject.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectCode">Subject Code *</Label>
                  <Input
                    id="subjectCode"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
                    placeholder="e.g., CS101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjectName">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    value={formData.subjectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                    placeholder="Enter subject name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: "core" | "elective") => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="elective">Elective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyHours">Weekly Hours *</Label>
                  <Input
                    id="weeklyHours"
                    type="number"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) || 0 }))}
                    placeholder="Hours per week"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                    placeholder="Credit hours"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter subject description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Prerequisites</Label>
                {formData.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={prereq}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                      placeholder="Enter prerequisite subject code"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePrerequisite(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPrerequisite}>
                  Add Prerequisite
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject} className="bg-gradient-primary">
                Add Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-academic">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subjects, codes, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Subject Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="elective">Elective</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Subjects ({filteredSubjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Weekly Hours</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      {subject.subjectCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subject.subjectName}</div>
                      {subject.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {subject.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      {subject.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {subject.weeklyHours}h
                      {subject.credits && (
                        <span className="text-sm text-muted-foreground ml-1">
                          ({subject.credits} credits)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[subject.type]}>
                      {subject.type}
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
                        <DropdownMenuItem onClick={() => handleEditSubject(subject)}>
                          Edit Subject
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Prerequisites</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => { if (confirm('Delete this subject?')) handleDeleteSubject(subject.id) }}
                        >
                          Delete Subject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Subject Modal */}
      <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the details for {editingSubject?.subjectCode} - {editingSubject?.subjectName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subjectCode">Subject Code *</Label>
                <Input
                  id="edit-subjectCode"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subjectName">Subject Name *</Label>
                <Input
                  id="edit-subjectName"
                  value={formData.subjectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                  placeholder="Enter subject name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "core" | "elective") => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-weeklyHours">Weekly Hours *</Label>
                <Input
                  id="edit-weeklyHours"
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) || 0 }))}
                  placeholder="Hours per week"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-credits">Credits</Label>
                <Input
                  id="edit-credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                  placeholder="Credit hours"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter subject description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Prerequisites</Label>
              {formData.prerequisites.map((prereq, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prereq}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    placeholder="Enter prerequisite subject code"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePrerequisite(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addPrerequisite}>
                Add Prerequisite
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubject(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubject} className="bg-gradient-primary">
              Update Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
