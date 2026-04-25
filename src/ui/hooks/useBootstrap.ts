import { useEffect } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';

/**
 * Au login, charge en parallèle les 6 collections de l'utilisateur dans le store.
 * Le hook `useAuth` a déjà hydraté `user`.
 */
export function useBootstrap() {
  const uc = useUseCases();
  const user = useRayonStore((s) => s.user);
  const setHydrated = useRayonStore((s) => s.setHydrated);
  const setAisles = useRayonStore((s) => s.setAisles);
  const setCategories = useRayonStore((s) => s.setCategories);
  const setIngredients = useRayonStore((s) => s.setIngredients);
  const setRecipes = useRayonStore((s) => s.setRecipes);
  const setCart = useRayonStore((s) => s.setCart);

  useEffect(() => {
    if (!user) {
      setHydrated(false);
      return;
    }
    let cancelled = false;
    Promise.all([
      uc.aisles.list(user.id),
      uc.categories.list(user.id),
      uc.ingredients.list(user.id),
      uc.recipes.list(user.id),
      uc.cart.get(user.id),
    ])
      .then(([aisles, categories, ingredients, recipes, cart]) => {
        if (cancelled) return;
        setAisles(aisles);
        setCategories(categories);
        setIngredients(ingredients);
        setRecipes(recipes);
        setCart({
          recipeIds: [...cart.recipeIds],
          items: Object.fromEntries(
            [...cart.items.entries()].map(([k, v]) => [k, { checked: v.checked }])
          ),
          extras: [...cart.extras],
        });
        setHydrated(true);
      })
      .catch((err) => {
        console.error('Bootstrap failed', err);
      });
    return () => {
      cancelled = true;
    };
  }, [
    user,
    uc,
    setAisles,
    setCategories,
    setIngredients,
    setRecipes,
    setCart,
    setHydrated,
  ]);
}
