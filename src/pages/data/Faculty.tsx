import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Users, GraduationCap, Clock, Mail, Phone } from "lucide-react";
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
import { Faculty, FacultyFormData } from "@/types";
import { useFaculty } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

// Remove mock data - now using Supabase

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
  "on-leave": "bg-warning/10 text-warning border-warning/20"
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

export default function Faculty() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    department: "",
    specialization: "",
    maxLoadPerWeek: 20,
    status: "active",
    email: "",
    phone: "",
    qualifications: [],
    experience: 0
  });

  const { faculty, loading, error, addFaculty, updateFaculty, deleteFaculty } = useFaculty();
  const { toast } = useToast();

  const filteredFaculty = faculty.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || faculty.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || faculty.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddFaculty = async () => {
    try {
      await addFaculty({
        name: formData.name,
        department: formData.department,
        specialization: formData.specialization,
        max_load_per_week: formData.maxLoadPerWeek,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        qualifications: formData.qualifications,
        experience: formData.experience
      });
      toast({
        title: "Success",
        description: "Faculty added successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add faculty",
        variant: "destructive",
      });
    }
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      department: faculty.department,
      specialization: faculty.specialization,
      maxLoadPerWeek: faculty.maxLoadPerWeek,
      status: faculty.status,
      email: faculty.email || "",
      phone: faculty.phone || "",
      qualifications: faculty.qualifications || [],
      experience: faculty.experience || 0
    });
  };

  const handleUpdateFaculty = async () => {
    if (!editingFaculty) return;
    try {
      await updateFaculty(editingFaculty.id, {
        name: formData.name,
        department: formData.department,
        specialization: formData.specialization,
        max_load_per_week: formData.maxLoadPerWeek,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        qualifications: formData.qualifications,
        experience: formData.experience
      });
      toast({
        title: "Success",
        description: "Faculty updated successfully",
      });
      setEditingFaculty(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update faculty",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    try {
      await deleteFaculty(id);
      toast({
        title: "Success",
        description: "Faculty deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete faculty",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      specialization: "",
      maxLoadPerWeek: 20,
      status: "active",
      email: "",
      phone: "",
      qualifications: [],
      experience: 0
    });
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, ""]
    }));
  };

  const updateQualification = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((q, i) => i === index ? value : q)
    }));
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading faculty...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty</h1>
          <p className="text-muted-foreground mt-2">
            Manage faculty members and their teaching loads
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Faculty Member</DialogTitle>
              <DialogDescription>
                Enter the details for the new faculty member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
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
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    placeholder="Enter specialization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoad">Max Load/Week *</Label>
                  <Input
                    id="maxLoad"
                    type="number"
                    value={formData.maxLoadPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxLoadPerWeek: parseInt(e.target.value) || 0 }))}
                    placeholder="Hours per week"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    placeholder="Years of experience"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "on-leave") => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Qualifications</Label>
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={qual}
                      onChange={(e) => updateQualification(index, e.target.value)}
                      placeholder="Enter qualification"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQualification(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addQualification}>
                  Add Qualification
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFaculty} className="bg-gradient-primary">
                Add Faculty
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
                placeholder="Search faculty, department, or specialization..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Table */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Faculty Members ({filteredFaculty.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Max Load/Week</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculty.map((faculty) => (
                <TableRow key={faculty.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{faculty.name}</div>
                        {faculty.email && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {faculty.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      {faculty.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {faculty.specialization}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {faculty.maxLoadPerWeek}h
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[faculty.status]}>
                      {faculty.status}
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
                        <DropdownMenuItem onClick={() => handleEditFaculty(faculty)}>
                          Edit Faculty
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteFaculty(faculty.id)}
                        >
                          Delete Faculty
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

      {/* Edit Faculty Modal */}
      <Dialog open={!!editingFaculty} onOpenChange={() => setEditingFaculty(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Faculty Member</DialogTitle>
            <DialogDescription>
              Update the details for {editingFaculty?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
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
                <Label htmlFor="edit-specialization">Specialization *</Label>
                <Input
                  id="edit-specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Enter specialization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxLoad">Max Load/Week *</Label>
                <Input
                  id="edit-maxLoad"
                  type="number"
                  value={formData.maxLoadPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxLoadPerWeek: parseInt(e.target.value) || 0 }))}
                  placeholder="Hours per week"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience (Years)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                  placeholder="Years of experience"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "on-leave") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Qualifications</Label>
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={qual}
                    onChange={(e) => updateQualification(index, e.target.value)}
                    placeholder="Enter qualification"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeQualification(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addQualification}>
                Add Qualification
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFaculty(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFaculty} className="bg-gradient-primary">
              Update Faculty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
