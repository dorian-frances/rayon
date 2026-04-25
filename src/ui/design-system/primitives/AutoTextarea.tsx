import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface AutoTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (next: string) => void;
}

export function AutoTextarea({
  value,
  onChange,
  className,
  ...rest
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full bg-transparent border-0 outline-none text-ink p-0 resize-none overflow-hidden',
        className
      )}
      {...rest}
    />
  );
}
