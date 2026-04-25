import { useEffect, useState } from 'react';
import {
  numerateSteps,
  RecipeStep,
  type RecipeId,
  type RecipeStep as StepEntity,
  type RecipeStepKind,
} from '@domain/recipe';
import { HeadingIcon, NumListIcon, TextIcon } from '@ds/icons';
import { useRecipes } from '@/ui/hooks/useRecipes';

export interface StepsEditorProps {
  recipeId: RecipeId;
  steps: readonly StepEntity[];
}

export function StepsEditor({ recipeId, steps }: StepsEditorProps) {
  const { updateSteps } = useRecipes();
  const [local, setLocal] = useState<StepEntity[]>([...steps]);

  useEffect(() => {
    setLocal([...steps]);
  }, [steps, recipeId]);

  const commit = (next: StepEntity[]) => {
    setLocal(next);
    void updateSteps(recipeId, next);
  };

  const addBlock = (kind: RecipeStepKind) =>
    commit([...local, RecipeStep.create(kind)]);

  const setBlock = (i: number, value: string) =>
    commit(local.map((b, idx) => (idx === i ? RecipeStep.setValue(b, value) : b)));

  const removeBlock = (i: number) => commit(local.filter((_, idx) => idx !== i));

  const changeKind = (i: number, kind: RecipeStepKind) =>
    commit(local.map((b, idx) => (idx === i ? RecipeStep.setKind(b, kind) : b)));

  const numbers = numerateSteps(local);

  return (
    <div className="flex flex-col gap-0.5">
      {local.map((b, i) => (
        <StepBlockMemo
          key={i}
          index={i}
          block={b}
          number={numbers[i]!}
          onChange={(v) => setBlock(i, v)}
          onRemove={() => removeBlock(i)}
          onChangeKind={(k) => changeKind(i, k)}
        />
      ))}

      <div className="flex gap-1.5 mt-3.5">
        <AddBlockBtn onClick={() => addBlock('h')} icon={<HeadingIcon size={14} />}>
          Titre
        </AddBlockBtn>
        <AddBlockBtn onClick={() => addBlock('li')} icon={<NumListIcon size={14} />}>
          Étape
        </AddBlockBtn>
        <AddBlockBtn onClick={() => addBlock('p')} icon={<TextIcon size={14} />}>
          Texte
        </AddBlockBtn>
      </div>
    </div>
  );
}

import { StepBlock, type StepBlockProps } from './StepBlock';
import { memo } from 'react';

const StepBlockMemo = memo(function StepBlockMemo(
  props: StepBlockProps & { index: number }
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { index, ...rest } = props;
  return <StepBlock {...rest} />;
});

function AddBlockBtn({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 px-3 rounded-[10px] bg-transparent border border-dashed border-[rgba(28,26,22,0.2)] text-[var(--muted-strong)] text-[12.5px] font-inherit cursor-pointer inline-flex items-center gap-1.5 hover:border-[rgba(28,26,22,0.4)] hover:text-ink transition-colors"
    >
      {icon}
      {children}
    </button>
  );
}
