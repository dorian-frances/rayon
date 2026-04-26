import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, IconButton } from '@ds/primitives';
import { XIcon } from '@ds/icons';
import { Container } from '@ds/layout';
import { useRecipes } from '@/ui/hooks/useRecipes';
import { useRayonStore } from '@/ui/store';
import { selectRecipeById } from '@/ui/store/selectors';
import type { CategoryId } from '@domain/category';
import type { TagId } from '@domain/tag';
import type { IngredientId } from '@domain/ingredient';
import { type RecipeId } from '@domain/recipe';
import { Field } from '../components/Field';
import { CategoryPicker } from '../components/CategoryPicker';
import { TagPicker } from '../components/TagPicker';
import { IngredientPicker } from '../components/IngredientPicker';

export function RecipeEditorScreen() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const existing = useRayonStore((s) => (id ? selectRecipeById(s, id) : undefined));
  const categories = useRayonStore((s) => s.categories);
  const tags = useRayonStore((s) => s.tags);
  const { create, update } = useRecipes();

  const [name, setName] = useState(existing?.name ?? '');
  const [selectedCats, setSelectedCats] = useState<CategoryId[]>(
    existing?.categories ? [...existing.categories] : []
  );
  const [selectedTags, setSelectedTags] = useState<TagId[]>(
    existing?.tags ? [...existing.tags] : []
  );
  const [link, setLink] = useState(existing?.link ?? '');
  const [image, setImage] = useState(existing?.image ?? '');
  const [selectedIngs, setSelectedIngs] = useState<IngredientId[]>(
    existing?.ingredients ? [...existing.ingredients] : []
  );

  const canSave = name.trim().length > 0 && selectedIngs.length > 0;

  const save = async () => {
    if (!canSave) return;
    if (existing) {
      const updated = await update(existing.id, {
        name: name.trim(),
        categories: selectedCats,
        tags: selectedTags,
        link: link || null,
        image: image.trim() || null,
        ingredients: selectedIngs,
      });
      navigate(`/recipes/${updated.id}`);
    } else {
      const created = await create({
        name: name.trim(),
        categories: selectedCats,
        tags: selectedTags,
        link: link || null,
        image: image.trim() || null,
        ingredients: selectedIngs,
      });
      navigate(`/recipes/${created.id}`);
    }
  };

  return (
    <div className="min-h-full bg-bg pb-24 md:pb-12">
      <div className="sticky top-0 z-10 bg-[rgba(250,248,243,0.92)] backdrop-blur-[12px] border-b border-[var(--hairline)]">
        <div className="flex items-center justify-between px-4 md:px-10 py-3 md:py-4">
          <div className="flex items-center gap-2.5">
            <IconButton
              onClick={() => navigate(existing ? `/recipes/${(existing.id as RecipeId)}` : '/')}
              aria-label="Fermer"
            >
              <XIcon size={18} />
            </IconButton>
            <h2 className="m-0 text-base font-medium">
              {existing ? 'Modifier' : 'Nouvelle recette'}
            </h2>
          </div>
          <Button variant="solid" onClick={save} disabled={!canSave}>
            Enregistrer
          </Button>
        </div>
      </div>

      <Container width="default" className="pt-6 md:pt-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la recette…"
          className="w-full bg-transparent border-0 outline-none p-0 mb-5 font-serif font-medium tracking-[-0.025em] text-[28px] md:text-[38px]"
        />

        <div className="flex flex-col gap-5 mb-8">
          <Field label="Catégories">
            <CategoryPicker
              categories={categories}
              selected={selectedCats}
              onChange={setSelectedCats}
            />
          </Field>

          <Field
            label="Tags"
            hint="Origine, régime, saison, texture… Utilise un emoji drapeau (🇫🇷 🇮🇹…) ou un libellé libre. Plusieurs tags possibles."
          >
            <TagPicker
              tags={tags}
              selected={selectedTags}
              onChange={setSelectedTags}
            />
          </Field>

          <Field label="Lien vers la recette (optionnel)">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="w-full h-11 px-3.5 rounded-[12px] border border-[var(--hairline-strong)] bg-card text-[14.5px] outline-none"
            />
          </Field>

          <Field label="Image de la recette (optionnel)">
            <div className="flex gap-3 items-start">
              <div
                className="w-24 h-24 shrink-0 rounded-[12px] border border-[var(--hairline)] flex items-center justify-center text-[11px] text-[rgba(28,26,22,0.35)]"
                style={
                  image
                    ? {
                        background: `var(--card) url(${JSON.stringify(image)}) center/cover no-repeat`,
                      }
                    : { background: 'rgba(28,26,22,0.04)' }
                }
              >
                {!image ? 'Aperçu' : null}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://…/photo.jpg"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-[var(--hairline-strong)] bg-card text-[14.5px] outline-none"
                />
                <div className="text-[11px] text-[var(--muted)]">
                  Colle l'URL d'une image (clic droit sur une photo → Copier l'adresse de l'image).
                </div>
              </div>
            </div>
          </Field>
        </div>

        <Field
          label={`Ingrédients · ${selectedIngs.length} sélectionné${selectedIngs.length > 1 ? 's' : ''}`}
        >
          <IngredientPicker selected={selectedIngs} onChange={setSelectedIngs} />
        </Field>
      </Container>
    </div>
  );
}
