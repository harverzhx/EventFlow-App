import { MockEvent, MockRegistration } from '@/data/mock';

export interface EventStats {
  registered: number;
  attended: number;
}

/** Computes per-event registration/attendance counts from live registrations.
 *
 * This is the single source of truth for counts. Event `registered`/`attended`
 * seed values are not used here, so the dashboard, reports, and any other
 * screen always stay in sync with the actual registration/check-in state.
 */
export function computeEventStats(
  events: MockEvent[],
  registrations: MockRegistration[]
): Map<string, EventStats> {
  const stats = new Map<string, EventStats>();
  for (const event of events) {
    stats.set(event.key, { registered: 0, attended: 0 });
  }
  for (const reg of registrations) {
    const current = stats.get(reg.eventKey);
    if (!current) continue;
    current.registered += 1;
    if (reg.attended) current.attended += 1;
  }
  return stats;
}
