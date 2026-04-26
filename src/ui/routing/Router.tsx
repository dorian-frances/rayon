import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShell, BottomNav, Sidebar, type SidebarNavItem } from '@ds/layout';
import { BookIcon, CartIcon, ListIcon } from '@ds/icons';
import { RouteTransition } from '@ds/motion';
import { LibraryScreen, RecipeDetailScreen, RecipeEditorScreen } from '@/ui/features/recipes';
import { ShoppingScreen } from '@/ui/features/shopping';
import { AislesManagerScreen } from '@/ui/features/aisles';
import { UserMenu } from '@/ui/features/auth';
import { useCart } from '@/ui/hooks/useCart';

export function Router() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useCart();
  const path = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll('main').forEach((m) => m.scrollTo(0, 0));
  }, [path]);

  const isLibraryArea = path === '/' || path.startsWith('/recipes');
  const isShopping = path === '/shopping';
  const isAisles = path === '/aisles';

  const sidebarItems: SidebarNavItem[] = [
    {
      id: 'library',
      label: 'Recettes',
      icon: <BookIcon size={17} />,
      active: isLibraryArea,
      onClick: () => navigate('/'),
    },
    {
      id: 'shopping',
      label: 'Courses',
      icon: <CartIcon size={17} />,
      active: isShopping,
      onClick: () => navigate('/shopping'),
      badge: cart.stats.recipeCount,
    },
    {
      id: 'aisles',
      label: 'Rayons & ingrédients',
      icon: <ListIcon size={17} />,
      active: isAisles,
      onClick: () => navigate('/aisles'),
    },
  ];

  const bottomItems = [
    {
      id: 'library',
      label: 'Recettes',
      icon: <BookIcon size={20} />,
      active: isLibraryArea,
      onClick: () => navigate('/'),
    },
    {
      id: 'shopping',
      label: 'Courses',
      icon: <CartIcon size={20} />,
      active: isShopping || isAisles,
      onClick: () => navigate('/shopping'),
      badge: cart.stats.recipeCount,
    },
  ];

  return (
    <AppShell
      sidebar={<Sidebar items={sidebarItems} footer={<UserMenu />} />}
      bottomNav={<BottomNav items={bottomItems} />}
    >
      <AnimatePresence mode="wait">
        <RouteTransition routeKey={location.pathname}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LibraryScreen />} />
            <Route path="/recipes/new" element={<RecipeEditorScreen />} />
            <Route path="/recipes/:id/edit" element={<RecipeEditorScreen />} />
            <Route path="/recipes/:id" element={<RecipeDetailScreen />} />
            <Route path="/shopping" element={<ShoppingScreen />} />
            <Route path="/aisles" element={<AislesManagerScreen />} />
            <Route path="*" element={<LibraryScreen />} />
          </Routes>
        </RouteTransition>
      </AnimatePresence>
    </AppShell>
  );
}
