# Simple appointment production rollout — 2026-10-26

- Patient: /booking/; popup launcher on Korean public pages.
- Staff: /admin/bookings/; existing clinic_admins membership required.
- No AI or SMS calls. A request is confirmed only after staff phone contact.
- Supabase project: twgxohkkovkefzoyslov, primary region ap-northeast-2 (Seoul).
- Applied SQL: 202610260003_simple_appointments.sql and 20261026115555_appointment_retention.sql.
- Verified live transaction: anonymous submission, capability-based edit, staff-only RLS reads, staff confirmation, edit rejection after confirmation. All synthetic data rolled back.
- Public REST checks: anonymous table read rejected (401), invalid/without-consent submission rejected (400).
- Daily cron simple-appointments-retention at 18:00 UTC (03:00 KST) calls purge_old_appointments; deletes only this feature's rows after 90 days from latest preferred/confirmed/updated timestamp. Events cascade.
- Advisor warnings for intentionally callable SECURITY DEFINER RPCs are reviewed: input checks, fixed search_path, explicit grants, hashed edit capability, staff membership and optimistic concurrency. Existing unrelated leaked-password protection warning is unchanged.
- Patient capability/receipt stays in page memory; reload/navigation loses access. Subsequent changes require clinic telephone contact. No personal data stored in localStorage.
- No test messages or real patient requests were created.
- Operator should verify the existing admin login and check this inbox regularly; automatic staff notifications are not included.
