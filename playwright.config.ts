import { defineConfig, devices } from '@playwright/test';

/**
 * Fonte: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §5.
 *
 * SEM `webServer` automático de propósito: `astro preview` neste projeto se autodaemoniza
 * (roda em background e retorna o controle imediatamente, mesmo sem `--background` — ver
 * AGENTS.md e docs/inputs.md) quando não há um TTY interativo, o que quebra o gerenciamento
 * de processo em foreground que o Playwright espera do `webServer.command`. Suba o servidor
 * antes de rodar os testes: `npm run build && npm run preview` (ou `npx astro preview
 * --background`), depois `npm run test:e2e`; ao final, `npx astro preview stop`. O workflow
 * de CI (.github/workflows/ci.yml) faz isso explicitamente com espera de porta.
 */
export default defineConfig({
  testDir: './tests',
  // tests/unit é Vitest (describe/it globais diferentes) — nunca roda pelo Playwright.
  testIgnore: ['**/unit/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // Viewports de 06 §3.9 / 08 §5 — usados nos testes de tests/visual e tests/e2e responsivo.
    { name: 'mobile-iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'mobile-pixel-8', use: { viewport: { width: 412, height: 915 } } },
  ],
});
