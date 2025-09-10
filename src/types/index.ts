// Faculty Types
export interface Faculty {
  id: string;
  name: string;
  department: string;
  specialization: string;
  maxLoadPerWeek: number;
  status: "active" | "inactive" | "on-leave";
  email?: string;
  phone?: string;
  qualifications?: string[];
  experience?: number; // years
}

// Subject Types
export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  weeklyHours: number;
  type: "core" | "elective";
  credits?: number;
  prerequisites?: string[];
  description?: string;
}

// Batch Types
export interface Batch {
  id: string;
  batchId: string;
  department: string;
  year: number;
  size: number;
  assignedSubjects: string[]; // Array of subject IDs
  startDate?: string;
  endDate?: string;
  status: "active" | "inactive" | "graduated";
  description?: string;
}

// Common filter types
export interface FilterOptions {
  searchTerm: string;
  department: string;
  status?: string;
  type?: string;
}

// Form data types for modals
export interface FacultyFormData {
  name: string;
  department: string;
  specialization: string;
  maxLoadPerWeek: number;
  status: "active" | "inactive" | "on-leave";
  email: string;
  phone: string;
  qualifications: string[];
  experience: number;
}

export interface SubjectFormData {
  subjectCode: string;
  subjectName: string;
  department: string;
  weeklyHours: number;
  type: "core" | "elective";
  credits: number;
  prerequisites: string[];
  description: string;
}

export interface BatchFormData {
  batchId: string;
  department: string;
  year: number;
  size: number;
  assignedSubjects: string[];
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "graduated";
  description: string;
}
