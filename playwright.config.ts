import { defineConfig, devices } from '@playwright/test';

// iOS user agent for custom WebKit phone definitions
const iosUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

// Android Chrome user agent for custom Chromium phone definitions
const androidUA = 'Mozilla/5.0 (Linux; Android 15; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    // ── iOS phones — WebKit ───────────────────────────────────────────
    {
      name: 'webkit-phone-375',
      use: {
        ...devices['iPhone SE'],         // iPhone SE 3rd gen — 375×667
      },
    },
    {
      name: 'webkit-phone-390',
      use: {
        ...devices['iPhone 15'],         // iPhone 14 / 15 / 16 standard — 390×844
      },
    },
    {
      name: 'webkit-phone-393',
      use: {
        ...devices['iPhone 15 Pro'],     // iPhone 14/15 Pro — 393×852
      },
    },
    {
      name: 'webkit-phone-402',
      use: {
        // iPhone 16 Pro — new viewport not in Playwright presets yet
        viewport: { width: 402, height: 874 },
        userAgent: iosUA,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'webkit-phone-428',
      use: {
        ...devices['iPhone 14 Plus'],    // iPhone 14 Plus — 428×926
      },
    },
    {
      name: 'webkit-phone-430',
      use: {
        ...devices['iPhone 15 Pro Max'], // iPhone 15/16 Plus + Pro Max — 430×932
      },
    },
    {
      name: 'webkit-phone-440',
      use: {
        // iPhone 16 Pro Max — new viewport not in Playwright presets yet
        viewport: { width: 440, height: 956 },
        userAgent: iosUA,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },

    // ── Android phones — Chromium ────────────────────────────────────
    {
      name: 'chromium-phone-320',
      use: {
        // Smallest Android / old iPhone SE — 320×568
        viewport: { width: 320, height: 568 },
        userAgent: androidUA,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-phone-360',
      use: {
        // Samsung Galaxy S24 / S25 / A55 — 360×780
        viewport: { width: 360, height: 780 },
        userAgent: androidUA,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-phone-412',
      use: {
        ...devices['Pixel 7'],           // Pixel 7/8/9 + Galaxy S25 Ultra — 412×915
      },
    },

    // ── iPads — WebKit ───────────────────────────────────────────────
    {
      name: 'webkit-tablet-744',
      use: {
        ...devices['iPad Mini'],         // iPad Mini 6 — 744×1133
      },
    },
    {
      name: 'webkit-tablet-820',
      use: {
        // iPad 10th gen (810×1080) + iPad Air 5 (820×1180) — use 820
        viewport: { width: 820, height: 1180 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },
    {
      name: 'webkit-tablet-834',
      use: {
        ...devices['iPad Pro 11'],       // iPad Pro 11" — 834×1194
      },
    },
    {
      name: 'webkit-tablet-1024',
      use: {
        // iPad Pro 12.9" — 1024×1366
        viewport: { width: 1024, height: 1366 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },

    // ── Android tablet — Chromium ────────────────────────────────────
    {
      name: 'chromium-tablet-800',
      use: {
        // Samsung Galaxy Tab S9/S10/A9 — 800×1280
        viewport: { width: 800, height: 1280 },
        userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },

    // ── Laptops + Desktops — Chromium ────────────────────────────────
    {
      name: 'chromium-laptop-1280',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },  // Windows 13" / MacBook Air
      },
    },
    {
      name: 'chromium-laptop-1366',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },  // Windows 15" HD (most common)
      },
    },
    {
      name: 'chromium-desktop-1440',
      use: { ...devices['Desktop Chrome'] },     // 1440×900 standard desktop
    },
    {
      name: 'chromium-desktop-1920',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // FHD desktop / Windows 15" FHD
      },
    },
    {
      name: 'chromium-desktop-2560',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 }, // QHD desktop / iMac 24"
      },
    },

    // ── Laptops + Desktops — WebKit (Safari) ─────────────────────────
    {
      name: 'webkit-laptop-1280',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 800 },  // MacBook Air 13"
      },
    },
    {
      name: 'webkit-desktop-1440',
      use: { ...devices['Desktop Safari'] },     // MacBook Pro 14" — 1440×900
    },

    // ── Laptops + Desktops — Firefox ─────────────────────────────────
    {
      name: 'firefox-laptop-1280',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'firefox-desktop-1440',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    // Serve the built production output. `astro dev` cold-start was exceeding
    // the 30s webServer timeout in CI and tripping the whole job.
    // Tests assume `npm run build` ran first (CI does this; locally,
    // reuseExistingServer lets devs point at `npm run dev` themselves).
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
