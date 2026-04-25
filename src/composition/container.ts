import type { AisleRepository } from '@application/ports/AisleRepository';
import type { AuthGateway } from '@application/ports/AuthGateway';
import type { CartRepository } from '@application/ports/CartRepository';
import type { CategoryRepository } from '@application/ports/CategoryRepository';
import type { Clock } from '@application/ports/Clock';
import type { IdGenerator } from '@application/ports/IdGenerator';
import type { IngredientRepository } from '@application/ports/IngredientRepository';
import type { RealtimeGateway } from '@application/ports/RealtimeGateway';
import type { RecipeRepository } from '@application/ports/RecipeRepository';

import { createAisle } from '@application/use-cases/aisle/createAisle';
import { listAisles } from '@application/use-cases/aisle/listAisles';
import { renameAisle } from '@application/use-cases/aisle/renameAisle';
import { setAisleEmoji } from '@application/use-cases/aisle/setAisleEmoji';
import { reorderAisles } from '@application/use-cases/aisle/reorderAisles';

import { createCategory } from '@application/use-cases/category/createCategory';
import { listCategories } from '@application/use-cases/category/listCategories';
import { renameCategory } from '@application/use-cases/category/renameCategory';
import { deleteCategory } from '@application/use-cases/category/deleteCategory';

import { listIngredients } from '@application/use-cases/ingredient/listIngredients';
import { searchIngredients } from '@application/use-cases/ingredient/searchIngredients';
import { createIngredient } from '@application/use-cases/ingredient/createIngredient';
import { moveIngredient } from '@application/use-cases/ingredient/moveIngredient';
import { renameIngredient } from '@application/use-cases/ingredient/renameIngredient';
import { deleteIngredient } from '@application/use-cases/ingredient/deleteIngredient';

import { listRecipes } from '@application/use-cases/recipe/listRecipes';
import { getRecipe } from '@application/use-cases/recipe/getRecipe';
import { createRecipe } from '@application/use-cases/recipe/createRecipe';
import { updateRecipe } from '@application/use-cases/recipe/updateRecipe';
import { deleteRecipe } from '@application/use-cases/recipe/deleteRecipe';
import { updateRecipeSteps } from '@application/use-cases/recipe/updateRecipeSteps';

import { getCart } from '@application/use-cases/cart/getCart';
import { toggleRecipeInCart } from '@application/use-cases/cart/toggleRecipeInCart';
import { toggleItem } from '@application/use-cases/cart/toggleItem';
import { addExtra } from '@application/use-cases/cart/addExtra';
import { removeExtra } from '@application/use-cases/cart/removeExtra';
import { toggleExtra } from '@application/use-cases/cart/toggleExtra';
import { resetCart } from '@application/use-cases/cart/resetCart';

import {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  getSession,
  observeSession,
} from '@application/use-cases/auth';

import {
  InMemoryAisleRepository,
  InMemoryAuthGateway,
  InMemoryCartRepository,
  InMemoryCategoryRepository,
  InMemoryDatabase,
  InMemoryIngredientRepository,
  InMemoryRealtimeGateway,
  InMemoryRecipeRepository,
} from '@infrastructure/in-memory';
import {
  getSupabaseClient,
  hasSupabaseCreds,
  SupabaseAisleRepository,
  SupabaseAuthGateway,
  SupabaseCartRepository,
  SupabaseCategoryRepository,
  SupabaseIngredientRepository,
  SupabaseRealtimeGateway,
  SupabaseRecipeRepository,
} from '@infrastructure/supabase';
import { CryptoIdGenerator, SystemClock } from '@infrastructure/system';

export interface Adapters {
  readonly aisles: AisleRepository;
  readonly categories: CategoryRepository;
  readonly ingredients: IngredientRepository;
  readonly recipes: RecipeRepository;
  readonly cart: CartRepository;
  readonly auth: AuthGateway;
  readonly realtime: RealtimeGateway;
  readonly ids: IdGenerator;
  readonly clock: Clock;
}

export interface UseCases {
  aisles: {
    list: ReturnType<typeof listAisles>;
    create: ReturnType<typeof createAisle>;
    rename: ReturnType<typeof renameAisle>;
    setEmoji: ReturnType<typeof setAisleEmoji>;
    reorder: ReturnType<typeof reorderAisles>;
  };
  categories: {
    list: ReturnType<typeof listCategories>;
    create: ReturnType<typeof createCategory>;
    rename: ReturnType<typeof renameCategory>;
    delete: ReturnType<typeof deleteCategory>;
  };
  ingredients: {
    list: ReturnType<typeof listIngredients>;
    search: ReturnType<typeof searchIngredients>;
    create: ReturnType<typeof createIngredient>;
    move: ReturnType<typeof moveIngredient>;
    rename: ReturnType<typeof renameIngredient>;
    delete: ReturnType<typeof deleteIngredient>;
  };
  recipes: {
    list: ReturnType<typeof listRecipes>;
    getById: ReturnType<typeof getRecipe>;
    create: ReturnType<typeof createRecipe>;
    update: ReturnType<typeof updateRecipe>;
    delete: ReturnType<typeof deleteRecipe>;
    updateSteps: ReturnType<typeof updateRecipeSteps>;
  };
  cart: {
    get: ReturnType<typeof getCart>;
    toggleRecipe: ReturnType<typeof toggleRecipeInCart>;
    toggleItem: ReturnType<typeof toggleItem>;
    toggleExtra: ReturnType<typeof toggleExtra>;
    addExtra: ReturnType<typeof addExtra>;
    removeExtra: ReturnType<typeof removeExtra>;
    reset: ReturnType<typeof resetCart>;
  };
  auth: {
    signInWithEmail: ReturnType<typeof signInWithEmail>;
    signInWithGoogle: ReturnType<typeof signInWithGoogle>;
    signOut: ReturnType<typeof signOut>;
    getSession: ReturnType<typeof getSession>;
    observe: ReturnType<typeof observeSession>;
  };
}

export interface Container {
  readonly adapters: Adapters;
  readonly useCases: UseCases;
}

function wireUseCases(adapters: Adapters): UseCases {
  return {
    aisles: {
      list: listAisles(adapters.aisles),
      create: createAisle(adapters.aisles, adapters.ids),
      rename: renameAisle(adapters.aisles),
      setEmoji: setAisleEmoji(adapters.aisles),
      reorder: reorderAisles(adapters.aisles),
    },
    categories: {
      list: listCategories(adapters.categories),
      create: createCategory(adapters.categories, adapters.ids),
      rename: renameCategory(adapters.categories),
      delete: deleteCategory(adapters.categories),
    },
    ingredients: {
      list: listIngredients(adapters.ingredients),
      search: searchIngredients(adapters.ingredients),
      create: createIngredient(adapters.ingredients, adapters.ids),
      move: moveIngredient(adapters.ingredients),
      rename: renameIngredient(adapters.ingredients),
      delete: deleteIngredient(adapters.ingredients),
    },
    recipes: {
      list: listRecipes(adapters.recipes),
      getById: getRecipe(adapters.recipes),
      create: createRecipe(adapters.recipes, adapters.ids, adapters.clock),
      update: updateRecipe(adapters.recipes, adapters.clock),
      delete: deleteRecipe(adapters.recipes),
      updateSteps: updateRecipeSteps(adapters.recipes, adapters.clock),
    },
    cart: {
      get: getCart(adapters.cart),
      toggleRecipe: toggleRecipeInCart(adapters.cart, adapters.recipes),
      toggleItem: toggleItem(adapters.cart),
      toggleExtra: toggleExtra(adapters.cart),
      addExtra: addExtra(adapters.cart, adapters.ids),
      removeExtra: removeExtra(adapters.cart),
      reset: resetCart(adapters.cart),
    },
    auth: {
      signInWithEmail: signInWithEmail(adapters.auth),
      signInWithGoogle: signInWithGoogle(adapters.auth),
      signOut: signOut(adapters.auth),
      getSession: getSession(adapters.auth),
      observe: observeSession(adapters.auth),
    },
  };
}

/**
 * Fabrique un container en mémoire pour le dev et les tests.
 */
export function createInMemoryContainer(): Container {
  const db = new InMemoryDatabase();
  const adapters: Adapters = {
    aisles: new InMemoryAisleRepository(db),
    categories: new InMemoryCategoryRepository(db),
    ingredients: new InMemoryIngredientRepository(db),
    recipes: new InMemoryRecipeRepository(db),
    cart: new InMemoryCartRepository(db),
    auth: new InMemoryAuthGateway(),
    realtime: new InMemoryRealtimeGateway(),
    ids: new CryptoIdGenerator(),
    clock: new SystemClock(),
  };
  return { adapters, useCases: wireUseCases(adapters) };
}

/**
 * Container câblé sur Supabase. Le client est instancié une seule fois et
 * réutilisé par tous les adaptateurs.
 */
export function createSupabaseContainer(): Container {
  const client = getSupabaseClient();
  const adapters: Adapters = {
    aisles: new SupabaseAisleRepository(client),
    categories: new SupabaseCategoryRepository(client),
    ingredients: new SupabaseIngredientRepository(client),
    recipes: new SupabaseRecipeRepository(client),
    cart: new SupabaseCartRepository(client),
    auth: new SupabaseAuthGateway(client),
    realtime: new SupabaseRealtimeGateway(client),
    ids: new CryptoIdGenerator(),
    clock: new SystemClock(),
  };
  return { adapters, useCases: wireUseCases(adapters) };
}

/**
 * Choisit le container selon l'environnement : Supabase si les credentials sont
 * présents, sinon in-memory (dev offline + tests).
 */
export function createDefaultContainer(): Container {
  return hasSupabaseCreds() ? createSupabaseContainer() : createInMemoryContainer();
}

export function createContainer(adapters: Adapters): Container {
  return { adapters, useCases: wireUseCases(adapters) };
}
