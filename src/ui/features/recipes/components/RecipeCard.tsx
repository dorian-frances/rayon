import { motion } from 'motion/react';
import type { Recipe } from '@domain/recipe';
import type { Category } from '@domain/category';
import type { Tag as TagEntity } from '@domain/tag';
import { FoodImage, Tag } from '@ds/primitives';
import { CheckIcon, PlusIcon } from '@ds/icons';
import { cn } from '@ds/utils/cn';

export interface RecipeCardProps {
  recipe: Recipe;
  categories: readonly Category[];
  tags: readonly TagEntity[];
  inCart: boolean;
  onOpen: () => void;
  onToggleCart: () => void;
  className?: string;
}

const MAX_BADGES = 3;

export function RecipeCard({
  recipe,
  categories,
  tags,
  inCart,
  onOpen,
  onToggleCart,
  className,
}: RecipeCardProps) {
  const catBadges = recipe.categories
    .map((cid) => categories.find((c) => c.id === cid))
    .filter((c): c is Category => Boolean(c));
  const tagBadges = recipe.tags
    .map((tid) => tags.find((t) => t.id === tid))
    .filter((t): t is TagEntity => Boolean(t));

  const all = [...catBadges, ...tagBadges].slice(0, MAX_BADGES);
  const overflow = catBadges.length + tagBadges.length - all.length;

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
          {all.map((entity) => {
            const isCat = 'color' in entity;
            return (
              <Tag
                key={entity.id}
                size="sm"
                color={isCat ? (entity as Category).color : '#F0E6D4'}
              >
                {entity.label}
              </Tag>
            );
          })}
          {overflow > 0 ? (
            <Tag size="sm" color="rgba(28,26,22,0.06)">
              +{overflow}
            </Tag>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
