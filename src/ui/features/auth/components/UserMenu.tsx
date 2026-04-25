import { useAuth } from '@/ui/hooks/useAuth';

export function UserMenu() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="w-8 h-8 rounded-full bg-[rgba(28,26,22,0.08)] flex items-center justify-center text-[13px] font-medium shrink-0">
        {(user.displayName ?? user.email ?? '?').slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] truncate">{user.displayName ?? user.email}</div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-[11px] text-[var(--muted)] hover:text-ink border-0 bg-transparent p-0 cursor-pointer"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
