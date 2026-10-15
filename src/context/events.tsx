import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { MOCK_EVENTS, type MockEvent } from '@/data/mock';

/**
 * In-memory event store for the demo (no backend, no database).
 *
 * Changes live only in React state — a page refresh resets everything to
 * the original sample data. This is intentional: the prototype must not
 * pretend that data is permanently saved.
 */

type EventsContextValue = {
  events: MockEvent[];
  addEvent: (draft: Omit<MockEvent, 'key' | 'registered' | 'attended'>) => MockEvent;
  updateEvent: (key: string, patch: Partial<MockEvent>) => void;
  deleteEvent: (key: string) => void;
  getEvent: (key: string) => MockEvent | undefined;
};

const EventsContext = createContext<EventsContextValue>({
  events: MOCK_EVENTS,
  addEvent: (draft) => ({ ...draft, key: 'x', registered: 0, attended: 0 }),
  updateEvent: () => {},
  deleteEvent: () => {},
  getEvent: () => undefined,
});

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<MockEvent[]>(MOCK_EVENTS);

  const addEvent = useCallback<EventsContextValue['addEvent']>((draft) => {
    const created: MockEvent = {
      ...draft,
      key: `e${Date.now()}`,
      registered: 0,
      attended: 0,
    };
    setEvents((prev) => [...prev, created]);
    return created;
  }, []);

  const updateEvent = useCallback<EventsContextValue['updateEvent']>((key, patch) => {
    setEvents((prev) => prev.map((event) => (event.key === key ? { ...event, ...patch } : event)));
  }, []);

  const deleteEvent = useCallback<EventsContextValue['deleteEvent']>((key) => {
    setEvents((prev) => prev.filter((event) => event.key !== key));
  }, []);

  const getEvent = useCallback<EventsContextValue['getEvent']>(
    (key) => events.find((event) => event.key === key),
    [events]
  );

  const value = useMemo(
    () => ({ events, addEvent, updateEvent, deleteEvent, getEvent }),
    [events, addEvent, updateEvent, deleteEvent, getEvent]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents(): EventsContextValue {
  return useContext(EventsContext);
}
