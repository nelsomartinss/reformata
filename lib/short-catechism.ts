import rawEntries from '@/content/breve-catecismo.json';
import type { CatechismEntry } from '@/lib/catechism';

export const shortCatechism = rawEntries as CatechismEntry[];

export function getShortEntry(number: number) {
  return shortCatechism.find((entry) => entry.number === number);
}
