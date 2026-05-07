import { test, expect } from '@playwright/test';

/**
 * Cross-device layout integrity tests.
 * Runs on all 24 projects. Validates no overflow, touch targets, and
 * correct responsive behavior at every viewport.
 */

test.describe('Layout integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('no horizontal overflow', async ({ page }) => {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflow, 'Page has horizontal overflow — check padding/width on a narrow viewport').toBe(false);
  });

  test('hero h1 is visible and has non-zero height', async ({ page }) => {
    const h1 = page.locator('.s-hero h1');
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box?.height, 'Hero h1 has zero height — likely clipped or hidden').toBeGreaterThan(0);
  });

  test('hero CTA meets 44×44px touch target (WCAG 2.5.5)', async ({ page }) => {
    const cta = page.locator('.s-hero .btn-primary');
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.width, 'Hero CTA width < 44px').toBeGreaterThanOrEqual(44);
    expect(box?.height, 'Hero CTA height < 44px').toBeGreaterThanOrEqual(44);
  });

  test('header is visible', async ({ page }) => {
    // getByRole('banner') uniquely targets the page <header> landmark — avoids dev-toolbar injections
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box?.height, 'Header has zero height').toBeGreaterThan(0);
  });

  test('header CTA is visible and reachable', async ({ page }) => {
    await expect(page.locator('header .btn-primary')).toBeVisible();
  });

  test('tab bar — all 3 tabs are visible', async ({ page }) => {
    const tabs = page.locator('.tab-btn');
    await expect(tabs).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('phase accordion summary is tappable (height ≥ 44px)', async ({ page }) => {
    const summary = page.locator('#build .accordion summary').first();
    await expect(summary).toBeVisible();
    const box = await summary.boundingBox();
    expect(box?.height, 'Accordion summary < 44px — too small to tap').toBeGreaterThanOrEqual(44);
  });

  test('FAQ accordion summary is tappable (height ≥ 44px)', async ({ page }) => {
    const summary = page.locator('.faq-block .accordion summary').first();
    await expect(summary).toBeVisible();
    const box = await summary.boundingBox();
    expect(box?.height, 'FAQ summary < 44px — too small to tap').toBeGreaterThanOrEqual(44);
  });

  test('roles table fits without horizontal scroll', async ({ page }) => {
    const table = page.locator('.roles-table');
    await expect(table).toBeVisible();
    const overflow = await table.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow, 'Roles table is horizontally scrolling').toBe(false);
  });

  test('pricing card is visible and not clipped', async ({ page }) => {
    const card = page.locator('.pricing-card');
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box?.height, 'Pricing card has zero height').toBeGreaterThan(0);
    expect(box?.width, 'Pricing card has zero width').toBeGreaterThan(0);
  });

  test('footer is visible and not overflowing', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    const overflow = await page.locator('footer').evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow, 'Footer is horizontally scrolling').toBe(false);
  });

  test('10 section IDs exist at every viewport', async ({ page }) => {
    const ids = ['hero', 'trust', 'inspect', 'fit', 'roles', 'build', 'includes', 'flow', 'founder', 'schedule'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`), `Section #${id} missing`).toBeAttached();
    }
  });
});

test.describe('Responsive visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sticky CTA is in DOM', async ({ page }) => {
    await expect(page.locator('#sticky-cta')).toBeAttached();
  });

  test('progress nav is in DOM', async ({ page }) => {
    await expect(page.locator('.progress-nav')).toBeAttached();
  });

  test('correct progress nav visibility by viewport width', async ({ page }) => {
    const viewportWidth = page.viewportSize()?.width ?? 0;
    const progressNav = page.locator('.progress-nav');

    if (viewportWidth >= 1280) {
      // Wide: progress nav should be visible
      await expect(progressNav).toBeVisible();
    } else {
      // Narrow: progress nav should be hidden via CSS
      const display = await progressNav.evaluate((el) => window.getComputedStyle(el).display);
      expect(display, 'Progress nav is visible on narrow viewport').toBe('none');
    }
  });

  test('correct sticky CTA CSS visibility by viewport width', async ({ page }) => {
    const viewportWidth = page.viewportSize()?.width ?? 0;
    const stickyCta = page.locator('#sticky-cta');

    if (viewportWidth > 640) {
      // Desktop: sticky CTA hidden via CSS (display: none)
      const display = await stickyCta.evaluate((el) => window.getComputedStyle(el).display);
      expect(display, 'Sticky CTA is displaying on desktop').toBe('none');
    } else {
      // Mobile: sticky CTA in DOM (not display:none), starts hidden via transform
      const display = await stickyCta.evaluate((el) => window.getComputedStyle(el).display);
      expect(display, 'Sticky CTA has display:none on mobile').not.toBe('none');
    }
  });
});
