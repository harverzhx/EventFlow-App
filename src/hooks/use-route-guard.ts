import { useEffect } from 'react';
import { router } from 'expo-router';

import { canAccess } from '@/constants/permissions';
import { useDemoSession } from '@/context/demo-session';

/**
 * Frontend demo route guard — call once at the top of a screen.
 *
 * - No demo session (never logged in) → redirect to /login.
 * - Signed in but the route is not allowed for the role → redirect to /dashboard.
 *
 * This is a demonstration guard only, not a security boundary.
 */
export function useRouteGuard(route: string) {
  const { role } = useDemoSession();

  useEffect(() => {
    if (!canAccess(route, role)) {
      router.replace(role ? '/dashboard' : '/login');
    }
  }, [route, role]);
}
