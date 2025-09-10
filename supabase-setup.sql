-- Supabase Database Setup Script
-- Run this in your Supabase SQL editor

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('classroom', 'lab', 'auditorium', 'seminar')),
  capacity INTEGER NOT NULL,
  building VARCHAR(255) NOT NULL,
  floor INTEGER NOT NULL,
  equipment TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  max_load_per_week INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
  email VARCHAR(255),
  phone VARCHAR(50),
  qualifications TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_code VARCHAR(50) NOT NULL UNIQUE,
  subject_name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  weekly_hours INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('core', 'elective')),
  credits INTEGER DEFAULT 3,
  prerequisites TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id VARCHAR(50) NOT NULL UNIQUE,
  department VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  size INTEGER NOT NULL,
  assigned_subjects TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department);
CREATE INDEX IF NOT EXISTS idx_subjects_type ON subjects(type);
CREATE INDEX IF NOT EXISTS idx_batches_department ON batches(department);
CREATE INDEX IF NOT EXISTS idx_batches_year ON batches(year);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations for authenticated users" ON rooms
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON faculty
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON subjects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON batches
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO rooms (name, type, capacity, building, floor, equipment, status) VALUES
('A-101', 'classroom', 40, 'Academic Block A', 1, ARRAY['Projector', 'Whiteboard', 'AC'], 'available'),
('B-203', 'lab', 30, 'Academic Block B', 2, ARRAY['Computers', 'Projector', 'AC', 'Lab Equipment'], 'occupied'),
('C-301', 'auditorium', 150, 'Academic Block C', 3, ARRAY['Sound System', 'Projector', 'Stage', 'AC'], 'available'),
('A-105', 'seminar', 20, 'Academic Block A', 1, ARRAY['Smart Board', 'Video Conferencing', 'AC'], 'maintenance');

INSERT INTO faculty (name, department, specialization, max_load_per_week, status, email, phone, qualifications, experience) VALUES
('Dr. Sarah Johnson', 'Computer Science', 'Machine Learning', 20, 'active', 'sarah.johnson@university.edu', '+1-555-0123', ARRAY['PhD Computer Science', 'MS Data Science'], 8),
('Prof. Michael Chen', 'Mathematics', 'Applied Mathematics', 18, 'active', 'michael.chen@university.edu', '+1-555-0124', ARRAY['PhD Mathematics', 'MS Statistics'], 12),
('Dr. Emily Rodriguez', 'Physics', 'Quantum Physics', 16, 'on-leave', 'emily.rodriguez@university.edu', '+1-555-0125', ARRAY['PhD Physics', 'MS Engineering'], 6),
('Prof. David Kim', 'Computer Science', 'Software Engineering', 22, 'active', 'david.kim@university.edu', '+1-555-0126', ARRAY['PhD Computer Science', 'MS Software Engineering'], 15),
('Dr. Lisa Wang', 'Chemistry', 'Organic Chemistry', 14, 'inactive', 'lisa.wang@university.edu', '+1-555-0127', ARRAY['PhD Chemistry', 'MS Biochemistry'], 4);

INSERT INTO subjects (subject_code, subject_name, department, weekly_hours, type, credits, prerequisites, description) VALUES
('CS101', 'Introduction to Programming', 'Computer Science', 4, 'core', 3, ARRAY[]::TEXT[], 'Fundamental concepts of programming using Python'),
('MATH201', 'Calculus II', 'Mathematics', 3, 'core', 3, ARRAY['MATH101'], 'Advanced calculus concepts and applications'),
('CS301', 'Machine Learning', 'Computer Science', 3, 'elective', 3, ARRAY['CS201', 'MATH201'], 'Introduction to machine learning algorithms and applications'),
('PHYS101', 'General Physics', 'Physics', 4, 'core', 4, ARRAY[]::TEXT[], 'Fundamental principles of physics with laboratory work'),
('CS401', 'Software Engineering', 'Computer Science', 3, 'core', 3, ARRAY['CS201', 'CS301'], 'Software development methodologies and best practices'),
('MATH301', 'Linear Algebra', 'Mathematics', 3, 'elective', 3, ARRAY['MATH201'], 'Vector spaces, linear transformations, and eigenvalues');

INSERT INTO batches (batch_id, department, year, size, assigned_subjects, start_date, end_date, status, description) VALUES
('CS2024A', 'Computer Science', 2024, 45, ARRAY[]::TEXT[], '2024-08-15', '2028-05-30', 'active', 'Computer Science Batch 2024 - Section A'),
('MATH2024A', 'Mathematics', 2024, 32, ARRAY[]::TEXT[], '2024-08-15', '2028-05-30', 'active', 'Mathematics Batch 2024 - Section A'),
('CS2023A', 'Computer Science', 2023, 38, ARRAY[]::TEXT[], '2023-08-15', '2027-05-30', 'active', 'Computer Science Batch 2023 - Section A'),
('PHYS2024A', 'Physics', 2024, 28, ARRAY[]::TEXT[], '2024-08-15', '2028-05-30', 'active', 'Physics Batch 2024 - Section A'),
('CS2022A', 'Computer Science', 2022, 42, ARRAY[]::TEXT[], '2022-08-15', '2026-05-30', 'graduated', 'Computer Science Batch 2022 - Section A (Graduated)');






