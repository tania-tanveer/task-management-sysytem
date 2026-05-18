create extension if not exists "pgcrypto";

create type public.task_status as enum ('todo', 'in_progress', 'done');
create type public.priority_level as enum ('Low', 'Medium', 'High');

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  description text,
  priority public.priority_level not null default 'Medium',
  due_date date,
  status public.task_status not null default 'todo',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index boards_user_id_idx on public.boards(user_id);
create index tasks_board_id_status_position_idx on public.tasks(board_id, status, position);
create index tasks_user_id_idx on public.tasks(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger boards_set_updated_at
before update on public.boards
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create or replace function public.create_default_boards()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.boards (user_id, title)
  values
    (new.id, 'Work'),
    (new.id, 'Personal');

  return new;
end;
$$;

create trigger on_auth_user_created_create_boards
after insert on auth.users
for each row execute function public.create_default_boards();

alter table public.boards enable row level security;
alter table public.tasks enable row level security;

create policy "Users can view their boards"
on public.boards for select
using (auth.uid() = user_id);

create policy "Users can create their boards"
on public.boards for insert
with check (auth.uid() = user_id);

create policy "Users can update their boards"
on public.boards for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their boards"
on public.boards for delete
using (auth.uid() = user_id);

create policy "Users can view their tasks"
on public.tasks for select
using (auth.uid() = user_id);

create policy "Users can create tasks on their boards"
on public.tasks for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.boards
    where boards.id = tasks.board_id
      and boards.user_id = auth.uid()
  )
);

create policy "Users can update their tasks"
on public.tasks for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.boards
    where boards.id = tasks.board_id
      and boards.user_id = auth.uid()
  )
);

create policy "Users can delete their tasks"
on public.tasks for delete
using (auth.uid() = user_id);
