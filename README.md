# Rayon

App de courses & recettes : transpose un dashboard Notion en web app responsive (mobile au supermarché, desktop à la maison). Architecture hexagonale frontend, connectée à Supabase.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind v4** (tokens via CSS variables)
- **zustand** (UI state) + **motion** (animations)
- **Supabase** (auth multi-user + Postgres + realtime)
- **pnpm**

## Architecture hexagonale

```
src/
├── domain/          # TS pur — entités, value objects, errors
├── application/     # ports (interfaces) + use cases
├── infrastructure/  # adapters Supabase, in-memory, localStorage
├── composition/     # DI root — wire les adapters aux use cases
└── ui/              # React — design system, features, store, routing
```

Règle de dépendance centripète : `ui → application → domain`, `infrastructure → domain + application/ports`.

## Lancement

```bash
pnpm install
cp .env.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
pnpm dev
```

Ouvre `http://localhost:5173`.

## Commandes

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de dev Vite |
| `pnpm build` | Build de production (typecheck + Vite) |
| `pnpm preview` | Preview du build |
| `pnpm typecheck` | Vérification TypeScript seule |

## Base de données

Les migrations sont dans `supabase/migrations/`. Exécuter dans l'éditeur SQL Supabase dans l'ordre chronologique, ou via `supabase db reset` si la CLI est installée.
