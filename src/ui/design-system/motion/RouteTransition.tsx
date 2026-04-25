import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { easeOut, fadeUp } from './variants';

export interface RouteTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export function RouteTransition({ children, routeKey }: RouteTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={easeOut}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
