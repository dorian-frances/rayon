import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ContainerProvider, createDefaultContainer } from '@composition/index';
import { AuthGate } from '@/ui/features/auth';
import { Router } from '@/ui/routing';

export function App() {
  const container = useMemo(() => createDefaultContainer(), []);
  return (
    <ContainerProvider container={container}>
      <BrowserRouter>
        <AuthGate>
          <Router />
        </AuthGate>
      </BrowserRouter>
    </ContainerProvider>
  );
}
