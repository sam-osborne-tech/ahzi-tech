# ahzi.tech

Handoff doc for any agent or engineer picking up this repo cold. Everything here is verified against the current source.

## What this is

Public marketing site for Ahzi LLC (Sam's Georgia LLC, S-Corp election) at https://ahzi.tech.

- Repo: `sam-osborne-tech/ahzi-tech` on Sam's personal GitHub (never the Wand identity; pushes as `so-wandai` get 403).
- Deploy: GitHub Pages via `.github/workflows/pages.yml`, triggered by every push to `main`. There is no staging: push equals production about 60 seconds later.
- Custom domain: `public/CNAME` (`ahzi.tech`). DNS lives at Squarespace Domains (Google Cloud DNS nameservers), A records to GitHub Pages, Google Workspace MX/SPF/DKIM/DMARC. Do not touch DNS from this repo.

## Stack and layout

Vite + React 19 + TypeScript + Tailwind 4 (via `@tailwindcss/vite`), with `motion` for reduced-motion-aware hero and Agent Lab state transitions.

- `src/App.tsx`: page composition for the header, focused narrative, lead funnel, and scroll progress.
- `src/content/site-content.ts`: typed offerings, agent patterns, synthetic Agent Lab scenarios, deep use cases, proof, controls, and CTA routes.
- `src/components/agent-lab.tsx`: manual synthetic run trace with scenario tabs, approval policy, human decision branch, evaluation evidence, keyboard navigation, and reduced-motion handling.
- `src/components/agent-catalog.tsx`: accessible business-function filters and detailed buildable agent pattern disclosures.
- `src/components/marketing-components.tsx`: shared section shells, headings, grids, gradient cards, workflow step flows, use-case flows, proof lists, CTA blocks, and image treatments.
- `src/components/site-sections.tsx`: focused business sections for the promise, productized offerings, deep use cases, public proof and controls, engagement path, and conversion.
- `src/index.css`: theme variables, reveal state machine CSS, photo treatment, all custom styling.
- `src/components/`: `scroll-progress.tsx` provides the top progress bar and section dots; `use-section-reveals.ts` owns the reveal state machine.
- `public/photos/`: self-hosted webp photography. `public/ahzi-social.png` is the OG card, `public/ahzi-logo.png` + `ahzi_logo_source.svg` the logo.

Commands: `npm run build` (tsc + vite), `npm run lint` (eslint), `npm run preview -- --port 4173 --strictPort` for local preview of `dist/`. Both lint and build must be green before any commit.

## Design system

Calm dark professional, Tribe.ai-inspired scroll storytelling. Single accent `--accent: #5b9dd9` plus gray-blue muted tones and neutrals in `src/index.css` `:root`. No neon, no magenta, no bright green, no glow shadows, no arcade styling; all of that was shipped once and explicitly removed by Sam's direction. Shared tint variables `--accent-border` and `--accent-wash` drive borders and washes; do not hardcode new rgb accents. Content cards over photography use the shared opaque layered `--photo-card-*` gradients, never a flat navy fill or translucent glass surface; photography stays visible around the card bounds.

## Reveal state machine (do not regress this)

Single mechanism: IntersectionObserver class toggles in `src/components/use-section-reveals.ts`. There is deliberately NO `animation-timeline: view()` anywhere.

- Two observers with hysteresis: entry boundary pulled 15% inside both viewport edges (`enterRootMargin '-15% 0px -15% 0px'`), un-reveal ONLY when a section is fully offscreen plus 15% margin (`exitRootMargin '15% 0px 15% 0px'`). A reset while any part of a section is visible is forbidden.
- Direction-aware: each section records the viewport edge it crossed in `data-reveal-from`; entering from below animates up, re-entering from above animates down.
- Travel is capped inside the section padding budget: 64px for the section body, 32px for cards (`.reveal-pending` rules). Padding is py-28 mobile / lg:py-44 desktop, so transforms can never push pixels into a visible neighbor.
- Transitions and the 80/160/240/320ms child stagger live ONLY on `.reveal-in`; a reset snaps instantly (invisible, since it only happens offscreen).
- `prefers-reduced-motion`: fade-only variant, no travel/blur/scale.
- No-JS and unknown engines: content is visible by default; the hidden state is applied by JS right before observing.

Past defects this design exists to prevent (all shipped and hit by Sam before being fixed):

1. `animation-timeline: view()` left the last sections frozen mid-animation (contact stuck at opacity 0.25, 3px blur) because the document ends before the animation-range completes.
2. One-shot reveals (unobserve after first fire) meant nothing animated on scroll up.
3. Un-revealing at bare viewport exit reset sections while still visible, piling mid-transition content into neighboring sections.
4. Re-revealing at one-pixel entry made scroll-up animation finish before the section was visible, so users saw nothing.

## Content rules

- Concrete claims only: what Ahzi builds, for whom, with what stack, and the proof. No interchangeable consulting phrases ("unlock value", "workflows people actually use", "operating rhythm"). Sam calls that slop and has rejected it once already.
- Never name clients or employers. Engagements are described concretely but anonymously ("a contract-intelligence run over 5,000+ agreements with population-level verification", "AI delivery inside a utility-scale enterprise").
- No em dashes or en dashes anywhere, including site copy, commits, and this file.
- The Agent Lab is a synthetic interactive walkthrough. It must stay labeled as synthetic, never imply live model execution or customer data, require manual progression, and keep approval and exception branches inspectable.

## Contact wiring

- Email: built at submit time from protected parts in `src/lib/contact.ts`. `src/components/use-protected-contact.ts` requires a trusted user event plus a 900ms page-settle before `mailto:` fires; synthetic submissions show a retry notice instead. That guard blocking automation is correct behavior, not a bug.
- The lead form validates and prepares a local email draft. It sends no network request and loads no analytics or third-party form script.
- All marketing CTAs route to section anchors or the lead form. Marketing routes are single-sourced in `src/content/site-content.ts`.

## Photography

Current images in `public/photos/` (self-hosted WebP, lazy loaded, explicit width/height, duotoned by `.section-photo`/`.inset-photo` CSS toward the calm blue behind a readability gradient):

- `hero-san-francisco.webp`: backdrop, hero
- `operations-containers.webp`: backdrop, `#offerings`
- `document-archive.webp`: backdrop, `#use-cases`
- `platform-patch-panel.webp`: inset, `#proof`
- `pipeline-circuit.webp`: subdued backdrop, `#agent-lab`
- `enterprise-racks.webp`: backdrop, `#proof`
- `outputs-linotype.webp`: backdrop, `#agent-catalog`, and inset, `#proof`
- `first-sprint-blueprints.webp`: backdrop, `#engagement`
- `build-terminal.webp`: inset card, `#engagement`
- `contact-cranes.webp`: backdrop, `#contact`

Sourcing: Unsplash and Pexels block automated access (401/Cloudflare). Openverse (`api.openverse.org/v1/images/?q=...&license=cc0,pdm,by`) works; view every candidate before use, reject anything branded, dated, or cliche (handshakes, robot hands, masked-era shots). Licenses are credited in `README.md` under Photography; keep that section updated. CC BY needs the credit; avoid by-sa/nc/nd.

## Verification protocol (hard requirement)

After every change, on the LIVE deployed site (not just preview):

1. Wheel-cadence scrolling, not `scrollTo` jumps: step in small deltas (about 140px/30ms slow, 700px/16ms flick). Programmatic jumps teleport past intermediate states and have hidden every scroll defect so far.
2. Full page DOWN and back UP at three viewports (about 1024x900, 1440x900, and a narrow mobile width; headless Chrome clamps below 500px wide).
3. Visually inspect frames (read the screenshots, do not just save them). Any overlap, clipped text, blur residue, or a section stuck hidden is a failure.
4. Verify reveals re-fire in BOTH directions (sample `reveal-in` class state and mid-transition opacities per section).
5. Deploy is done only after live validation passes. Wait for the Pages run to complete, confirm the served bundle hash changed, and hard-reload (stale tabs have produced false readings).

Use the native `user-browser` MCP for local visual verification when it is healthy. If it is unavailable, keep implementation and deterministic checks moving, do not open another browser context, and report the pixel-level visual gap.

## History pointers

Recent commit themes, newest first: photography + contact audit (`ab07cf6`), concrete copy rewrite (`9f72b24`), scroll-up pile-up fix (`46d60fb`), scroll-up visibility + spacing + stronger motion (`63d5842`), direction-aware reveals (`243caac`), re-triggerable reveals + customer-outcome hero (`5e7c4ba`), hero overlap fix (`63e1e37`), IntersectionObserver migration (`73932e8`), calm-blue palette (`902cf9e` and `c24fac5`), professional restyle (`4655fba`), initial scroll experience (`2b36e4f`).

If the palette ever changes, regenerate BOTH `public/ahzi-logo.png` (from `ahzi_logo_source.svg`, render at 1024x1024) and `public/ahzi-social.png` (1200x630, same design tokens), or the brand assets drift from the site.
