import type { Aisle } from '@domain/aisle';
import type { Category } from '@domain/category';
import type { Tag } from '@domain/tag';
import type { Ingredient } from '@domain/ingredient';
import type { Recipe, RecipeId } from '@domain/recipe';
import type { CartExtra } from '@domain/cart';
import type { User } from '@domain/user';
import type { ThemeName } from '@ds/tokens/tokens';

export interface RayonState {
  theme: ThemeName;

  user: User | null;
  sessionReady: boolean;

  aisles: Aisle[];
  categories: Category[];
  tags: Tag[];
  ingredients: Ingredient[];
  recipes: Recipe[];

  // Panier aplati pour la sérialisation (localStorage friendly)
  cartRecipeIds: RecipeId[];
  /** Map aplati : IngredientId (string) -> { checked } */
  cartItems: Record<string, { checked: boolean }>;
  cartExtras: CartExtra[];

  hydrated: boolean;

  // Setters
  setTheme: (t: ThemeName) => void;
  setUser: (u: User | null) => void;
  setSessionReady: (ready: boolean) => void;
  setHydrated: (v: boolean) => void;

  setAisles: (a: Aisle[]) => void;
  upsertAisle: (a: Aisle) => void;
  removeAisle: (id: Aisle['id']) => void;

  setCategories: (c: Category[]) => void;
  upsertCategory: (c: Category) => void;
  removeCategory: (id: Category['id']) => void;

  setTags: (t: Tag[]) => void;
  upsertTag: (t: Tag) => void;
  removeTag: (id: Tag['id']) => void;

  setIngredients: (ing: Ingredient[]) => void;
  upsertIngredient: (ing: Ingredient) => void;
  removeIngredient: (id: Ingredient['id']) => void;

  setRecipes: (r: Recipe[]) => void;
  upsertRecipe: (r: Recipe) => void;
  removeRecipe: (id: Recipe['id']) => void;

  setCart: (c: {
    recipeIds: RecipeId[];
    items: Record<string, { checked: boolean }>;
    extras: CartExtra[];
  }) => void;
  addCartRecipe: (recipeId: RecipeId, ingredientIds: readonly string[]) => void;
  removeCartRecipe: (recipeId: RecipeId, orphanIngredientIds: readonly string[]) => void;
  setItemChecked: (ingredientId: string, checked: boolean) => void;
  addExtra: (extra: CartExtra) => void;
  removeExtra: (id: CartExtra['id']) => void;
  setExtraChecked: (id: CartExtra['id'], checked: boolean) => void;
  resetCart: () => void;

  reset: () => void;
}
