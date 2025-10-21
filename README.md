# Todo App

A modern, full-stack todo application built with Next.js 15, React 18, TypeScript, and Supabase.

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, and delete todos
- Mark todos as completed/active
- Filter todos by status (all, active, completed)
- Real-time todo counter
- Responsive design with Tailwind CSS
- Protected routes with middleware
- Server-side authentication with Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication & Database)
- **Package Manager**: npm

## Prerequisites

- Node.js (v18 or higher)
- npm
- A Supabase account and project

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd claude-code-subagent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up Supabase database

Create the following table in your Supabase database:

```sql
-- Create todos table
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can create their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── register/
│   │   │   └── page.tsx         # Registration page
│   │   └── todos/
│   │       └── page.tsx         # Todo list page
│   ├── lib/
│   │   ├── supabase.ts          # Supabase server client
│   │   ├── supabase-browser.ts  # Supabase browser client
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── todos.ts             # Todo CRUD operations
│   │   └── validation.ts        # Input validation
│   └── middleware.ts            # Route protection middleware
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication

- Secure user registration and login
- Session management with Supabase Auth
- Protected routes using Next.js middleware
- Automatic redirect for authenticated/unauthenticated users

### Todo Management

- Add new todos with a simple form
- Toggle todo completion status with a checkbox
- Delete todos with confirmation
- Filter todos by status (all, active, completed)
- Real-time counters for active and completed todos

### UI/UX

- Clean and intuitive interface
- Responsive design that works on all devices
- Loading states for better user feedback
- Hover effects and smooth transitions
- Clear visual feedback for completed todos

## Security

- Row Level Security (RLS) policies in Supabase
- Server-side validation
- Protected API routes
- Secure session management

## License

This project is private and not licensed for public use.
