import { Checkbox } from '@ds/primitives';
import { cn } from '@ds/utils/cn';
import type { ShoppingItemRow } from '@/ui/store/selectors';

export interface ShoppingRowProps {
  item: ShoppingItemRow;
  onToggle: () => void;
}

function recipeCountColor(count: number): string {
  if (count >= 3) return 'text-danger';
  if (count === 2) return 'text-amber-500';
  return 'text-[var(--muted)]';
}

export function ShoppingRow({ item, onToggle }: ShoppingRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-start gap-3.5 px-1 py-3.5 border-0 bg-transparent border-b border-[rgba(28,26,22,0.05)] cursor-pointer text-left w-full font-inherit"
    >
      <Checkbox checked={item.checked} onChange={onToggle} className="mt-0.5 shrink-0" />
      <span
        className={cn(
          'flex-1 min-w-0 text-base transition-all duration-200',
          item.checked ? 'text-[var(--muted)] line-through' : 'text-ink'
        )}
      >
        {item.name}
      </span>
      {item.source === 'extra' ? (
        <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] shrink-0 mt-0.5">
          hors recette
        </span>
      ) : item.recipeNames.length > 0 ? (
        <span
          className={cn(
            'text-[11px] text-right shrink-0 max-w-[45%] leading-snug whitespace-pre-line',
            recipeCountColor(item.recipeNames.length),
            item.checked && 'line-through'
          )}
        >
          {item.recipeNames.join('\n')}
        </span>
      ) : null}
    </button>
  );
}
