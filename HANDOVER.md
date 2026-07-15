# 5M Signcom site — handover

**Session ended:** 2026-07-15 (rounds 9–10).

Project: `C:\Users\drax1\Downloads\5M\site\` — static multi-page HTML/CSS/vanilla-JS
site for 5M Signcom Sdn Bhd (Shah Alam signage manufacturer). No build step, no
framework. i18n via `assets/js/site.js` (`I18N` dict, `data-i18n` attrs, en/ms/zh).
Git repo: branch `staging` tracks `origin/staging` (GitHub `Chhhh619/5M-Signcom`),
deploys to a Vercel branch-preview URL (`*-git-staging-*.vercel.app`, gated behind
Vercel's own SSO — cannot be fetched/verified by an agent without logging in).

Dev server: `python -m http.server <port>` from `C:\Users\drax1\Downloads\5M\site`
(background task, dies when its terminal/session closes — restart each session; port
varies by session, 8137 was last used, not reserved). Then `http://localhost:<port>/`.
For visual verification without the claude-in-chrome extension, `playwright-core` is
installed in the scratchpad dir and can drive real system Chrome headless
(`executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`,
`args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']` for
software WebGL — needed to screenshot the 3D viewer). **Use `waitUntil:'domcontentloaded'`
+ explicit `waitForTimeout`, not `'networkidle'`** — contact.html's Google Maps iframe
polls forever and networkidle hangs indefinitely.

## Cache-busting — READ THIS FIRST
Every `<link rel="stylesheet">` and `<script src=...>` tag across all 5 HTML pages
carries `?v=20260716b` (current as of session end; run the pending version bump below
if you change assets). **Any time you edit `site.css`, `site.js`, `viewer3d.js`,
`gallery.js`, or `gallery-data.js`, bump this version string in all 5 HTML files and
keep CSS/JS in sync.** Check current value with `grep -ho 'v=2026[0-9a-z]*' site/*.html`.

## Copy tone — READ BEFORE WRITING ANY COPY
No punchy marketing one-liners / slogan headings (user: "super cringe"). Natural,
friendly, down-to-earth sentences; audience 25+. Exception: the company's own
tagline "ANYTHING YOU CAN IMAGINE, WE CAN DO IT." (kept, in quotes, about page).
Applies to all three languages. (Also in auto-memory as `no-punchy-taglines`.)

## Done this session (2026-07-13)
1. **About page tagline moved** — "ANYTHING YOU CAN IMAGINE…" now in the right
   column of the Who-we-are prose grid (last paragraph before the factory photo on
   mobile via DOM order), wrapped in curly quotes, all 3 langs.
2. **New "Sheet A.3 / Installation" section (about page)** — heading "Installation
   is part of the job" + 2 paragraphs; photo collage (`.install-grid` /
   `.install-photos` CSS): tall crop of boom-lift pylon install
   (proj-pylon-cergas), LED site-wiring (outdoor-04), concrete base casting
   (installation-pylon), each with a black mono caption tag. Section is
   `section-alt`; the "Why clients choose us" section below it switched to plain
   to keep background alternation. i18n keys `ab_inst_*` in en/ms/zh.
3. **Home "View the full gallery →" button** — now `btn-red`.
4. **Services 3D viewer = actual 5M logo** — traced the red "5M" mark from
   `logo.png` via a Python pixel-boundary-walk + RDP script (scratchpad
   `trace_logo.py`), embedded as `LOGO` polygon array in `viewer3d.js`, extruded
   with `THREE.ExtrudeGeometry` (front face = orange faceMat glows on "LED on";
   sides = red). **Wireframe button removed** (HTML + JS + i18n `v_ctl_wire`
   deleted). Viewer header/aria/fallback text updated to say "5M logo".
5. **Gallery page reorganised BY BRAND** (user's plan: gallery = brands, services
   = sign types). Filter bar + `proj-empty` removed. Now exactly **9 brand cards**:
   Parkson, Thong Bowl · Thong Cha, Niko Neko Matcha, MUJI, Village Grocer,
   Vivace Dance Academy, San Francisco Coffee, RHB Centre, Kenny Hills Bakers.
   (User explicitly removed the other 16 single-photo brand cards.)
6. **Brand-logo thumbnails** — gallery cards use real brand logos on uniform
   1200×900 white canvases at consistent scale: `assets/img/gallery/thumbs/*.png`,
   composed by scratchpad `make_thumbs.py` from downloaded logos (Wikimedia for
   MUJI/RHB, brand sites for Parkson/Village Grocer/Kenny Hills/SF Coffee,
   Facebook graph avatars for Niko Neko/Vivace/SF Coffee, and the official
   Thong Bowl logo from a URL the user supplied:
   http://thongbowl.com/assets/logo-Bay2PJCG.png).
7. **Services page photos are clickable type-galleries** — each `.svc-photo` is a
   `.proj-item[data-cat]` opening the lightbox slider with ALL photos of that
   sign type (incl. brand-folder shots); "● N PHOTOS" badge (`.svc-count` CSS,
   count auto-synced from data by `gallery.js`). `gallery-data.js` +
   `gallery.js` now loaded on services.html too.
8. **`gallery.js` generalised** — wires `document.querySelectorAll(".proj-item[data-cat]")`
   (no longer requires `.proj-grid`), fills `.gl-count` badges, lightbox caption
   falls back to the service card `h3` when there is no `.sheet-block b`.
9. **`gallery-data.js` rebuilt** — brand keys (9) + type keys (10) in one
   `window.GALLERY`. Removed refs to files the user deleted (lightbox.jpg,
   lightbox2/4.jpg, cutout4.jpg). Per user: `signboard-05.jpg` (NKC Used Car)
   removed from "outdoor"; `parkson5/6.jpg` removed from "lightbox" type set
   (still in the parkson brand set).

## Standing instruction from user
Update this handover doc when session usage reaches ~85%, every session.

## Round 10 (cache ?v=20260716b) — 2026-07-15 — D'Laman Rasa removed, gallery CTA, Design-MCP process flow
NOT yet committed at time of writing (client had not asked). Client-supplied files
also uncommitted: `parkson-01.jpg` (modified), `parkson-07.jpeg`→`parkson-07.png`
(swapped), `MIDHILLS/midhills-logo.png` (new — see logo note below).

1. **D'Laman Rasa removed as a brand, photos re-homed.** Client: it's a DBKL public
   hawker centre, not a brand worth showing as a client. Gone from the gallery grid
   and the trusted-by marquee (all 6 marquee copies). Its 3 photos moved into the
   **`3dled`** (Neon / LED signs) type set, so they still show under that service —
   count 6→9, services.html `.gl-count` fallback updated to match. Brand key deleted
   from `gallery-data.js`. Orphaned `logos/brands/dlamanrasa.png` +
   `gallery/thumbs/dlamanrasa.png` were `git rm`'d (zero refs; recoverable from git).
   The 3 JPEGs in `gallery/D Laman Rasa/` MUST stay — they're referenced by 3dled now.
2. **"All projects" tile → CTA button.** The dark 63-count tile is gone; there's now a
   red `See all our projects →` button in the section header row (`.sec-tag-cta`
   modifier + `.gl-all-btn`), matching the home page's "See all our services →". It's
   a real `<button class="proj-item" data-cat="…11 keys…">`. Total is now **60** photos
   (63 − 3 D'Laman Rasa).
   - **Two gallery.js changes this needed** (both matter if more buttons get added):
     (a) a native `<button>` already fires click on Enter/Space, so wiring the
     fake-button `keydown` handler onto it double-fired `activate()` — gallery.js now
     skips role/tabindex/keydown when `card.tagName === "BUTTON"`.
     (b) the lightbox caption fell back to the raw `data-cat` string (would have shown
     the whole comma list); gallery.js now reads an optional `data-label` first. That
     label stays translated via the site's existing `data-i18n-attr="data-label:gl_all"`
     machinery — a neat trick worth reusing: `data-i18n-attr` can set ANY attribute
     from a dict key, not just aria-label.
   - i18n: `gl_all_sub` deleted (tile-only), `gl_all_cta` re-worded to the button text,
     `gl_all` still the lightbox caption.
3. **Process flow section rebuilt from a Claude Design component.** Client shared
   `Process Flow.dc.html` from design project `d6538c74-ed82-48d6-85e4-fa2ff3c36410`,
   pulled via the **DesignSync MCP** (`method:"get_file"`; `list_files` first to see
   the tree — that project also holds a `Hero Section.dc.html` not yet used).
   **The design could not be dropped in as-is** — it assumed things this site forbids:
   Google Fonts `<link>` (CSP `font-src 'self'` + `style-src 'self'`), an inline
   `<script>` with a `DCLogic` class + props system (CSP `script-src 'self'`), and its
   own palette. Adaptation: kept the *geometry maths verbatim* (bowed cubic connectors,
   arrowhead placed at each curve's midpoint via `getPointAtLength`, ring+dot bookends,
   26px stubs, `singleCol` detection at `|rects[0].x - rects[1].x| < 8`), and moved it
   into **`assets/js/flow.js`** (previously an unused WIP file, now rewritten and
   ACTUALLY LOADED in index.html for the first time). Type/colour now come from
   site.css tokens (`--red`), fonts stay Barlow/Barlow Condensed.
   - Markup: `#process .flow` is now a 2-col CSS grid with 4 `<article class="flow-step">`
     zigzagging (`:nth-of-type(1..4)` → col1/row1, col2/row2, col1/row3, col2/row4) plus
     one `<svg class="flow-thread">` overlay. **`:nth-of-type` is deliberate** — it counts
     articles only, so the sibling `<svg>` doesn't shift the numbering the way
     `:nth-child` would. Mobile (≤640) forces all cards to col1 and flow.js's
     `singleCol` branch draws an S-curve thread instead.
   - All the old `.flow-arrow` / `.flow-arrow-m` / `.flow-rev` / `.fa-line` / `.fa-tip`
     inline SVGs + CSS from rounds 5–6 are DELETED — superseded by the JS thread.
   - Verified: 8 paths + 4 circles rendered, desktop + 390px mobile, 0 console errors.
4. **Gallery THUMBNAILS were still crops — round 9 only fixed the marquee.** Easy trap:
   the brand logos live in TWO places, `logos/brands/*.png` (marquee, ~38px tall) and
   `gallery/thumbs/*.png` (gallery cards, 1200×900 white canvas). Round 9 replaced only
   the former, so the gallery still showed photo-crops. Regenerated ideas/8days/
   grandflexible thumbs from the real logos (scratchpad script: flatten→trim
   whitespace→fit into a 760×420 inner box→centre on 1200×900 white). **Update both
   places whenever a brand logo changes.**
5. **Midhills RESOLVED — there are now ZERO screenshot-crop logos left.** All 11 brands
   show real, clean marks in both the marquee and the gallery. History worth keeping:
   web sourcing was a dead end (`lbs.com.my/property/midhills/` hard-404s — the URL in
   search results is stale and only carries LBS *corporate* logos; `midhillsgenting.com`
   has a text-only header; the FB avatar `graph.facebook.com/midhills.my/picture?width=800`
   is a building photo, though it usefully confirmed the identity as a green serif
   wordmark). The client's FIRST `midhills-logo.png` was an artistic shallow-DOF photo
   of the physical letters — unusable, only **5.8% of pixels darker than 200**, an
   illegible smudge at 38px. They then supplied a **clean green serif wordmark** (same
   filename, 3.7 MB) which measures **22.5%** — that's the one now in use. Generated
   from it: `logos/brands/midhills.png` (281×96, white→alpha derived from luminance so
   the anti-aliased edges don't fringe) and `gallery/thumbs/midhills.png` (1200×900).
   **Contrast check is a cheap gate for any future logo drop:** flatten→trim→measure the
   share of pixels darker than 200; under ~10% means it won't read at marquee size.
6. **Image weight policy (new).** `parkson-07` arrived as a 7.7 MB PNG — a *photograph*
   in a lossless format with a fully-opaque alpha channel. Converted to
   **`parkson-07.webp`, 2160×1014, q82 = 227 KB (34× smaller, PSNR 39 dB, visually
   identical at 2× zoom)** and the manifest re-pointed. Client explicitly chose WebP
   @2160 over full-res after being shown the numbers. **Rules of thumb for this repo:**
   photos → WebP (~36% smaller than JPEG at equal quality; safe since Safari 14/2020,
   and CSP `img-src 'self'` is format-agnostic); PNG only for flat graphics/real
   transparency; the lightbox renders at **1080×507 CSS px**, so ~2160px wide is the
   sensible ceiling (covers 2× retina) — anything beyond that is bytes nobody sees.
   No gallery image now exceeds 1 MB; keep it that way.

## Round 9 (cache ?v=20260716a) — 2026-07-15 — logo colours, 3D fix, gallery-all, mobile lightbox
Committed as `98cc794` then `5dad8bb`, pushed to `origin/staging`. Two back-to-back
sessions covering the client's numbered feedback list; second session corrected two
things the first got wrong (see "reversed" note below) — **when in doubt about which
element a client screenshot is circling, ask for a marked-up screenshot before acting.**

1. **Client-logo marquee is now full colour** — removed `filter:grayscale(1)
   contrast(1.75) brightness(1.22); mix-blend-mode:multiply` from `.client-logo img`
   (site.css). Client explicitly wants brand colours (MUJI red, etc.), not monotone.
2. **3 of 5 remaining screenshot-crop logos replaced with real official marks**
   (downloaded with client's explicit per-file approval — filename/source/size stated
   first, per this environment's download-permission rule): Grand Flexible Bags
   (`grandflexiblebags.com`, green globe+GFB badge), Eight Days Salon
   (`eightdayssalon.com`, black ED monogram), IDEAS Hotel (`ideaskl.com` — filename
   said "White" but is actually gold-on-transparent, reads fine on white, no dark-chip
   treatment needed). **Still crops: Midhills** (LBS Bina's `lbs.com.my/property/
   midhills/` page 404s through the WebFetch tool despite existing per web search —
   worth a retry or manual fetch) and **D'Laman Rasa** (this is a DBKL-run public
   hawker centre / Pusat Penjaja, not a branded business — it has no corporate logo;
   the neon signage lettering photo is its only visual identity, may be unfixable).
3. **3D logo viewer (`viewer3d.js`) rebuilt to show the FULL logo**, not just "5M":
   extruded 5M mark (unchanged polygon data) + "SIGNCOM" as real `THREE.TextGeometry`
   (font: bundled `assets/fonts/helvetiker_bold.typeface.json`) + 5 coloured leaf
   ribbons, fanning from one shared pivot point. **Root-cause debugging note**: client
   reported "the 5 looks broken/shattered" — I first suspected the hand-traced "5"
   polygon self-intersects (it doesn't; verified with a segment-crossing check in
   scratchpad Python, zero self-intersections, valid simple CCW polygon). Actual cause:
   the leaf ribbons were positioned with a hardcoded guess (`LEAF_BASE={x:-1.72,...}`)
   that placed them spatially inside the "5" glyph's volume, so the two meshes
   z-fought/overlapped at render time — that's what read as "broken". Fixed by pixel-
   measuring the real `logo.png` (scratchpad `measure_logo.py`, `logo_grid.png` — a
   3×-upscaled gridded reference image, reusable if the logo composition changes
   again) to get the true pivot point and per-leaf angle/length, converted to Three.js
   `rotation.z` convention (`theta = atan2(dy,dx) - π/2`, since the blade shape is
   authored along local +Y). New pivot `{x:-0.15,y:-1.35}` sits cleanly in the gap
   between "5" and "M", no more overlap. SIGNCOM position/scale also corrected from
   the same pixel measurements (target width 2.24 units, not the old guessed 2.75).
4. **Contact form churned twice this round** — session A added Size + Quantity +
   Artwork + Sample picture + Installation location fields (client's original numbered
   list). Session B removed Size + Quantity per follow-up ("remove the quantity and
   size box"). **Current final state**: Name, Company, Phone, Type of signage,
   Artwork (file upload), Sample picture (file upload), Installation location (file
   upload), free-text message. Matching i18n keys (`f_size`/`f_qty`/hints) were fully
   deleted from all 3 language dicts, not just unused — don't resurrect them without
   re-adding the HTML fields too. Heading is "Get a **free** quotation" (free in
   `.hl-free`, 5M red) in all 3 languages.
5. **WhatsApp prefill message changed twice** — session A set a 5-point quotation
   checklist ("Thank you for contacting..."), session B replaced it per explicit
   client request with the short opener `"Hi, I am enquiring from 5msigncom.com.my"`.
   Applied via `site.js` querying every `a[href*="wa.me"]` and appending `?text=`
   (skips links that already have one) — don't hand-edit individual `wa.me` hrefs in
   HTML, they're all driven from `WA_MSG` in one place.
6. **Home service cards (4 grouped tiles) now open combined lightbox galleries** —
   `data-cat` can be a comma-joined list (e.g. `"signboard,3d,cutout"`); `gallery.js`'s
   `imagesFor()` aggregates + dedups across all listed keys. Same mechanism now powers
   item 7 below. `.gl-count` span auto-fills from the real aggregated count.
7. **Projects/gallery page: new "All projects" tile** (first card, dark bg, big red
   count number, "View all →") with `data-cat` listing all 12 brand keys — opens every
   project photo (63 total) in one lightbox via the same aggregation mechanism.
8. **Mobile lightbox nav — bigger tap targets + no more double-tap-zoom.** Client
   reported quick swiping through photos on mobile sometimes triggers the browser's
   native pinch-zoom (mis-tapping the small 46px arrow buttons registers as a
   double-tap). Fixed in the `≤700px` media query: prev/next buttons become full-
   height (`top:0;bottom:0`) zones spanning ~30% width on each side of the photo, plus
   `touch-action:manipulation` on `.lb-stage` and `.lb button` to disable the native
   double-tap-zoom gesture. **CSS specificity gotcha hit and fixed**: the base rule
   `.lb button{width:46px;height:46px;...}` has specificity (0,1,1) — a class + an
   element selector — which beats a same-media-query override written as
   `.lb-prev,.lb-next{...}` (specificity (0,1,0), class only), REGARDLESS of source
   order/media-query placement. Had to write it as `.lb .lb-prev,.lb .lb-next{...}`
   (0,2,0) to win. **Watch for this pattern anywhere else `.lb button` base rules get
   overridden** — any future override needs ≥2 classes of specificity.
9. **About page — REVERSED from what the first session shipped.** Client's original
   "remove the block underneath the company photo" was misread as the `.partner-row`
   welcome-partnerships paragraph; client's follow-up (with a circled screenshot)
   clarified they meant the `.sheet-block` caption bar (Location/Type/Our own
   facility) that sits directly flush under the factory photo. Current correct state:
   caption bar removed, partnership paragraph restored. If this gets touched again,
   the two elements are: `<figcaption class="sheet-block mono">` (now deleted) vs.
   `<div class="partner-row"><p class="partner-note" data-i18n="ab_p5">` (now present).
10. **Unrelated bug found + fixed**: `assets/img/hero-happyfeet.jpg` was tracked in
    git (real 28,754-byte JPEG from the very first commit `3da12d9`) but absent from
    the working directory on disk — a genuine 404 on the Services page's Signboard
    card, predating both sessions this round, cause unknown (not caused by any edit
    here; possibly a sync/cleanup issue outside git). Fixed with `git checkout HEAD --
    site/assets/img/hero-happyfeet.jpg` (safe: file had zero working-tree changes to
    lose, this only restores what git already had). If any other gallery image ever
    404s, check `git ls-files` + `git cat-file -s HEAD:<path>` before assuming it was
    never committed — it might just be missing from disk the same way.

**Next step / open items:** No pending client asks as of session end. The brand-logo
workstream that ran across rounds 9–10 is now **CLOSED** — all 11 brands have real
logos in both places. Two loose ends, neither blocking: (a) the client's
`MIDHILLS/midhills-logo.png` source file (3.7 MB) is deliberately left **untracked** —
it's only the source the marquee/thumb were generated from, nothing references it;
delete it or downsize+add it as a gallery photo if the client wants the artwork shown.
(b) The design project `d6538c74-ed82-48d6-85e4-fa2ff3c36410` also contains a
`Hero Section.dc.html` that has not been looked at — the client only asked for the
process flow.

## Round 7 (cache ?v=20260713n) — gallery re-cut to direct customers ONLY
User purged photos of retailer-collab/confidential jobs. Folder presence in
assets/img/gallery/ is now the source of truth for brand cards.
- **Removed everywhere**: Thong Bowl, Village Grocer, RHB, Kenny Hills
  (folders deleted by user; cards, data keys, marquee logos, thumbs all
  purged — grep for them returns 0).
- **New gallery order (12 cards)**: Parkson(7) → AICB(6) → Ideas Hotel(6) →
  Eight Days Salon(9) → Midhills, Genting(6) → Markas TUDM(4) → MUJI(4) →
  Niko Neko(6) → SFC(5, sfc-05 new) → Vivace(4) → D' Laman Rasa(3) →
  Grand Flexible Bags(3). Home cards = first 3; marquee = all 12 × 6 copies
  (duration 90s/65s). NOTE: several folders/files have SPACES in names
  ("8 DAYS/", "MARKAS TUDM1.jpeg") — works fine, keep paths quoted; ignore
  "8 DAYS/Thumbs.db". Renamed AICB2.jfif → AICB2.jpg (mime safety).
- **Thumbnails**: real logos for AICB (FB avatar) + TUDM (Wikimedia RMAF
  badge); photo-crops for Ideas/8 Days/Midhills/D'Laman Rasa/Grand Flexible
  (no public logos exist — small local brands). Generator: scratchpad
  make_thumbs2.py (also outputs marquee 96px versions).
- **Type sets rebuilt** after user's loose-file deletions (3d-05/06, baagus*,
  wisb, lightbox-04/05/06/09, cutout-05, acrylic-01/09 gone; 3dled-11,
  pylon-03..08 new). Counts now: signboard 7, 3dled 6, 3d 5, lightbox 7,
  cutout 10, acrylic 5, etching 7, waterjet 1, pylon 10, outdoor 8.
- **Install section tall photo** was lightbox-04 (GSC, deleted) → now
  aicb/AICB1.jpeg (boom-lift install at AICB facade).
- gallery.html meta description updated to new brand names. Full ref check:
  129 data refs + all HTML srcs, 0 missing. Verified in browser: gallery
  order/cards, Ideas slider (space paths OK), home marquee.
- Dev server: python http.server dies when its terminal closes — restart
  with `cd site && python -m http.server 8080`.

## Round 6 (cache ?v=20260713m) — process arrows redrawn, DESKTOP verified
- User supplied an Excalidraw mockup: bold red serpentine hand-drawn arrows
  connecting the 4 step cards corner-to-corner ("more natural, graphic
  design"). Replaced the stiff dotted arrows with bold SOLID red flowing
  curves + filled triangular arrowheads that hook down into each next card.
- Impl: each gap has 2 svgs — `.flow-arrow` (viewBox 0 0 300 108, desktop:
  sweeps right then hooks straight down) and `.flow-arrow-m` (0 0 120 112,
  mobile: vertical S ending straight down). rev flags across the 3 gaps =
  [False, True, False] (normal, mirrored, normal) via `.flow-rev{scaleX(-1)}`.
  CSS: `.fa-line{stroke:var(--red);stroke-width:3;stroke-linecap:round}`,
  `.fa-tip{fill:var(--red)}`. Removed old `.fa-dot` + `stroke-dasharray`.
- Desktop verified in browser at 1440px — looks exactly like the mockup.
  Mobile (`.flow-arrow-m`) NOT live-verified: resize_window can't drop the
  CSS viewport below the 640px breakpoint in this env (cards stay in desktop
  offset layout), same limitation noted in round 5. Geometry is sound; worth
  a real-phone glance.
- To tune arrow curve/hook later: edit the `d=` paths in the 3 `.flow-arrow`
  / `.flow-arrow-m` svg pairs in index.html (regen via a small py loop like
  the one used this round) — don't hand-edit all 6 individually.

## Round 5 (cache ?v=20260713m) — about tagline + install copy + arrows v1
## (files node-checked; superseded arrows now replaced in round 6)
- **About tagline as a sign plate** — `.tag-sign` (about.html right column):
  big Barlow Condensed display type on a white panel, 1px ink border, hard
  8px red offset shadow, rotated -1.5deg — the tagline literally set like a
  fabricated sign. Old `.lead-tag` CSS removed. Mobile sizes in ≤640 block.
- **Installation section softened** (user: never hardsell/forceful; some
  clients have their own installers): heading now "We handle installation
  too", p1 "We offer installation as part of the project…" (no more "we do
  NOT hand work to subcontractors"), ×3 langs. The 3 black photo caption
  tags (GSC / LED LETTERING / GROUNDWORK) removed from services.html and
  `sv_inst_c1..c3` deleted from all dicts.
- **Process arrows refined** — now drafting leaders: origin dot (steel),
  round-cap dotted curve (stroke-dasharray .1 8), filled red triangular tip.
  Each arrow slot has TWO svgs: `.flow-arrow` (wide, desktop) and
  `.flow-arrow-m` (tall S-curve, shown only ≤640 where the wide one hid) —
  the old single arrow squished badly on mobile.
- **User asked to "use skills / ready-made UI components e.g. shadcn"** —
  cannot literally: zero-build vanilla site + strict CSP (no CDN/npm).
  Standing approach: use the frontend-design skill for design work and
  hand-translate component patterns into site.css (as done for the language
  dropdown and these arrows). If the user pushes for an actual component
  library, that's a framework migration conversation (Next/Astro + Tailwind
  + shadcn), which contradicts the earlier "static = best decision" — raise
  trade-offs before doing anything.

## Round 4 (all verified, cache ?v=20260713k)
- **Waze link**: now `display:block` under Google Maps link (`.maplink` CSS),
  and no longer has `data-i18n` — stays in English always. Removed the
  now-dead `lbl_waze` dict entries (en/ms/zh) from site.js.
- **Same-background sections fixed on gallery.html and index.html.** Watch
  for this class of bug going forward: `.section` (paper) and `.section-alt`
  (white) must alternate for a visible seam — check the class on EVERY
  section on a page after adding/reordering/moving sections, don't just check
  the two you touched. gallery.html: gallery-grid section was plain, "why"
  section (added in round 2) was also plain → added `section-alt` to "why".
  index.html: after round-3's projects/process swap, both ended up
  `section-alt` (adjacent, invisible seam) while process+why (both plain)
  had the same issue on the other side → removed `section-alt` from #process
  (kept `section-grid` for its own blueprint texture, doesn't need alt) and
  added `section-alt` to #why. Current index.html order/bg: hero(grid) →
  clients(white) → services(paper) → projects(alt/white) →
  process(paper+grid) → why(alt/white) → cta(dark).

## Round 3 — home page overhaul + SEO (all verified, cache now ?v=20260713h)
- **Home projects section = 3 brand cards** (Parkson, Thong Bowl · Thong Cha,
  MUJI) using the gallery logo thumbs, clickable sliders (gallery-data.js +
  gallery.js now loaded on index.html too). Old 6 photo cards removed.
- **Process section expanded** ("drafting-sheet flow", frontend-design skill):
  staggered white step cards (red top edge, giant red Barlow Condensed numerals
  01-04) zigzagging down a blueprint-grid background (`.section-grid`),
  connected by dashed leader-line SVG arrows with red open arrowheads
  (`.flow*` CSS; old `.steps` CSS removed). Verified desktop + ~390px mobile.
- **Top-bar WhatsApp**: text "WhatsApp us" button on desktop, icon-only red
  button ≤700px (`.wa-icon`, inline SVG). NOTE the specificity trap that bit
  us: base rule must be `.btn.top-wa`, and the mobile hide must also be
  `.btn.top-wa{display:none}` — a bare `.top-wa` in the media query loses.
- **SEO pass**: JSON-LD LocalBusiness on index.html (name/SSM/address/phone/
  email/foundingDate — CSP does not block ld+json, it's a non-executing data
  block); og:site_name/type/title/description meta on all 5 pages;
  `site/robots.txt` (allow all). **Still pending: canonical URLs, sitemap.xml,
  og:image — all need the final live DOMAIN, which the user has not provided.
  Ask for the domain, then add those three.** Framework decision (static
  HTML/CSS/vanilla JS, no build) is deliberate: fastest loads, fully
  crawlable markup, trivial hosting — document as "best decision" rationale.
- Marquee note: monotone treatment makes light-coloured logos (Thong Bowl,
  Vivace) read fainter than dark ones; user hasn't complained but a darker
  filter tweak is a known option.

## Round 2 (all verified)
- **"Sheet X /" prefixes removed site-wide** from every section tag (HTML +
  36 dict values across en/ms/zh): tags now read "Services", "Installation",
  "The company", "At a glance", etc. (Note: 图纸 still appears 3× in zh body
  copy meaning "drawing" — those are correct, not tags.)
- **Installation section moved about.html → services.html** as "Installation"
  (i18n keys renamed ab_inst_* → sv_inst_*). Jump-to-service index strip
  removed from services. About "why" section restored to section-alt.
- **Install hero photo swapped** to the GSC scaffold shot — which is
  `gallery/lightbox-04.jpg` (matched the user's upload by image diff);
  caption "GSC · sign installation" ×3 langs.
- **Mobile WhatsApp icon button** — `.wa-icon` anchor (inline simple-icons
  WhatsApp SVG, red square) added to all 5 headers before `.lang`; shown only
  ≤700px with `margin-left:auto` (text .top-wa hidden there); glyph verified
  via a temp test page (deleted).
- **Why-item h3 headings now 5M red** (home + about).
- **Home client marquee = the 9 gallery brand logos, monotone** (existing
  grayscale/multiply CSS): clean trimmed logos in `assets/img/logos/brands/`
  (96px tall, from `make_thumbs.py` sources). Track rebuilt with **6 copies**
  (3 per loop-half) so the chain never shows a gap up to ~3300px viewports;
  animation slowed 36s→70s (50s mobile) to keep pace. Old `logos/*.png`
  crops + `.client-text` CSS are now unused (harmless, could clean later).
- **Descriptions rewritten as company copy** (no instructions to the reader):
  home projects_intro + gallery gl_lede now say 18 years / trusted clients /
  1,000+ projects end to end, ×3 langs. About stat 4 changed "1 Workshop, no
  outsourcing" → "1,000+ Projects completed end to end".
- Home hero image ref fixed to `gallery/parkson/parkson-01.jpg` (old
  parkson.jpg was deleted by the user's folder reorg).
- Cache version now `?v=20260713f`. node --check + full img-ref check pass.

## Earlier rounds (all verified)
- Thumbnails generated (`thumbs/*.png`, contact-sheet reviewed), cache bumped to
  `?v=20260713d`, `node --check` passed, every data ref + gallery.html img
  verified to exist on disk (19 keys / 116 refs / 0 missing), gallery + Parkson
  slider verified in-browser.
- **User recategorised type sets** (from slider screenshots): `cutout-01.jpg`
  (CCN Hub) 3d→cutout; `RHB/rhb-01.jpg` removed from 3d; `signboard-06.jpg`
  (Infinity/Richfield) 3d→signboard; `aidil.jpg` signboard→acrylic (user said
  "acrylic or 3d box-up"; I picked acrylic — flag if wrong).
- **Parkson folder added by user** (`gallery/parkson/parkson-01..06.jpg`; old
  loose parkson*.jpg deleted). Brand set now uses the folder (6 photos); dead
  parkson2/3 refs dropped from the "3dled" type set. Type-set counts now:
  signboard 9, 3dled 8, 3d 8, lightbox 11, cutout 12, acrylic 7, etching 7,
  waterjet 1, pylon 5, outdoor 8.

## Other pending items
- **Brand-card type sublabels are my best guess** from one photo per folder
  (Kenny Hills "Signboard", Vivace/"Village Grocer"/RHB/MUJI "3D box-up
  lettering", Niko Neko "3D box-up · LED", SFC "Lightbox", Thong Bowl "Neon /
  LED signs"). User has not confirmed them.
- The `thongcha/` folder photos are actually the **Thong Bowl** outlet (sister
  brand, combined store — lightbox signs read "Thong Bowl", Book-of-Records
  boxes reference both). Card is labelled "Thong Bowl · Thong Cha"; user has
  seen this reasoning but not explicitly signed off.
- Mobile layouts of the new about-page sections were verified from CSS logic
  only — browser resize/zoom is a no-op in the claude-in-chrome environment.
  Worth one look on a real phone.
- Adding future gallery projects: drop folder into `assets/img/gallery/`, add a
  brand key to `gallery-data.js`, add one card to `gallery.html` (thumb via
  `make_thumbs.py` pattern).
- Thumbnails keep original brand colours on white; if the user wants a stricter
  "one colour" look (all-black marks like the home marquee), recompose in
  `make_thumbs.py`.

## Decisions / rationale worth knowing
- No external UI libraries or icon fonts — zero build step, strict CSP
  (`script-src 'self'`, `img-src 'self' data:`) — this is also WHY brand logos
  had to be downloaded and served locally rather than hotlinked.
- Never market "no middleman / direct factory" — clients include resellers;
  retailer partnerships welcomed (see about-page partner note).
- CERGAS naming removed site-wide earlier (photo doesn't verifiably show CERGAS
  branding) — the pylon is labelled generically "Multi-tenant pylon".
- Painting service fully removed site-wide in an earlier session — still current.
