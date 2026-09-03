import rawEntries from '@/content/catecismo-maior.json';

export type CatechismEntry = {
  number: number;
  question: string;
  answer: string;
  references: string[];
};

export const greaterCatechism = rawEntries as CatechismEntry[];

export function getEntry(number: number) {
  return greaterCatechism.find((entry) => entry.number === number);
}

export function normalizeSearchText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function findEntry(entries: CatechismEntry[], number: number) {
  return entries.find((entry) => entry.number === number);
}

export function searchEntries(entries: CatechismEntry[], query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return entries;
  return entries.filter((entry) => {
    const haystack = normalizeSearchText(`${entry.number} ${entry.question} ${entry.answer} ${entry.references.join(' ')}`);
    return haystack.includes(normalizedQuery);
  });
}
