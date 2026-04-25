import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface InlineEditProps {
  value: string;
  onSubmit: (next: string) => void;
  placeholder?: string;
  className?: string;
  textSize?: number;
  allowEnterToSubmit?: boolean;
}

export function InlineEdit({
  value,
  onSubmit,
  placeholder,
  className,
  textSize = 15,
  allowEnterToSubmit = true,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          onSubmit(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (allowEnterToSubmit && e.key === 'Enter') {
            onSubmit(draft);
            setEditing(false);
          }
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn(
          'bg-transparent border-0 outline-none text-ink p-0 w-full font-inherit',
          className
        )}
        style={{
          outlineColor: 'var(--accent)',
          outlineStyle: 'solid',
          outlineWidth: '1.5px',
          outlineOffset: 2,
          fontSize: textSize,
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => setEditing(true)}
      onClick={() => setEditing(true)}
      className={cn('cursor-text', className)}
      style={{ fontSize: textSize }}
    >
      {value || <span className="text-muted">{placeholder ?? '—'}</span>}
    </span>
  );
}
