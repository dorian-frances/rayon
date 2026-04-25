import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { IconButton } from './IconButton';
import { XIcon } from '../icons/icons';
import { useIsDesktop } from '../utils/useMediaQuery';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: number;
  children: ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onClose,
  title,
  maxWidth = 520,
  children,
  className,
}: SheetProps) {
  const isDesktop = useIsDesktop();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className={cn(
            'fixed inset-0 z-[1000] flex',
            'bg-[rgba(28,26,22,0.4)] backdrop-blur-[4px]',
            isDesktop ? 'items-center justify-center p-5' : 'items-end justify-stretch'
          )}
        >
          <motion.div
            key="panel"
            initial={
              isDesktop
                ? { opacity: 0, y: 12, scale: 0.98 }
                : { opacity: 0, y: '100%' }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              isDesktop
                ? { opacity: 0, y: 8, scale: 0.98 }
                : { opacity: 0, y: '100%' }
            }
            transition={{
              duration: 0.28,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'bg-card flex flex-col overflow-hidden shadow-[var(--shadow-sheet)]',
              isDesktop
                ? 'w-full rounded-[20px] max-h-[90vh]'
                : 'w-full rounded-t-[20px] max-h-[90vh]',
              className
            )}
            style={{ maxWidth: isDesktop ? maxWidth : undefined }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title ? (
              <div className="px-5 pt-[18px] pb-[10px] flex items-center justify-between border-b border-[var(--hairline)]">
                <h3 className="m-0 text-[18px] font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <IconButton onClick={onClose} aria-label="Fermer">
                  <XIcon size={18} />
                </IconButton>
              </div>
            ) : null}
            <div className="overflow-auto px-5 pt-3.5 pb-[22px]">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
