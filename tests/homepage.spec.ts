import { test, expect } from '@playwright/test';

test.describe('Homepage — core sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('key section IDs exist', async ({ page }) => {
    const ids = ['hero', 'ensure', 'path', 'track', 'pricing', 'faq', 'cta-final'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('hero headline contains expected text', async ({ page }) => {
    await expect(page.locator('#hero h1')).toContainText('understand the system');
  });

  test('hero has two CTA buttons', async ({ page }) => {
    await expect(page.locator('#hero .hero-actions .btn')).toHaveCount(2);
  });

  test('hero meta grid has 4 cells', async ({ page }) => {
    await expect(page.locator('#hero .hero-meta .cell')).toHaveCount(4);
  });

  test('hero meta shows program fee label', async ({ page }) => {
    await expect(page.locator('#hero .hero-meta')).toContainText('Program fee');
    await expect(page.locator('#hero .hero-meta')).toContainText('Monthly cohorts');
  });

  test('hero uses enrolled language not graduates', async ({ page }) => {
    const text = await page.locator('#hero').textContent();
    expect(text).toContain('engineers enrolled');
    expect(text).not.toContain('all graduates');
  });

  test('hero primary CTA opens cal.com directly', async ({ page }) => {
    const cta = page.locator('#hero .hero-actions .btn-amber');
    const calLink = await cta.getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('hero eyebrow shows engineers placed count', async ({ page }) => {
    await expect(page.locator('#hero .hero-eyebrow')).toContainText('engineers placed');
  });

  test('placement stream chips exist below hero actions', async ({ page }) => {
    await expect(page.locator('.placement-stream')).toBeAttached();
    await expect(page.locator('.chip')).toHaveCount(10);
  });

  test('trust anchor line exists below hero CTAs', async ({ page }) => {
    await expect(page.locator('.trust-anchor')).toContainText('No commission');
    await expect(page.locator('.trust-anchor')).toContainText('Flat $1,500');
  });

  test('authority strip has 4 stats', async ({ page }) => {
    await expect(page.locator('.authority .cell')).toHaveCount(4);
  });

  test('authority strip shows 23 cohorts', async ({ page }) => {
    await expect(page.locator('.authority')).toContainText('June 2026');
  });

  test('anchor pricing strip has 4 columns', async ({ page }) => {
    await expect(page.locator('.anchor-strip .col')).toHaveCount(4);
  });

  test('anchor pricing strip has placement agency column', async ({ page }) => {
    await expect(page.locator('.anchor-strip')).toContainText('Placement agency');
    expect(await page.locator('.anchor-strip').textContent()).not.toContain('CS degree');
  });

  test('Yarova column is highlighted in anchor strip', async ({ page }) => {
    await expect(page.locator('.anchor-strip .col.us')).toHaveCount(1);
    await expect(page.locator('.anchor-strip .col.us')).toContainText('$1,500');
  });

  test('ensure section has 3 cards with new headings', async ({ page }) => {
    await expect(page.locator('.ensure-card')).toHaveCount(3);
    await expect(page.locator('.ensure-card').nth(0)).toContainText('visual tool');
    await expect(page.locator('.ensure-card').nth(1)).toContainText('tickets');
  });

  test('request path has 7 nodes', async ({ page }) => {
    await expect(page.locator('.path-node')).toHaveCount(7);
  });

  test('layers detail has 12 rows', async ({ page }) => {
    await expect(page.locator('.layer-row')).toHaveCount(12);
  });

  test('track record shows twenty-three cohorts heading', async ({ page }) => {
    await expect(page.locator('#track h2')).toContainText('Twenty-three');
    await expect(page.locator('#track h2')).toContainText('Three hundred and seventy');
  });

  test('track record table has 23 cohort rows plus COVID pause row', async ({ page }) => {
    await expect(page.locator('.track-table tbody tr:not(.covid-pause)')).toHaveCount(23);
    await expect(page.locator('.track-table .covid-pause')).toHaveCount(1);
  });

  test('cohort bar shows June 2026 and pulse dot', async ({ page }) => {
    await expect(page.locator('.cohort-bar')).toContainText('June 2026');
    await expect(page.locator('.cohort-bar .seats')).toContainText('1 remaining');
    await expect(page.locator('.pulse-dot')).toBeAttached();
  });

  test('track record celebration row exists', async ({ page }) => {
    await expect(page.locator('.celebrate-row')).toBeAttached();
    await expect(page.locator('.celebrate-row')).toContainText('370 engineers placed');
  });

  test('guarantee seal badge exists', async ({ page }) => {
    await expect(page.locator('.seal-badge')).toContainText('GUARANTEED');
  });

  test('CTA section heading is Tell us about yourself', async ({ page }) => {
    await expect(page.locator('#cta-final h2')).toContainText('Tell us about yourself');
  });

  test('testimonials grid has 6 cards', async ({ page }) => {
    await expect(page.locator('.testi')).toHaveCount(6);
  });

  test('journey section exists with 3 main stages and 3 parallel stages', async ({ page }) => {
    await expect(page.locator('#journey')).toBeAttached();
    await expect(page.locator('.jstage')).toHaveCount(6);
  });

  test('journey heading is correct', async ({ page }) => {
    await expect(page.locator('#journey h2')).toContainText('Three tracks running in parallel');
  });

  test('compare matrix has placement agency column not CS degree', async ({ page }) => {
    await expect(page.locator('.matrix')).toContainText('Placement agency');
    expect(await page.locator('.matrix').textContent()).not.toContain('CS degree');
  });

  test('compare matrix has 8 rows', async ({ page }) => {
    await expect(page.locator('.matrix tbody tr')).toHaveCount(8);
  });

  test('pricing shows $1,500 CAD and June 2026', async ({ page }) => {
    await expect(page.locator('.price-card .price')).toContainText('$1,500');
    await expect(page.locator('.price-card .price .ccy')).toContainText('CAD');
    await expect(page.locator('.price-card .label')).toContainText('June 2026');
  });

  test('pricing CTA has data-cal-link (opens cal.com directly)', async ({ page }) => {
    const cta = page.locator('.price-card .btn-amber');
    const calLink = await cta.getAttribute('data-cal-link');
    expect(calLink).toBe('yarova-fxqeea/discovery-call');
  });

  test('included list has 10 items', async ({ page }) => {
    await expect(page.locator('.price-list ul').first().locator('li')).toHaveCount(10);
  });

  test('not-included list has 4 items', async ({ page }) => {
    await expect(page.locator('.price-list ul').last().locator('li.no')).toHaveCount(4);
  });

  test('FAQ has 8 questions with new heading', async ({ page }) => {
    await expect(page.locator('.faq details')).toHaveCount(8);
    await expect(page.locator('#faq h2')).toContainText('before committing');
  });

  test('first FAQ is open by default', async ({ page }) => {
    await expect(page.locator('.faq details[open]')).toHaveCount(1);
  });

  test('FAQ glyph shows minus when open', async ({ page }) => {
    const firstDetails = page.locator('.faq details').first();
    await expect(firstDetails.locator('.glyph')).toContainText('−');
  });

  test('clicking a closed FAQ opens it and shows minus glyph', async ({ page }) => {
    const second = page.locator('.faq details').nth(1);
    await expect(second).not.toHaveAttribute('open');
    await second.locator('summary').click();
    await expect(second).toHaveAttribute('open', '');
    await expect(second.locator('.glyph')).toContainText('−');
  });

  test('final CTA section heading exists', async ({ page }) => {
    await expect(page.locator('#cta-final h2')).toBeAttached();
  });

  test('fit-call form has 4 steps', async ({ page }) => {
    await expect(page.locator('#bookFlow .step')).toHaveCount(4);
    await expect(page.locator('#bookFlow .step.on')).toHaveCount(1);
  });

  test('twin lane section has 2 lanes', async ({ page }) => {
    await expect(page.locator('.cta-final .twin .lane')).toHaveCount(2);
  });

  test('no autoplay video or audio', async ({ page }) => {
    const count = await page.locator('[autoplay]').count();
    expect(count).toBe(0);
  });
});

test.describe('Homepage — header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('scarcity bar mentions June 2026 cohort', async ({ page }) => {
    await expect(page.locator('.scarcity')).toBeVisible();
    await expect(page.locator('.scarcity')).toContainText('June 2026');
  });

  test('header logo links to /', async ({ page }) => {
    const href = await page.locator('.site-header .brand').getAttribute('href');
    expect(href).toBe('/');
  });

  test('service switch has Placement and Accounting links', async ({ page }) => {
    await expect(page.locator('.service-switch a')).toHaveCount(2);
    await expect(page.locator('.service-switch a.on')).toContainText('Placement');
  });

  test('nav CTA links to #cta-final', async ({ page }) => {
    const href = await page.locator('.nav-links a.btn-amber').getAttribute('href');
    expect(href).toBe('#cta-final');
  });

  test('countdown timer renders in scarcity bar', async ({ page }) => {
    const el = page.locator('#countdown');
    await expect(el).toBeAttached();
    const text = await el.textContent();
    expect(text).toMatch(/in \d+d \d+h \d+m|now/);
  });
});

test.describe('Homepage — footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('contact strip has 3 cells', async ({ page }) => {
    await expect(page.locator('.contact-strip .cell')).toHaveCount(3);
  });

  test('contact strip has cal.com, WhatsApp, email', async ({ page }) => {
    await expect(page.locator('.contact-strip')).toContainText('yarova-fxqeea/discovery-call');
    await expect(page.locator('.contact-strip')).toContainText('+1 (604) 719');
    await expect(page.locator('.contact-strip')).toContainText('hello@yarova.ca');
  });

  test('footer shows Langley and operating since 2018', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Langley');
    await expect(page.locator('footer')).toContainText('2018');
  });

  test('footer links include blog and about', async ({ page }) => {
    await expect(page.locator('.foot-links a[href="/blog"]')).toHaveCount(1);
    await expect(page.locator('.foot-links a[href="/about"]')).toHaveCount(1);
  });
});

test.describe('Homepage — fit-call form flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#cta-final').scrollIntoViewIfNeeded();
  });

  test('step 1 is shown initially', async ({ page }) => {
    await expect(page.locator('#bookFlow .step.on .q')).toContainText('Question 1 of 3');
  });

  test('selecting an option advances to step 2', async ({ page }) => {
    await page.locator('#bookFlow .step.on .opt').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('#bookFlow .step.on .q')).toContainText('Question 2 of 3');
  });

  test('back button returns to step 1', async ({ page }) => {
    await page.locator('#bookFlow .step.on .opt').first().click();
    await page.waitForTimeout(300);
    await page.locator('#bookFlow .step.on .back').click();
    await expect(page.locator('#bookFlow .step.on .q')).toContainText('Question 1 of 3');
  });
});

test.describe('Homepage — floating actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('floating actions exist', async ({ page }) => {
    await expect(page.locator('.floating-actions')).toBeAttached();
    await expect(page.locator('.fa-btn.wa')).toBeAttached();
    await expect(page.locator('.fa-btn.cal')).toBeAttached();
  });

  test('WhatsApp link has correct href', async ({ page }) => {
    const href = await page.locator('.fa-btn.wa').getAttribute('href');
    expect(href).toContain('wa.me/16047197918');
  });

  test('cal button has data-cal-link attribute', async ({ page }) => {
    const attr = await page.locator('.fa-btn.cal').getAttribute('data-cal-link');
    expect(attr).toBe('yarova-fxqeea/discovery-call');
  });
});

test.describe('Homepage — reading preferences', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('preferences toggle button exists', async ({ page }) => {
    await expect(page.locator('#prefsToggle')).toBeVisible();
  });

  test('preferences panel opens on toggle click', async ({ page }) => {
    await expect(page.locator('#prefsPanel')).toBeHidden();
    await page.locator('#prefsToggle').click();
    await expect(page.locator('#prefsPanel')).toBeVisible();
  });

  test('two preference switches exist', async ({ page }) => {
    await page.locator('#prefsToggle').click();
    await expect(page.locator('.switch')).toHaveCount(2);
  });
});

test.describe('Page — about', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Yarova/);
  });
});

test.describe('Page — blog', () => {
  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Yarova/);
  });
});
