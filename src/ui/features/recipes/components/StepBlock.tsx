import { useState } from 'react';
import type { RecipeStep, RecipeStepKind } from '@domain/recipe';
import { AutoTextarea } from '@ds/primitives';
import { XIcon } from '@ds/icons';

export interface StepBlockProps {
  block: RecipeStep;
  number: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  onChangeKind: (kind: RecipeStepKind) => void;
}

export function StepBlock({
  block,
  number,
  onChange,
  onRemove,
}: StepBlockProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        'flex items-start gap-2.5 relative ' +
        (block.kind === 'h' ? 'pt-4 pb-1.5' : 'py-1')
      }
    >
      <div
        className="w-7 shrink-0 text-right font-serif text-[var(--muted)]"
        style={{
          paddingTop: block.kind === 'h' ? 4 : 2,
          fontSize: 14,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {block.kind === 'li' ? `${number}.` : ''}
      </div>
      {block.kind === 'h' ? (
        <input
          value={block.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Titre de section…"
          className="flex-1 bg-transparent border-0 outline-none p-0 font-serif text-[20px] font-medium tracking-[-0.015em]"
        />
      ) : (
        <AutoTextarea
          value={block.value}
          onChange={onChange}
          placeholder={block.kind === 'li' ? 'Décris cette étape…' : 'Texte…'}
          className="text-[15.5px] leading-[1.55]"
        />
      )}
      {hover ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer"
          className="absolute right-[-4px] top-1 w-6 h-6 rounded-full border-0 bg-[rgba(28,26,22,0.05)] cursor-pointer flex items-center justify-center text-[var(--muted-strong)]"
        >
          <XIcon size={12} />
        </button>
      ) : null}
    </div>
  );
}
