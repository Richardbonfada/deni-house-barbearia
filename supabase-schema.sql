create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  normalized_contact text not null unique,
  password_hash text not null,
  password_salt text not null
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null,
  contact text,
  email text,
  service text not null,
  provider text not null,
  barber_id text not null,
  appointment_date date not null,
  date_label text,
  appointment_time text not null,
  payment_method text not null default 'Pendente no balcão',
  payment_status text not null default 'counter',
  payment_id text,
  payment_qr_code text,
  payment_qr_code_base64 text,
  price numeric(10, 2) not null default 0,
  unique (provider, appointment_date, appointment_time)
);

create index if not exists appointments_date_idx
  on public.appointments (appointment_date, appointment_time);

create index if not exists appointments_barber_date_idx
  on public.appointments (barber_id, appointment_date);

alter table public.appointments enable row level security;
alter table public.customers enable row level security;

drop policy if exists "Server manages appointments" on public.appointments;
drop policy if exists "Server manages customers" on public.customers;

create policy "Server manages appointments"
  on public.appointments
  for all
  using (false)
  with check (false);

create policy "Server manages customers"
  on public.customers
  for all
  using (false)
  with check (false);
