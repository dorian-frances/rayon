import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FoodImage, IconButton, Tag } from '@ds/primitives';
import { CheckIcon, ChevLeftIcon, EditIcon, LinkIcon, PlusIcon } from '@ds/icons';
import { Container } from '@ds/layout';
import { useRayonStore } from '@/ui/store';
import { useCart } from '@/ui/hooks/useCart';
import { selectRecipeById } from '@/ui/store/selectors';
import { StepsEditor } from '../components/StepsEditor';
import type { Aisle } from '@domain/aisle';
import type { Ingredient } from '@domain/ingredient';

export function RecipeDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useRayonStore((s) => (id ? selectRecipeById(s, id) : undefined));
  const aisles = useRayonStore((s) => s.aisles);
  const ingredients = useRayonStore((s) => s.ingredients);
  const categories = useRayonStore((s) => s.categories);
  const tagsList = useRayonStore((s) => s.tags);
  const cart = useCart();

  const ingredientsByAisle = useMemo(() => {
    if (!recipe) return [];
    const ingMap = new Map(ingredients.map((i) => [i.id as string, i] as const));
    const groups = new Map<string, Ingredient[]>();
    for (const iid of recipe.ingredients) {
      const ing = ingMap.get(iid);
      if (!ing) continue;
      const aid = ing.aisleId as string;
      const arr = groups.get(aid) ?? [];
      arr.push(ing);
      groups.set(aid, arr);
    }
    const aisleMap = new Map(aisles.map((a) => [a.id as string, a] as const));
    return [...groups.entries()]
      .map(([aisleId, items]) => {
        const aisle = aisleMap.get(aisleId);
        return [aisle, items.sort((a, b) => a.name.localeCompare(b.name))] as const;
      })
      .filter((entry): entry is readonly [Aisle, Ingredient[]] => Boolean(entry[0]))
      .sort(([a], [b]) => a.position - b.position);
  }, [recipe, ingredients, aisles]);

  if (!recipe) {
    return (
      <Container width="default" className="py-12 text-center text-[var(--muted)]">
        Recette introuvable.
      </Container>
    );
  }

  const inCart = cart.inCart(recipe.id);

  return (
    <div className="min-h-full bg-bg pb-24 md:pb-12">
      <div className="relative h-[280px] md:h-[420px]">
        <FoodImage name={recipe.name} src={recipe.image} className="w-full h-full" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(28,26,22,0.15) 0%, transparent 30%, transparent 70%, var(--bg) 100%)',
          }}
        />
        <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-between">
          <IconButton
            onClick={() => navigate(-1)}
            size={40}
            aria-label="Retour"
            className="bg-[rgba(250,248,243,0.9)] backdrop-blur-[8px]"
          >
            <ChevLeftIcon size={20} />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
            size={40}
            aria-label="Éditer"
            className="bg-[rgba(250,248,243,0.9)] backdrop-blur-[8px]"
          >
            <EditIcon size={16} />
          </IconButton>
        </div>
      </div>

      <Container width="default" className="-mt-10 md:-mt-14 relative">
        <div className="bg-card rounded-[20px] border border-[var(--hairline)] shadow-[var(--shadow-card-soft)] p-6 md:p-9">
          <div className="flex gap-2 mb-3.5 flex-wrap">
            {recipe.categories.map((cid) => {
              const cat = categories.find((c) => c.id === cid);
              return (
                <Tag key={cid} color={cat?.color ?? '#E8DCC4'}>
                  {cat?.label ?? '—'}
                </Tag>
              );
            })}
            {recipe.tags.map((tid) => {
              const t = tagsList.find((x) => x.id === tid);
              return (
                <Tag key={tid} color="#F0E6D4">
                  {t?.label ?? '—'}
                </Tag>
              );
            })}
          </div>
          <h1 className="m-0 font-serif font-medium tracking-[-0.025em] leading-[1.1] text-[28px] md:text-[42px]">
            {recipe.name}
          </h1>
          {recipe.link ? (
            <a
              href={recipe.link.startsWith('http') ? recipe.link : `https://${recipe.link}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] text-[var(--muted-strong)] hover:text-ink no-underline"
            >
              <LinkIcon size={14} /> {recipe.link}
            </a>
          ) : null}
          <div className="mt-5 flex gap-2.5">
            <Button
              variant={inCart ? 'outline' : 'solid'}
              size="md"
              onClick={() => cart.toggleRecipe(recipe.id)}
              leftIcon={
                inCart ? <CheckIcon size={16} sw={2.2} /> : <PlusIcon size={16} sw={2} />
              }
            >
              {inCart ? 'Dans le panier' : 'Ajouter au panier'}
            </Button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)] font-semibold m-0 mb-4">
            Ingrédients
          </h2>
          {ingredientsByAisle.length === 0 ? (
            <div className="text-[13.5px] text-[var(--muted)]">
              Aucun ingrédient — édite la recette pour en ajouter.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {ingredientsByAisle.map(([aisle, items]) => (
                <div key={aisle!.id}>
                  <div className="text-[12px] text-[var(--muted-strong)] mb-1.5 flex items-center gap-1.5">
                    <span>{aisle!.emoji}</span>
                    {aisle!.name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((ing) => (
                      <span
                        key={ing.id}
                        className="h-8 px-3.5 rounded-[16px] bg-card border border-[var(--hairline-strong)] inline-flex items-center text-[13.5px]"
                      >
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-11">
          <h2 className="text-[13px] tracking-[0.14em] uppercase text-[var(--muted)] font-semibold m-0 mb-4">
            Préparation
          </h2>
          <StepsEditor recipeId={recipe.id} steps={recipe.steps} />
        </section>
      </Container>
    </div>
  );
}
