import { Checkbox } from '@ds/primitives';
import { cn } from '@ds/utils/cn';
import type { ShoppingItemRow } from '@/ui/store/selectors';

export interface ShoppingRowProps {
  item: ShoppingItemRow;
  onToggle: () => void;
}

export function ShoppingRow({ item, onToggle }: ShoppingRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3.5 px-1 py-3.5 border-0 bg-transparent border-b border-[rgba(28,26,22,0.05)] cursor-pointer text-left w-full font-inherit"
    >
      <Checkbox checked={item.checked} onChange={onToggle} />
      <span
        className={cn(
          'flex-1 text-base transition-all duration-200',
          item.checked ? 'text-[var(--muted)] line-through' : 'text-ink'
        )}
      >
        {item.name}
      </span>
      {item.source === 'extra' ? (
        <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)]">
          hors recette
        </span>
      ) : null}
    </button>
  );
}
