import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type {
  AuthGateway,
  AuthSession,
  SessionObserver,
} from '@application/ports/AuthGateway';
import { UserId, type User } from '@domain/user';

export class SupabaseAuthGateway implements AuthGateway {
  constructor(private readonly client: SupabaseClient) {}

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    return data.session ? toAuthSession(data.session) : null;
  }

  async signInWithEmail(email: string, redirectTo?: string): Promise<void> {
    const { error } = await this.client.auth.signInWithOtp({
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });
    if (error) throw error;
  }

  async signInWithGoogle(redirectTo?: string): Promise<void> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: redirectTo ? { redirectTo } : undefined,
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  observe(fn: SessionObserver): () => void {
    void this.getSession().then((s) => fn(s));
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      fn(session ? toAuthSession(session) : null);
    });
    return () => data.subscription.unsubscribe();
  }
}

function toAuthSession(session: Session): AuthSession {
  const su = session.user;
  const meta = (su.user_metadata ?? {}) as Record<string, unknown>;
  const user: User = {
    id: UserId.of(su.id),
    email: su.email ?? '',
    displayName:
      typeof meta.full_name === 'string'
        ? (meta.full_name as string)
        : typeof meta.name === 'string'
          ? (meta.name as string)
          : su.email?.split('@')[0],
    avatarUrl:
      typeof meta.avatar_url === 'string' ? (meta.avatar_url as string) : undefined,
  };
  return { user, accessToken: session.access_token };
}
