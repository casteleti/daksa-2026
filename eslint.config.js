// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.wrangler/**', 'public/**'],
  },
  {
    rules: {
      // Regra 05/01: sem abstração prematura, sem "utils" genérico — não há regra de
      // lint automática para isso; fica no checklist de PR (09 §4).
      // 'log' permitido: 02 §6 pede log estruturado por lead nos endpoints server (Worker logs).
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // scripts/*.mjs rodam em Node puro (CI, build) — console/process/Buffer são esperados.
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
  {
    // Testes (Vitest/Playwright) — console de diagnóstico é aceitável em falha de teste.
    files: ['tests/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
