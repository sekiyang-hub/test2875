# Detailed treatment translations

Eight language editions cover the 22 existing Korean treatment guides: English, Chinese, Vietnamese, Mongolian, Nepali, Russian, Uzbek and Thai (176 detail pages).

Routes: `/guide/{language}/treatments/{slug}/`. Korean routes and clinic configuration are retained. The translation records follow the Korean definition, examination, steps, section topics and symptom lists, aftercare, and cautions. Wording is adapted for readability; it is not a certified or independently reviewed medical translation.

Each language’s treatment cards and related-treatment links remain in that language. The language selector preserves the current treatment. Shared implant and bridge diagrams accept translated accessible labels and captions; Korean defaults are retained. Original external reference URLs remain available and may be in English or Korean.

Each translated page has a localized H1, description, canonical URL, nine language alternates (including Korean), breadcrumbs and MedicalWebPage data. The sitemap includes all 176 pages. The article has an explicit language tag. The shared document shell retains Korean as its default language.

## Review required

The source Korean content and these translations require final clinical review. A native-language reviewer should also check terminology and naturalness, especially Mongolian, Nepali, Uzbek and Thai. Every page identifies this pending review, explains that it is general information, and asks visitors to confirm available treatment and language assistance with the clinic. No guarantee of results or interpreter availability is added.

Review VPT indications and possible later root canal treatment; flapless implant limitations; fixture/screw/abutment distinctions; preservation and irreversible tooth preparation; TMD conservative options and actual clinic scope; STM laboratory-versus-clinical evidence limitations; adverse effects and aftercare. Verify that translations preserve uncertainty and do not imply guaranteed suitability.

## Verification

Run `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `node docs/check-treatment-translations.mjs`. The translation check verifies 22 records per language, matching section/step/symptom-list counts, nonempty clinical fields, absence of Korean in translated articles, one H1, metadata, nine language alternatives, MedicalWebPage, sitemap entries, internal links and anchors. Visual checks should include mobile, tablet and desktop, with long Cyrillic headings and Devanagari/Thai text.

No new external images or libraries are added. Existing clinic name, doctor, address, telephone, hours and reservation settings are unchanged.

Local validation on 2026-10-01: lint, typecheck and production build passed (220 generated pages including framework pages). The 176-page translation check passed. The existing Korean export check passed for 22 treatment pages and 24 linked pages. Representative layouts at 390, 820 and 1280 pixels showed no horizontal overflow, including Russian headings, Nepali bridge graphics and Thai VPT text. Clinic configuration was compared with GitHub and matched.
