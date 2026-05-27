import { test, expect } from '@playwright/test';

/**
 * Smoke + content tests for the main site.
 * Asserts the literal section structure and copy that ships in src/pages/index.astro.
 * Update this file when sections are added, removed, or renamed.
 */

test.describe('Home — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all primary section IDs exist', async ({ page }) => {
    const ids = ['main', 'how-it-works', 'tracks', 'journey', 'pricing', 'track-record', 'faq', 'book'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`), `Section #${id} missing`).toBeAttached();
    }
  });

  test('hero contains the experience loop block', async ({ page }) => {
    await expect(page.locator('.hero .loop-block')).toBeAttached();
    await expect(page.locator('.hero .loop-exit')).toContainText('Yarova is the exit from that loop');
  });

  test('hero CTA links to discovery call', async ({ page }) => {
    const cta = page.locator('.hero .actions a.btn').first();
    await expect(cta).toBeVisible();
    const calLink = await cta.getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Home — header & footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('top bar shows $799/month', async ({ page }) => {
    await expect(page.locator('.top-bar')).toContainText('$799/month');
  });

  test('header has no accounting link', async ({ page }) => {
    await expect(page.locator('header a[href="/accounting"]')).toHaveCount(0);
  });

  test('header CTA opens the discovery call', async ({ page }) => {
    const calLink = await page.locator('header .nav-links a.btn-amber').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('header nav anchors all resolve to real section IDs', async ({ page }) => {
    const anchors = await page.locator('header .nav-links a:not(.btn)').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')),
    );
    for (const href of anchors) {
      if (!href || !href.includes('#')) continue;
      const id = href.split('#')[1];
      await expect(page.locator(`#${id}`), `Header anchor #${id} has no matching section`).toBeAttached();
    }
  });

  test('footer shows company line', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Yarova Inc.');
    await expect(page.locator('footer')).toContainText('Langley, BC');
  });

  test('footer nav anchors resolve to real section IDs', async ({ page }) => {
    const anchors = await page.locator('footer .foot-links a').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')),
    );
    for (const href of anchors) {
      if (!href || !href.includes('#') || href.startsWith('http')) continue;
      const id = href.split('#')[1];
      await expect(page.locator(`#${id}`), `Footer anchor #${id} has no matching section`).toBeAttached();
    }
  });
});

test.describe('Home — how it works', () => {
  test('exactly 6 steps', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#how-it-works .how-item')).toHaveCount(6);
  });

  test('step 6 is the dark final step', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#how-it-works .how-item-final')).toBeAttached();
    await expect(page.locator('#how-it-works .how-item-final')).toContainText('GitHub');
  });
});

test.describe('Home — tracks', () => {
  test('two track cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tracks .track-card')).toHaveCount(2);
  });

  test('DevOps track and SRE track both present', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#tracks .track-card');
    await expect(cards.nth(0)).toContainText('DevOps');
    await expect(cards.nth(1)).toContainText('Site Reliability Engineering');
  });

  test('shared foundation block is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#tracks .shared-foundation')).toBeAttached();
  });
});

test.describe('Home — 90-day journey', () => {
  test('exactly 3 month cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#journey .month-card')).toHaveCount(3);
  });

  test('month 3 card is dark', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#journey .month-card-dark')).toHaveCount(1);
    await expect(page.locator('#journey .month-card-dark')).toContainText('Month 3');
  });
});

test.describe('Home — pricing', () => {
  test('price card shows $799/month', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .price-num')).toContainText('$799');
    await expect(page.locator('#pricing .price-when')).toContainText('Month to month');
    await expect(page.locator('#pricing .price-when')).toContainText('Cancel anytime');
  });

  test('ROI strip shows $2,397 and $98,000', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .price-roi')).toContainText('$2,397');
    await expect(page.locator('#pricing .price-roi')).toContainText('$98,000');
  });

  test('pricing CTA links to discovery call', async ({ page }) => {
    await page.goto('/');
    const calLink = await page.locator('#pricing a.btn-amber').first().getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Home — track record', () => {
  test('three stat blocks present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#track-record .stat')).toHaveCount(3);
  });

  test('stats show 47 engineers, $98K, 11 weeks', async ({ page }) => {
    await page.goto('/');
    const stats = page.locator('#track-record .stat');
    await expect(stats.nth(0)).toContainText('47');
    await expect(stats.nth(1)).toContainText('$98K');
    await expect(stats.nth(2)).toContainText('11 wks');
  });
});

test.describe('Home — FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('FAQ has at least 8 questions', async ({ page }) => {
    expect(await page.locator('#faq details').count()).toBeGreaterThanOrEqual(8);
  });

  test('IRCC disclaimer is present', async ({ page }) => {
    await expect(page.locator('#faq')).toContainText('IRCC');
  });

  test('clicking a closed FAQ opens it', async ({ page }) => {
    const closed = page.locator('#faq details:not([open])').first();
    await closed.locator('summary').click();
    await expect(closed).toHaveAttribute('open', '');
  });
});

test.describe('Home — final CTA', () => {
  test('book section has a Cal.com CTA', async ({ page }) => {
    await page.goto('/');
    const calLink = await page.locator('#book a.btn-amber').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Other pages', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Yarova/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Yarova/);
  });

  test('all 5 city pages load', async ({ page }) => {
    const slugs = [
      'devops-experience-toronto',
      'sre-simulation-vancouver',
      'devops-placement-calgary',
      'platform-engineering-ottawa',
      'sre-training-halifax',
    ];
    for (const slug of slugs) {
      await page.goto(`/${slug}`);
      await expect(page).toHaveTitle(/Yarova/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('accounting page returns 404', async ({ page }) => {
    const response = await page.goto('/accounting');
    expect(response?.status()).toBe(404);
  });
});
