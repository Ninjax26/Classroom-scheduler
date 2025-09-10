import { useState } from "react";
import { Plus, Search, MoreHorizontal, Users, GraduationCap, Calendar, Hash, UserCheck } from "lucide-react";
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
import { Batch, BatchFormData } from "@/types";
import { useBatches, useSubjects } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

// Removed mock subjects and batches; using Supabase hooks

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
  graduated: "bg-accent/10 text-accent border-accent/20"
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

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

export default function Batches() {
  const { subjects } = useSubjects();
  const { batches, loading, error, addBatch, updateBatch, deleteBatch } = useBatches();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState<BatchFormData>({
    batchId: "",
    department: "",
    year: new Date().getFullYear(),
    size: 30,
    assignedSubjects: [],
    startDate: "",
    endDate: "",
    status: "active",
    description: ""
  });

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || batch.department === departmentFilter;
    const matchesYear = yearFilter === "all" || batch.year.toString() === yearFilter;
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.subjectCode} - ${subject.subjectName}` : "Unknown Subject";
  };

  const handleAddBatch = async () => {
    try {
      await addBatch({
        batchId: formData.batchId,
        department: formData.department,
        year: formData.year,
        size: formData.size,
        assignedSubjects: formData.assignedSubjects,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        status: formData.status,
        description: formData.description || undefined,
      });
      toast({ title: "Success", description: "Batch added" });
      setIsAddModalOpen(false);
      resetForm();
    } catch (e) {
      toast({ title: "Error", description: "Failed to add batch", variant: "destructive" });
    }
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      batchId: batch.batchId,
      department: batch.department,
      year: batch.year,
      size: batch.size,
      assignedSubjects: batch.assignedSubjects,
      startDate: batch.startDate || "",
      endDate: batch.endDate || "",
      status: batch.status,
      description: batch.description || ""
    });
  };

  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
    try {
      await updateBatch(editingBatch.id, {
        batchId: formData.batchId,
        department: formData.department,
        year: formData.year,
        size: formData.size,
        assignedSubjects: formData.assignedSubjects,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        status: formData.status,
        description: formData.description || undefined,
      });
      toast({ title: "Success", description: "Batch updated" });
      setEditingBatch(null);
      resetForm();
    } catch (e) {
      toast({ title: "Error", description: "Failed to update batch", variant: "destructive" });
    }
  };

  const handleDeleteBatch = async (id: string) => {
    try {
      await deleteBatch(id);
      toast({ title: "Success", description: "Batch deleted" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete batch", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      batchId: "",
      department: "",
      year: new Date().getFullYear(),
      size: 30,
      assignedSubjects: [],
      startDate: "",
      endDate: "",
      status: "active",
      description: ""
    });
  };

  const toggleSubjectAssignment = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedSubjects: prev.assignedSubjects.includes(subjectId)
        ? prev.assignedSubjects.filter(id => id !== subjectId)
        : [...prev.assignedSubjects, subjectId]
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading batches...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-destructive">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground mt-2">
            Manage student batches and their assigned subjects
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
              <DialogDescription>
                Enter the details for the new student batch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID *</Label>
                  <Input
                    id="batchId"
                    value={formData.batchId}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchId: e.target.value }))}
                    placeholder="e.g., CS2024A"
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Batch Size *</Label>
                  <Input
                    id="size"
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                    placeholder="Number of students"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "graduated") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter batch description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Assigned Subjects</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {subjects.map(subject => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`subject-${subject.id}`}
                        checked={formData.assignedSubjects.includes(subject.id)}
                        onChange={() => toggleSubjectAssignment(subject.id)}
                        className="rounded"
                      />
                      <label htmlFor={`subject-${subject.id}`} className="text-sm">
                        {subject.subjectCode} - {subject.subjectName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBatch} className="bg-gradient-primary">
                Add Batch
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
                placeholder="Search batches, departments, or descriptions..."
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
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Batches ({filteredBatches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Assigned Subjects</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{batch.batchId}</div>
                        {batch.description && (
                          <div className="text-sm text-muted-foreground">
                            {batch.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      {batch.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {batch.year}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {batch.size} students
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {batch.assignedSubjects.slice(0, 2).map((subjectId) => (
                        <Badge key={subjectId} variant="secondary" className="text-xs">
                          {getSubjectName(subjectId).split(' - ')[0]}
                        </Badge>
                      ))}
                      {batch.assignedSubjects.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{batch.assignedSubjects.length - 2}
                        </Badge>
                      )}
                      {batch.assignedSubjects.length === 0 && (
                        <span className="text-sm text-muted-foreground">No subjects</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBatch(batch)}>
                          Edit Batch
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Students</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => { if (confirm('Delete this batch?')) handleDeleteBatch(batch.id) }}
                        >
                          Delete Batch
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

      {/* Edit Batch Modal */}
      <Dialog open={!!editingBatch} onOpenChange={() => setEditingBatch(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update the details for {editingBatch?.batchId}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-batchId">Batch ID *</Label>
                <Input
                  id="edit-batchId"
                  value={formData.batchId}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchId: e.target.value }))}
                  placeholder="e.g., CS2024A"
                />
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year *</Label>
                <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-size">Batch Size *</Label>
                <Input
                  id="edit-size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of students"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "graduated") => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter batch description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Assigned Subjects</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-subject-${subject.id}`}
                      checked={formData.assignedSubjects.includes(subject.id)}
                      onChange={() => toggleSubjectAssignment(subject.id)}
                      className="rounded"
                    />
                    <label htmlFor={`edit-subject-${subject.id}`} className="text-sm">
                      {subject.subjectCode} - {subject.subjectName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBatch(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch} className="bg-gradient-primary">
              Update Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
