import { useRef, useState } from 'react';
import type { AisleId } from '@domain/aisle';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import { SearchInput } from '@ds/primitives';
import { XIcon } from '@ds/icons';
import { useIngredients } from '@/ui/hooks/useIngredients';
import { useRayonStore } from '@/ui/store';
import { IngredientSuggestions } from './IngredientSuggestions';

export interface IngredientPickerProps {
  selected: readonly IngredientId[];
  onChange: (next: IngredientId[]) => void;
}

export function IngredientPicker({ selected, onChange }: IngredientPickerProps) {
  const ingredients = useRayonStore((s) => s.ingredients);
  const aisles = useRayonStore((s) => s.aisles);
  const { create } = useIngredients();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ingMap = new Map(ingredients.map((i) => [i.id, i] as const));
  const aisleMap = new Map(aisles.map((a) => [a.id, a] as const));

  const toggle = (id: IngredientId) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  return (
    <div>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map((iid) => {
            const ing = ingMap.get(iid);
            if (!ing) return null;
            const aisle = aisleMap.get(ing.aisleId);
            return (
              <SelectedChip
                key={iid}
                ingredient={ing}
                aisleEmoji={aisle?.emoji}
                onRemove={() => toggle(iid)}
              />
            );
          })}
        </div>
      ) : null}

      <div className="relative">
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={
            selected.length === 0
              ? 'Ajouter un ingrédient…'
              : 'Ajouter un autre ingrédient…'
          }
          focused={focused}
        />
        <IngredientSuggestions
          open={Boolean(query) && focused}
          query={query}
          ingredients={ingredients}
          aisles={aisles}
          selectedIds={selected}
          onPick={(id) => {
            if (!selected.includes(id)) onChange([...selected, id]);
            setQuery('');
            inputRef.current?.focus();
          }}
          onCreate={async (name, aisleId: AisleId) => {
            const ing = await create(name, aisleId);
            onChange([...selected, ing.id]);
            setQuery('');
            inputRef.current?.focus();
          }}
        />
      </div>
    </div>
  );
}

function SelectedChip({
  ingredient,
  aisleEmoji,
  onRemove,
}: {
  ingredient: Ingredient;
  aisleEmoji?: string;
  onRemove: () => void;
}) {
  return (
    <span className="h-[30px] pl-3 pr-1.5 rounded-full bg-ink text-ink-contrast text-[13px] inline-flex items-center gap-2">
      {aisleEmoji ? <span className="opacity-50 text-[11px]">{aisleEmoji}</span> : null}
      {ingredient.name}
      <button
        type="button"
        onClick={onRemove}
        className="w-5 h-5 rounded-full border-0 bg-[rgba(250,248,243,0.15)] text-ink-contrast inline-flex items-center justify-center cursor-pointer p-0"
        aria-label="Retirer"
      >
        <XIcon size={11} sw={2.5} />
      </button>
    </span>
  );
}
