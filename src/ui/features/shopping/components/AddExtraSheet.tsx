import { useEffect, useMemo, useState } from 'react';
import { Button, Sheet } from '@ds/primitives';
import { useCart } from '@/ui/hooks/useCart';
import { useRayonStore } from '@/ui/store';
import { buildSortedAisles } from '@/ui/store/selectors';
import type { AisleId } from '@domain/aisle';

export interface AddExtraSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AddExtraSheet({ open, onClose }: AddExtraSheetProps) {
  const rawAisles = useRayonStore((s) => s.aisles);
  const aisles = useMemo(() => buildSortedAisles(rawAisles), [rawAisles]);
  const cart = useCart();
  const [name, setName] = useState('');
  const [aisleId, setAisleId] = useState<AisleId | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setAisleId(aisles[0]?.id ?? null);
    }
  }, [open, aisles]);

  const submit = async () => {
    if (!name.trim() || !aisleId) return;
    await cart.addExtra(name.trim(), aisleId);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Ajouter un article" maxWidth={440}>
      <div className="flex flex-col gap-3.5">
        <div>
          <div className="text-[12px] text-[var(--muted)] mb-1.5">Article</div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void submit();
            }}
            placeholder="ex: Papier toilette, Café…"
            className="w-full h-11 px-3.5 rounded-[12px] border border-[var(--hairline-strong)] bg-card text-[14.5px] outline-none"
          />
        </div>
        <div>
          <div className="text-[12px] text-[var(--muted)] mb-1.5">Rayon</div>
          <div className="grid grid-cols-2 gap-1.5">
            {aisles.map((a) => {
              const selected = aisleId === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAisleId(a.id)}
                  className={
                    'h-11 px-3 rounded-[12px] cursor-pointer text-[13.5px] flex items-center gap-2.5 text-left ' +
                    (selected
                      ? 'border-[1.5px] border-ink bg-[rgba(28,26,22,0.04)]'
                      : 'border border-[var(--hairline-strong)] bg-card hover:bg-[rgba(28,26,22,0.02)]')
                  }
                >
                  <span>{a.emoji}</span>
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-1.5">
          <Button variant="outline" onClick={onClose} fullWidth>
            Annuler
          </Button>
          <Button variant="solid" onClick={submit} fullWidth>
            Ajouter
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
