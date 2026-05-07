import { test, expect } from '@playwright/test';

test.describe('Homepage — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all 10 section IDs exist', async ({ page }) => {
    const ids = ['hero', 'trust', 'inspect', 'fit', 'roles', 'build', 'includes', 'flow', 'founder', 'schedule'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('hero has correct tag line and CTA', async ({ page }) => {
    await expect(page.locator('.hero-tag')).toContainText('A CONSULTANCY, NOT A BOOTCAMP');
    await expect(page.locator('.s-hero h1')).toContainText('IT placement consultancy');
    await expect(page.locator('.s-hero .btn-primary')).toContainText('Schedule a fit call');
    await expect(page.locator('.cadence')).toContainText('Monthly cohorts');
  });

  test('hero CTA opens cal.com (data-cal-link set)', async ({ page }) => {
    const calLink = await page.locator('.s-hero [data-cal-link]').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('trust strip shows 3 company anchors', async ({ page }) => {
    await expect(page.locator('.trust-anchors li')).toHaveCount(3);
    await expect(page.locator('.trust-anchors')).toContainText('Morgan Stanley');
    await expect(page.locator('.trust-anchors')).toContainText('Salesforce');
    await expect(page.locator('.trust-anchors')).toContainText('BC Government');
  });

  test('trust strip "read background" links to #founder', async ({ page }) => {
    const href = await page.locator('.trust-link').getAttribute('href');
    expect(href).toBe('#founder');
  });

  test('4 buyer profiles exist', async ({ page }) => {
    await expect(page.locator('.profile-card')).toHaveCount(4);
  });

  test('roles table has 5 rows', async ({ page }) => {
    await expect(page.locator('.roles-table tbody tr')).toHaveCount(5);
  });

  test('salary disclaimer is present', async ({ page }) => {
    await expect(page.locator('.disclaimer')).toContainText('does not guarantee placement');
  });

  test('8 phase accordions exist', async ({ page }) => {
    const phases = page.locator('#build .accordion');
    await expect(phases).toHaveCount(8);
  });

  test('3 repo cards exist', async ({ page }) => {
    await expect(page.locator('.repo-card')).toHaveCount(3);
  });

  test('inclusion list has 9 items', async ({ page }) => {
    await expect(page.locator('.inclusion-list li')).toHaveCount(9);
  });

  test('exclusion list has 4 items', async ({ page }) => {
    await expect(page.locator('.exclusion-list li')).toHaveCount(4);
  });

  test('guarantee line is present', async ({ page }) => {
    await expect(page.locator('.guarantee').first()).toContainText('rejoin the next cohort free');
  });

  test('10 A–J flow accordions exist', async ({ page }) => {
    await expect(page.locator('#flow .accordion')).toHaveCount(10);
  });

  test('founder section has anchors and quote', async ({ page }) => {
    await expect(page.locator('.founder-anchors li')).toHaveCount(3);
    await expect(page.locator('.founder-quote')).toContainText('The work is yours');
  });

  test('13 FAQ accordions exist', async ({ page }) => {
    await expect(page.locator('.faq-block .accordion')).toHaveCount(13);
  });

  test('pricing shows $1,500 CAD', async ({ page }) => {
    await expect(page.locator('.price-value')).toContainText('$1,500 CAD');
  });

  test('final CTA has correct heading', async ({ page }) => {
    await expect(page.locator('.final-cta h2')).toContainText('inspected the work');
  });

  test('no autoplay video or audio elements', async ({ page }) => {
    const autoplay = await page.locator('[autoplay]').count();
    expect(autoplay).toBe(0);
  });

  test('no countdown timer or urgency badge elements', async ({ page }) => {
    const timers = await page.locator('[class*="countdown"], [class*="urgency"], [class*="timer"]').count();
    expect(timers).toBe(0);
  });

  test('all CTAs have consistent wording', async ({ page }) => {
    const ctaButtons = page.locator('.btn-primary');
    const count = await ctaButtons.count();
    for (let i = 0; i < count; i++) {
      const text = await ctaButtons.nth(i).textContent();
      // Primary CTAs should say "Schedule a fit call" or "Reserve your seat"
      expect(['Schedule a fit call', 'Reserve your seat'].some(t => text?.includes(t))).toBe(true);
    }
  });
});

test.describe('Homepage — tab interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('first tab panel is visible by default', async ({ page }) => {
    await expect(page.locator('#tab-chapter')).toBeVisible();
    await expect(page.locator('#tab-ticket')).toBeHidden();
    await expect(page.locator('#tab-question')).toBeHidden();
  });

  test('clicking Ticket tab shows ticket panel', async ({ page }) => {
    await page.locator('.tab-btn', { hasText: 'A Ticket' }).click();
    await expect(page.locator('#tab-ticket')).toBeVisible();
    await expect(page.locator('#tab-chapter')).toBeHidden();
  });

  test('clicking Interview Question tab shows question panel', async ({ page }) => {
    await page.locator('.tab-btn', { hasText: 'An Interview Question' }).click();
    await expect(page.locator('#tab-question')).toBeVisible();
    await expect(page.locator('#tab-chapter')).toBeHidden();
  });

  test('active tab has active class', async ({ page }) => {
    await page.locator('.tab-btn', { hasText: 'A Ticket' }).click();
    await expect(page.locator('.tab-btn', { hasText: 'A Ticket' })).toHaveClass(/active/);
    await expect(page.locator('.tab-btn', { hasText: 'A Chapter' })).not.toHaveClass(/active/);
  });
});

test.describe('Homepage — accordions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('phase accordions are closed by default', async ({ page }) => {
    const firstPhase = page.locator('#build .accordion').first();
    await expect(firstPhase).not.toHaveAttribute('open');
  });

  test('clicking a phase accordion opens it', async ({ page }) => {
    const firstPhase = page.locator('#build .accordion').first();
    await firstPhase.locator('summary').click();
    await expect(firstPhase).toHaveAttribute('open', '');
  });

  test('flow accordions are closed by default', async ({ page }) => {
    const firstStage = page.locator('#flow .accordion').first();
    await expect(firstStage).not.toHaveAttribute('open');
  });

  test('clicking a flow accordion opens it', async ({ page }) => {
    const firstStage = page.locator('#flow .accordion').first();
    await firstStage.locator('summary').click();
    await expect(firstStage).toHaveAttribute('open', '');
  });

  test('FAQ accordions are closed by default', async ({ page }) => {
    const firstFaq = page.locator('.faq-block .accordion').first();
    await expect(firstFaq).not.toHaveAttribute('open');
  });

  test('clicking a FAQ accordion opens it', async ({ page }) => {
    const firstFaq = page.locator('.faq-block .accordion').first();
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');
  });
});

test.describe('Homepage — header and footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header logo links to /', async ({ page }) => {
    const href = await page.locator('header .logo').getAttribute('href');
    expect(href).toBe('/');
  });

  test('header CTA opens cal.com (data-cal-link set)', async ({ page }) => {
    const calLink = await page.locator('header [data-cal-link]').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('footer has new tagline', async ({ page }) => {
    await expect(page.locator('.footer-tagline')).toContainText('IT placement consultancy');
  });

  test('footer shows Langley location', async ({ page }) => {
    await expect(page.locator('.built-with')).toContainText('Langley');
  });

  test('footer has no Services link', async ({ page }) => {
    const servicesLink = page.locator('footer a[href="/services"]');
    await expect(servicesLink).toHaveCount(0);
  });
});

test.describe('Mobile — sticky CTA', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sticky CTA is hidden initially', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sticky-cta')).not.toHaveClass(/visible/);
  });

  test('sticky CTA appears after scrolling 50%', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const total = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, total * 0.6);
    });
    await page.waitForTimeout(200);
    await expect(page.locator('#sticky-cta')).toHaveClass(/visible/);
  });

  test('sticky CTA dismiss button hides it', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const total = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, total * 0.6);
    });
    await page.waitForTimeout(200);
    await page.locator('#sticky-dismiss').click();
    await expect(page.locator('#sticky-cta')).not.toHaveClass(/visible/);
  });

  test('sticky CTA opens cal.com (data-cal-link set)', async ({ page }) => {
    await page.goto('/');
    const calLink = await page.locator('.sticky-cta-link').getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Page — about', () => {
  test('about page loads and has correct heading', async ({ page }) => {
    await page.goto('/about');
    // Use .about-header h1 to avoid strict-mode violation from dev toolbar injections
    await expect(page.locator('.about-header h1')).toContainText('IT placement consultancy');
  });

  test('about page has 3 company anchors', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('.anchor-list li')).toHaveCount(3);
  });
});

test.describe('Page — blog', () => {
  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Yarova/);
  });
});
