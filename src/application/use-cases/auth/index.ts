import type { AuthGateway } from '@application/ports/AuthGateway';

export const signInWithEmail =
  (gw: AuthGateway) =>
  (email: string, redirectTo?: string): Promise<void> =>
    gw.signInWithEmail(email, redirectTo);

export const signInWithGoogle =
  (gw: AuthGateway) =>
  (redirectTo?: string): Promise<void> =>
    gw.signInWithGoogle(redirectTo);

export const signOut = (gw: AuthGateway) => (): Promise<void> => gw.signOut();

export const getSession = (gw: AuthGateway) => () => gw.getSession();

export const observeSession = (gw: AuthGateway) => gw.observe.bind(gw);
