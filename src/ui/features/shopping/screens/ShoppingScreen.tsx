import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Progress, EmptyState } from '@ds/primitives';
import { PlusIcon, RefreshIcon, SettingsIcon } from '@ds/icons';
import { Container } from '@ds/layout';
import { useCart } from '@/ui/hooks/useCart';
import { AisleSection } from '../components/AisleSection';
import { AddExtraSheet } from '../components/AddExtraSheet';
import { ResetCartSheet } from '../components/ResetCartSheet';

export function ShoppingScreen() {
  const cart = useCart();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const stats = cart.stats;
  const empty = stats.total === 0;

  return (
    <div className="min-h-full bg-bg pb-24 md:pb-12 relative">
      <div className="sticky top-0 z-20 bg-[rgba(250,248,243,0.92)] backdrop-blur-[12px] border-b border-[var(--hairline)]">
        <Container width="default" className="pt-4 md:pt-6 pb-3.5">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)]">
                {stats.recipeCount} recette{stats.recipeCount > 1 ? 's' : ''} ·{' '}
                {stats.total} article{stats.total > 1 ? 's' : ''}
              </div>
              <h1 className="m-0 mt-1 font-serif font-medium tracking-[-0.025em] text-[26px] md:text-[38px]">
                Courses
              </h1>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <IconButton onClick={() => setAddOpen(true)} aria-label="Ajouter un article">
                <PlusIcon size={18} sw={2} />
              </IconButton>
              <IconButton onClick={() => navigate('/aisles')} aria-label="Réordonner les rayons">
                <SettingsIcon size={18} />
              </IconButton>
              {stats.total > 0 ? (
                <IconButton
                  onClick={() => setResetOpen(true)}
                  aria-label="Réinitialiser"
                >
                  <RefreshIcon size={18} />
                </IconButton>
              ) : null}
            </div>
          </div>
          <div className="mt-3.5 flex items-center gap-3">
            <Progress
              value={stats.pct}
              height={6}
              tone={stats.pct === 1 ? 'success' : 'ink'}
            />
            <span
              className="text-[12.5px] font-medium min-w-[38px] text-right tabular-nums"
              style={{ color: stats.pct === 1 ? 'var(--success)' : 'var(--ink)' }}
            >
              {Math.round(stats.pct * 100)}%
            </span>
          </div>
        </Container>
      </div>

      {empty ? (
        <EmptyState
          emoji="🛒"
          title="Panier vide"
          description="Ajoute des recettes depuis la bibliothèque pour commencer ta liste de courses."
        />
      ) : (
        <Container width="default" className="pt-4 md:pt-4">
          {cart.groups.map((section) => (
            <AisleSection key={section.aisle.id} section={section} />
          ))}
        </Container>
      )}

      <AddExtraSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <ResetCartSheet open={resetOpen} onClose={() => setResetOpen(false)} />
    </div>
  );
}
