'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { DARK_QUERY, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const getSystemTheme = (): Theme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function saveChoice(theme: Theme | null) {
  try {
    if (theme) window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    else window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Sem armazenamento disponível: a escolha vale apenas para esta visita.
  }
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getTheme,
    () => null,
  );

  // Quando o sistema muda (ex.: modo escuro automático à noite), o site acompanha
  // e a escolha manual é descartada: a preferência do sistema tem prioridade.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    function onSystemChange() {
      saveChoice(null);
      applyTheme(getSystemTheme());
    }
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  function toggle() {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    // Voltar ao mesmo tema do sistema equivale a voltar ao modo automático.
    saveChoice(next === getSystemTheme() ? null : next);
  }

  const label =
    theme === 'dark'
      ? 'Usar modo claro'
      : theme === 'light'
        ? 'Usar modo escuro'
        : 'Alternar entre modo claro e escuro';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={`${label} (por padrão, o site segue o tema do seu aparelho)`}
      className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
}
