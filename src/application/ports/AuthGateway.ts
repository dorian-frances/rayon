import type { User } from '@domain/user';

export interface AuthSession {
  readonly user: User;
  readonly accessToken: string;
}

export type SessionObserver = (session: AuthSession | null) => void;

export interface AuthGateway {
  getSession(): Promise<AuthSession | null>;
  signInWithEmail(email: string, redirectTo?: string): Promise<void>;
  signInWithGoogle(redirectTo?: string): Promise<void>;
  signOut(): Promise<void>;
  /**
   * Observe les changements de session (login, logout, refresh).
   * Retourne une fn de désabonnement.
   */
  observe(fn: SessionObserver): () => void;
}
