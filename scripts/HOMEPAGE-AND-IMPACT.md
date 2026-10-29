# Homepage, Engineering Notebook, and Impact

The site remains buildless HTML/CSS/JavaScript, served by GitHub Pages. These pages retain the shared `styles.css`, `scripts.js`, navigation, logo, and footer.

## Homepage

- `ninjasstemfoundation.html`: animated pathways and a community feature using an existing Little Elm Library gallery photograph.
- `foundation-home.css`: scoped homepage presentation and responsive rules.
- `foundation-home.js`: pathway cards, reduced-motion support, and redirects for previous homepage notebook anchors. The homepage has no on-page motion toggle.
- `assets/community/little-elm-robotics-workshop-blurred.webp`: homepage image, using the AI-edited preview approved by the user on October 22, 2026. Three smiley overlays were replaced with soft privacy patches; this is not a recovery of the obscured faces. The approved PNG was encoded as lossless WebP. The AI edit can change fine details beyond the patches.
- `assets/community/little-elm-robotics-workshop.jpg`: retained source copy of the ninth image from `LITTLEELM_PHOTOS`, with the original smiley overlays.

## Gallery privacy images

On October 22, 2026, the user requested the same AI-edited soft-blur treatment for gallery photos with smiley face overlays. The five affected Little Elm photos are 5, 6, 7, 9, and 10. Four new edits are stored as `assets/gallery/littleelm-{05,06,07,10}-privacy.webp`; photo 9 reuses the approved homepage image. Generated PNGs were encoded as quality-92 WebP for gallery loading. Privacy patches remain featureless; they do not recover the obscured faces, and generative edits may change fine details elsewhere.

`gallery.html` retains its photo order and counts. The remaining 23 photos are unchanged byte for byte in their embedded data URLs. Keep the privacy image references and descriptive alt text when maintaining the gallery; do not restore the smiley-covered copies into these five positions.

### Accessible galleries and team controls

`accessible-gallery.js` supplies the galleries on both `team.html` and `gallery.html`. They advance only on user input, support named previous/next and photo-selector buttons, arrow/Home/End keys and horizontal touch swipes, and hide inactive slides from assistive technology. The selected photo has `aria-current` and a visible, politely announced caption. A one-photo gallery hides navigation. Keep the descriptions in this shared script aligned with each page's photo-array order; do not add student identities to descriptions without permission.

`team-accessibility.css` provides shared focus indicators, adequate control targets, readable secondary text and reduced-motion support. `team-accessibility.js` manages the mobile navigation, Tech Spotlight, member-card disclosures, Show More controls and deep links into hidden articles. Disclosure state must keep `hidden` and `aria-expanded` synchronized; source links remain separate from disclosure buttons. The homepage motion preference is unchanged.

The flyer linked on Programs was updated on October 23, 2026 to mark Innovation Lab active while leaving STEM Academy in development. `foundation-flyer.html` is a reflowable text alternative arranged in panel reading order, including descriptions of the photograph and QR destinations. Update the PDF, two previews and HTML text together; preserve the print version's QR codes and omit printed web addresses as requested.

## Engineering Notebook

- `foundation-notebook.html`, `foundation-notebook.css`, and `foundation-notebook.js`: the dedicated three-story notebook, all 18 steps, image controls, and PTO modes. The script's `stories` object holds the narrative and `assets` maps its images.
- `foundation-programs.html` and `foundation-programs.css`: the compact visual preview inside Competitive Robotics (`#competitive-robotics`).
- `assets/notebook/`: selected diagrams, notes, and robot photos cropped from the team’s 2025–2026 and 2024–2025 engineering notebooks. Complete notebook decks are not uploaded.

Preserve these deep links on the notebook page and the redirects from the old homepage URLs: `#makers-notebook`, `#notebook-revolver`, `#notebook-pin-catcher`, and `#notebook-power-sharing`.

The pin-catcher trial result describes seven serious errors in 150 recorded intake trials, not a guaranteed success rate. The PTO before/after runs include hardware, code, and strategy changes; do not attribute the full improvement solely to the PTO. The six-motor intake experiment is explicitly rejected. The 20 × 20 to 20 × 18-hole chassis detail remains with the revolver story.

Motion respects the device’s reduced-motion preference. The Engineering Notebook's visible pause control also stops its decorative motion. Notebook selection is stored only in sessionStorage; no account, external application, or Codex runtime is needed.

## Impact

- `foundation-impact.html`: map introduction, scheduled event cards and their past-event templates, and all previous community stories.
- `foundation-impact-events.js`: automatic calendar-date transitions using `America/Chicago`, independent of the visitor's timezone. No scheduled GitHub job or server is required.
- `foundation-impact-map.css` and `foundation-impact-map.js`: responsive map, projection data, native pin buttons, selection, pan, and zoom.
- `assets/impact-map/north-texas.svg`: static map fallback.

The existing locations are Little Elm Public Library (100 W. Eldorado Pkwy), Collin County Chinese Fellowship Church (4500 McDermott Road, Plano), and the April 12, 2026 scrimmage (730 E Park Blvd, Plano). The two church events share a pin. The older unspecified library event, Magikids, and Feed the Hunger remain in the event record without speculative locations.

Davis Library (7501 Independence Parkway) and Haggard Library (2501 Coit Road) become past-event pins only after their event dates. Addresses come from the library listings (https://plano.libnet.info/event/16729411 and https://plano.libnet.info/event/16823536); coordinates were matched by the U.S. Census `Public_AR_Current` address geocoder on October 22, 2026. These are street address matches, not surveyed building locations.

Preserve `#outreach` and `#community-impact`. Event records also have `#event-littleelm`, `#event-vbs`, `#event-scrimmage`, `#event-church`, and `#event-library` anchors.

Boundary source: NCTCOG City Limits (2020), https://maps.pape-dawson.com/server2/rest/services/PD_GIS_Webmap/PD_GIS_WebMap__DFW_External/MapServer/425. Data from the North Central Texas Council of Governments was used in the preparation of this product. Roads: © OpenStreetMap contributors, https://www.openstreetmap.org/copyright. Venue positions use U.S. Census address geocoding. These are address matches, not surveyed building coordinates.

### Automatic event dates

A scheduled card marked `data-impact-event` moves into `#date-based-past-events` the day after its final event date in Central time. The map gains the same venue and links to its event record. The page checks on load, every minute while open, and when returning from the background. Events occurring today remain upcoming; device timezone does not change this rule. The visitor's device clock supplies the current instant. This enhancement requires JavaScript, as does the interactive map; static HTML remains a readable fallback.

For a new scheduled event, copy one of the existing cards and supply:

- A unique card ID, `data-event-date="YYYY-MM-DD"`, and a readable `data-date-label`. For multi-day events, add `data-event-end-date` with the final date.
- Verified `data-venue-id`, name, short label, address, and longitude/latitude in `data-coordinates`. Reuse a venue ID for repeated visits. Omit unverified venue details; an archived card can still appear without a speculative map pin.
- An accurate `data-map-summary` and a `template[data-past-event]` containing the usual `impact-event-card` fields. The script preserves the scheduled card's ID on its archived version.

Passing a date does not verify attendance, completion, or outcomes. Until an event report is supplied, keep the explicit report-pending text in both the template and map summary. Automatically archived events default to `Recap pending` on their map pins, location buttons and event details. A location with earlier recorded visits and a pending visit retains both records and says `Includes a pending recap`. Only after verified event details are supplied, update the template and map summary and add `data-report-status="recorded"` to the scheduled card. Do not set that attribute merely because a date has passed. Add photo links only for published photographs. Cancelled events should have `data-event-status="cancelled"` and visibly updated cancellation text (or be removed from the schedule). They are never automatically mapped as past events. Invalid or unknown dates do not transition automatically.

Shared posters use `data-event-poster-for` with space-separated event IDs. They remain above upcoming events until every referenced event has passed, then move to `#past-event-posters`, once, above the archived event cards. The upcoming section shows an empty-state message when no events remain. Add future event IDs to the poster attribute only when the poster actually covers them.

Use local test fixtures to simulate dates; there is intentionally no public URL parameter for overriding the date. Run `node scripts/test-impact-events.cjs` to test Central-midnight boundaries, daylight saving changes, multi-day events, invalid dates, cancellations, and venue grouping. Also verify date transitions in the browser with the real page and map, ensuring no duplicate cards or pins and working event anchors. Remove temporary date fixtures before publishing.

## Validation

Check the homepage, Programs, and notebook at 320, 390, 768, 1024, and 1440px widths. Exercise all three stories and 18 steps, image enlargement, PTO mode selection, motion preference, mobile navigation, story anchors, the Competitive Robotics entry point, old homepage anchor redirects, and touch scrolling. When changing Impact, also check map venue selection, grouped church events, pan, zoom, and reset. Check local asset and anchor links and browser console errors before publication.
