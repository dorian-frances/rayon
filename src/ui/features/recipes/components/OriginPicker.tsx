import { useState } from 'react';
import { DashedAddButton } from '@ds/primitives';

export interface OriginPickerProps {
  value: string;
  onChange: (next: string) => void;
  existingOrigins: readonly string[];
}

export function OriginPicker({ value, onChange, existingOrigins }: OriginPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (draft.trim()) onChange(draft.trim());
    setDraft('');
    setAdding(false);
  };

  const showsCustomCurrent = value && !existingOrigins.includes(value);

  return (
    <div className="flex gap-1 flex-wrap items-center">
      <button
        type="button"
        onClick={() => onChange('')}
        className={
          'h-[34px] px-2.5 rounded-[17px] border border-[var(--hairline-strong)] cursor-pointer text-[12px] ' +
          (!value ? 'bg-[rgba(28,26,22,0.06)]' : 'bg-transparent')
        }
      >
        Aucune
      </button>
      {showsCustomCurrent ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="min-w-9 h-[34px] px-2.5 rounded-[17px] text-[17px] border-[1.5px] border-ink bg-[rgba(28,26,22,0.06)] cursor-pointer"
        >
          {value}
        </button>
      ) : null}
      {existingOrigins.map((o) => {
        const active = value === o;
        const isFlag = /^\p{Extended_Pictographic}/u.test(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o === value ? '' : o)}
            className={
              'min-w-9 h-[34px] px-2.5 rounded-[17px] cursor-pointer ' +
              (active
                ? 'border-[1.5px] border-ink bg-[rgba(28,26,22,0.06)]'
                : 'border border-[var(--hairline-strong)] bg-transparent hover:bg-[rgba(28,26,22,0.04)]')
            }
            style={{ fontSize: isFlag ? 17 : 12.5 }}
          >
            {o}
          </button>
        );
      })}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') {
              setAdding(false);
              setDraft('');
            }
          }}
          onBlur={submit}
          placeholder="🇫🇷 ou texte"
          className="h-[34px] px-2.5 rounded-[17px] border-[1.5px] border-ink bg-card text-[13px] outline-none w-[130px]"
        />
      ) : (
        <DashedAddButton onClick={() => setAdding(true)}>Ajouter</DashedAddButton>
      )}
    </div>
  );
}
