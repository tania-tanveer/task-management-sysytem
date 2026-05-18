# TaskFlow - Trello Style Task Management App

Full stack task board built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL, and `@hello-pangea/dnd`.

## Folder Structure

```text
task management system/
├─ app/
│  ├─ auth/
│  │  ├─ callback/route.ts
│  │  ├─ login/page.tsx
│  │  └─ signup/page.tsx
│  ├─ boards/[boardId]/page.tsx
│  ├─ dashboard/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ board/
│  │  ├─ BoardColumn.tsx
│  │  ├─ BoardView.tsx
│  │  └─ CreateBoardForm.tsx
│  ├─ layout/AppHeader.tsx
│  └─ tasks/
│     ├─ TaskCard.tsx
│     └─ TaskModal.tsx
├─ lib/
│  ├─ constants.ts
│  └─ supabase/
│     ├─ browser.ts
│     ├─ middleware.ts
│     └─ server.ts
├─ supabase/schema.sql
├─ types/
│  ├─ app.ts
│  └─ database.ts
├─ middleware.ts
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ .env.example
```

## Features

- Supabase email/password signup, login, logout, and session refresh middleware.
- Dashboard with multiple boards. New users automatically receive `Work` and `Personal` boards from the database trigger.
- Each board has fixed `To Do`, `In Progress`, and `Done` columns.
- Create, edit, delete, and drag tasks between columns.
- Task fields: title, description, priority, due date, status, and position.
- Supabase Row Level Security keeps each user scoped to their own boards and tasks.

## Supabase Setup

1. Create a project at Supabase.
2. Open `SQL Editor` in Supabase.
3. Paste and run the SQL from `supabase/schema.sql`.
4. Go to `Authentication > Providers` and make sure Email is enabled.
5. Go to `Project Settings > API` and copy:
   - Project URL
   - `anon` public key

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If email confirmations are enabled in Supabase, signups will require email confirmation before login. During local development you can disable confirmations in `Authentication > Providers > Email` if you want immediate login after signup.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Add these Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. In Supabase, go to `Authentication > URL Configuration`:
   - Set `Site URL` to your Vercel URL.
   - Add `https://your-vercel-domain.vercel.app/auth/callback` to redirect URLs.

## Main Files

- `app/dashboard/page.tsx`: protected boards dashboard.
- `app/boards/[boardId]/page.tsx`: protected board page.
- `components/board/BoardView.tsx`: task CRUD and drag/drop persistence.
- `components/tasks/TaskModal.tsx`: create/edit task form.
- `supabase/schema.sql`: PostgreSQL schema, enums, triggers, indexes, and RLS policies.
