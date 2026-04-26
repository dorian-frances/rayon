import { useMemo } from 'react';
import type { Category } from '@domain/category';
import type { Tag, TagId } from '@domain/tag';
import type { Recipe } from '@domain/recipe';
import { PillGroup, SearchInput } from '@ds/primitives';

export interface RecipeFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  activeTagIds: readonly TagId[];
  onToggleTag: (id: TagId) => void;
  recipes: readonly Recipe[];
  categories: readonly Category[];
  tags: readonly Tag[];
  isDesktop: boolean;
}

export function RecipeFilters({
  query,
  onQueryChange,
  categoryId,
  onCategoryChange,
  activeTagIds,
  onToggleTag,
  recipes,
  categories,
  tags,
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

  // Tags qui apparaissent dans au moins une recette
  const usedTags = useMemo(() => {
    const used = new Set<string>();
    for (const r of recipes) for (const t of r.tags) used.add(t);
    return tags.filter((t) => used.has(t.id));
  }, [recipes, tags]);

  const catOptions = [
    { id: 'all', label: 'Tout', count: counts.all },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      count: counts.byCat[c.id] ?? 0,
    })),
  ];

  return (
    <div className="flex flex-col gap-2 mb-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] basis-full md:basis-[280px] md:flex-none">
          <SearchInput value={query} onChange={onQueryChange} placeholder="Rechercher…" />
        </div>

        <PillGroup options={catOptions} value={categoryId} onChange={onCategoryChange} />
      </div>

      {isDesktop && usedTags.length > 0 ? (
        <div className="flex gap-1 flex-wrap">
          {usedTags.map((t) => {
            const active = activeTagIds.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggleTag(t.id)}
                className={
                  'h-8 px-3 rounded-full font-inherit cursor-pointer transition-colors text-[12.5px] ' +
                  (active
                    ? 'border-[1.5px] border-ink bg-[rgba(28,26,22,0.06)]'
                    : 'border border-[var(--hairline-strong)] bg-transparent hover:bg-[rgba(28,26,22,0.04)]')
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
