# Class Schedule Zen

A smart classroom and timetable scheduling application built with modern web technologies.

## Features

- Smart classroom scheduling
- Timetable optimization
- Intelligent constraint management
- Academic schedule automation

## Technologies Used

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd class-schedule-zen
```

2. Install dependencies:
```sh
npm install
```

3. Create environment file:
```
cp .env.example .env
```

4. Start the development server:
```sh
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment variables

Create `.env` based on `.env.example`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase setup

- Run `supabase-setup.sql` in the Supabase SQL editor to create tables, policies, and seed data.
- See `AUTH_SETUP.md` and `GOOGLE_OAUTH_SETUP.md` for configuring auth.

## Backend API (Timetable Generation)

The timetable generation uses a Python FastAPI backend:

1. **Install Python 3.8+** and pip
2. **Start the backend:**
   ```bash
   cd backend
   ./start.sh
   ```
   Or manually:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. **Backend runs on:** `http://localhost:8000`
4. **API docs:** `http://localhost:8000/docs`

The backend provides AI-powered timetable generation with conflict resolution, room optimization, and constraint handling.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
