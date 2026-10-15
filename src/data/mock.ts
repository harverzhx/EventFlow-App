export type UserRole = 'admin' | 'staff' | 'participant';

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin / Organizer',
  staff: 'Staff / Assistant',
  participant: 'Participant / Attendee',
};

export type MockUser = {
  key: string;
  name: string;
  email: string;
  role: UserRole;
  /** The signed-in user; kept in memory only — no backend. */
  isCurrent?: boolean;
};

export const CURRENT_USER: MockUser = {
  key: 'u1',
  name: 'Magsayo Dave Archie',
  email: 'dave.magsayo@jmsu.edu.ph',
  role: 'admin',
  isCurrent: true,
};

export const MOCK_USERS: MockUser[] = [
  CURRENT_USER,
  { key: 'u2', name: 'Baje John Harvy', email: 'harvy.baje@jmsu.edu.ph', role: 'staff' },
  { key: 'u3', name: 'Marian Santos', email: 'marian.santos@jmsu.edu.ph', role: 'participant' },
  { key: 'u4', name: 'Ana Reyes', email: 'ana.reyes@jmsu.edu.ph', role: 'participant' },
  { key: 'u5', name: 'Carlo Lim', email: 'carlo.lim@jmsu.edu.ph', role: 'participant' },
];

export type MockEvent = {
  key: string;
  title: string;
  day: string;
  month: string;
  time: string;
  venue: string;
  description: string;
  capacity: number;
  registered: number;
  /** Participants who scanned in at the event. */
  attended: number;
  organizer: string;
};

export const MOCK_EVENTS: MockEvent[] = [
  {
    key: 'e1',
    title: 'Tech Seminar 2026',
    day: '12',
    month: 'SEP',
    time: '9:00 AM – 12:00 PM',
    venue: 'JRMSU Main Auditorium',
    description: 'A morning seminar on emerging technologies and career paths for IT students.',
    capacity: 200,
    registered: 148,
    attended: 132,
    organizer: 'Magsayo Dave Archie',
  },
  {
    key: 'e2',
    title: 'Product Launch',
    day: '18',
    month: 'SEP',
    time: '2:30 PM – 5:00 PM',
    venue: 'Grand Hall',
    description: 'Official launch of the new campus event platform.',
    capacity: 100,
    registered: 76,
    attended: 0,
    organizer: 'Baje John Harvy',
  },
  {
    key: 'e3',
    title: 'Quarterly Review',
    day: '25',
    month: 'SEP',
    time: '10:00 AM – 11:30 AM',
    venue: 'Meeting Room A',
    description: 'Quarterly organizational review with event committees.',
    capacity: 40,
    registered: 32,
    attended: 0,
    organizer: 'Magsayo Dave Archie',
  },
  {
    key: 'e4',
    title: 'Expo Go Workshop',
    day: '02',
    month: 'OCT',
    time: '1:00 PM – 4:00 PM',
    venue: 'Lab 3',
    description: 'Hands-on workshop about building mobile apps with Expo.',
    capacity: 60,
    registered: 54,
    attended: 0,
    organizer: 'Baje John Harvy',
  },
  {
    key: 'e5',
    title: 'Project Defense',
    day: '09',
    month: 'OCT',
    time: '8:30 AM – 4:00 PM',
    venue: 'Room 204',
    description: 'Capstone project defense schedule for senior students.',
    capacity: 50,
    registered: 41,
    attended: 0,
    organizer: 'Magsayo Dave Archie',
  },
  {
    key: 'e6',
    title: 'Hackathon Night',
    day: '16',
    month: 'OCT',
    time: '5:00 PM – 10:00 PM',
    venue: 'Innovation Hub',
    description: 'Overnight hackathon open to all enrolled students.',
    capacity: 120,
    registered: 98,
    attended: 0,
    organizer: 'Marian Santos',
  },
];

/** Participants registered to an event, with their check-in state. */
export type MockRegistration = {
  key: string;
  eventKey: string;
  userKey: string;
  name: string;
  qrCode: string;
  attended: boolean;
};

export const MOCK_REGISTRATIONS: MockRegistration[] = [
  { key: 'r1', eventKey: 'e1', userKey: 'u3', name: 'Marian Santos', qrCode: 'EF-E1-U3', attended: true },
  { key: 'r2', eventKey: 'e1', userKey: 'u4', name: 'Ana Reyes', qrCode: 'EF-E1-U4', attended: true },
  { key: 'r3', eventKey: 'e1', userKey: 'u5', name: 'Carlo Lim', qrCode: 'EF-E1-U5', attended: true },
  { key: 'r4', eventKey: 'e2', userKey: 'u3', name: 'Marian Santos', qrCode: 'EF-E2-U3', attended: false },
  { key: 'r5', eventKey: 'e2', userKey: 'u4', name: 'Ana Reyes', qrCode: 'EF-E2-U4', attended: false },
  { key: 'r6', eventKey: 'e4', userKey: 'u5', name: 'Carlo Lim', qrCode: 'EF-E4-U5', attended: false },
];

/** Quick actions shown on the dashboard, per role. */
export function quickActionsForRole(role: UserRole) {
  if (role === 'admin') {
    return [
      { key: 'create', label: 'Create Event', caption: 'Add a new event', icon: 'plus-circle', route: '/create-event' },
      { key: 'participants', label: 'Participants', caption: 'Registered list', icon: 'users', route: '/participants' },
      { key: 'attendance', label: 'Attendance', caption: 'Check-in records', icon: 'check-square', route: '/attendance' },
      { key: 'reports', label: 'Reports', caption: 'Summary & export', icon: 'bar-chart-2', route: '/reports' },
      { key: 'users', label: 'Users', caption: 'Manage accounts', icon: 'user-check', route: '/user-management' },
    ] as const;
  }

  if (role === 'staff') {
    return [
      { key: 'scan', label: 'Scan QR', caption: 'Check in a participant', icon: 'maximize', route: '/scan-qr' },
      { key: 'verify', label: 'Verify', caption: 'Check registration', icon: 'shield', route: '/scan-qr' },
      { key: 'attendance', label: 'Attendance', caption: 'Check-in records', icon: 'check-square', route: '/attendance' },
      { key: 'participants', label: 'Participants', caption: 'Registered list', icon: 'users', route: '/participants' },
    ] as const;
  }

  return [
    { key: 'register', label: 'Register', caption: 'Join an event', icon: 'edit-3', route: '/register-event' },
    { key: 'my-qr', label: 'My QR Code', caption: 'Show at check-in', icon: 'grid', route: '/my-qr' },
    { key: 'my-reg', label: 'My Events', caption: 'My registrations', icon: 'calendar', route: '/my-registrations' },
  ] as const;
}
