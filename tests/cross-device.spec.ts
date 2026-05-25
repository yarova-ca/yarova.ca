import { test, expect } from '@playwright/test';

/**
 * Cross-device layout integrity tests.
 * Runs on every Playwright project (multiple viewports + browsers).
 * Validates that nothing overflows or shrinks below tappable size on any viewport.
 */

test.describe('Layout integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('no horizontal overflow on the document', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, 'Page has horizontal overflow on this viewport').toBe(false);
  });

  test('hero h1 is visible with non-zero height', async ({ page }) => {
    const h1 = page.locator('.hero h1');
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box?.height ?? 0, 'Hero h1 has zero height').toBeGreaterThan(0);
  });

  test('hero primary CTA meets 44x44 touch target (WCAG 2.5.5)', async ({ page }) => {
    const cta = page.locator('.hero .actions a.btn').first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.width ?? 0, 'Hero CTA width < 44px').toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0, 'Hero CTA height < 44px').toBeGreaterThanOrEqual(44);
  });

  test('header is the banner landmark and is visible', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(0);
  });

  test('header CTA is visible and reachable', async ({ page }) => {
    await expect(page.locator('header .btn-amber').first()).toBeVisible();
  });

  test('FAQ summary is tappable on every viewport (>= 44px)', async ({ page }) => {
    const summary = page.locator('#faq details summary').first();
    await summary.scrollIntoViewIfNeeded();
    await expect(summary).toBeVisible();
    const box = await summary.boundingBox();
    expect(box?.height ?? 0, 'FAQ summary < 44px').toBeGreaterThanOrEqual(44);
  });

  test('batches table never causes the page itself to scroll horizontally', async ({ page }) => {
    await page.locator('#batches').scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, 'Batches section is pushing the document wider than the viewport').toBe(false);
  });

  test('pricing-equivalent (enroll section) renders with non-zero width', async ({ page }) => {
    const card = page.locator('#enroll .terms');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box?.width ?? 0, 'Enrollment terms list has zero width').toBeGreaterThan(0);
  });

  test('footer is visible without horizontal overflow', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    const overflow = await footer.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow, 'Footer is horizontally scrolling').toBe(false);
  });

  test('floating actions stay in DOM (do not depend on viewport)', async ({ page }) => {
    await expect(page.locator('.floating-actions')).toBeAttached();
  });
});
