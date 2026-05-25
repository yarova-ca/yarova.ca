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
    const ids = ['main', 'wall', 'tracks', 'day', 'runway', 'enroll', 'faq'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`), `Section #${id} missing`).toBeAttached();
    }
  });

  test('hero H1 is the literal-truth headline', async ({ page }) => {
    await expect(page.locator('.hero h1')).toContainText('Get Real Canadian DevOps or SRE Production Experience in 8 Weeks');
  });

  test('hero price label is visible and direct', async ({ page }) => {
    await expect(page.locator('.hero .price-label')).toContainText('$2,400 CAD Flat');
    await expect(page.locator('.hero .price-label')).toContainText('No hidden fees');
  });

  test('hero CTA scrolls to enrollment', async ({ page }) => {
    const cta = page.locator('.hero .actions a.btn').first();
    await expect(cta).toBeVisible();
    expect(await cta.getAttribute('href')).toBe('#enroll');
  });
});

test.describe('Home — header & footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('no scarcity bar on the main page', async ({ page }) => {
    await expect(page.locator('.scarcity')).toHaveCount(0);
  });

  test('header has no accounting toggle', async ({ page }) => {
    await expect(page.locator('header a[href="/accounting"]')).toHaveCount(0);
  });

  test('header CTA opens the discovery call directly', async ({ page }) => {
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

  test('footer is visible and shows the company line', async ({ page }) => {
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

test.describe('Home — wall (catch-22)', () => {
  test('three labeled blocks: Loop, Problem, Fix', async ({ page }) => {
    await page.goto('/');
    const labels = await page.locator('#wall .wall-label').allTextContents();
    expect(labels).toEqual(['The Loop', 'The Problem', 'The Fix']);
  });
});

test.describe('Home — tracks', () => {
  test('two track blocks with Focus, What you build, Tool Stack', async ({ page }) => {
    await page.goto('/');
    const tracks = page.locator('#tracks .track-block');
    await expect(tracks).toHaveCount(2);
    await expect(tracks.nth(0)).toContainText('DevOps');
    await expect(tracks.nth(1)).toContainText('Site Reliability Engineering');
    const labels = await page.locator('#tracks .track-block dt').allTextContents();
    for (const label of ['The Focus', 'What you build', 'The Tool Stack']) {
      expect(labels).toContain(label);
    }
  });
});

test.describe('Home — day schedule', () => {
  test('exactly 7 schedule entries', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#day .day-grid li')).toHaveCount(7);
  });

  test('schedule starts at 09:00 and ends at 17:00', async ({ page }) => {
    await page.goto('/');
    const times = await page.locator('#day .day-grid .t').allTextContents();
    expect(times[0]).toBe('09:00');
    expect(times[times.length - 1]).toBe('17:00');
  });
});

test.describe('Home — runway', () => {
  test('exactly 5 numbered runway steps', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#runway .runway-list li')).toHaveCount(5);
  });

  test('finish line statement is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#runway .runway-finish')).toContainText('Probation cleared');
  });
});

test.describe('Home — enrollment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('batches table renders at least one row', async ({ page }) => {
    expect(await page.locator('.batches tbody tr').count()).toBeGreaterThan(0);
  });

  test('every non-full row links to Cal.com discovery call', async ({ page }) => {
    const rows = page.locator('.batches tbody tr:not(.full)');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const cta = rows.nth(i).locator('a.btn');
      const calLink = await cta.getAttribute('data-cal-link');
      expect(calLink).toBe('yarova-fxqeea/discovery-call');
    }
  });

  test('every row caps at 4 seats total', async ({ page }) => {
    const seats = await page.locator('.batches tbody td.seats').allTextContents();
    for (const s of seats) {
      const m = s.match(/of\s+(\d+)/);
      if (m) expect(Number(m[1])).toBe(4);
    }
  });

  test('flat-rate terms list has the 3 expected items', async ({ page }) => {
    await expect(page.locator('#enroll .terms li')).toHaveCount(3);
    await expect(page.locator('#enroll .terms')).toContainText('$2,400 CAD');
    await expect(page.locator('#enroll .terms')).toContainText('Safety Net');
    await expect(page.locator('#enroll .terms')).toContainText('Exclusions');
  });

  test('inline Cal.com calendar container is rendered', async ({ page }) => {
    await expect(page.locator('#cal-discovery-call-inline')).toBeAttached();
  });
});

test.describe('Home — FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('FAQ has at least 6 questions', async ({ page }) => {
    expect(await page.locator('#faq details').count()).toBeGreaterThanOrEqual(6);
  });

  test('all FAQ details start closed (accordion at bottom)', async ({ page }) => {
    await expect(page.locator('#faq details[open]')).toHaveCount(0);
  });

  test('clicking a closed FAQ opens it', async ({ page }) => {
    const first = page.locator('#faq details').first();
    await expect(first).not.toHaveAttribute('open', '');
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
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
