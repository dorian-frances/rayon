import { motion } from 'motion/react';
import type { Recipe } from '@domain/recipe';
import type { Category } from '@domain/category';
import { FoodImage, Tag } from '@ds/primitives';
import { CheckIcon, PlusIcon } from '@ds/icons';
import { cn } from '@ds/utils/cn';

export interface RecipeCardProps {
  recipe: Recipe;
  categories: readonly Category[];
  inCart: boolean;
  onOpen: () => void;
  onToggleCart: () => void;
  className?: string;
}

export function RecipeCard({
  recipe,
  categories,
  inCart,
  onOpen,
  onToggleCart,
  className,
}: RecipeCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'text-left rounded-[16px] overflow-hidden bg-card border border-[var(--hairline)]',
        'cursor-pointer flex flex-col p-0 hover:shadow-[var(--shadow-card)]',
        className
      )}
    >
      <div className="relative aspect-[1.1] shrink-0">
        <FoodImage name={recipe.name} src={recipe.image} className="w-full h-full" />
        {recipe.origin ? (
          <div className="absolute top-2.5 left-2.5 h-[26px] px-2 rounded-[13px] bg-[rgba(250,248,243,0.9)] backdrop-blur-[8px] flex items-center text-[13px]">
            {recipe.origin}
          </div>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart();
          }}
          aria-label={inCart ? 'Retirer du panier' : 'Ajouter au panier'}
          className={cn(
            'absolute top-2.5 right-2.5 w-[34px] h-[34px] rounded-full border-0 cursor-pointer',
            'flex items-center justify-center transition-all duration-200 backdrop-blur-[8px]',
            inCart
              ? 'bg-ink text-ink-contrast'
              : 'bg-[rgba(250,248,243,0.92)] text-ink'
          )}
        >
          {inCart ? <CheckIcon size={16} sw={2.3} /> : <PlusIcon size={16} sw={2.3} />}
        </button>
      </div>
      <div className="p-3 md:p-3.5 md:pb-4">
        <div className="text-[13.5px] md:text-[14.5px] font-medium leading-tight tracking-[-0.01em] mb-2 line-clamp-2 min-h-[34px]">
          {recipe.name}
        </div>
        <div className="flex gap-1 flex-wrap">
          {recipe.categories.slice(0, 2).map((cid) => {
            const cat = categories.find((c) => c.id === cid);
            return (
              <Tag key={cid} size="sm" color={cat?.color ?? '#E8DCC4'}>
                {cat?.label ?? '—'}
              </Tag>
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}
