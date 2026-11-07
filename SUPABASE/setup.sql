-- Jalankan seluruh SQL ini di Supabase SQL Editor.
create table if not exists public.projects (
  id text primary key,
  no integer,
  title text not null,
  info text,
  type text default 'ZIP',
  size text,
  date text,
  videoid text not null,
  drive_url text,
  safelink_url text,
  thumbnail_url text,
  published boolean not null default true,
  sort_order bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.projects enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects
for select to anon, authenticated using (published = true or public.is_admin());

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects" on public.projects
for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects" on public.projects
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects" on public.projects
for delete to authenticated using (public.is_admin());

drop policy if exists "Admins can read own admin row" on public.admin_users;
create policy "Admins can read own admin row" on public.admin_users
for select to authenticated using (user_id = auth.uid());

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.projects to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- Import enam project lama. Link Drive belum tersedia di data.js, jadi isi drive_url nanti dari Admin Panel.
insert into public.projects (id,no,title,info,type,size,date,videoid,safelink_url,published,sort_order)
values
('1',1,'DJ TRAP YA DANA DANA_TOMY-EKA-RMX.zip','Vocal + FLM','ZIP','8,6 MB','Rabu, 6 Mei 2026','RBXPIe9ybaU','https://sub4unlock.co/i2mO',true,1),
('2',2,'DJ TRAP SHOLATUMMINALLAH_TOMYEKA-RMX.zip','Vocal + FLM','ZIP','6,8 MB','Minggu, 26 April 2026','kKOXsIuLExg','https://sub4unlock.co/LlUX9VdT',true,2),
('3',3,'DJ TRAP ARABIC INNI UHIBBUKA_TOMYEKA-RMX.zip','Vocal + FLM','ZIP','11,8 MB','Sabtu, 16 Mei 2026','IfAjHb5YUo4','https://sub4unlock.co/3FrarU',true,3),
('4',4,'DJ TRAP SHOLAWAT PASRAH_TOMYEKA-RMX.zip','Vocal + FLM + Sample','ZIP','21,03 MB','Jum''at, 29 Mei 2026','9bL_EHvdUCA','https://sub4unlock.co/gU2N8',true,4),
('5',5,'DJ TRAP HADROH HANYA SEBATANG KARA X ROHATIL (MAULID NABI).zip','Vocal + FLM','ZIP','11,20 MB','Sabtu, 20 Juni 2026','XCk07X5rbdA','https://sub4unlock.co/degPti',true,5),
('6',6,'TRAP PALESTINE - ATOUNA EL TOUFOULE_TOMYEKA-RMX.zip','Vocal + FLM','ZIP','10,0 MB','Selasa, 14 Juli 2026','VoxFZnajeaQ','https://sub4unlock.co/CSbcI',true,6)
on conflict (id) do nothing;

-- Setelah membuat akun admin di Authentication > Users, jalankan perintah ini
-- dengan UUID akun milikmu:
-- insert into public.admin_users (user_id) values ('UUID-AKUN-ADMIN');
