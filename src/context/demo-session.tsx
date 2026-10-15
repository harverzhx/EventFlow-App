import { createContext, useContext } from 'react';

import type { MockUser, UserRole } from '@/data/mock';

/**
 * Demo session state — frontend-only, in-memory, resets on refresh.
 *
 * This is NOT authentication. There is no backend, no database, and no
 * real identity verification. The selected role only controls which
 * demo screens are reachable in the UI.
 */

export type DemoSession = {
  user: MockUser | null;
  role: UserRole | null;
  isDemo: boolean;
};

export const DEMO_SESSION_INITIAL: DemoSession = {
  user: null,
  role: null,
  isDemo: true,
};

/** Mock accounts used by the demo role selector (clearly labeled as sample data). */
export const DEMO_ACCOUNTS: Record<UserRole, MockUser> = {
  admin: {
    key: 'u1',
    name: 'Magsayo Dave Archie',
    email: 'dave.magsayo@jmsu.edu.ph',
    role: 'admin',
    isCurrent: true,
  },
  staff: {
    key: 'u2',
    name: 'Baje John Harvy',
    email: 'harvy.baje@jmsu.edu.ph',
    role: 'staff',
    isCurrent: true,
  },
  participant: {
    key: 'u3',
    name: 'Marian Santos',
    email: 'marian.santos@jmsu.edu.ph',
    role: 'participant',
    isCurrent: true,
  },
};

type DemoSessionContextValue = DemoSession & {
  signIn: (role: UserRole) => void;
  signOut: () => void;
};

export const DemoSessionContext = createContext<DemoSessionContextValue>({
  ...DEMO_SESSION_INITIAL,
  signIn: () => {},
  signOut: () => {},
});

export function useDemoSession(): DemoSessionContextValue {
  return useContext(DemoSessionContext);
}
