import { useState } from 'react';
import { Button } from '@ds/primitives';
import { RayonMark } from '@ds/layout';
import { ArrowRightIcon } from '@ds/icons';
import { useAuth } from '@/ui/hooks/useAuth';

export function SignInScreen() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      await signInWithEmail(email.trim());
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-card rounded-[20px] border border-[var(--hairline)] shadow-[var(--shadow-card)] p-8 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <RayonMark size={48} />
          <h1 className="font-serif font-medium tracking-[-0.025em] text-[28px] md:text-[34px] mt-4 mb-2">
            Rayon
          </h1>
          <p className="text-[14px] text-[var(--muted-strong)] m-0">
            Tes courses, organisées comme tu les penses.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-[15px] mb-2">Email envoyé ✉️</div>
            <p className="text-[13.5px] text-[var(--muted-strong)] m-0">
              Clique le lien magique dans ta boîte mail pour te connecter.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void submit();
                }}
                placeholder="ton@email.com"
                className="w-full h-12 px-4 rounded-[12px] border border-[var(--hairline-strong)] bg-bg text-[15px] outline-none focus:border-ink focus:border-[1.5px]"
              />
              <Button
                variant="solid"
                size="lg"
                onClick={submit}
                disabled={loading || !email.trim()}
                fullWidth
                rightIcon={<ArrowRightIcon size={16} sw={2} />}
              >
                {loading ? 'Envoi…' : 'Recevoir un lien magique'}
              </Button>
              {error ? (
                <div className="text-[12.5px] text-[var(--danger)]">{error}</div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--hairline)]" />
              <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)]">
                ou
              </div>
              <div className="flex-1 h-px bg-[var(--hairline)]" />
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() => void signInWithGoogle()}
              fullWidth
            >
              <GoogleGlyph />
              Continuer avec Google
            </Button>

            <div className="text-[11.5px] text-[var(--muted)] text-center mt-6">
              En te connectant, tu acceptes que Rayon stocke tes recettes et ton panier
              dans Supabase, accessibles uniquement par toi.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.8 8.8 0 0 0 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
