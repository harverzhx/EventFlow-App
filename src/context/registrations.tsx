import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { MOCK_REGISTRATIONS, type MockRegistration } from '@/data/mock';

/**
 * In-memory registration store for the demo (no backend, no database).
 *
 * Seeded from the sample data; registrations and check-ins live only in
 * React state and reset on refresh. Nothing here is permanent — the
 * prototype must not imply that records are actually saved.
 */

/** Builds the demo QR payload for a participant/event pair. */
function qrFor(eventKey: string, userKey: string): string {
  return `EF-${eventKey.toUpperCase()}-${userKey.toUpperCase()}`;
}

type RegistrationsContextValue = {
  registrations: MockRegistration[];
  /** Registers a participant for an event; returns null when already registered. */
  register: (userKey: string, eventKey: string, name: string) => MockRegistration | null;
  /** Marks a registration present; returns false when already checked in or unknown code. */
  markAttended: (qrCode: string) => boolean;
  findByQr: (qrCode: string) => MockRegistration | undefined;
  registrationsForUser: (userKey: string) => MockRegistration[];
  registrationsForEvent: (eventKey: string) => MockRegistration[];
  isRegistered: (userKey: string, eventKey: string) => boolean;
};

const RegistrationsContext = createContext<RegistrationsContextValue>({
  registrations: MOCK_REGISTRATIONS,
  register: () => null,
  markAttended: () => false,
  findByQr: () => undefined,
  registrationsForUser: () => [],
  registrationsForEvent: () => [],
  isRegistered: () => false,
});

export function RegistrationsProvider({ children }: { children: React.ReactNode }) {
  const [registrations, setRegistrations] = useState<MockRegistration[]>(MOCK_REGISTRATIONS);

  const register = useCallback<RegistrationsContextValue['register']>(
    (userKey, eventKey, name) => {
      const existing = registrations.find(
        (item) => item.userKey === userKey && item.eventKey === eventKey
      );
      if (existing) {
        return null;
      }

      const created: MockRegistration = {
        key: `r${Date.now()}`,
        eventKey,
        userKey,
        name,
        qrCode: qrFor(eventKey, userKey),
        attended: false,
      };
      setRegistrations((prev) => [...prev, created]);
      return created;
    },
    [registrations]
  );

  const markAttended = useCallback<RegistrationsContextValue['markAttended']>((qrCode) => {
    const target = registrations.find((item) => item.qrCode === qrCode);
    if (!target || target.attended) {
      return false;
    }
    setRegistrations((prev) =>
      prev.map((item) => (item.qrCode === qrCode ? { ...item, attended: true } : item))
    );
    return true;
  }, [registrations]);

  const value = useMemo<RegistrationsContextValue>(
    () => ({
      registrations,
      register,
      markAttended,
      findByQr: (qrCode) => registrations.find((item) => item.qrCode === qrCode),
      registrationsForUser: (userKey) =>
        registrations.filter((item) => item.userKey === userKey),
      registrationsForEvent: (eventKey) =>
        registrations.filter((item) => item.eventKey === eventKey),
      isRegistered: (userKey, eventKey) =>
        registrations.some((item) => item.userKey === userKey && item.eventKey === eventKey),
    }),
    [registrations, register, markAttended]
  );

  return (
    <RegistrationsContext.Provider value={value}>{children}</RegistrationsContext.Provider>
  );
}

export function useRegistrations(): RegistrationsContextValue {
  return useContext(RegistrationsContext);
}
