-- Create the table for journal entries
create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'Untitled',
  content text default '',
  tags text[] default array[]::text[],
  ai_insight jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.journal_entries enable row level security;

-- Create policies to restrict access to owner only
create policy "Users can view their own entries"
on public.journal_entries for select
using (auth.uid() = user_id);

create policy "Users can insert their own entries"
on public.journal_entries for insert
with check (auth.uid() = user_id);

create policy "Users can update their own entries"
on public.journal_entries for update
using (auth.uid() = user_id);

create policy "Users can delete their own entries"
on public.journal_entries for delete
using (auth.uid() = user_id);
