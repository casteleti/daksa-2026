/**
 * Progressive enhancement dos dropdowns do header — fonte: 05 §3 (Dropdown desktop):
 * "abre em hover (200 ms delay) e click; fecha em Esc/click fora; setas navegam".
 * O <details>/<summary> nativo já cobre click + teclado básico + funcionamento sem JS
 * (princípio 2, 00 §2); este módulo só adiciona hover com delay, Esc e navegação por setas.
 */
const HOVER_OPEN_DELAY_MS = 200;

export function enhanceNavDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLDetailsElement>('[data-nav-dropdown]');
  if (!dropdowns.length) return;

  let hoverTimer: ReturnType<typeof setTimeout> | undefined;

  const closeAll = (except?: HTMLDetailsElement) => {
    dropdowns.forEach((d) => {
      if (d !== except) d.open = false;
    });
  };

  dropdowns.forEach((details) => {
    const summary = details.querySelector('summary');
    const panel = details.querySelector<HTMLElement>('.nav-dropdown__panel');
    if (!summary || !panel) return;

    details.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        closeAll(details);
        details.open = true;
      }, HOVER_OPEN_DELAY_MS);
    });

    details.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      details.open = false;
    });

    details.addEventListener('keydown', (event) => {
      const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a'));
      const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

      if (event.key === 'Escape') {
        details.open = false;
        summary.focus();
        event.stopPropagation();
        return;
      }
      if (!details.open) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = links[currentIndex + 1] ?? links[0];
        next?.focus();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = links[currentIndex - 1] ?? links[links.length - 1];
        prev?.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    dropdowns.forEach((details) => {
      if (!details.contains(target)) details.open = false;
    });
  });

  document.addEventListener('astro:before-swap', () => closeAll());
}
