import { test, expect } from '@playwright/test';

/** Fonte: 08 §5 — sem overflow horizontal nos viewports de teste, rotas P0. */
const WIDTHS = [320, 375, 393, 412, 768, 1024, 1280, 1536];

for (const width of WIDTHS) {
  test(`sem overflow horizontal em ${width}px (home)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
}

test('landscape 844×390 — header não ocupa mais de 20% da altura (06 §3.9)', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  const headerHeight = await page.locator('header.site-header').evaluate((el) => el.clientHeight);
  expect(headerHeight / 390).toBeLessThan(0.2);
});
