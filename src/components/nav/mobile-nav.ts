/**
 * Drawer mobile — fonte: 05 §3 (MobileNav), 06 §3.1.
 * <dialog>.showModal() já isola o conteúdo de fundo nativamente (top layer);
 * cobre: abrir por botão, fechar por X/Esc/overlay/swipe, foco no primeiro item,
 * retorno de foco ao trigger.
 */
const SWIPE_CLOSE_THRESHOLD_PX = 80;

export function enhanceMobileNav(): void {
  const trigger = document.querySelector<HTMLButtonElement>('[data-mobile-nav-open]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-nav]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-mobile-nav-close]');
  if (!trigger || !dialog || !closeBtn) return;

  let lastFocused: HTMLElement | null = null;

  const open = () => {
    lastFocused = document.activeElement as HTMLElement;
    dialog.showModal();
    const firstLink = dialog.querySelector<HTMLElement>('a, summary');
    firstLink?.focus();
  };

  const close = () => {
    dialog.close();
    lastFocused?.focus();
  };

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  // Click no overlay (::backdrop não recebe click diretamente — clique fora do
  // conteúdo visível do <dialog> cai no próprio elemento dialog).
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('cancel', () => {
    // Esc nativo do <dialog> já fecha; só garantimos o retorno de foco.
    requestAnimationFrame(() => lastFocused?.focus());
  });

  // Swipe para a direita fecha (Pointer Events; touch-action: pan-y no CSS permite
  // scroll vertical da lista sem interferir no gesto horizontal).
  let startX = 0;
  let tracking = false;
  dialog.style.touchAction = 'pan-y';
  dialog.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    tracking = true;
  });
  dialog.addEventListener('pointerup', (event) => {
    if (!tracking) return;
    tracking = false;
    const delta = event.clientX - startX;
    if (delta > SWIPE_CLOSE_THRESHOLD_PX) close();
  });

  document.addEventListener('astro:before-swap', () => {
    if (dialog.open) dialog.close();
  });
}
