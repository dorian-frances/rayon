/**
 * Un bloc d'étape façon Notion : titre, étape numérotée ou paragraphe.
 * Les étapes numérotées (`li`) se comptent à partir du dernier `h` rencontré.
 */

export type RecipeStepKind = 'h' | 'li' | 'p';

export interface RecipeStep {
  readonly kind: RecipeStepKind;
  readonly value: string;
}

export const RecipeStep = {
  create(kind: RecipeStepKind, value = ''): RecipeStep {
    return { kind, value };
  },
  setValue(step: RecipeStep, value: string): RecipeStep {
    return { ...step, value };
  },
  setKind(step: RecipeStep, kind: RecipeStepKind): RecipeStep {
    return { ...step, kind };
  },
};

/**
 * Calcule, pour chaque étape de type `li`, son numéro d'étape depuis
 * le dernier titre (`h`). Retourne un tableau de la même longueur que `steps`.
 */
export function numerateSteps(steps: readonly RecipeStep[]): number[] {
  let counter = 0;
  return steps.map((s) => {
    if (s.kind === 'h') {
      counter = 0;
      return 0;
    }
    if (s.kind === 'li') {
      counter += 1;
      return counter;
    }
    return 0;
  });
}
