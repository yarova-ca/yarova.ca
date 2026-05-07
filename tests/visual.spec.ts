import { test, expect } from '@playwright/test';

/**
 * Visual regression tests — screenshot baseline comparisons.
 *
 * First run: generates baselines in tests/snapshots/
 * Subsequent runs: diffs against baselines — fails on visual change.
 *
 * To update baselines after intentional design changes:
 *   npx playwright test tests/visual.spec.ts --update-snapshots
 *
 * Runs on 4 projects:
 *   webkit-phone-375 (iPhone SE), webkit-phone-390 (iPhone 15),
 *   webkit-tablet-834 (iPad Pro 11), chromium-desktop-1440
 */

test.describe('Visual regression — hero section', () => {
  test('hero above-fold screenshot', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Clip to above-fold viewport area only
    const viewportHeight = page.viewportSize()?.height ?? 900;
    await expect(page).toHaveScreenshot(`hero-${testInfo.project.name}.png`, {
      clip: { x: 0, y: 0, width: page.viewportSize()!.width, height: viewportHeight },
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual regression — trust strip', () => {
  test('trust strip screenshot', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const trustSection = page.locator('#trust');
    await expect(trustSection).toHaveScreenshot(`trust-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual regression — inspect tabs', () => {
  test('inspect section tab 1 default state', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const inspectSection = page.locator('#inspect');
    await expect(inspectSection).toHaveScreenshot(`inspect-tab1-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual regression — profiles grid', () => {
  test('who this is for section', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const fitSection = page.locator('#fit');
    await expect(fitSection).toHaveScreenshot(`profiles-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual regression — pricing card', () => {
  test('pricing card screenshot', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const pricingCard = page.locator('.pricing-card');
    await expect(pricingCard).toHaveScreenshot(`pricing-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('Visual regression — footer', () => {
  test('footer screenshot', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot(`footer-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
});
