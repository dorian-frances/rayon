-- Rayon — schéma initial
-- 7 tables, RLS par user_id, pas de seed (la base est vide après inscription).
-- À exécuter dans l'éditeur SQL Supabase ou via `supabase db push`.

set search_path = public, extensions;

create extension if not exists "pgcrypto";

-- =====================
-- aisles
-- =====================
create table if not exists public.aisles (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  name        text          not null,
  emoji       text          not null default '🛒',
  position    integer       not null default 0,
  created_at  timestamptz   not null default now()
);
create index if not exists aisles_user_idx on public.aisles (user_id, position);

-- =====================
-- categories
-- =====================
create table if not exists public.categories (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  label       text          not null,
  color       text          not null default '#E8DCC4',
  created_at  timestamptz   not null default now()
);
create index if not exists categories_user_idx on public.categories (user_id);

-- =====================
-- ingredients
-- =====================
create table if not exists public.ingredients (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  name        text          not null,
  aisle_id    uuid          not null references public.aisles(id) on delete restrict,
  created_at  timestamptz   not null default now()
);
create index if not exists ingredients_user_aisle_idx on public.ingredients (user_id, aisle_id);
create index if not exists ingredients_user_name_idx on public.ingredients (user_id, lower(name));

-- =====================
-- recipes
-- =====================
create table if not exists public.recipes (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  name        text          not null,
  image       text,
  origin      text,
  link        text,
  categories  uuid[]        not null default '{}',
  steps       jsonb         not null default '[]'::jsonb,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);
create index if not exists recipes_user_idx on public.recipes (user_id, updated_at desc);

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists recipes_touch_updated_at on public.recipes;
create trigger recipes_touch_updated_at
  before update on public.recipes
  for each row execute procedure public.touch_updated_at();

-- =====================
-- recipe_ingredients (jointure)
-- =====================
create table if not exists public.recipe_ingredients (
  recipe_id      uuid    not null references public.recipes(id) on delete cascade,
  ingredient_id  uuid    not null references public.ingredients(id) on delete cascade,
  position       integer not null default 0,
  primary key (recipe_id, ingredient_id)
);
create index if not exists recipe_ingredients_ing_idx on public.recipe_ingredients (ingredient_id);

-- =====================
-- cart_recipes
-- =====================
create table if not exists public.cart_recipes (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  recipe_id  uuid        not null references public.recipes(id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- =====================
-- cart_items (ingrédients cochables, dérivés des recettes au panier)
-- =====================
create table if not exists public.cart_items (
  user_id        uuid    not null references auth.users(id) on delete cascade,
  ingredient_id  uuid    not null references public.ingredients(id) on delete cascade,
  checked        boolean not null default false,
  primary key (user_id, ingredient_id)
);

-- =====================
-- cart_extras (articles hors recette)
-- =====================
create table if not exists public.cart_extras (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  name        text          not null,
  aisle_id    uuid          references public.aisles(id) on delete set null,
  checked     boolean       not null default false,
  created_at  timestamptz   not null default now()
);
create index if not exists cart_extras_user_idx on public.cart_extras (user_id);

-- =====================
-- RLS — owner all
-- =====================
alter table public.aisles             enable row level security;
alter table public.categories         enable row level security;
alter table public.ingredients        enable row level security;
alter table public.recipes            enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.cart_recipes       enable row level security;
alter table public.cart_items         enable row level security;
alter table public.cart_extras        enable row level security;

-- Direct user_id tables : policy "owner all"
do $$
declare t text;
begin
  for t in select unnest(array[
    'aisles','categories','ingredients','recipes',
    'cart_recipes','cart_items','cart_extras'
  ]) loop
    execute format($q$
      drop policy if exists owner_all on public.%I;
      create policy owner_all on public.%I for all
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);
    $q$, t, t);
  end loop;
end $$;

-- recipe_ingredients : RLS via jointure (le user_id est sur la recette)
drop policy if exists owner_all on public.recipe_ingredients;
create policy owner_all on public.recipe_ingredients for all
  using (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_ingredients.recipe_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_ingredients.recipe_id and r.user_id = auth.uid()
    )
  );

-- =====================
-- Realtime — activer sur toutes les tables pertinentes
-- =====================
alter publication supabase_realtime add table
  public.aisles, public.categories, public.ingredients,
  public.recipes, public.recipe_ingredients,
  public.cart_recipes, public.cart_items, public.cart_extras;
