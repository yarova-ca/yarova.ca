# yarova.ca

**What this is:** The production marketing site for Yarova — IT placement consultancy.

**What it does:** Converts a $1,500 buyer in 2.5 minutes.

**Stack:** Astro 6 · TypeScript · Vanilla JS · Cloudflare Pages

---

## Project structure

```
src/
  components/
    BaseHead.astro       SEO meta tags, OG, Twitter cards, font loading
    Header.astro         Sticky nav — logo left, single CTA right
    Footer.astro         Brand tagline, nav links, social, location
    FormattedDate.astro  Date formatting utility (blog only)
  layouts/
    BlogPost.astro       Blog article template
  pages/
    index.astro          Homepage — 10-section v2 site
    about.astro          About Yarova + founder bio
    blog/
      index.astro        Blog listing
      [...slug].astro    Individual blog post
    rss.xml.js           RSS feed
  content/
    blog/                Markdown blog posts
  styles/
    global.css           Design system — colors, typography, spacing, components
  consts.ts              Site title and description
tests/
  homepage.spec.ts       43 functional tests (structure, tabs, accordions, CTAs, nav)
  cross-device.spec.ts   Layout integrity at every viewport (no overflow, touch targets)
  accessibility.spec.ts  WCAG 2.1 AA — axe-core + keyboard navigation
  visual.spec.ts         Screenshot regression — 24 baselines
  visual.spec.ts-snapshots/  Committed baseline PNGs (4 projects × 6 sections)
playwright.config.ts     24 projects — all 2026 device viewports × 3 browser engines
.github/
  workflows/
    ci.yml               Build + test on every push and PR
    deploy.yml           Deploy to Cloudflare Pages on push to main
public/
  favicon.svg
  favicon.ico
```

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve built `dist/` locally |
| `npm run test` | All Playwright tests, all 24 projects |
| `npm run test:a11y` | WCAG 2.1 AA axe-core audit, Chromium desktop |
| `npm run test:devices` | Cross-device layout tests, all 24 projects |
| `npm run test:visual` | Screenshot regression (run `--update-snapshots` to regenerate) |
| `npm run lighthouse` | Lighthouse audit against `localhost:4321` (run preview first) |

---

## Running Lighthouse

Lighthouse requires the production build running on a server.

```sh
npm run build
npm run preview          # starts on port 4321
# in a second terminal:
npm run lighthouse
```

Scores (production build, Cloudflare Pages):

| Category | Score |
|---|---|
| Performance | 100 |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

---

## Running all Playwright tests

```sh
npx playwright install   # first time only
npm run test             # all 24 projects, ~4 min
```

### Device coverage (24 Playwright projects)

**iOS — WebKit**

| Project | Viewport | Covers |
|---|---|---|
| webkit-phone-375 | 375×667 | iPhone SE 3rd gen |
| webkit-phone-390 | 390×844 | iPhone 14 / 15 / 16 |
| webkit-phone-393 | 393×852 | iPhone 14/15 Pro |
| webkit-phone-402 | 402×874 | iPhone 16 Pro |
| webkit-phone-428 | 428×926 | iPhone 14 Plus |
| webkit-phone-430 | 430×932 | iPhone 15/16 Plus + Pro Max |
| webkit-phone-440 | 440×956 | iPhone 16 Pro Max |
| webkit-tablet-744 | 744×1133 | iPad Mini 6 |
| webkit-tablet-820 | 820×1180 | iPad Air 5 / iPad 10th gen |
| webkit-tablet-834 | 834×1194 | iPad Pro 11" |
| webkit-tablet-1024 | 1024×1366 | iPad Pro 12.9" |
| webkit-laptop-1280 | 1280×800 | MacBook Air 13" |
| webkit-desktop-1440 | 1440×900 | MacBook Pro 14" |

**Android + Windows + QHD — Chromium**

| Project | Viewport | Covers |
|---|---|---|
| chromium-phone-320 | 320×568 | Smallest Android |
| chromium-phone-360 | 360×780 | Galaxy S24, S25, A55 |
| chromium-phone-412 | 412×915 | Pixel 9, Galaxy S25 Ultra |
| chromium-tablet-800 | 800×1280 | Samsung Tab S9/S10/A9 |
| chromium-laptop-1280 | 1280×800 | Windows 13" |
| chromium-laptop-1366 | 1366×768 | Windows 15" HD |
| chromium-desktop-1440 | 1440×900 | Standard desktop |
| chromium-desktop-1920 | 1920×1080 | FHD desktop / Windows 15" FHD |
| chromium-desktop-2560 | 2560×1440 | QHD / iMac 24" |

**Firefox**

| Project | Viewport |
|---|---|
| firefox-laptop-1280 | 1280×800 |
| firefox-desktop-1440 | 1440×900 |

---

## CI/CD

**On every push + PR to main:**

1. Install dependencies (`npm ci`)
2. Build (`npm run build`)
3. Playwright functional tests — Chromium desktop
4. Playwright cross-device — 3 key viewports
5. Accessibility audit — axe-core WCAG 2.1 AA

**On push to main (after CI passes):**

1. Build
2. Deploy to Cloudflare Pages via `wrangler pages deploy`

### Required GitHub secrets

Add these in: `GitHub repo → Settings → Secrets → Actions`

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token (use "Edit Cloudflare Workers" template) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar on any page |

### Cloudflare Pages project

Project name in `deploy.yml`: `yarova-ca`

When you run the first deployment:
- Cloudflare Pages creates the project automatically.
- Point the custom domain `yarova.ca` in Cloudflare Pages → Custom Domains.

---

## Content gates — required before launch

These are placeholder values. Replace before deploying to production.

| Item | Location | Current value |
|---|---|---|
| Founder portrait | `src/assets/blog-placeholder-about.jpg` | Placeholder image |
| Cohort start date | `src/pages/index.astro` hero cadence signal | "Monthly cohorts · 40 seats · Applications close end of month" |
| Fit call booking link | All `href="#schedule"` CTAs | Scrolls to bottom section — replace with Calendly/Cal.com link |
| WhatsApp Business link | Final CTA section | `mailto:hello@yarova.ca` fallback — replace with WhatsApp URL |

### Replace founder photo

1. Add photo to `public/founder.jpg` (1024×1024, square, professional)
2. In `src/pages/index.astro`: replace `FounderPhoto` import with `../public/founder.jpg`
3. Remove the `/* TODO */` comment
4. Rebuild and verify

---

## Design system

Colors that pass WCAG AA contrast:

| Token | Value | Contrast on white | Use |
|---|---|---|---|
| `--color-amber-hover` | `#B45309` | 4.95:1 | CTAs, labels, links (primary amber) |
| `--color-teal` | `#0D9488` | — | Available for future use |
| `--text-primary` | `#0A0A0B` | 21:1 | Headings, strong text |
| `--text-secondary` | `#57534E` | 7.55:1 | Body, list items |
| `--text-tertiary` | `#78716C` | 4.39:1 | Non-text decorative only — do not use for text |

Note: `--color-amber` (`#D97706`) fails WCAG AA at 14px normal weight.
Use `--color-amber-hover` (`#B45309`) for all text and interactive elements.

---

## Accessibility

WCAG 2.1 AA compliant. Verified with axe-core.

Zero critical violations. Zero serious violations.

Test: `npm run test:a11y`

---

## Security tooling

Three automated security checks run on every push and PR.

**Dependabot** — weekly PRs for npm + GitHub Actions dependency updates.

Config: `.github/dependabot.yml`

Astro minor/major updates require manual review.
Patch updates are auto-proposed.

---

**Trivy** — vulnerability + secret + misconfiguration scan.

Scans: npm dependencies, filesystem, any hardcoded secrets.

Results: uploaded to `GitHub repo → Security → Code scanning`.

Schedule: every push, every PR, every Monday.

---

**CodeQL** — static analysis for JS/TS security vulnerabilities.

Finds: XSS, injection, prototype pollution, unsafe patterns.

Results: uploaded to GitHub Security tab as SARIF.

Schedule: every push, every PR, every Wednesday.

---

## Deployment history

Deployed to Cloudflare Pages at `yarova.ca`.

Build: Astro static output (`dist/`).

CDN: Cloudflare global edge network.
