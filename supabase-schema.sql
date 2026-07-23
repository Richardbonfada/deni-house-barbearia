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

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('plan', 'service', 'product')),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  duration integer,
  stock integer,
  visits_per_month integer,
  active boolean not null default true
);

create table if not exists public.plan_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  contact text not null,
  plan_name text not null,
  plan_description text,
  price numeric(10, 2) not null default 0,
  settlement_date date not null,
  payment_method text not null default 'Balcao',
  payment_status text not null default 'counter_pending',
  pix_key text
);

create index if not exists appointments_date_idx
  on public.appointments (appointment_date, appointment_time);

create index if not exists appointments_barber_date_idx
  on public.appointments (barber_id, appointment_date);

create index if not exists catalog_items_type_idx
  on public.catalog_items (type, active);

create index if not exists plan_orders_contact_idx
  on public.plan_orders (contact, settlement_date);

alter table public.appointments enable row level security;
alter table public.customers enable row level security;
alter table public.catalog_items enable row level security;
alter table public.plan_orders enable row level security;

drop policy if exists "Server manages appointments" on public.appointments;
drop policy if exists "Server manages customers" on public.customers;
drop policy if exists "Server manages catalog items" on public.catalog_items;
drop policy if exists "Server manages plan orders" on public.plan_orders;

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

create policy "Server manages catalog items"
  on public.catalog_items
  for all
  using (false)
  with check (false);

create policy "Server manages plan orders"
  on public.plan_orders
  for all
  using (false)
  with check (false);
