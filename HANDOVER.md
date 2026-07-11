# 5M Signcom site — handover

**Session ended:** 2026-07-12 (date only — exact time not available in this
environment; treat any "today"/"just now" references below as this date).

Project: `C:\Users\drax1\Downloads\5M\site\` — static multi-page HTML/CSS/vanilla-JS
site for 5M Signcom Sdn Bhd (Shah Alam signage manufacturer). No build step, no
framework. i18n via `assets/js/site.js` (`I18N` dict, `data-i18n` attrs, en/ms/zh).

Dev server: `python -m http.server 4001` from `C:\Users\drax1\Downloads\5M` (background
task, may need restarting next session). Site at `http://localhost:4001/site/`.

## Cache-busting — READ THIS FIRST
Every `<link rel="stylesheet">` and `<script src=...>` tag across all 5 HTML pages
carries `?v=20260712f` (current as of session end). **Any time you edit `site.css`, `site.js`, `gallery.js`, or
`gallery-data.js`, bump this version string in all 5 HTML files and keep CSS/JS in
sync** — a stale-cache mismatch already cost real time this session (user reported a
CSS fix "not working" when it was actually their browser serving the old cached file).
Check current value with `grep -ho 'v=2026[0-9a-z]*' site/*.html`.

## Done this session
1. **Gallery re-audit** — manually viewed all ~75 photos, rewrote
   `assets/js/gallery-data.js` (67 photos / 10 categories, was a stale 122-photo
   manifest with real mis-categorizations e.g. lightbox photos filed under
   "signboard"). Deleted 8 duplicate/irrelevant files. Updated `gallery.html` card
   captions/counts + meta description to match. Verified: `node --check` passes,
   a script confirmed every referenced file exists on disk.
2. **Lightbox popup fixed-size container** — `.lb-stage` now a fixed box
   (`min(1080px,100%)` × `min(70vh,720px)`, smaller on mobile) with
   `object-fit:contain`, so every photo (portrait or landscape) letterboxes into
   the same-size frame instead of the popup resizing per-photo. Verified live.
3. **Mobile horizontal-overflow bug (root cause found & fixed)** — `.hero-inner`,
   `.page-head-inner`, `.cta-band-inner` used shorthand `padding:72px 0 84px` while
   also carrying the shared `.container` class (e.g.
   `<div class="container hero-inner">`) — the `0` in the shorthand was zeroing out
   the side padding `.container` was supposed to provide, so content ran edge-to-edge
   and clipped on phone widths. Fixed all 9 occurrences (base rules + mobile
   overrides) to explicit `padding-top`/`padding-bottom` only. Verified via a 390px
   iframe probe on index + gallery pages — **about/services/contact pages use the
   same shared classes so should be fixed too, but were not individually
   screenshotted this session.**
4. **Burger menu icon** — replaced the text "Menu" button with an animated 3-bar
   burger that morphs to an X on open (`.menu-btn` now wraps `<span class="menu-bars">`
   with 3 spans; label moved to `aria-label` via `data-i18n-attr`). Verified
   open/close + animation in-browser.
5. **Gallery filter bar on mobile** — the 10 category filter buttons now scroll
   horizontally in one row (`overflow-x:auto`, `flex-wrap:nowrap`) under 700px
   instead of wrapping into a tall stack.
6. **Client-logo marquee images produced** — cropped all 12 logo PNGs into
   `assets/img/logos/` from existing project photos (PowerShell
   `System.Drawing`, two passes: rough crop then refined based on visual review).
   Files: parkson, yamaha, um, aicb, doosan, setiaecoglades, jayacom, learninghub,
   baagus, mygenius, wisb, aidil — all reviewed via Read, legible. AICB/Doosan/
   Jayacom crops are tight/small given source photo resolution — acceptable, not
   premium.
7. **Language toggle redesigned** — replaced the always-visible EN/BM/中文
   3-button row with a single inline-SVG globe icon button that opens a dropdown
   (no external icon library — CSP is `script-src 'self'` / no external fonts/CDNs,
   so the shadcn/iconoir icon the user linked was hand-recreated as inline SVG, not
   pulled in as a dependency). Per follow-up feedback: dropdown shows **no current-
   language text**, just the globe icon, and the button sits **directly next to the
   burger menu**, both always visible (not just on mobile). Dropdown wired in
   `site.js`: open/close, outside-click-to-close, Escape-to-close, `aria-pressed`
   sync. Added `lang_label` i18n key (EN "Language" / BM "Bahasa" / ZH "语言").
8. **Navbar logo size** — user flagged it looked mismatched vs other navbar
   elements; bumped `.brand-logo` 46px→54px desktop, 36px→44px mobile.
9. **Client-logo marquee color treatment** — first pass (`grayscale(1)
   contrast(1.6) brightness(0.9)`, opacity .72) looked washed-out gray per
   screenshot. Changed to `grayscale(1) contrast(1.75) brightness(1.22)` +
   `mix-blend-mode:multiply` + opacity .8 for a cleaner "unified black" look.
   Verified live on the index-page marquee; the strip now reads as black marks
   on white instead of the earlier gray wash.
10. **Navbar logo height fixed** — user flagged (with a mobile screenshot) that
    `.brand-logo` looked oversized next to the globe/burger buttons. Root cause:
    logo was set to 54px/44px (desktop/mobile) while the nav buttons next to it
    are 40px/36px. Changed `.brand-logo` to 40px desktop, 36px mobile — same
    height as the buttons it sits beside. Verified live via browser screenshot,
    confirmed visually aligned.

11. **Navbar logo optical centering** — after the height fix (item 10), the logo's
    *DOM box* was confirmed perfectly centered (12px top/bottom, measured via
    `getBoundingClientRect`, identical to the button gaps) — but the user still saw
    less whitespace above the logo than below. Root cause: the source
    `assets/img/logo.png` itself is optically top-heavy (bold solid "5M" mark
    touches the very top of the canvas edge-to-edge, while "SIGNCOM" + swirl
    accent beneath is thin and fades out ~3px before the bottom edge) — computed
    the ink-weighted vertical centroid at ~16.7% of the image height above the
    geometric center. Fixed by nudging the rendered logo down with
    `transform:translateY(6px)` desktop / `translateY(5px)` mobile (visual-only,
    doesn't affect flex layout of siblings). Verified via live screenshots at
    both mobile (390px) and desktop (1440px) — mark now reads as vertically
    balanced in the bar.

## Immediate next step
Delete the throwaway probe files, `C:\Users\drax1\Downloads\5M\probe-overflow.html`
and `probe-view.html`, unless you want to keep them as local test harnesses.
After that, do the 390px spot-check on `about.html` / `services.html` /
`contact.html` if you want full coverage of the shared mobile CSS.

## Other pending items
- **Spot-check about.html / services.html / contact.html at 390px** — the padding
  fix (item 3) and burger/globe UI (items 4, 7) should carry over automatically
  since everything shares `site.css`/`site.js`, but only index.html and
  gallery.html were actually screenshotted this session.
- **Gallery reorganization by BRAND — explicitly deferred.** User said: *"I want the
  project galleries organized by brand (e.g. 'Parkson') instead of category... I will
  find and organize the photos for you, so ignore this first."* Do not build a
  brand-based structure until the user supplies that mapping. When they do, expect:
  new `gallery-data.js` shape keyed by brand, rewritten `proj-grid` cards + filter
  bar, and brand-based i18n labels instead of the current category ones
  (`s_signboard`, `type_3dled`, etc.).
- **Probe cleanup done** — `probe-overflow.html` and `probe-view.html` were
   temporary iframe-based mobile-width harnesses; both have now been removed.
- Re-run `node --check assets/js/site.js` once more after the language-dropdown
  edits — it was checked right after the burger-menu edit but before the later
  dropdown JS changes (low risk, quick to confirm).

## Decisions / rationale worth knowing
- No external UI libraries or icon fonts — the site has zero build step and a
  strict CSP (`script-src 'self'`, no external font/style sources). Any "use this
  icon library" request gets hand-translated into inline SVG matching the visual,
  not an actual dependency.
- CERGAS naming removed site-wide in an earlier session (photo doesn't verifiably
  show CERGAS branding) — replaced with generic "Multi-tenant pylon" label. Still
  current; unrelated to this session's work but worth knowing if that pylon photo
  comes up again.
- Painting service fully removed site-wide in an earlier session — still current.
