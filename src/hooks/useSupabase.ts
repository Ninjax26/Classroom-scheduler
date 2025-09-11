import { useEffect, useState } from "react";
import { supabase, Database } from "@/lib/supabase";

// Faculty Hook
export function useFaculty() {
  const [faculty, setFaculty] = useState<Array<{
    id: string;
    name: string;
    department: string;
    specialization: string;
    maxLoadPerWeek: number;
    status: "active" | "inactive" | "on-leave";
    email?: string;
    phone?: string;
    qualifications?: string[];
    experience?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToUi = (r: Database['public']['Tables']['faculty']['Row']) => ({
    id: r.id,
    name: r.name,
    department: r.department,
    specialization: r.specialization,
    maxLoadPerWeek: r.max_load_per_week,
    status: r.status,
    email: r.email || undefined,
    phone: r.phone || undefined,
    qualifications: r.qualifications || [],
    experience: r.experience || 0,
  });

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setFaculty((data || []).map(mapRowToUi));
    } catch (e: any) {
      setError(e.message || 'Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  };

  const addFaculty = async (payload: Database['public']['Tables']['faculty']['Insert']) => {
    const { data, error } = await supabase
      .from('faculty')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    setFaculty(prev => [mapRowToUi(data), ...prev]);
  };

  const updateFaculty = async (id: string, payload: Database['public']['Tables']['faculty']['Update']) => {
    const { data, error } = await supabase
      .from('faculty')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setFaculty(prev => prev.map(f => f.id === id ? mapRowToUi(data) : f));
  };

  const deleteFaculty = async (id: string) => {
    const { error } = await supabase
      .from('faculty')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => { fetchFaculty(); }, []);

  return { faculty, loading, error, addFaculty, updateFaculty, deleteFaculty, refetch: fetchFaculty };
}

// Subjects Hook (maps DB snake_case to UI camelCase)
export function useSubjects() {
  type Row = Database['public']['Tables']['subjects']['Row'];
  const [subjects, setSubjects] = useState<Array<{
    id: string;
    subjectCode: string;
    subjectName: string;
    department: string;
    weeklyHours: number;
    type: 'core' | 'elective';
    credits?: number;
    prerequisites?: string[];
    description?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToUi = (r: Row) => ({
    id: r.id,
    subjectCode: r.subject_code,
    subjectName: r.subject_name,
    department: r.department,
    weeklyHours: r.weekly_hours,
    type: r.type,
    credits: r.credits || undefined,
    prerequisites: r.prerequisites || [],
    description: r.description || undefined,
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSubjects((data || []).map(mapRowToUi));
    } catch (e: any) {
      setError(e.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (payload: {
    subjectCode: string;
    subjectName: string;
    department: string;
    weeklyHours: number;
    type: 'core' | 'elective';
    credits?: number;
    prerequisites?: string[];
    description?: string;
  }) => {
    const insertPayload: Database['public']['Tables']['subjects']['Insert'] = {
      subject_code: payload.subjectCode,
      subject_name: payload.subjectName,
      department: payload.department,
      weekly_hours: payload.weeklyHours,
      type: payload.type,
      credits: payload.credits,
      prerequisites: payload.prerequisites,
      description: payload.description,
    };
    const { data, error } = await supabase
      .from('subjects')
      .insert([insertPayload])
      .select()
      .single();
    if (error) throw error;
    setSubjects(prev => [mapRowToUi(data), ...prev]);
  };

  const updateSubject = async (id: string, payload: Partial<{
    subjectCode: string;
    subjectName: string;
    department: string;
    weeklyHours: number;
    type: 'core' | 'elective';
    credits?: number;
    prerequisites?: string[];
    description?: string;
  }>) => {
    const updatePayload: Database['public']['Tables']['subjects']['Update'] = {
      subject_code: payload.subjectCode,
      subject_name: payload.subjectName,
      department: payload.department,
      weekly_hours: payload.weeklyHours,
      type: payload.type,
      credits: payload.credits,
      prerequisites: payload.prerequisites,
      description: payload.description,
    };
    const { data, error } = await supabase
      .from('subjects')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setSubjects(prev => prev.map(s => s.id === id ? mapRowToUi(data) : s));
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  useEffect(() => { fetchSubjects(); }, []);

  return { subjects, loading, error, addSubject, updateSubject, deleteSubject, refetch: fetchSubjects };
}

// Batches Hook (assignedSubjects holds subject IDs as strings)
export function useBatches() {
  type Row = Database['public']['Tables']['batches']['Row'];
  const [batches, setBatches] = useState<Array<{
    id: string;
    batchId: string;
    department: string;
    year: number;
    size: number;
    assignedSubjects: string[];
    startDate?: string;
    endDate?: string;
    status: 'active' | 'inactive' | 'graduated';
    description?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToUi = (r: Row) => ({
    id: r.id,
    batchId: r.batch_id,
    department: r.department,
    year: r.year,
    size: r.size,
    assignedSubjects: r.assigned_subjects || [],
    startDate: r.start_date || undefined,
    endDate: r.end_date || undefined,
    status: r.status,
    description: r.description || undefined,
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBatches((data || []).map(mapRowToUi));
    } catch (e: any) {
      setError(e.message || 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const addBatch = async (payload: {
    batchId: string;
    department: string;
    year: number;
    size: number;
    assignedSubjects?: string[];
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive' | 'graduated';
    description?: string;
  }) => {
    const insertPayload: Database['public']['Tables']['batches']['Insert'] = {
      batch_id: payload.batchId,
      department: payload.department,
      year: payload.year,
      size: payload.size,
      assigned_subjects: payload.assignedSubjects,
      start_date: payload.startDate,
      end_date: payload.endDate,
      status: payload.status,
      description: payload.description,
    };
    const { data, error } = await supabase
      .from('batches')
      .insert([insertPayload])
      .select()
      .single();
    if (error) throw error;
    setBatches(prev => [mapRowToUi(data), ...prev]);
  };

  const updateBatch = async (id: string, payload: Partial<{
    batchId: string;
    department: string;
    year: number;
    size: number;
    assignedSubjects?: string[];
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive' | 'graduated';
    description?: string;
  }>) => {
    const updatePayload: Database['public']['Tables']['batches']['Update'] = {
      batch_id: payload.batchId,
      department: payload.department,
      year: payload.year,
      size: payload.size,
      assigned_subjects: payload.assignedSubjects,
      start_date: payload.startDate,
      end_date: payload.endDate,
      status: payload.status,
      description: payload.description,
    };
    const { data, error } = await supabase
      .from('batches')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setBatches(prev => prev.map(b => b.id === id ? mapRowToUi(data) : b));
  };

  const deleteBatch = async (id: string) => {
    const { error } = await supabase
      .from('batches')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  useEffect(() => { fetchBatches(); }, []);

  return { batches, loading, error, addBatch, updateBatch, deleteBatch, refetch: fetchBatches };
}

// Rooms Hook
export function useRooms() {
  type Row = Database['public']['Tables']['rooms']['Row'];
  const [rooms, setRooms] = useState<Array<{
    id: string;
    name: string;
    type: 'classroom' | 'lab' | 'auditorium' | 'seminar';
    capacity: number;
    building: string;
    floor: number;
    equipment: string[];
    status: 'available' | 'occupied' | 'maintenance';
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToUi = (r: Row) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    capacity: r.capacity,
    building: r.building,
    floor: r.floor,
    equipment: r.equipment || [],
    status: r.status,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRooms((data || []).map(mapRowToUi));
    } catch (e: any) {
      setError(e.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  return { rooms, loading, error, refetch: fetchRooms };
}

