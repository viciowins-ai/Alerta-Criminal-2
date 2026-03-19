-- Tabela de Perfis Públicos (Vinculada ao Auth.Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  phone text,
  cpf text,
  guardian_level text default 'Guardião Bronze', -- Ex: Bronze, Prata, Ouro
  points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar segurança RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Políticas de Acesso
create policy "Perfis são visíveis publicamente" on public.profiles
  for select using (true);

create policy "Usuários podem editar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Gatilho para criar perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, guardian_level, points)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'Guardião Bronze', 0);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Tabela de Incidentes (Alertas)
create table public.incidents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text not null, -- Ex: roubo, suspeita, vandalismo
  description text,
  latitude double precision not null,
  longitude double precision not null,
  media_url text, -- Foto ou Vídeo
  status text default 'reportado', -- reportado, verificado, resolvido
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.incidents enable row level security;

create policy "Incidentes são visíveis para todos" on public.incidents
  for select using (true);

create policy "Usuários logados podem criar incidentes" on public.incidents
  for insert with check (auth.uid() = user_id);

-- Configuração de Storage (Para fotos)
-- Nota: Você precisará criar um Bucket chamado 'app-uploads' no menu Storage manualmente,
-- mas aqui está a política caso queira rodar depois.
-- insert into storage.buckets (id, name) values ('app-uploads', 'app-uploads');

-- create policy "Qualquer um pode ver imagens" on storage.objects
--   for select using ( bucket_id = 'app-uploads' );

-- create policy "Usuários logados podem fazer upload" on storage.objects
--   for insert with check ( bucket_id = 'app-uploads' and auth.role() = 'authenticated' );

-- Tabela de Contatos de Emergência
create table public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  phone text not null,
  relationship text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.emergency_contacts enable row level security;

create policy "Usuários podem ver seus próprios contatos" on public.emergency_contacts
  for select using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios contatos" on public.emergency_contacts
  for insert with check (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios contatos" on public.emergency_contacts
  for delete using (auth.uid() = user_id);

-- Tabela de Comentários (Feed)
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  incident_id uuid references public.incidents(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comentários visíveis para todos" on public.comments for select using (true);
-- Importante: impedir spoof de user_id no insert
create policy "Usuários podem comentar" on public.comments
  for insert with check (auth.uid() = user_id);

-- Tabela de Likes (Feed)
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  incident_id uuid references public.incidents(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, incident_id) -- Um like por usuário por post
);

alter table public.likes enable row level security;

create policy "Likes visíveis para todos" on public.likes for select using (true);
-- Importante: impedir spoof de user_id no insert
create policy "Usuários podem dar like" on public.likes
  for insert with check (auth.uid() = user_id);
create policy "Usuários podem remover like" on public.likes for delete using (auth.uid() = user_id);


