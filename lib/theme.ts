/**
 * Preferência de tema escolhida manualmente. Sem ela, o site segue o sistema.
 * (O nome mudou de "reformata-theme" para descartar escolhas antigas, salvas
 * quando o botão ainda ignorava o sistema.)
 */
export const THEME_STORAGE_KEY = 'reformata-tema';

export type Theme = 'light' | 'dark';

export const DARK_QUERY = '(prefers-color-scheme: dark)';
