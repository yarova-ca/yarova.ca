import { test, expect } from '@playwright/test';

/**
 * Smoke + content tests for the main site.
 * Asserts the structure and copy that actually ships in src/pages/index.astro.
 * Update this file when sections are added, removed, or renamed.
 */

test.describe('Home — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all primary section IDs exist', async ({ page }) => {
    const ids = ['main', 'problem', 'tracks', 'how', 'squad', 'support', 'batches', 'proof', 'pricing', 'faq', 'cta-final'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`), `Section #${id} missing`).toBeAttached();
    }
  });

  test('hero contains the tagline', async ({ page }) => {
    await expect(page.locator('.hero h1')).toContainText('The closest thing to your first day on the job');
    await expect(page.locator('.hero h1')).toContainText('Without the first-day anxiety');
  });

  test('hero shows the $2,400 flat eyebrow', async ({ page }) => {
    await expect(page.locator('.hero .eyebrow')).toContainText('$2,400 flat');
  });

  test('hero has primary and secondary CTAs', async ({ page }) => {
    const ctas = page.locator('.hero .actions .btn');
    await expect(ctas).toHaveCount(2);
    const calLink = await page.locator('.hero .btn-amber').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Home — header & footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header has no accounting toggle', async ({ page }) => {
    await expect(page.locator('header .service-switch')).toHaveCount(0);
    await expect(page.locator('header a[href="/accounting"]')).toHaveCount(0);
  });

  test('scarcity bar shows the next batch and seat count', async ({ page }) => {
    const bar = page.locator('.scarcity').first();
    await expect(bar).toBeVisible();
    await expect(bar).toContainText('Next batch:');
    await expect(bar).toContainText('seats left');
  });

  test('header CTA opens the discovery call directly', async ({ page }) => {
    const calLink = await page.locator('header .nav-links a.btn-amber').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('header nav anchors all point to real section IDs', async ({ page }) => {
    const anchors = await page.locator('header .nav-links a:not(.btn)').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')),
    );
    for (const href of anchors) {
      if (!href || !href.includes('#')) continue;
      const id = href.split('#')[1];
      await expect(page.locator(`#${id}`), `Header anchor #${id} has no matching section`).toBeAttached();
    }
  });

  test('footer is visible and shows the company line', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Yarova Inc.');
    await expect(page.locator('footer')).toContainText('Langley, BC');
  });

  test('footer nav anchors all resolve', async ({ page }) => {
    const anchors = await page.locator('footer .foot-links a').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')),
    );
    for (const href of anchors) {
      if (!href || !href.includes('#') || href.startsWith('http')) continue;
      const id = href.split('#')[1];
      await expect(page.locator(`#${id}`), `Footer anchor #${id} has no matching section`).toBeAttached();
    }
  });

  test('contact strip has 3 cells (cal, whatsapp, email)', async ({ page }) => {
    await expect(page.locator('.contact-strip .cell')).toHaveCount(3);
    await expect(page.locator('.contact-strip')).toContainText('yarova-fxqeea/discovery-call');
    await expect(page.locator('.contact-strip')).toContainText('hello@yarova.ca');
  });
});

test.describe('Home — batches table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('batches table renders at least one row', async ({ page }) => {
    const rows = page.locator('.batches tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('batches table has the required columns', async ({ page }) => {
    const headers = await page.locator('.batches thead th').allTextContents();
    const joined = headers.join(' | ');
    expect(joined).toContain('Start date');
    expect(joined).toContain('Track');
    expect(joined).toContain('Seats left');
  });

  test('every non-full row has a Reserve a seat CTA pointing to Cal.com', async ({ page }) => {
    const rows = page.locator('.batches tbody tr:not(.full)');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const cta = rows.nth(i).locator('a.btn');
      const calLink = await cta.getAttribute('data-cal-link');
      expect(calLink, `Row ${i} CTA is not wired to Cal.com`).toBe('yarova-fxqeea/discovery-call');
    }
  });

  test('every row caps at 4 seats total', async ({ page }) => {
    const seats = await page.locator('.batches tbody td.seats').allTextContents();
    for (const s of seats) {
      const m = s.match(/of\s+(\d+)/);
      if (m) expect(Number(m[1]), `Row should show "of 4" not "of ${m[1]}"`).toBe(4);
    }
  });
});

test.describe('Home — pricing', () => {
  test('pricing block shows the $2,400 CAD price', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .price-num')).toContainText('$2,400');
    await expect(page.locator('#pricing .price-num')).toContainText('CAD');
  });

  test('pricing CTA is wired to Cal.com', async ({ page }) => {
    await page.goto('/');
    const calLink = await page.locator('#pricing .btn-amber').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('included list has the guarantee row', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pricing .incl li.guarantee')).toContainText('Rejoin the next batch');
  });
});

test.describe('Home — FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('FAQ has at least 6 questions', async ({ page }) => {
    const details = page.locator('#faq details');
    expect(await details.count()).toBeGreaterThanOrEqual(6);
  });

  test('first FAQ is open by default', async ({ page }) => {
    await expect(page.locator('#faq details[open]')).toHaveCount(1);
  });

  test('clicking a closed FAQ opens it', async ({ page }) => {
    const second = page.locator('#faq details').nth(1);
    await expect(second).not.toHaveAttribute('open', '');
    await second.locator('summary').click();
    await expect(second).toHaveAttribute('open', '');
  });
});

test.describe('Home — floating actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('floating actions render', async ({ page }) => {
    await expect(page.locator('.floating-actions')).toBeAttached();
    await expect(page.locator('.fa-btn.wa')).toBeAttached();
    await expect(page.locator('.fa-btn.cal')).toBeAttached();
  });

  test('WhatsApp link uses the business number', async ({ page }) => {
    const href = await page.locator('.fa-btn.wa').getAttribute('href');
    expect(href).toContain('wa.me/16047197918');
  });

  test('cal button is wired to discovery-call', async ({ page }) => {
    const attr = await page.locator('.fa-btn.cal').getAttribute('data-cal-link');
    expect(attr).toBe('yarova-fxqeea/discovery-call');
  });

  test('no autoplay video or audio', async ({ page }) => {
    expect(await page.locator('[autoplay]').count()).toBe(0);
  });
});

test.describe('Other pages', () => {
  test('about page loads with expected title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Yarova/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Yarova/);
  });
});
