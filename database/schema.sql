-- SolarMatch schema for Supabase/Postgres

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique,
  profile_type text check (profile_type in ('home', 'large_home', 'shop', 'clinic')),
  created_at timestamptz not null default now()
);

create table if not exists appliance_presets (
  id text primary key,
  name text not null,
  category text not null,
  image_url text,
  icon text,
  avg_watt numeric not null,
  min_watt numeric,
  max_watt numeric,
  surge_watt numeric,
  duty_cycle numeric default 1,
  typical_usage_hours_light numeric,
  typical_usage_hours_normal numeric,
  typical_usage_hours_heavy numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists retailers (
  id text primary key,
  name text not null,
  contact text,
  phone text,
  location_json jsonb,
  distance_km numeric,
  rating numeric,
  products_json jsonb default '[]'::jsonb,
  avg_prices_json jsonb default '{}'::jsonb,
  languages text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists business_templates (
  id text primary key,
  name text not null,
  description text,
  multipliers_json jsonb not null,
  default_appliances_json jsonb not null,
  typical_daily_kwh_range numeric[] not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  template_id text not null,
  input_snapshot jsonb not null,
  result_json jsonb not null,
  retailer_ids text[] default '{}',
  created_at timestamptz not null default now()
);

create index if not exists saved_plans_user_idx on saved_plans (user_id);

