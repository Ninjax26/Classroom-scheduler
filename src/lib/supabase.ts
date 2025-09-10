import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          type: 'classroom' | 'lab' | 'auditorium' | 'seminar'
          capacity: number
          building: string
          floor: number
          equipment: string[]
          status: 'available' | 'occupied' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'classroom' | 'lab' | 'auditorium' | 'seminar'
          capacity: number
          building: string
          floor: number
          equipment?: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'classroom' | 'lab' | 'auditorium' | 'seminar'
          capacity?: number
          building?: string
          floor?: number
          equipment?: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      faculty: {
        Row: {
          id: string
          name: string
          department: string
          specialization: string
          max_load_per_week: number
          status: 'active' | 'inactive' | 'on-leave'
          email?: string
          phone?: string
          qualifications?: string[]
          experience?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          department: string
          specialization: string
          max_load_per_week: number
          status?: 'active' | 'inactive' | 'on-leave'
          email?: string
          phone?: string
          qualifications?: string[]
          experience?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          department?: string
          specialization?: string
          max_load_per_week?: number
          status?: 'active' | 'inactive' | 'on-leave'
          email?: string
          phone?: string
          qualifications?: string[]
          experience?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          subject_code: string
          subject_name: string
          department: string
          weekly_hours: number
          type: 'core' | 'elective'
          credits?: number
          prerequisites?: string[]
          description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_code: string
          subject_name: string
          department: string
          weekly_hours: number
          type: 'core' | 'elective'
          credits?: number
          prerequisites?: string[]
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_code?: string
          subject_name?: string
          department?: string
          weekly_hours?: number
          type?: 'core' | 'elective'
          credits?: number
          prerequisites?: string[]
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      batches: {
        Row: {
          id: string
          batch_id: string
          department: string
          year: number
          size: number
          assigned_subjects: string[]
          start_date?: string
          end_date?: string
          status: 'active' | 'inactive' | 'graduated'
          description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          department: string
          year: number
          size: number
          assigned_subjects?: string[]
          start_date?: string
          end_date?: string
          status?: 'active' | 'inactive' | 'graduated'
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          department?: string
          year?: number
          size?: number
          assigned_subjects?: string[]
          start_date?: string
          end_date?: string
          status?: 'active' | 'inactive' | 'graduated'
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
