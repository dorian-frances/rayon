import { useMemo, useState } from 'react';
import { sortByPosition, type Aisle } from '@domain/aisle';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import type { AisleId } from '@domain/aisle';
import { HighlightMatch, Suggestion } from '@ds/primitives';
import { PlusIcon } from '@ds/icons';

export interface IngredientSuggestionsProps {
  open: boolean;
  query: string;
  ingredients: readonly Ingredient[];
  aisles: readonly Aisle[];
  selectedIds: readonly IngredientId[];
  onPick: (id: IngredientId) => void;
  onCreate: (name: string, aisleId: AisleId) => void;
}

export function IngredientSuggestions({
  open,
  query,
  ingredients,
  aisles,
  selectedIds,
  onPick,
  onCreate,
}: IngredientSuggestionsProps) {
  const q = query.trim().toLowerCase();

  const matches = useMemo(
    () =>
      q
        ? ingredients
            .filter((i) => i.name.toLowerCase().includes(q))
            .slice(0, 40)
        : [],
    [ingredients, q]
  );

  const exactMatch = useMemo(
    () => ingredients.find((i) => i.name.toLowerCase() === q),
    [ingredients, q]
  );

  const sortedAisles = useMemo(() => sortByPosition(aisles), [aisles]);

  const byAisle = useMemo(() => {
    const map = new Map<string, Ingredient[]>();
    for (const i of matches) {
      const arr = map.get(i.aisleId) ?? [];
      arr.push(i);
      map.set(i.aisleId, arr);
    }
    return map;
  }, [matches]);

  const [pickingAisle, setPickingAisle] = useState(false);

  return (
    <Suggestion open={open}>
      <div className="overflow-auto flex-1">
        {matches.length === 0 ? (
          <div className="px-4 py-3.5 text-[13px] text-[var(--muted-strong)]">
            Aucun ingrédient existant ne correspond.
          </div>
        ) : null}
        {sortedAisles.map((a) => {
          const items = byAisle.get(a.id);
          if (!items || items.length === 0) return null;
          return (
            <div key={a.id}>
              <div className="px-4 pt-2 pb-1 text-[10.5px] tracking-[0.12em] uppercase text-[rgba(28,26,22,0.4)] flex items-center gap-1.5 bg-bg">
                <span>{a.emoji}</span>
                {a.name}
              </div>
              {items.map((i) => {
                const already = selectedIds.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onPick(i.id)}
                    disabled={already}
                    className={
                      'w-full px-4 py-2 border-0 bg-transparent text-left text-[14px] flex items-center justify-between cursor-pointer hover:bg-[rgba(28,26,22,0.04)] disabled:cursor-default ' +
                      (already ? 'text-[var(--muted)]' : 'text-ink')
                    }
                  >
                    <HighlightMatch text={i.name} query={q} />
                    {already ? (
                      <span className="text-[11px]">✓ déjà ajouté</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {!exactMatch && q ? (
        <div className="border-t border-[var(--hairline)] bg-[rgba(201,100,66,0.05)] p-2.5">
          {pickingAisle ? (
            <div>
              <div className="text-[11.5px] text-[var(--muted-strong)] mb-1.5 px-1">
                Ranger « <b>{q}</b> » dans quel rayon ?
              </div>
              <div className="flex flex-wrap gap-1">
                {sortedAisles.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onCreate(q, a.id);
                      setPickingAisle(false);
                    }}
                    className="h-8 px-2.5 rounded-full border border-[var(--hairline-strong)] bg-card text-[12.5px] inline-flex items-center gap-1.5 cursor-pointer hover:bg-[rgba(28,26,22,0.04)]"
                  >
                    <span>{a.emoji}</span>
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setPickingAisle(true)}
              className="w-full px-2.5 py-2 rounded-lg bg-transparent text-[13.5px] text-ink cursor-pointer text-left flex items-center gap-2 border-0 hover:bg-[rgba(28,26,22,0.04)]"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-ink inline-flex items-center justify-center text-ink-contrast shrink-0">
                <PlusIcon size={12} sw={2.5} />
              </span>
              Créer « <b>{q}</b> »
            </button>
          )}
        </div>
      ) : null}
    </Suggestion>
  );
}
