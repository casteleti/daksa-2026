import { test, expect } from '@playwright/test';

/** Smoke — fonte: 02 §7 CI gate ("Playwright E2E smoke"). Fluxos completos de diagnóstico/
 * contato entram na Fase 2/3, quando essas páginas existirem. */

test.describe('Fundação — Fase 1', () => {
  test('home carrega, tem H1 único e sem erros de console', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test('skip link é o primeiro elemento focável', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
  });

  test('styleguide carrega (QA interno, noindex)', async ({ page }) => {
    const response = await page.goto('/styleguide/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('404 real do Astro não vaza para rota inexistente sem cair em erro 500', async ({
    page,
  }) => {
    const response = await page.goto('/rota-que-nao-existe/');
    expect(response?.status()).toBe(404);
  });

  test('/api/healthz responde 200 com JSON', async ({ request }) => {
    const response = await request.get('/api/healthz/');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('header: dropdown "O que fazemos" abre por click e fecha por Esc', async ({ page }) => {
    await page.goto('/');
    // "O que fazemos" é o primeiro dos 3 dropdowns do header, em ordem de DOM (03 §2).
    const details = page.locator('.nav-dropdown').first();
    const trigger = details.locator('summary');
    await expect(trigger).toHaveText('O que fazemos');
    // force:true — a checagem de estabilidade do Chromium headless não converge no header
    // sticky (composição de backdrop-filter/scroll); o clique em si funciona normalmente
    // (confirmado via page.evaluate). Não mascara bug funcional, só a checagem de animação.
    await trigger.click({ force: true });
    await expect(details).toHaveJSProperty('open', true);
    await page.keyboard.press('Escape');
    await expect(details).toHaveJSProperty('open', false);
  });
});
