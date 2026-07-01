create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  treatment text not null default 'Valoración',
  page text,
  landing_page text,
  referrer text,
  message text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  ip text,
  user_agent text,
  status text not null default 'new',
  notes text,
  contacted_at timestamptz,
  booked_at timestamptz,
  archived_at timestamptz,
  constraint leads_status_check check (
    status in (
      'new',
      'contacted',
      'booked',
      'no_response',
      'discarded',
      'archived'
    )
  )
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_treatment_idx on public.leads (treatment);
create index if not exists leads_utm_source_idx on public.leads (utm_source);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "No public lead access" on public.leads;

create policy "No public lead access"
on public.leads
for all
using (false)
with check (false);
