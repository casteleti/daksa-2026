import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Fonte: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §4/§5 — 0 violações critical/serious em todas as rotas do build. */

const ROUTES = ['/', '/styleguide/'];

for (const route of ROUTES) {
  test(`axe: ${route} sem violações critical/serious`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (seriousOrCritical.length) {
      console.log(JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });
}
