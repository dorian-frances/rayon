import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RayonState } from './types';

const initial: Omit<
  RayonState,
  | 'setTheme'
  | 'setUser'
  | 'setSessionReady'
  | 'setHydrated'
  | 'setAisles'
  | 'upsertAisle'
  | 'removeAisle'
  | 'setCategories'
  | 'upsertCategory'
  | 'removeCategory'
  | 'setTags'
  | 'upsertTag'
  | 'removeTag'
  | 'setIngredients'
  | 'upsertIngredient'
  | 'removeIngredient'
  | 'setRecipes'
  | 'upsertRecipe'
  | 'removeRecipe'
  | 'setCart'
  | 'addCartRecipe'
  | 'removeCartRecipe'
  | 'setItemChecked'
  | 'addExtra'
  | 'removeExtra'
  | 'setExtraChecked'
  | 'resetCart'
  | 'reset'
> = {
  theme: 'editorial',
  user: null,
  sessionReady: false,
  hydrated: false,
  aisles: [],
  categories: [],
  tags: [],
  ingredients: [],
  recipes: [],
  cartRecipeIds: [],
  cartItems: {},
  cartExtras: [],
};

export const useRayonStore = create<RayonState>()(
  persist(
    (set) => ({
      ...initial,

      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
      setSessionReady: (sessionReady) => set({ sessionReady }),
      setHydrated: (hydrated) => set({ hydrated }),

      setAisles: (aisles) => set({ aisles }),
      upsertAisle: (a) =>
        set((s) => {
          const idx = s.aisles.findIndex((x) => x.id === a.id);
          if (idx < 0) return { aisles: [...s.aisles, a] };
          const next = [...s.aisles];
          next[idx] = a;
          return { aisles: next };
        }),
      removeAisle: (id) =>
        set((s) => ({ aisles: s.aisles.filter((a) => a.id !== id) })),

      setCategories: (categories) => set({ categories }),
      upsertCategory: (c) =>
        set((s) => {
          const idx = s.categories.findIndex((x) => x.id === c.id);
          if (idx < 0) return { categories: [...s.categories, c] };
          const next = [...s.categories];
          next[idx] = c;
          return { categories: next };
        }),
      removeCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      setTags: (tags) => set({ tags }),
      upsertTag: (t) =>
        set((s) => {
          const idx = s.tags.findIndex((x) => x.id === t.id);
          if (idx < 0) return { tags: [...s.tags, t] };
          const next = [...s.tags];
          next[idx] = t;
          return { tags: next };
        }),
      removeTag: (id) =>
        set((s) => ({
          tags: s.tags.filter((t) => t.id !== id),
          recipes: s.recipes.map((r) => ({
            ...r,
            tags: r.tags.filter((x) => x !== id),
          })),
        })),

      setIngredients: (ingredients) => set({ ingredients }),
      upsertIngredient: (ing) =>
        set((s) => {
          const idx = s.ingredients.findIndex((x) => x.id === ing.id);
          if (idx < 0) return { ingredients: [...s.ingredients, ing] };
          const next = [...s.ingredients];
          next[idx] = ing;
          return { ingredients: next };
        }),
      removeIngredient: (id) =>
        set((s) => ({
          ingredients: s.ingredients.filter((i) => i.id !== id),
          recipes: s.recipes.map((r) => ({
            ...r,
            ingredients: r.ingredients.filter((x) => x !== id),
          })),
          cartItems: Object.fromEntries(
            Object.entries(s.cartItems).filter(([iid]) => iid !== id)
          ),
        })),

      setRecipes: (recipes) => set({ recipes }),
      upsertRecipe: (r) =>
        set((s) => {
          const idx = s.recipes.findIndex((x) => x.id === r.id);
          if (idx < 0) return { recipes: [r, ...s.recipes] };
          const next = [...s.recipes];
          next[idx] = r;
          return { recipes: next };
        }),
      removeRecipe: (id) =>
        set((s) => ({
          recipes: s.recipes.filter((r) => r.id !== id),
          cartRecipeIds: s.cartRecipeIds.filter((rid) => rid !== id),
        })),

      setCart: ({ recipeIds, items, extras }) =>
        set({ cartRecipeIds: recipeIds, cartItems: items, cartExtras: extras }),
      addCartRecipe: (recipeId, ingredientIds) =>
        set((s) => {
          const nextIds = s.cartRecipeIds.includes(recipeId)
            ? s.cartRecipeIds
            : [...s.cartRecipeIds, recipeId];
          const nextItems = { ...s.cartItems };
          for (const ing of ingredientIds) {
            if (!nextItems[ing]) nextItems[ing] = { checked: false };
          }
          return { cartRecipeIds: nextIds, cartItems: nextItems };
        }),
      removeCartRecipe: (recipeId, orphanIngredientIds) =>
        set((s) => {
          const nextItems = { ...s.cartItems };
          for (const ing of orphanIngredientIds) delete nextItems[ing];
          return {
            cartRecipeIds: s.cartRecipeIds.filter((r) => r !== recipeId),
            cartItems: nextItems,
          };
        }),
      setItemChecked: (ingredientId, checked) =>
        set((s) => ({
          cartItems: {
            ...s.cartItems,
            [ingredientId]: { checked },
          },
        })),
      addExtra: (extra) =>
        set((s) => ({ cartExtras: [...s.cartExtras, extra] })),
      removeExtra: (id) =>
        set((s) => ({ cartExtras: s.cartExtras.filter((e) => e.id !== id) })),
      setExtraChecked: (id, checked) =>
        set((s) => ({
          cartExtras: s.cartExtras.map((e) =>
            e.id === id ? { ...e, checked } : e
          ),
        })),
      resetCart: () =>
        set({ cartRecipeIds: [], cartItems: {}, cartExtras: [] }),

      reset: () => set({ ...initial }),
    }),
    {
      name: 'rayon-state-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        aisles: state.aisles,
        categories: state.categories,
        tags: state.tags,
        ingredients: state.ingredients,
        recipes: state.recipes,
        cartRecipeIds: state.cartRecipeIds,
        cartItems: state.cartItems,
        cartExtras: state.cartExtras,
      }),
    }
  )
);
