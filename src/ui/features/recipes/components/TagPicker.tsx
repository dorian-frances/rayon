import { useState } from 'react';
import type { Tag, TagId } from '@domain/tag';
import { DashedAddButton } from '@ds/primitives';
import { useTags } from '@/ui/hooks/useTags';

export interface TagPickerProps {
  tags: readonly Tag[];
  selected: readonly TagId[];
  onChange: (next: TagId[]) => void;
}

export function TagPicker({ tags, selected, onChange }: TagPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const { create } = useTags();

  const toggle = (id: TagId) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  const submit = async () => {
    if (!draft.trim()) {
      setAdding(false);
      setDraft('');
      return;
    }
    const t = await create(draft.trim());
    onChange([...selected, t.id]);
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      {tags.map((t) => {
        const active = selected.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            className={
              'h-[34px] px-3.5 rounded-[17px] cursor-pointer text-[13px] font-inherit ' +
              (active
                ? 'bg-ink text-ink-contrast border-0'
                : 'bg-transparent text-ink border border-[var(--hairline-strong)] hover:bg-[rgba(28,26,22,0.04)]')
            }
          >
            {t.label}
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
          placeholder="🇫🇷 ou texte"
          className="h-[34px] px-3.5 rounded-[17px] border-[1.5px] border-ink bg-card text-[13px] outline-none w-[180px]"
        />
      ) : (
        <DashedAddButton onClick={() => setAdding(true)}>Ajouter</DashedAddButton>
      )}
    </div>
  );
}
