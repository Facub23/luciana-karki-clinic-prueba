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

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb
);

create index if not exists lead_events_lead_id_idx on public.lead_events (lead_id);
create index if not exists lead_events_created_at_idx on public.lead_events (created_at desc);

alter table public.lead_events enable row level security;

drop policy if exists "No public lead event access" on public.lead_events;

create policy "No public lead event access"
on public.lead_events
for all
using (false)
with check (false);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  section text not null,
  label text not null,
  content_type text not null default 'text',
  value text not null default '',
  description text,
  constraint site_content_type_check check (
    content_type in ('text', 'textarea', 'url', 'json')
  ),
  unique (section, label)
);

create index if not exists site_content_section_idx on public.site_content (section);

drop trigger if exists site_content_set_updated_at on public.site_content;

create trigger site_content_set_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "No public site content access" on public.site_content;

create policy "No public site content access"
on public.site_content
for all
using (false)
with check (false);

insert into public.site_content (section, label, content_type, value, description)
values
  ('Inicio', 'Título principal', 'text', 'Medicina estética con resultados naturales', 'Texto principal del hero.'),
  ('Inicio', 'Subtítulo doctora', 'text', 'Dra. Luciana Karki Martín', 'Nombre visible debajo del título.'),
  ('Inicio', 'Descripción hero', 'textarea', 'Tratamientos faciales y corporales diseñados con valoración médica, criterio estético y una prioridad clara: realzar sin transformar tu esencia.', 'Texto descriptivo del inicio.'),
  ('Contacto', 'WhatsApp', 'text', '+34 644 24 17 06', 'Número de contacto principal.'),
  ('SEO', 'Meta title', 'text', 'Dra. Luciana Karki Martín | Medicina Estética', 'Título SEO por defecto.'),
  ('SEO', 'Meta description', 'textarea', 'Medicina estética avanzada, tratamientos faciales y corporales personalizados en Barcelona y Alicante.', 'Descripción SEO principal.')
on conflict (section, label) do nothing;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  patient_name text not null,
  phone text not null,
  treatment text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled',
  notes text,
  constraint reservations_status_check check (
    status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
  )
);

create index if not exists reservations_starts_at_idx on public.reservations (starts_at);
create index if not exists reservations_status_idx on public.reservations (status);
create index if not exists reservations_lead_id_idx on public.reservations (lead_id);

drop trigger if exists reservations_set_updated_at on public.reservations;

create trigger reservations_set_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

alter table public.reservations enable row level security;

drop policy if exists "No public reservations access" on public.reservations;

create policy "No public reservations access"
on public.reservations
for all
using (false)
with check (false);
