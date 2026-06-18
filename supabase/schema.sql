-- Workers table
create table workers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  email text not null unique,
  phone text,
  city text,
  country text,
  markets text[] default '{}',
  roles text[] default '{}',
  experience text,
  events_worked text,
  availability text[] default '{}',
  international boolean default false,
  languages text,
  right_to_work_uk boolean default false,
  heard_from text,
  cv_url text,
  status text default 'Applied',
  tier text,
  notes text,
  rating integer default 0,
  date_available text,
  emergency_contact text,
  bank_details_provided boolean default false,
  deel_contract_active boolean default false
);

-- Client briefs table
create table client_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  event_name text,
  event_type text,
  event_date text,
  event_end_date text,
  location text,
  country text,
  staff_count text,
  roles text[] default '{}',
  budget text,
  deposit_agreed boolean default false,
  information text,
  status text default 'New',
  notes text,
  assigned_workers uuid[] default '{}'
);

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  brief_id uuid references client_briefs(id),
  event_name text,
  event_date text,
  event_end_date text,
  location text,
  country text,
  client_name text,
  client_company text,
  client_email text,
  workers uuid[] default '{}',
  total_invoice_value numeric,
  worker_cost numeric,
  margin numeric,
  deposit_amount numeric,
  deposit_paid boolean default false,
  invoice_sent boolean default false,
  invoice_paid boolean default false,
  factoring_used boolean default false,
  status text default 'Confirmed',
  notes text
);

-- Markets table
create table markets (
  id uuid primary key default gen_random_uuid(),
  country text unique,
  status text default 'Planned',
  upcoming_events text,
  notes text
);

-- Enable RLS
alter table workers enable row level security;
alter table client_briefs enable row level security;
alter table bookings enable row level security;
alter table markets enable row level security;

-- Public can insert workers and briefs
create policy "Anyone can apply" on workers for insert with check (true);
create policy "Anyone can submit brief" on client_briefs for insert with check (true);

-- Only authenticated can read and update
create policy "Auth read workers" on workers for select using (auth.role() = 'authenticated');
create policy "Auth update workers" on workers for update using (auth.role() = 'authenticated');
create policy "Auth read briefs" on client_briefs for select using (auth.role() = 'authenticated');
create policy "Auth update briefs" on client_briefs for update using (auth.role() = 'authenticated');
create policy "Auth all bookings" on bookings for all using (auth.role() = 'authenticated');
create policy "Auth all markets" on markets for all using (auth.role() = 'authenticated');

-- Service role bypasses RLS automatically

-- Seed markets
insert into markets (country, status) values
  ('United Kingdom', 'Active'),
  ('Ireland', 'Building'),
  ('Ibiza', 'Building'),
  ('Croatia', 'Building'),
  ('Netherlands', 'Building'),
  ('Belgium', 'Building');

-- Storage: create a public bucket for CVs
-- Run this in Supabase Dashboard > Storage:
-- create bucket "cvs" with public = true;
