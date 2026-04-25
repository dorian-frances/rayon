import { cn } from '@ds/utils/cn';
import type { AisleSectionView } from '@/ui/store/selectors';
import { useCart } from '@/ui/hooks/useCart';
import { ShoppingRow } from './ShoppingRow';
import type { CartExtraId } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';

export interface AisleSectionProps {
  section: AisleSectionView;
}

export function AisleSection({ section }: AisleSectionProps) {
  const cart = useCart();
  const { aisle, items } = section;
  const done = items.filter((i) => i.checked).length;
  const allDone = done === items.length;

  const onToggle = (id: string, source: 'recipe' | 'extra') => {
    if (source === 'extra') void cart.toggleExtra(id as CartExtraId);
    else void cart.toggleItem(id as IngredientId);
  };

  return (
    <div className="mb-2">
      <div className="sticky top-[120px] md:top-[148px] z-10 bg-[rgba(250,248,243,0.92)] backdrop-blur-[10px] py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn('text-[20px]', allDone && 'opacity-35')}>{aisle.emoji}</span>
          <h3
            className={cn(
              'm-0 font-serif font-medium tracking-[-0.01em] text-[16px] md:text-[18px]',
              allDone && 'opacity-45 line-through'
            )}
          >
            {aisle.name}
          </h3>
        </div>
        <span className="text-[12px] text-[var(--muted)] tabular-nums">
          {done}/{items.length}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <ShoppingRow
            key={item.id}
            item={item}
            onToggle={() => onToggle(item.id, item.source)}
          />
        ))}
      </div>
    </div>
  );
}
