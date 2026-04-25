/**
 * Brand<Base, Tag> — alias nominal pour un type primitif.
 * Permet de distinguer `RecipeId` de `IngredientId` au compile-time
 * sans coût runtime.
 */
declare const __brand: unique symbol;

export type Brand<Base, Tag extends string> = Base & {
  readonly [__brand]: Tag;
};

export const brand = <Base, Tag extends string>(v: Base): Brand<Base, Tag> =>
  v as Brand<Base, Tag>;
