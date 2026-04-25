import { cn } from '../utils/cn';
import { CheckIcon } from '../icons/icons';

export interface CheckboxProps {
  checked: boolean;
  onChange?: (next: boolean) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Checkbox({
  checked,
  onChange,
  size = 22,
  className,
  disabled,
  ...rest
}: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!checked);
      }}
      disabled={disabled}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        'rounded-full flex items-center justify-center shrink-0 p-0 transition-all duration-200',
        'cursor-pointer',
        checked ? 'bg-ink' : 'bg-transparent',
        className
      )}
      style={{
        width: size,
        height: size,
        border: checked
          ? '1.5px solid var(--ink)'
          : '1.5px solid rgba(28,26,22,0.25)',
      }}
      {...rest}
    >
      {checked ? (
        <CheckIcon size={size * 0.6} stroke="var(--ink-contrast)" sw={2.5} />
      ) : null}
    </button>
  );
}
