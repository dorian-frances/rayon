import { useState } from 'react';
import type { Category, CategoryId } from '@domain/category';
import { DashedAddButton } from '@ds/primitives';
import { useCategories } from '@/ui/hooks/useCategories';

export interface CategoryPickerProps {
  categories: readonly Category[];
  selected: readonly CategoryId[];
  onChange: (next: CategoryId[]) => void;
}

export function CategoryPicker({
  categories,
  selected,
  onChange,
}: CategoryPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const { create } = useCategories();

  const toggle = (id: CategoryId) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  const submit = async () => {
    if (!draft.trim()) {
      setAdding(false);
      return;
    }
    const c = await create(draft.trim());
    onChange([...selected, c.id]);
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      {categories.map((c) => {
        const active = selected.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={
              'h-[34px] px-3.5 rounded-[17px] cursor-pointer text-[13px] font-inherit ' +
              (active
                ? 'bg-ink text-ink-contrast border-0'
                : 'bg-transparent text-ink border border-[var(--hairline-strong)] hover:bg-[rgba(28,26,22,0.04)]')
            }
          >
            {c.label}
          </button>
        );
      })}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit();
            if (e.key === 'Escape') {
              setAdding(false);
              setDraft('');
            }
          }}
          onBlur={() => void submit()}
          placeholder="Nom de la catégorie"
          className="h-[34px] px-3.5 rounded-[17px] border-[1.5px] border-ink bg-card text-[13px] outline-none w-[180px]"
        />
      ) : (
        <DashedAddButton onClick={() => setAdding(true)}>Ajouter</DashedAddButton>
      )}
    </div>
  );
}
