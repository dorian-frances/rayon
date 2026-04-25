import { createContext, useContext, type ReactNode } from 'react';
import type { Container } from './container';

const ContainerContext = createContext<Container | null>(null);

export interface ContainerProviderProps {
  container: Container;
  children: ReactNode;
}

export function ContainerProvider({ container, children }: ContainerProviderProps) {
  return (
    <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
  );
}

export function useContainer(): Container {
  const ctx = useContext(ContainerContext);
  if (!ctx) {
    throw new Error('useContainer must be used within a <ContainerProvider>');
  }
  return ctx;
}

export function useUseCases() {
  return useContainer().useCases;
}

export function useAdapters() {
  return useContainer().adapters;
}
