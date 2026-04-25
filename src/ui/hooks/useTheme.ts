import { useEffect } from 'react';
import { useRayonStore } from '@/ui/store';
import type { ThemeName } from '@ds/tokens/tokens';

export function useTheme(): { theme: ThemeName; setTheme: (t: ThemeName) => void } {
  const theme = useRayonStore((s) => s.theme);
  const setTheme = useRayonStore((s) => s.setTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return { theme, setTheme };
}
