import type {
  AuthGateway,
  AuthSession,
  SessionObserver,
} from '@application/ports/AuthGateway';
import { UserId, type User } from '@domain/user';

/**
 * Auth factice — pour le dev offline. Loggue instantanément un user local
 * stocké dans localStorage. À remplacer par `SupabaseAuthGateway` en prod.
 */
export class InMemoryAuthGateway implements AuthGateway {
  private static readonly LS_KEY = 'rayon:in-memory-auth';
  private listeners = new Set<SessionObserver>();
  private session: AuthSession | null = null;

  constructor() {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(InMemoryAuthGateway.LS_KEY)
        : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: User; accessToken: string };
        this.session = { user: parsed.user, accessToken: parsed.accessToken };
      } catch {
        this.session = null;
      }
    }
  }

  async getSession() {
    return this.session;
  }

  async signInWithEmail(email: string): Promise<void> {
    const user: User = {
      id: UserId.of('local-user'),
      email,
      displayName: email.split('@')[0],
    };
    this.session = { user, accessToken: 'local' };
    this.persist();
    this.emit();
  }

  async signInWithGoogle(): Promise<void> {
    const user: User = {
      id: UserId.of('local-user'),
      email: 'you@rayon.app',
      displayName: 'Rayon Local',
    };
    this.session = { user, accessToken: 'local' };
    this.persist();
    this.emit();
  }

  async signOut(): Promise<void> {
    this.session = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(InMemoryAuthGateway.LS_KEY);
    }
    this.emit();
  }

  observe(fn: SessionObserver): () => void {
    this.listeners.add(fn);
    queueMicrotask(() => fn(this.session));
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    for (const fn of this.listeners) fn(this.session);
  }

  private persist() {
    if (typeof localStorage === 'undefined' || !this.session) return;
    localStorage.setItem(
      InMemoryAuthGateway.LS_KEY,
      JSON.stringify({
        user: this.session.user,
        accessToken: this.session.accessToken,
      })
    );
  }
}
