import { Button, Sheet } from '@ds/primitives';
import { useCart } from '@/ui/hooks/useCart';

export interface ResetCartSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ResetCartSheet({ open, onClose }: ResetCartSheetProps) {
  const cart = useCart();
  const confirm = async () => {
    await cart.reset();
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Finir les courses ?" maxWidth={420}>
      <p className="m-0 mb-4 text-[14.5px] leading-[1.5] text-[var(--muted-strong)]">
        Cela va vider ton panier (recettes sélectionnées, ingrédients cochés et articles
        hors recette) pour repartir à zéro pour la prochaine fois.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} fullWidth>
          Pas maintenant
        </Button>
        <Button variant="solid" onClick={confirm} fullWidth>
          Réinitialiser
        </Button>
      </div>
    </Sheet>
  );
}
