import { ValidationError } from '../shared/errors';
import type { TagId } from './TagId';

/**
 * Tag libre attaché à une recette : pays d'origine (🇫🇷 Français), régime
 * (🌱 Végétarien), saison (☀️ Été), texture (🐟 Poisson)... Multi-valeur par recette.
 */
export interface Tag {
  readonly id: TagId;
  readonly label: string;
}

export const Tag = {
  create(input: { id: TagId; label: string }): Tag {
    if (!input.label.trim()) {
      throw new ValidationError('Le libellé du tag ne peut pas être vide');
    }
    return { id: input.id, label: input.label.trim() };
  },
  rename(tag: Tag, label: string): Tag {
    if (!label.trim()) {
      throw new ValidationError('Le libellé du tag ne peut pas être vide');
    }
    return { ...tag, label: label.trim() };
  },
};
