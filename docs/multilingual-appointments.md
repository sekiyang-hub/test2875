# Multilingual appointment requests

- Added English, Chinese, Vietnamese, Mongolian, Nepali, Russian, Uzbek and Thai appointment routes at /guide/{language}/booking/.
- Guide home navigation, booking links, footer and floating launcher use the selected language, including treatment pages. Booking-page language switching retains the booking destination.
- Shared translated form covers labels, prompts, validation, consent, receipt, patient edits and cancellation-by-phone guidance. Native date/time controls depend on the user's browser; the form explicitly labels KST (UTC+9). International +country-code and Korean phone formats are accepted.
- No translation API, AI call or new runtime dependency. The form does not promise phone or clinical services in the selected language.
- Consent summary is translated. It includes collected language, Seoul storage, possible overseas service/support processing, retention and refusal/rights guidance. Full Korean privacy policy opens in a new tab to preserve the in-memory receipt/edit capability.
- request_language is recorded and visible in staff inbox. New localized RPC wrappers validate supported codes and delegate to the existing rate-limited, consent-checked, capability-protected request functions. Existing endpoints remain compatible with open Korean pages. Public table reads/writes remain restricted.
- Existing confirmation, acknowledgement and reminder behavior is reused. Patient names, phone, clinic hours/address, reservation provider URLs and staff accounts were not changed.
- Canonical, hreflang, WebPage JSON-LD and sitemap entries cover the new routes.
- Text/route/error tests: node --test docs/test-booking-languages.mjs (18 cases). Local DB test harness: 22 submit/edit/language/RLS checks. Live transaction integration: docs/verify-live-multilingual.sql, rolled back without storing synthetic records.
- Advisor warnings for intentionally public SECURITY DEFINER wrappers were reviewed: fixed search_path, explicit execute grants, supported-language validation and delegated authorization/capability checks. Existing unrelated password-protection warning remains unchanged.

- Production export: 230 pages. Exported HTML checks: 128 guide/booking/treatment launcher, cross-language link, schema and sitemap checks passed.
- Localized wrappers record consent_version=simple-2026-10-27-multilingual; old Korean endpoints keep their existing consent version.

