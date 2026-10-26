# Appointment inbox notifications

- /admin/bookings/ checks for changes every 5 seconds while signed in; focus, returning online, and tab visibility trigger an immediate check. Browser background throttling/sleep can delay checks. Closing the screen stops checks.
- No new runtime dependencies, third-party messaging, or personal data in OS notifications.
- One chime for each fetched batch containing new, unread patient revisions. Repeated polls, staff processing and acknowledgements do not ring again. Audio starts only after a user presses the sound-enable button; sound test/off controls are provided.
- Unread and patient revision state is shared in Postgres. Acknowledgement does not confirm a reservation or alter optimistic-lock timestamps. Stale acknowledgements cannot hide a newer patient edit. Staff processing also marks the handled revision read.
- List is ordered unread first, then newest, with a 300-row limit explicitly stated in UI. Count describes the loaded list.
- Staff auth/refresh tokens stay in page memory; token refresh maintains the session while open. Logout clears the view. Network failures retain the last successful list, show a retry state and recover automatically. Authentication failure clears patient data and requests login.
- Authorization/revision/concurrency: 15 local PGlite and notification-detection checks passed. Existing 24 database checks run separately. Local test harness stays in the development workspace; no production test dependency added.
- Live integration test: docs/verify-live-inbox.sql, executed via authenticated Supabase CLI; synthetic insert/edit/ack/confirmation is rolled back.
- Existing anonymous table access restrictions retained. acknowledge_appointment is granted only to authenticated and checks clinic_admins membership internally.
- The staff confirmation form submits the version captured when it opened, so automatic refresh cannot silently confirm a patient's later changed request.

## Unread reminder cadence
- Default: 3 minutes. Staff may select 1, 3, 5 minutes, or repeat off for the current page. Sound still requires explicit activation after login.
- Reminders are evaluated on successful inbox refreshes using the current server unread flags; connection errors cannot sound stale unread reminders.
- A batch of unread requests produces one chime. New patient revisions take priority over a due reminder and restart the interval. Reconnection does not replay missed intervals.
- All read / sound off / logout stops repeats. Repeat off retains immediate incoming alerts. Sound testing, enabling sound and cadence changes start a fresh interval.
- Node 24+ tests: node --test docs/test-appointment-reminders.mjs (10 timing, mute, acknowledgement and deduplication scenarios).
