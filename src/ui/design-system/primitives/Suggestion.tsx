import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SuggestionProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Dropdown de suggestions générique — positionnement absolu sous son parent.
 * Le parent doit être `relative`.
 */
export function Suggestion({ open, children, className }: SuggestionProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute left-0 right-0 z-30 mt-2 bg-card rounded-[12px] overflow-hidden',
            'shadow-[var(--shadow-popover)] max-h-[380px] flex flex-col',
            className
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
