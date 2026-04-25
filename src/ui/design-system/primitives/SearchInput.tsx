import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { SearchIcon, XIcon } from '../icons/icons';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value: string;
  onChange: (next: string) => void;
  onClear?: () => void;
  focused?: boolean;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      onChange,
      onClear,
      focused,
      containerClassName,
      className,
      placeholder,
      ...rest
    },
    ref
  ) {
    const canClear = Boolean(value) && (onClear ?? (() => onChange('')));
    return (
      <div
        className={cn(
          'flex items-center gap-2 h-11 px-3.5 rounded-[12px] bg-card',
          'transition-[border-color] duration-150',
          focused
            ? 'border-[1.5px] border-ink'
            : 'border border-[var(--hairline-strong)]',
          containerClassName
        )}
      >
        <SearchIcon size={16} stroke="var(--muted)" />
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent border-0 outline-none text-ink text-[14.5px]',
            className
          )}
          {...rest}
        />
        {canClear ? (
          <button
            type="button"
            onClick={() => (onClear ? onClear() : onChange(''))}
            aria-label="Effacer"
            className="w-[22px] h-[22px] rounded-full border-0 bg-[rgba(28,26,22,0.08)] hover:bg-[rgba(28,26,22,0.12)] flex items-center justify-center cursor-pointer"
          >
            <XIcon size={11} sw={2.5} />
          </button>
        ) : null}
      </div>
    );
  }
);
