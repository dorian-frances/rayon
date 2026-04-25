import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface InlineEmojiProps {
  value: string;
  onSubmit: (next: string) => void;
  className?: string;
}

export function InlineEmoji({ value, onSubmit, className }: InlineEmojiProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, 2))}
        onBlur={() => {
          onSubmit(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            onSubmit(draft);
            setEditing(false);
          }
        }}
        className={cn(
          'w-8 h-8 rounded-[10px] text-center outline-none p-0 bg-card',
          'border-[1.5px] border-ink text-[16px]',
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'w-8 h-8 rounded-[10px] border-0 cursor-pointer text-[16px]',
        'bg-[rgba(28,26,22,0.04)] flex items-center justify-center',
        className
      )}
    >
      {value}
    </button>
  );
}
