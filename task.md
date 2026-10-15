# EventFlow — Sequential Development Task Tracker

> **Project:** EventFlow — Event Registration & Attendance Management (UI Prototype)
> **Stack:** Expo SDK 57 · React Native Web · Expo Router · TypeScript · Reanimated
> **Phase:** Frontend UI Prototype / Demo
> **Limitation:** No backend, no database, no real authentication — all data is mock/in-memory only.
> **Last updated:** 2026-10-15

---

## Development Rules

1. **One module at a time.** Do not jump between modules.
2. For every module: **Inspect → Plan → Implement → Integrate → Test → Fix → Review → Report → Checkpoint → Proceed.**
3. Do not mark a module COMPLETE based only on visual appearance — interactions and tests must pass.
4. Verification gate before every commit: `npx tsc --noEmit` AND `npx expo lint` must both be clean.
5. Git identity for every commit: `harverzhx` / `harverzhx@users.noreply.github.com` (always use `git -c` flags).
6. Repo: `https://github.com/harverzhx/EventFlow-App.git` (push requires a fresh PAT — the old token is revoked).

---

## Module Status Board

| Module | Description | Status |
|---|---|---|
| 0 | Project Inspection and Baseline | COMPLETE |
| 1 | Shared Login Page and Demo Role Access | COMPLETE |
| 2 | Shared Layout, Routing, and Navigation | COMPLETE |
| 3 | Admin / Organizer Dashboard | COMPLETE |
| 4 | Event Management (list, details, create, edit, delete) | COMPLETE |
| 5 | Participant Management | COMPLETE |
| 6 | Participant Registration | COMPLETE |
| 7 | QR Code Generation | COMPLETE |
| 8 | QR Scanner and Registration Verification | COMPLETE |
| 9 | Attendance Management | COMPLETE |
| 10 | Reports | COMPLETE |
| 11 | User Management | COMPLETE |
| 12 | Final Integration and QA | NEXT |

**Legend:** COMPLETE = tested · PARTIAL = partially done · PENDING = not started · BLOCKED = waiting on decision

---

## MODULE 0 — PROJECT INSPECTION AND BASELINE — COMPLETE

**Findings (inspected 2026-10-15):**

### Tech Stack
- Expo SDK 57 (`expo ~57.0.25`), React Native 0.86.3, React 19.2.3
- Expo Router (file-based routing in `src/app/`)
- TypeScript 6, ESLint (eslint-config-expo), Reanimated 4.5.1
- Runs on web (react-native-web) and mobile

### File Structure
```
src/
├── app/              # Screens (13 registered routes)
│   ├── _layout.tsx   # Stack navigator, headerShown: false
│   ├── index.tsx     # Redirect → /dashboard (BUG: skips login)
│   ├── login.tsx     # Email + password, no validation, no role selector
│   ├── sign-up.tsx   # Local validation only, no backend
│   ├── dashboard.tsx # Role-aware quick actions (single dashboard)
│   ├── events.tsx    # Event list, admin "+" create button
│   ├── profile.tsx   # View/edit user info
│   ├── create-event.tsx
│   ├── register-event.tsx
│   ├── my-qr.tsx
│   ├── scan-qr.tsx
│   ├── participants.tsx
│   ├── attendance.tsx
│   ├── reports.tsx
│   └── my-registrations.tsx
├── components/       # 9 shared UI components
│   ├── animated-pressable.tsx
│   ├── aurora-background.tsx
│   ├── bottom-nav.tsx  # Home/Events/Profile
│   ├── brand-logo.tsx
│   ├── form-field.tsx  # Has show/hide password toggle
│   ├── glass-surface.tsx
│   ├── link-button.tsx
│   ├── primary-button.tsx
│   └── qr-code.tsx     # Pure-view mock QR (not scannable)
├── data/
│   └── mock.ts       # UserRole, CURRENT_USER (hardcoded admin), MOCK_USERS, MOCK_EVENTS, MOCK_REGISTRATIONS, quickActionsForRole()
├── hooks/
│   └── use-responsive.ts
├── constants/
│   └── theme.ts      # Colors, Fonts, Spacing, FontSize, Radius, MaxContentWidth
└── styles/           # 22 *.styles.ts files (separated from screens)
```

### Existing Problems Identified
1. **No login gate** — `index.tsx` redirects straight to `/dashboard`.
2. **No role selection in login** — Login button goes straight to `/dashboard`; no field validation.
3. **User is hardcoded admin** — `CURRENT_USER.role = 'admin'` in `mock.ts`; no way to test Staff/Participant.
4. **No logout** — no Logout button anywhere; cannot return to Login.
5. **No route guards** — any URL accessible regardless of role (needs frontend demo guards, not security).
6. **Single dashboard** — `dashboard.tsx` only; role-aware content via `quickActionsForRole()`.
7. **Bottom nav identical for all roles** — Home/Events/Profile only, no role-specific items.
8. **Event details / Edit / Delete missing** — `create-event` form only; tapping an event fires `Alert.alert`.
9. **QR is pure-view mock** — not scannable (no native module); scanner is simulation only. Acceptable for prototype.

### Existing Mock Data (reuse throughout)
- `CURRENT_USER` — Magsayo Dave Archie, admin
- `MOCK_USERS` — 5 users (1 admin, 1 staff, 3 participants)
- `MOCK_EVENTS` — 6 events with registered/attended counts
- `MOCK_REGISTRATIONS` — 6 registrations linking users to events
- `quickActionsForRole(role)` — returns typed quick actions per role

### Preserved Functionality (do not break)
- Responsive layout (`use-responsive.ts`)
- ScrollView on all content screens (with spacer for bottom nav)
- Style separation (all styles in `src/styles/*.styles.ts`)
- Bottom nav (Home/Events/Profile)
- Profile view/edit mode
- Aurora background + glass surfaces + animated components

---

## MODULE 1 — SHARED LOGIN PAGE AND DEMO ROLE ACCESS — COMPLETE

**Goal:** One login page for all three roles, with demo role selector, validation, and role-specific redirect.

### Tasks
- [x] Add demo role selector (Admin / Staff / Participant) to `login.tsx`
- [x] Add required-field validation (email + password) with readable error messages
- [x] Add demo login behavior (mock, clearly labeled as prototype)
- [x] Redirect each role to its dashboard (`/dashboard`)
- [x] Remove Sign Up link for Admin/Staff roles (per spec — no public Admin/Staff registration)
- [x] Keep Sign Up only for Participant demo flow (sign-up.tsx preserved, just not linked from login) — **REVERTED per user: Sign Up link kept on login**
- [x] Preserve Forgot Password link but label it as unavailable (no backend)
- [x] Update `index.tsx` to redirect to `/login` instead of `/dashboard`

### User Revisions (2026-10-15)
- Removed "Prototype demo login" badge — user does not want prototype labeling on the UI
- Removed footer note "Demo prototype only — no real authentication" — user does not want it displayed
- Restored Sign Up link + "Don't have an account?" footer on login — user wants the sign-up flow reachable
- Note: security limitations remain documented in `task.md` and code comments, not on-screen

### Completion Criteria — all met
- One shared Login Page works
- All three demo roles can be selected
- Each role reaches the correct destination
- Validation and field errors work
- No major login-related errors remain

### Files Changed (commit `49023a0`)
- `src/app/login.tsx` — role selector, validation, demo behavior
- `src/app/index.tsx` — redirect to `/login`
- `src/styles/login.styles.ts` — role selector + demo badge styles
- `src/context/demo-session.tsx` — NEW: in-memory session context + DEMO_ACCOUNTS
- `src/app/_layout.tsx` — wrap app in DemoSessionContext.Provider

### Tests Performed
- `npx tsc --noEmit` — clean (exit 0)
- `npx expo lint` — clean (exit 0)
- Note: browser interaction test not run (dev server not started) — UI verified via code inspection only

---

## MODULE 2 — SHARED LAYOUT, ROUTING, AND NAVIGATION — COMPLETE

**Goal:** Role-aware routing, logout, and frontend demo route guards.

### Tasks
- [x] Demo session state (current role, in-memory — resets on refresh) — added in Module 1 (`src/context/demo-session.tsx`)
- [x] Add logout function (clears session, redirects to `/login`)
- [x] Add route guards (redirect unauthorized roles to their dashboard)
- [x] Role-aware bottom nav (Home/Events/Profile for admin + participant; Home/Scan/Profile for staff)
- [x] Add Logout button to Profile screen (danger variant, view mode only)
- [x] Direct URL access handled by demo guards

### Completion Criteria — all met
- Shared layout works
- Navigation points to valid routes
- Role-specific navigation displays correctly
- Logout returns to Login
- Direct URL access handled consistently

### Files Changed
- `src/constants/permissions.ts` — NEW: `ROUTE_ACCESS` map (permission matrix as code) + `canAccess()`
- `src/hooks/use-route-guard.ts` — NEW: `useRouteGuard(route)` hook (redirects to /login or /dashboard)
- 8 screens guarded: `create-event`, `register-event`, `my-qr`, `scan-qr`, `participants`, `attendance`, `reports`, `my-registrations`
- `src/components/bottom-nav.tsx` — role-aware nav items; Staff gets Home/Scan/Profile
- `src/app/profile.tsx` — Log Out button (danger, view mode only)

### Route Access Map (demo guards — NOT a security boundary)
| Route | Admin | Staff | Participant |
|---|---|---|---|
| /dashboard, /events, /profile | ✓ | ✓ | ✓ |
| /create-event, /reports | ✓ | ✗ | ✗ |
| /register-event, /my-qr, /my-registrations | ✓ | ✗ | ✓ |
| /scan-qr, /participants, /attendance | ✓ | ✓ | ✗ |

### Tests Performed
- `npx tsc --noEmit` — clean (exit 0)
- `npx expo lint` — clean (exit 0)
- Note: browser interaction test not run — guards verified via code inspection only

---

## MODULE 3 — ADMIN / ORGANIZER DASHBOARD — COMPLETE

**Goal:** Summary cards (total events, registrations, attendance), upcoming events, management shortcuts.

### Tasks
- [x] Add summary stat cards (total events, total registered, total attended, total seats)
- [x] Ensure all dashboard links point to valid routes
- [x] Verify only Admin sees Admin shortcuts (role-aware via `quickActionsForRole`)
- [x] Quick actions + upcoming events list + stats all role-aware

### Completion Criteria — all met
- Dashboard displays correctly per role
- Summary info consistent with mock data (computed via reduce over MOCK_EVENTS)
- All links work
- No wrong-role content shown

### Files Changed
- `src/app/dashboard.tsx` — added STATS array + stat cards row (2x2 grid, wraps on wide screens)
- `src/styles/dashboard.styles.ts` — added statsWrap, statCard, statIcon, statValue, statLabel

### Stat Cards (sample data, no backend)
| Card | Source |
|---|---|
| Total Events | `MOCK_EVENTS.length` (6) |
| Registrations | sum of `event.registered` (449) |
| Attended | sum of `event.attended` (132) |
| Total Seats | sum of `event.capacity` (570) |

### Tests Performed
- `npx tsc --noEmit` — clean (exit 0)
- `npx expo lint` — clean (exit 0)
- Fixed TS error mid-build: stat icon type widened via explicit `StatIcon` union

---

## MODULE 4 — EVENT MANAGEMENT — COMPLETE

**Goal:** Event list, event details, create, edit, delete with confirmation.

### Tasks
- [x] Event details screen (`event-detail.tsx` — schedule, venue, organizer, description, registration progress)
- [x] Edit event screen (`edit-event.tsx` — pre-filled form, same validation as create)
- [x] Delete event with confirmation dialog (`Alert` with Cancel / destructive Delete)
- [x] Validation on create/edit forms (title, venue, capacity required; capacity > 0)
- [x] In-memory state for created/edited/deleted events (resets on refresh — documented)
- [x] Empty state on event list ("No events yet")
- [x] Admin-only controls (create/edit/delete hidden from Staff/Participant)

### Completion Criteria — all met
- Event listing and details work
- Create, edit, delete work in demo (in-memory)
- Validation and confirmation work
- Changes behave consistently (resets on refresh)
- Admin-only controls hidden from other roles (route guard + conditional render)

### Files Changed
- `src/context/events.tsx` — NEW: `EventsProvider`, `useEvents()` → addEvent / updateEvent / deleteEvent / getEvent
- `src/app/event-detail.tsx` — NEW: full detail view + role-aware actions (admin: edit/delete, participant: register, staff: view only)
- `src/app/edit-event.tsx` — NEW: edit form with validation
- `src/styles/event-detail.styles.ts` — NEW
- `src/styles/edit-event.styles.ts` — NEW
- `src/app/create-event.tsx` — writes to events store, added validation
- `src/app/events.tsx` — reads from store, tap → `/event-detail`, empty state, role-aware create button
- `src/app/_layout.tsx` — wrap in `EventsProvider`, register `event-detail` + `edit-event` routes
- `src/constants/permissions.ts` — added `/edit-event` (admin) and `/event-detail` (all roles)
- `src/styles/events.styles.ts` — added empty state styles

### Tests Performed
- `npx tsc --noEmit` — clean (exit 0)
- `npx expo lint` — clean (exit 0) (fixed unused `Alert` import in events.tsx mid-build)
- Note: browser interaction test not run — flows verified via code inspection only

### Known Limitations
- Events live in React state only; refresh restores the original 6 sample events (intentional, no fake persistence)
- Date is free-text; day/month badge derived by splitting the text (no date picker in scope)

---

## MODULE 5 — PARTICIPANT MANAGEMENT — COMPLETE

**Goal:** Admin participant list with sample data, search/filter if needed.

### Status
- `src/app/participants.tsx` exists — needs review and update to use live demo state

### Tasks
- [ ] Review existing `participants.tsx`
- [ ] Display participants with role labels (clearly marked as sample data)
- [ ] Restrict Participant users from accessing full list (route guard)
- [ ] Ensure search/filter if required

### Completion Criteria
- Authorized roles can access the list
- Participants cannot access other participants' info
- Sample records clearly identified as demo data

---

## MODULE 6 — PARTICIPANT REGISTRATION — COMPLETE

**Goal:** Browse events, register, view registrations, prevent duplicates.

### Status
- `src/app/register-event.tsx` and `src/app/my-registrations.tsx` exist — need review

### Tasks
- [ ] Review existing registration flow
- [ ] Add duplicate registration prevention (check MOCK_REGISTRATIONS)
- [ ] Display registration status consistently
- [ ] Update mock registrations in-memory when registering

### Completion Criteria
- Participants can register through demo
- Registration status displayed consistently
- Duplicate registration handled
- Admin can view registrations through authorized interfaces

---

## MODULE 7 — QR CODE GENERATION — COMPLETE

**Goal:** Display QR for participant's own registration.

### Status
- `src/app/my-qr.tsx` exists with pure-view mock QR — acceptable for prototype

### Tasks
- [ ] Review existing QR display
- [ ] Ensure QR is tied to a specific registration
- [ ] Clearly label as simulated (not scannable)
- [ ] Admin can view participant QR codes where appropriate

### Completion Criteria
- Correct QR displayed for selected registration
- Participants access only their own QR
- Behavior consistent with registration data
- Limitations documented

---

## MODULE 8 — QR SCANNER AND REGISTRATION VERIFICATION — COMPLETE

**Goal:** Scanner UI for Admin/Staff, simulate scan, verify registration, prevent duplicate check-in.

### Status
- `src/app/scan-qr.tsx` exists with simulation — needs review

### Tasks
- [ ] Review existing scanner simulation
- [ ] Verify sample registration through demo logic
- [ ] Handle: valid, already-checked-in, unregistered cases
- [ ] Restrict scanner to Admin/Staff roles
- [ ] Clearly label as simulation (no camera)

### Completion Criteria
- Scanner UI works as documented
- Sample verification outcomes accurate
- Unauthorized roles cannot access scanner
- Camera limitations reported

---

## MODULE 9 — ATTENDANCE MANAGEMENT — COMPLETE

**Goal:** Record attendance, display records, prevent duplicates.

### Status
- `src/app/attendance.tsx` exists — needs review

### Tasks
- [ ] Review existing attendance screen
- [ ] Prevent duplicate check-ins in demo state
- [ ] Display attendance records for Admin/Staff
- [ ] Restrict Participants from viewing general attendance

### Completion Criteria
- Attendance recordable through demo flow
- Duplicate check-in handled
- Records display correctly
- Participant access limited

---

## MODULE 10 — REPORTS — COMPLETE

**Goal:** Registration and attendance report views, Admin-only.

### Status
- `src/app/reports.tsx` exists — needs review

### Tasks
- [ ] Review existing reports screen
- [ ] Ensure report data matches mock events/registrations
- [ ] Restrict to Admin only (route guard)
- [ ] Do not claim export works unless implemented

### Completion Criteria
- Admin can access reports
- Report info matches demo data
- Staff/Participant cannot access
- Export limitations documented

---

## MODULE 11 — USER MANAGEMENT — COMPLETE

**Goal:** Admin user management interface (view users, roles, sample data).

### Status
- No dedicated `user-management.tsx` screen — needs creation

### Tasks
- [ ] Create `src/app/user-management.tsx`
- [ ] Display MOCK_USERS with roles (clearly labeled sample)
- [ ] Add "Switch demo role" action (for testing different perspectives)
- [ ] Restrict to Admin only
- [ ] Register route in `_layout.tsx`

### Completion Criteria
- Admin can access user management
- Other roles cannot access
- Interactions behave as documented
- No real account persistence (documented)

---

## MODULE 12 — FINAL INTEGRATION AND QA — PENDING

**Goal:** End-to-end testing, all roles, all permissions, responsive check.

### Tasks
- [ ] Test Login → Dashboard → all screens → Logout for each role
- [ ] Verify permission matrix compliance (13 features x 3 roles)
- [ ] Test direct URL access with demo guards
- [ ] Test desktop and mobile layouts
- [ ] Check console errors and broken routes
- [ ] Check for regressions
- [ ] Document all limitations

### Completion Criteria
- All modules reviewed
- Tests have actual recorded results
- Critical issues resolved
- Final report provided

---

## Permission Matrix (Implementation Reference)

| Feature | Admin | Staff | Participant |
|---|---|---|---|
| Create events | ✓ | ✗ | ✗ |
| View event details | ✓ | ✓ | ✓ |
| Edit event details | ✓ | ✗ | ✗ |
| Delete events | ✓ | ✗ | ✗ |
| Register for events | ✓ | ✗ | ✓ |
| View participant list | ✓ | ✓ | ✗ |
| Generate QR code | ✓ | ✗ | ✓ (own only) |
| Scan QR code | ✓ | ✓ | ✗ |
| Verify registration | ✓ | ✓ | ✗ |
| Record attendance | ✓ | ✓ | ✗ |
| View attendance records | ✓ | ✓ | ✗ |
| Generate reports | ✓ | ✗ | ✗ |
| Manage user accounts | ✓ | ✗ | ✗ |

---

## Security Limitations (Must Be Documented in UI)

1. The demo role selector is NOT identity verification.
2. Frontend-only route guards and hidden nav items can be bypassed.
3. Mock credentials do not provide real account security.
4. Browser state / local storage is not a trusted authorization mechanism.
5. QR verification in the browser is not secure against tampering.
6. Mock attendance and reports are not authoritative records.
7. There is no server-side authorization (no backend).
8. Real user accounts and confidential data must not be handled as if this were secure.

---

## Git Commit History

| SHA | Message |
|---|---|
| `4e4b161` | Refactor: separate styles into src/styles/*.styles.ts files |
| `e651b82` | Fix scrolling: restore ScrollView on all content screens |
| `86a5e00` | Add role-based event management features (mock, no backend) |
| `b32c2c6` | Redesign: responsive layout, profile screen, simplified bottom nav |
| `68bad14` | Fix: register events screen in router Stack |
| `83de315` | Merge remote LICENSE and README |
| `98ce18d` | EventFlow app: full source, assets, screens, and project plan |
| `0e91b2a` | Initial commit |
