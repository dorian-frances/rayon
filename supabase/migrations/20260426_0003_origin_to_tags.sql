-- Migration : transformer le champ `origin` (text) en relation multi-tags.
-- Crée une table `tags` (calquée sur `categories`) et bascule chaque valeur
-- d'`origin` non-vide en un tag dédié + insertion dans recipes.tags.
--
-- Idempotente : peut être rejouée sans dommage.

set search_path = public, extensions;

-- =====================
-- 1. Table tags
-- =====================
create table if not exists public.tags (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  label       text          not null,
  created_at  timestamptz   not null default now()
);

create unique index if not exists tags_user_label_unique
  on public.tags (user_id, lower(label));

alter table public.tags enable row level security;

drop policy if exists owner_all on public.tags;
create policy owner_all on public.tags for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tags'
  ) then
    alter publication supabase_realtime add table public.tags;
  end if;
end $$;

-- =====================
-- 2. Colonne tags uuid[] sur recipes
-- =====================
alter table public.recipes
  add column if not exists tags uuid[] not null default '{}';

-- =====================
-- 3. Migration des données : origin (text) → tags table + recipes.tags
-- =====================
-- Skip si la colonne origin a déjà été supprimée (ré-exécution).
do $$
declare
  r record;
  v_tag_id uuid;
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'recipes' and column_name = 'origin'
  ) then
    -- Pour chaque (user, origin) distinct, créer le tag s'il n'existe pas.
    for r in
      select distinct user_id, trim(origin) as label
      from public.recipes
      where origin is not null and trim(origin) <> ''
    loop
      if not exists (
        select 1 from public.tags
        where user_id = r.user_id and lower(label) = lower(r.label)
      ) then
        insert into public.tags (user_id, label)
        values (r.user_id, r.label);
      end if;
    end loop;

    -- Pour chaque recette ayant un origin, mettre l'uuid du tag dans recipes.tags
    for r in
      select id, user_id, origin
      from public.recipes
      where origin is not null and trim(origin) <> ''
    loop
      select id into v_tag_id
      from public.tags
      where user_id = r.user_id and lower(label) = lower(trim(r.origin))
      limit 1;

      if v_tag_id is not null then
        update public.recipes
        set tags = case
          when tags @> array[v_tag_id]::uuid[] then tags
          else array_append(tags, v_tag_id)
        end
        where id = r.id;
      end if;
    end loop;
  end if;
end $$;

-- =====================
-- 4. Suppression de la colonne origin
-- =====================
alter table public.recipes drop column if exists origin;
