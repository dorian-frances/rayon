import { ValidationError } from '../shared/errors';
import type { CategoryId } from './CategoryId';

export interface Category {
  readonly id: CategoryId;
  readonly label: string;
  readonly color: string;
}

export const DEFAULT_CATEGORY_COLOR = '#E8DCC4';

export const Category = {
  create(input: { id: CategoryId; label: string; color?: string }): Category {
    if (!input.label.trim()) {
      throw new ValidationError('Le libellé de la catégorie ne peut pas être vide');
    }
    return {
      id: input.id,
      label: input.label.trim(),
      color: input.color ?? DEFAULT_CATEGORY_COLOR,
    };
  },
  rename(category: Category, label: string): Category {
    if (!label.trim()) {
      throw new ValidationError('Le libellé de la catégorie ne peut pas être vide');
    }
    return { ...category, label: label.trim() };
  },
};
