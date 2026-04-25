import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryId } from '@domain/category';
import { Button, EmptyState } from '@ds/primitives';
import { PlusIcon } from '@ds/icons';
import { useIsDesktop } from '@ds/utils/useMediaQuery';
import { Container } from '@ds/layout';
import { useRayonStore } from '@/ui/store';
import { useCart } from '@/ui/hooks/useCart';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeFilters } from '../components/RecipeFilters';

export function LibraryScreen() {
  const recipes = useRayonStore((s) => s.recipes);
  const categories = useRayonStore((s) => s.categories);
  const cart = useCart();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [origin, setOrigin] = useState<string>('');

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (categoryId !== 'all' && !r.categories.includes(categoryId as CategoryId))
        return false;
      if (origin && r.origin !== origin) return false;
      return true;
    });
  }, [recipes, query, categoryId, origin]);

  return (
    <div className="pb-24 md:pb-12">
      <Container width="wide" className="pt-6 md:pt-12">
        <header className="flex justify-between items-end flex-wrap gap-4 mb-6 md:mb-8">
          <div>
            <div className="text-[12px] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
              {recipes.length} recette{recipes.length > 1 ? 's' : ''} ·{' '}
              {filtered.length} affichée{filtered.length > 1 ? 's' : ''}
            </div>
            <h1 className="m-0 font-serif font-medium tracking-[-0.03em] leading-none text-[34px] md:text-[52px]">
              Ma bibliothèque
            </h1>
          </div>
          <Button
            variant="solid"
            size={isDesktop ? 'lg' : 'md'}
            onClick={() => navigate('/recipes/new')}
            leftIcon={<PlusIcon size={16} sw={2} />}
          >
            Nouvelle recette
          </Button>
        </header>

        <RecipeFilters
          query={query}
          onQueryChange={setQuery}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          origin={origin}
          onOriginChange={setOrigin}
          recipes={recipes}
          categories={categories}
          isDesktop={isDesktop}
        />

        {recipes.length === 0 ? (
          <EmptyState
            emoji="📓"
            title="Bibliothèque vide"
            description="Ajoute ta première recette pour commencer à composer tes courses."
            action={
              <Button
                variant="solid"
                onClick={() => navigate('/recipes/new')}
                leftIcon={<PlusIcon size={16} sw={2} />}
              >
                Nouvelle recette
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="Aucune recette ne correspond"
            description="Essaie un autre filtre ou efface ta recherche."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                categories={categories}
                inCart={cart.inCart(r.id)}
                onOpen={() => navigate(`/recipes/${r.id}`)}
                onToggleCart={() => cart.toggleRecipe(r.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
