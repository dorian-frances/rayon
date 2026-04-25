import { useState } from 'react';
import type { Aisle, AisleId } from '@domain/aisle';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import { Button, DashedAddButton } from '@ds/primitives';
import { useIngredients } from '@/ui/hooks/useIngredients';
import { IngredientChip } from './IngredientChip';

export interface AisleIngredientsProps {
  aisle: Aisle;
  allAisles: readonly Aisle[];
  ingredients: readonly Ingredient[];
}

export function AisleIngredients({
  aisle,
  allAisles,
  ingredients,
}: AisleIngredientsProps) {
  const { create, move, remove } = useIngredients();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const submit = async () => {
    if (!name.trim()) {
      setAdding(false);
      setName('');
      return;
    }
    await create(name.trim(), aisle.id);
    setName('');
  };

  return (
    <div className="px-4 py-2.5 pl-[52px] bg-[rgba(28,26,22,0.02)]">
      {ingredients.length === 0 ? (
        <div className="text-[12.5px] text-[var(--muted)] py-1.5">
          Aucun ingrédient dans ce rayon.
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {ingredients.map((ing) => (
          <IngredientChip
            key={ing.id}
            ingredient={ing}
            allAisles={allAisles}
            onMove={(aid: AisleId) => void move(ing.id, aid)}
            onDelete={() => void remove(ing.id as IngredientId)}
          />
        ))}
      </div>
      {adding ? (
        <div className="flex gap-1.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void submit();
              if (e.key === 'Escape') {
                setAdding(false);
                setName('');
              }
            }}
            placeholder={`Ingrédient dans ${aisle.name}…`}
            className="flex-1 h-[34px] px-3 rounded-[10px] border border-[var(--hairline-strong)] bg-card text-[13px] outline-none"
          />
          <Button variant="solid" size="sm" onClick={submit}>
            Ajouter
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
            Annuler
          </Button>
        </div>
      ) : (
        <DashedAddButton size="sm" onClick={() => setAdding(true)}>
          ingrédient
        </DashedAddButton>
      )}
    </div>
  );
}
