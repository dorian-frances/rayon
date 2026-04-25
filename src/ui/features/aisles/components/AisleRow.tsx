import { Reorder, useDragControls } from 'motion/react';
import type { Aisle } from '@domain/aisle';
import { ChevDownIcon, GripIcon } from '@ds/icons';
import { IconButton, InlineEdit, InlineEmoji } from '@ds/primitives';
import { useAisles } from '@/ui/hooks/useAisles';

export interface AisleRowProps {
  aisle: Aisle;
  index: number;
  ingredientCount: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export function AisleRow({
  aisle,
  index,
  ingredientCount,
  isOpen,
  onToggle,
  isLast,
}: AisleRowProps) {
  const { rename, setEmoji } = useAisles();
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={aisle}
      dragListener={false}
      dragControls={controls}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-card"
    >
      <div
        className={
          'flex items-center gap-3 px-4 py-3.5 ' +
          (!isLast || isOpen ? 'border-b border-[var(--hairline)]' : '')
        }
      >
        <button
          type="button"
          aria-label="Glisser pour réordonner"
          onPointerDown={(e) => controls.start(e)}
          className="text-[rgba(28,26,22,0.3)] flex border-0 bg-transparent cursor-grab active:cursor-grabbing p-0"
        >
          <GripIcon size={20} />
        </button>
        <InlineEmoji
          value={aisle.emoji}
          onSubmit={(v) => void setEmoji(aisle.id, v)}
        />
        <div className="flex-1 min-w-0">
          <InlineEdit
            value={aisle.name}
            textSize={15}
            onSubmit={(v) => void rename(aisle.id, v)}
          />
          <div className="text-[11.5px] text-[rgba(28,26,22,0.45)] mt-0.5">
            {ingredientCount} ingrédient{ingredientCount > 1 ? 's' : ''}
          </div>
        </div>
        <span className="text-[12px] text-[rgba(28,26,22,0.35)] tabular-nums">
          {index + 1}
        </span>
        <IconButton size={32} onClick={onToggle} aria-label="Détails">
          <ChevDownIcon
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </IconButton>
      </div>
    </Reorder.Item>
  );
}
