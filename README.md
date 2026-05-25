# yarova.ca

The production marketing site for **Yarova** — a simulated remote workplace for DevOps and SRE engineers in Canada.

Eight weeks of real work in a squad of 4 under a real Team Lead. Real GitHub history. Then full support to a stable Canadian job. **$2,400 CAD flat.**

Stack: **Astro 6 · TypeScript · Vanilla JS · Cloudflare Pages**

---

## Project structure

```
src/
  components/
    BaseHead.astro       SEO meta, OG, Twitter card, font loading
    Header.astro         Sticky nav + next-batch scarcity bar
    Footer.astro         Contact strip + company footer
    FormattedDate.astro  Date utility (blog only)
  layouts/
    BlogPost.astro       Blog article template
  pages/
    index.astro          Main site — 11-section homepage with batches table
    about.astro          About Yarova + founder bio
    accounting.astro     Standalone accounting service (unlisted, no nav link)
    blog/
      index.astro        Blog listing
      [...slug].astro    Individual blog post
    rss.xml.js           RSS feed
  content/
    blog/                Markdown blog posts
  styles/
    global.css           Design tokens — colors, typography, spacing
    enhancements.css     Scoped to accounting.astro
  consts.ts              Site title and description
public/
  enhancements.js        Scoped to accounting.astro (reveal-on-scroll, counters)
  favicon.svg / .ico
  llms.txt               LLM-readable description
  robots.txt
tests/
  homepage.spec.ts       Functional tests for the main site
  cross-device.spec.ts   Layout integrity at every viewport
  accessibility.spec.ts  WCAG 2.1 AA — axe-core + keyboard
  visual.spec.ts         Screenshot regression (snapshots committed, regenerate after design changes)
playwright.config.ts     24 projects — all major 2026 device viewports x browsers
.github/
  workflows/             CI (build + test), deploy (Cloudflare Pages), CodeQL, Trivy
  dependabot.yml         Weekly dependency updates
```

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve built `dist/` locally |
| `npm run test` | All Playwright tests, all projects |
| `npm run test:a11y` | WCAG 2.1 AA axe-core, Chromium desktop |
| `npm run test:devices` | Cross-device layout, all projects |
| `npm run test:visual` | Screenshot regression (pass `--update-snapshots` to regenerate) |
| `npm run lighthouse` | Lighthouse audit against `localhost:4321` (run `preview` first) |

---

## Content gates — required before launch

Anywhere a value is marked **TODO** in code, swap it for the real value.

| Item | Where | Current |
|---|---|---|
| Next batch banner (date · track · seats left) | `src/components/Header.astro` (`nextBatch`) | Mon Jun 1 · DevOps · 2 of 4 |
| Full batch list (date, track, focus, shift, seats) | `src/pages/index.astro` (`batches`) | 6 upcoming Mondays |
| Aggregate hiring stats (placed, salary, weeks, since) | `src/pages/index.astro` (`stats`) | Placeholder values — replace |
| Cal.com link | All CTAs | `cal.com/yarova-fxqeea/discovery-call` |
| WhatsApp number | All `wa.me/...` links | `+1 (604) 719-7918` |
| Email | Footer + about | `hello@yarova.ca` |

Update the **batches** list weekly. Update the **stats** block whenever a new engineer clears probation.

---

## Design system

Colors that pass WCAG AA contrast:

| Token | Value | Contrast on white | Use |
|---|---|---|---|
| `--color-amber-hover` | `#B45309` | 4.95:1 | CTAs, links, accent text |
| `--text-primary` | `#0A0A0B` | 21:1 | Headings, strong text |
| `--text-secondary` | `#57534E` | 7.55:1 | Body text |
| `--text-tertiary` | `#78716C` | 4.39:1 | Decorative only — never body text |

`--color-amber` (`#D97706`) does NOT pass AA at 14px normal weight. Use `--color-amber-hover` for text and interactive elements.

---

## Accessibility

WCAG 2.1 AA. Verified with axe-core (zero critical, zero serious).

Test: `npm run test:a11y`

---

## CI/CD

**On every push + PR to main:**

1. `npm ci`
2. `npm run build`
3. Functional tests on Chromium desktop
4. Cross-device tests on desktop + mobile
5. Accessibility (axe-core WCAG 2.1 AA)

**On push to main (after CI passes):**

Build + deploy to Cloudflare Pages via `wrangler pages deploy`.

### Required secrets

`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` — set in repo Settings → Secrets → Actions.

Project name in `deploy.yml`: `viro`.

---

## Visual regression

Screenshot baselines live in `tests/visual.spec.ts-snapshots/`. **They are stale after the May 2026 redesign and need regeneration.** Run:

```
npm run build && npm run preview &
npx playwright test tests/visual.spec.ts --update-snapshots
```

Then commit the new baselines.

---

## Accounting

The site also serves a separate accounting product at `/accounting`. It is **unlisted** — no link to it from the main site, header, or footer. Visitors only land there via direct URL or a paid ad. Do not link to it from `index.astro`, `about.astro`, the header, or the footer.

---

## Security tooling

- **Dependabot** — weekly npm + GitHub Actions updates (`.github/dependabot.yml`)
- **Trivy** — vuln + secret + misconfig scan, results uploaded to Security tab
- **CodeQL** — static analysis for JS/TS, results uploaded to Security tab

---

## Deployment

Cloudflare Pages at `yarova.ca`. Astro static output (`dist/`). Cloudflare global edge.
