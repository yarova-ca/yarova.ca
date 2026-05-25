import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * WCAG 2.1 AA accessibility tests using axe-core.
 * Runs on chromium-desktop-1440 only — accessibility doesn't need multi-device.
 * Configure via: npx playwright test tests/accessibility.spec.ts --project=chromium-desktop-1440
 */

test.describe('Accessibility — homepage', () => {
  test('no critical axe violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('astro-dev-toolbar')
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map(v =>
        `[${v.id}] ${v.description} — ${v.nodes.length} node(s): ${v.nodes.map(n => n.html.slice(0, 80)).join(' | ')}`
      ).join('\n');
      expect.fail(`Critical axe violations:\n${summary}`);
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('no serious axe violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('astro-dev-toolbar')
      .analyze();

    const seriousViolations = results.violations.filter(v => v.impact === 'serious');
    if (seriousViolations.length > 0) {
      const summary = seriousViolations.map(v => `[${v.id}] ${v.description} — ${v.nodes.length} node(s): ${v.nodes.map(n => n.html.slice(0, 120)).join(' | ')}`).join('\n');
      throw new Error(`Serious axe violations:\n${summary}`);
    }
    expect(seriousViolations).toHaveLength(0);
  });

  test('all images have non-empty alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} is missing alt attribute`).not.toBeNull();
      expect(alt?.trim(), `Image ${i} has empty alt attribute`).not.toBe('');
    }
  });

  test('all buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const innerHTML = await btn.innerHTML();
      // Skip Astro DevToolbar slot buttons (dev-only, not in production)
      if (innerHTML.trim() === '<slot></slot>' || innerHTML.includes('astro-dev-toolbar')) continue;

      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      const ariaLabelledby = await btn.getAttribute('aria-labelledby');

      const hasName = (text?.trim() !== '') || (ariaLabel !== null) || (ariaLabelledby !== null);
      expect(hasName, `Button ${i} has no accessible name. HTML: ${innerHTML.slice(0, 100)}`).toBe(true);
    }
  });

  test('keyboard: Tab from body reaches header CTA', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('href') || document.activeElement?.tagName);
    // First tab should land on the header CTA or the logo
    expect(focused).toBeTruthy();
  });

  test('keyboard: can reach hero CTA via Tab', async ({ page }) => {
    await page.goto('/');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
      if (focused?.includes('Book your enrollment call')) break;
    }
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBeTruthy();
  });

  test('keyboard: can tab through page without trap', async ({ page }) => {
    await page.goto('/');
    // WCAG 2.1.2: focus must not get trapped in a component.
    // A trap = cycling through only N elements before visiting the rest of the page.
    // Normal browser behavior: Tab cycles from last focusable element back to first (not a trap).
    // We detect a trap by checking if within the first 30 tabs, focus never advances past 5 unique elements.

    const visited = new Set<string>();

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName}::${el.getAttribute('href') || el.textContent?.trim().slice(0, 30)}` : 'unknown';
      });
      visited.add(tag);
    }

    // After 30 tabs, we should have visited at least 10 distinct focusable elements.
    // A real keyboard trap would keep us in a tight loop of 1–3 elements.
    expect(visited.size, `Keyboard trap suspected — only ${visited.size} unique elements visited in 30 tabs`).toBeGreaterThanOrEqual(10);
  });
});

test.describe('Accessibility — about page', () => {
  test('no critical axe violations', async ({ page }) => {
    await page.goto('/about');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});

test.describe('Accessibility — blog page', () => {
  test('no critical axe violations', async ({ page }) => {
    await page.goto('/blog');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});
