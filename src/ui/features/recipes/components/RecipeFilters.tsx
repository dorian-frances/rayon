import { useMemo } from 'react';
import type { Category } from '@domain/category';
import type { Recipe } from '@domain/recipe';
import { PillGroup, SearchInput } from '@ds/primitives';

export interface RecipeFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  origin: string;
  onOriginChange: (origin: string) => void;
  recipes: readonly Recipe[];
  categories: readonly Category[];
  isDesktop: boolean;
}

export function RecipeFilters({
  query,
  onQueryChange,
  categoryId,
  onCategoryChange,
  origin,
  onOriginChange,
  recipes,
  categories,
  isDesktop,
}: RecipeFiltersProps) {
  const counts = useMemo(() => {
    const all = recipes.length;
    const byCat: Record<string, number> = {};
    for (const c of categories) {
      byCat[c.id] = recipes.filter((r) => r.categories.includes(c.id)).length;
    }
    return { all, byCat };
  }, [recipes, categories]);

  const origins = useMemo(() => {
    const set = new Set<string>();
    for (const r of recipes) if (r.origin) set.add(r.origin);
    return [...set];
  }, [recipes]);

  const catOptions = [
    { id: 'all', label: 'Tout', count: counts.all },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      count: counts.byCat[c.id] ?? 0,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <div className="flex-1 min-w-[200px] basis-full md:basis-[280px] md:flex-none">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Rechercher…"
        />
      </div>

      <PillGroup
        options={catOptions}
        value={categoryId}
        onChange={onCategoryChange}
      />

      {isDesktop && origins.length > 0 ? (
        <div className="flex gap-1 flex-wrap ml-auto">
          {origins.map((o) => {
            const isFlag = /^\p{Extended_Pictographic}/u.test(o);
            const active = origin === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => onOriginChange(o === origin ? '' : o)}
                className={
                  'min-w-9 h-9 px-2.5 rounded-full font-inherit cursor-pointer transition-colors ' +
                  (active
                    ? 'border-[1.5px] border-ink bg-[rgba(28,26,22,0.06)]'
                    : 'border border-[var(--hairline-strong)] bg-transparent hover:bg-[rgba(28,26,22,0.04)]')
                }
                style={{ fontSize: isFlag ? 16 : 12.5 }}
              >
                {o}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
