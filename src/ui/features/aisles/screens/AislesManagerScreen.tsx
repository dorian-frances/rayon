import { useState } from 'react';
import { Reorder } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, DashedAddButton } from '@ds/primitives';
import { ChevLeftIcon, PlusIcon } from '@ds/icons';
import { Container } from '@ds/layout';
import { useAisles } from '@/ui/hooks/useAisles';
import { useRayonStore } from '@/ui/store';
import type { Aisle, AisleId } from '@domain/aisle';
import { AisleRow } from '../components/AisleRow';
import { AisleIngredients } from '../components/AisleIngredients';

export function AislesManagerScreen() {
  const { aisles, create, reorder } = useAisles();
  const ingredients = useRayonStore((s) => s.ingredients);
  const navigate = useNavigate();

  const [openId, setOpenId] = useState<AisleId | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftEmoji, setDraftEmoji] = useState('🛒');

  const submit = async () => {
    if (!draftName.trim()) return;
    await create(draftName.trim(), draftEmoji);
    setDraftName('');
    setDraftEmoji('🛒');
    setAdding(false);
  };

  const handleReorder = (next: Aisle[]) => {
    void reorder(next.map((a) => a.id));
  };

  return (
    <div className="min-h-full bg-bg pb-24 md:pb-12">
      <Container width="default" className="pt-6 md:pt-9">
        <div className="flex items-center gap-2 mb-4">
          <IconButton onClick={() => navigate(-1)} aria-label="Retour">
            <ChevLeftIcon size={20} />
          </IconButton>
          <div>
            <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)]">
              Parcours & base
            </div>
            <h1 className="m-0 font-serif font-medium tracking-[-0.025em] text-[24px] md:text-[34px]">
              Rayons & ingrédients
            </h1>
          </div>
        </div>

        <p className="text-[13.5px] text-[var(--muted-strong)] leading-[1.5] mb-5 max-w-[540px]">
          Glisse-dépose les rayons pour refléter ton parcours dans le supermarché. Clique
          sur un rayon pour gérer ses ingrédients.
        </p>

        <div className="bg-card rounded-[16px] border border-[var(--hairline)] overflow-hidden">
          <Reorder.Group
            axis="y"
            values={[...aisles]}
            onReorder={handleReorder}
            className="list-none m-0 p-0"
          >
            {aisles.map((aisle, idx) => {
              const ings = ingredients.filter((i) => i.aisleId === aisle.id);
              const isOpen = openId === aisle.id;
              return (
                <div key={aisle.id}>
                  <AisleRow
                    aisle={aisle}
                    index={idx}
                    ingredientCount={ings.length}
                    isOpen={isOpen}
                    onToggle={() => setOpenId(isOpen ? null : aisle.id)}
                    isLast={idx === aisles.length - 1 && !isOpen}
                  />
                  {isOpen ? (
                    <AisleIngredients
                      aisle={aisle}
                      allAisles={aisles}
                      ingredients={ings}
                    />
                  ) : null}
                </div>
              );
            })}
          </Reorder.Group>

          {adding ? (
            <div className="flex gap-1.5 p-3 border-t border-[var(--hairline)] bg-[rgba(28,26,22,0.02)]">
              <input
                autoFocus
                value={draftEmoji}
                onChange={(e) => setDraftEmoji(e.target.value.slice(0, 2))}
                className="w-[52px] h-11 px-3 rounded-[12px] border border-[var(--hairline-strong)] bg-card text-center text-[16px] outline-none"
              />
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void submit();
                  if (e.key === 'Escape') {
                    setAdding(false);
                    setDraftName('');
                  }
                }}
                placeholder="Nom du rayon (ex: Bio, Frais…)"
                className="flex-1 h-11 px-3.5 rounded-[12px] border border-[var(--hairline-strong)] bg-card text-[14.5px] outline-none"
              />
              <Button variant="solid" onClick={submit}>
                OK
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                Annuler
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="w-full px-4 py-3.5 border-0 border-t border-dashed border-[rgba(28,26,22,0.12)] bg-transparent cursor-pointer font-inherit text-[13px] text-[var(--muted-strong)] flex items-center justify-center gap-1.5 hover:bg-[rgba(28,26,22,0.02)]"
            >
              <PlusIcon size={14} sw={2} />
              Ajouter un rayon
            </button>
          )}
        </div>

        {aisles.length === 0 ? (
          <div className="text-center py-10">
            <DashedAddButton onClick={() => setAdding(true)}>
              Crée ton premier rayon
            </DashedAddButton>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
