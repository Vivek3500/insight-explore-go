-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create app role enum
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check roles (MUST be created before policies that use it)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- User roles policies (now that has_role function exists)
create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Only admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Create scraped_jobs table
create table public.scraped_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  company text,
  location text,
  salary text,
  experience text,
  skills text[],
  description text,
  source_url text,
  scraped_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on scraped_jobs
alter table public.scraped_jobs enable row level security;

-- Scraped jobs policies
create policy "Users can view their own scraped jobs"
  on public.scraped_jobs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own scraped jobs"
  on public.scraped_jobs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own scraped jobs"
  on public.scraped_jobs for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own scraped jobs"
  on public.scraped_jobs for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create saved_jobs table (bookmarks)
create table public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references public.scraped_jobs(id) on delete cascade not null,
  notes text,
  created_at timestamp with time zone not null default now(),
  unique (user_id, job_id)
);

-- Enable RLS on saved_jobs
alter table public.saved_jobs enable row level security;

-- Saved jobs policies
create policy "Users can view their own saved jobs"
  on public.saved_jobs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own saved jobs"
  on public.saved_jobs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved jobs"
  on public.saved_jobs for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own saved jobs"
  on public.saved_jobs for update
  to authenticated
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for profiles updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for better query performance
create index idx_scraped_jobs_user_id on public.scraped_jobs(user_id);
create index idx_scraped_jobs_created_at on public.scraped_jobs(created_at desc);
create index idx_saved_jobs_user_id on public.saved_jobs(user_id);
create index idx_saved_jobs_job_id on public.saved_jobs(job_id);
create index idx_user_roles_user_id on public.user_roles(user_id);