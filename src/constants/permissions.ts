import type { UserRole } from '@/data/mock';

/**
 * Frontend demo route access map.
 *
 * NOT a security boundary — these guards only hide screens in the demo UI.
 * A determined user can bypass them (direct URL, dev tools). Real
 * authorization requires a backend, which this prototype does not have.
 *
 * `public` routes are reachable without a demo session (login, sign-up).
 * All other routes require a signed-in demo role.
 */
export const ROUTE_ACCESS: Record<string, UserRole[] | 'public'> = {
  '/login': 'public',
  '/sign-up': 'public',
  '/dashboard': ['admin', 'staff', 'participant'],
  '/events': ['admin', 'staff', 'participant'],
  '/profile': ['admin', 'staff', 'participant'],
  '/create-event': ['admin'],
  '/edit-event': ['admin'],
  '/event-detail': ['admin', 'staff', 'participant'],
  '/register-event': ['admin', 'participant'],
  '/my-qr': ['admin', 'participant'],
  '/my-registrations': ['admin', 'participant'],
  '/scan-qr': ['admin', 'staff'],
  '/participants': ['admin', 'staff'],
  '/attendance': ['admin', 'staff'],
  '/reports': ['admin'],
};

/** Can this role open this route? No role = no session = public routes only. */
export function canAccess(route: string, role: UserRole | null): boolean {
  const access = ROUTE_ACCESS[route];

  if (!access || access === 'public') {
    return true;
  }
  if (!role) {
    return false;
  }

  return access.includes(role);
}
