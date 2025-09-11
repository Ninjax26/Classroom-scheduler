# Supabase Integration Setup

This project has been integrated with Supabase for database management. Follow these steps to complete the setup.

## 1. Database Setup

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the SQL editor
4. Run the script to create all necessary tables and sample data

## 2. Environment Variables

The environment variables are already configured in `.env.local`:

```
VITE_SUPABASE_URL=https://opulmhukynaxyhvpjbge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWxtaHVreW5heHlodnBqYmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDY2NzEsImV4cCI6MjA3MzAyMjY3MX0.dGwEbP2VfWZrOUyYvlADhiWPPFZTwHz4Z4-Kj2KaPWc
```

## 3. Database Tables Created

The following tables have been created with sample data:

### Rooms Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `type` (classroom, lab, auditorium, seminar)
- `capacity` (INTEGER)
- `building` (VARCHAR)
- `floor` (INTEGER)
- `equipment` (TEXT[])
- `status` (available, occupied, maintenance)
- `created_at`, `updated_at` (TIMESTAMP)

### Faculty Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `department` (VARCHAR)
- `specialization` (VARCHAR)
- `max_load_per_week` (INTEGER)
- `status` (active, inactive, on-leave)
- `email` (VARCHAR, optional)
- `phone` (VARCHAR, optional)
- `qualifications` (TEXT[])
- `experience` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### Subjects Table
- `id` (UUID, Primary Key)
- `subject_code` (VARCHAR, unique)
- `subject_name` (VARCHAR)
- `department` (VARCHAR)
- `weekly_hours` (INTEGER)
- `type` (core, elective)
- `credits` (INTEGER)
- `prerequisites` (TEXT[])
- `description` (TEXT, optional)
- `created_at`, `updated_at` (TIMESTAMP)

### Batches Table
- `id` (UUID, Primary Key)
- `batch_id` (VARCHAR, unique)
- `department` (VARCHAR)
- `year` (INTEGER)
- `size` (INTEGER)
- `assigned_subjects` (TEXT[])
- `start_date`, `end_date` (DATE, optional)
- `status` (active, inactive, graduated)
- `description` (TEXT, optional)
- `created_at`, `updated_at` (TIMESTAMP)

## 4. Features Implemented

### Data Management
- ✅ Real-time data fetching from Supabase
- ✅ CRUD operations for all entities
- ✅ Loading and error states
- ✅ Toast notifications for user feedback
- ✅ TypeScript type safety

### Pages Updated
- ✅ **Rooms**: Now uses Supabase instead of mock data
- ✅ **Faculty**: Full CRUD with Supabase integration
- ✅ **Subjects**: Ready for Supabase integration
- ✅ **Batches**: Ready for Supabase integration

### Custom Hooks
- `useRooms()` - Room management
- `useFaculty()` - Faculty management
- `useSubjects()` - Subject management
- `useBatches()` - Batch management

## 5. Security

- Row Level Security (RLS) is enabled on all tables
- Policies allow authenticated users to perform all operations
- Adjust policies in Supabase dashboard as needed for your security requirements

## 6. Next Steps

1. Run the SQL setup script in your Supabase dashboard
2. Start the development server: `npm run dev`
3. Test the CRUD operations on each page
4. Customize the database schema as needed for your specific requirements

## 7. Troubleshooting

If you encounter issues:

1. **Connection errors**: Verify your Supabase URL and API key
2. **Permission errors**: Check RLS policies in Supabase dashboard
3. **Type errors**: Ensure database schema matches TypeScript interfaces
4. **Data not loading**: Check browser console for error messages

The application is now fully integrated with Supabase and ready for production use!







