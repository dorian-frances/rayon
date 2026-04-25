import { useEffect, useRef, useState } from 'react';
import type { Aisle, AisleId } from '@domain/aisle';
import type { Ingredient } from '@domain/ingredient';
import { ChevDownIcon, TrashIcon } from '@ds/icons';

export interface IngredientChipProps {
  ingredient: Ingredient;
  allAisles: readonly Aisle[];
  onMove: (aisleId: AisleId) => void;
  onDelete: () => void;
}

export function IngredientChip({
  ingredient,
  allAisles,
  onMove,
  onDelete,
}: IngredientChipProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const others = allAisles.filter((a) => a.id !== ingredient.aisleId);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-7 px-2.5 rounded-full border border-[var(--hairline-strong)] bg-card text-[12.5px] font-inherit cursor-pointer inline-flex items-center gap-1.5 hover:bg-[rgba(28,26,22,0.04)]"
      >
        {ingredient.name}
        <ChevDownIcon size={11} stroke="rgba(28,26,22,0.4)" />
      </button>
      {open ? (
        <div className="absolute top-8 left-0 z-30 bg-card rounded-[10px] p-1 min-w-[200px] max-h-[300px] overflow-auto shadow-[var(--shadow-popover)]">
          <div className="text-[10.5px] tracking-[0.1em] uppercase text-[rgba(28,26,22,0.45)] px-2.5 pt-1.5 pb-1">
            Déplacer vers
          </div>
          {others.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                onMove(a.id);
                setOpen(false);
              }}
              className="w-full px-2.5 py-1.5 rounded-md border-0 bg-transparent cursor-pointer text-left text-[13px] text-ink flex items-center gap-2 hover:bg-[rgba(28,26,22,0.04)]"
            >
              <span className="text-[14px]">{a.emoji}</span>
              {a.name}
            </button>
          ))}
          <div className="h-px bg-[var(--hairline)] my-1" />
          <button
            type="button"
            onClick={() => {
              if (confirm(`Supprimer "${ingredient.name}" ?`)) {
                onDelete();
                setOpen(false);
              }
            }}
            className="w-full px-2.5 py-1.5 rounded-md border-0 bg-transparent cursor-pointer text-left text-[13px] flex items-center gap-2 text-[var(--danger)] hover:bg-[rgba(185,74,46,0.05)]"
          >
            <TrashIcon size={13} />
            Supprimer
          </button>
        </div>
      ) : null}
    </div>
  );
}
