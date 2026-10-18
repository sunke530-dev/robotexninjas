# Homepage, Engineering Notebook, and Impact

The site remains buildless HTML/CSS/JavaScript, served by GitHub Pages. These pages retain the shared `styles.css`, `scripts.js`, navigation, logo, and footer.

## Homepage

- `ninjasstemfoundation.html`: animated pathways and a community feature using an existing Little Elm Library gallery photograph.
- `foundation-home.css`: scoped homepage presentation and responsive rules.
- `foundation-home.js`: pathway cards, motion controls, and redirects for previous homepage notebook anchors.
- `assets/community/little-elm-robotics-workshop.jpg`: the ninth image from the existing `LITTLEELM_PHOTOS` gallery array, copied unchanged with existing face coverings retained.

## Engineering Notebook

- `foundation-notebook.html`, `foundation-notebook.css`, and `foundation-notebook.js`: the dedicated three-story notebook, all 18 steps, image controls, and PTO modes. The script's `stories` object holds the narrative and `assets` maps its images.
- `foundation-programs.html` and `foundation-programs.css`: the compact visual preview inside Competitive Robotics (`#competitive-robotics`).
- `assets/notebook/`: selected diagrams, notes, and robot photos cropped from the team’s 2025–2026 and 2024–2025 engineering notebooks. Complete notebook decks are not uploaded.

Preserve these deep links on the notebook page and the redirects from the old homepage URLs: `#makers-notebook`, `#notebook-revolver`, `#notebook-pin-catcher`, and `#notebook-power-sharing`.

The pin-catcher trial result describes seven serious errors in 150 recorded intake trials, not a guaranteed success rate. The PTO before/after runs include hardware, code, and strategy changes; do not attribute the full improvement solely to the PTO. The six-motor intake experiment is explicitly rejected. The 20 × 20 to 20 × 18-hole chassis detail remains with the revolver story.

Motion respects the device’s reduced-motion preference. The visible pause control also stops decorative motion. Notebook selection is stored only in sessionStorage; no account, external application, or Codex runtime is needed.

## Impact

- `foundation-impact.html`: map introduction, event details, upcoming event, and all previous community stories.
- `foundation-impact-map.css` and `foundation-impact-map.js`: responsive map, projection data, native pin buttons, selection, pan, and zoom.
- `assets/impact-map/north-texas.svg`: static map fallback.

The three confirmed locations are Little Elm Public Library (100 W. Eldorado Pkwy), Collin County Chinese Fellowship Church (4500 McDermott Road, Plano), and the April 12, 2026 scrimmage (730 E Park Blvd, Plano). The two church events share a pin. The older unspecified library event, Magikids, and Feed the Hunger remain in the event record without speculative locations. The upcoming Haggard Library event is separate from past-event pins.

Preserve `#outreach` and `#community-impact`. Event records also have `#event-littleelm`, `#event-vbs`, `#event-scrimmage`, `#event-church`, and `#event-library` anchors.

Boundary source: NCTCOG City Limits (2020), https://maps.pape-dawson.com/server2/rest/services/PD_GIS_Webmap/PD_GIS_WebMap__DFW_External/MapServer/425. Data from the North Central Texas Council of Governments was used in the preparation of this product. Roads: © OpenStreetMap contributors, https://www.openstreetmap.org/copyright. Venue positions use U.S. Census address geocoding. These are address matches, not surveyed building coordinates.

Update event dates, stories, and venue records together when a new program is confirmed. Keep unknown locations unplaced and future events separate from completed events.

## Validation

Check the homepage, Programs, and notebook at 320, 390, 768, 1024, and 1440px widths. Exercise all three stories and 18 steps, image enlargement, PTO mode selection, motion preference, mobile navigation, story anchors, the Competitive Robotics entry point, old homepage anchor redirects, and touch scrolling. When changing Impact, also check map venue selection, grouped church events, pan, zoom, and reset. Check local asset and anchor links and browser console errors before publication.
