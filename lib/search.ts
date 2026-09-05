import { greaterCatechism, normalizeSearchText } from '@/lib/catechism';
import { confessionChapters } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';
import { thesesDocument } from '@/lib/theses';

export type GlobalSearchResult = {
  documentSlug: string;
  documentTitle: string;
  label: string;
  excerpt: string;
  href: string;
};

const MAX_RESULTS = 8;

function excerpt(value: string) {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > 150 ? clean.slice(0, 147).trimEnd() + '…' : clean;
}

function matches(query: string, ...values: string[]) {
  const normalizedQuery = normalizeSearchText(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  return values.some((value) => {
    const normalizedValue = normalizeSearchText(value);
    return (
      normalizedValue.includes(normalizedQuery) ||
      queryWords.every((word) => normalizedValue.includes(word))
    );
  });
}

export function searchAllDocuments(query: string): GlobalSearchResult[] {
  const normalizedQuery = query.trim();
  if (normalizeSearchText(normalizedQuery).length < 2) return [];

  const results: GlobalSearchResult[] = [];

  for (const entry of greaterCatechism) {
    if (
      matches(
        normalizedQuery,
        `Pergunta ${entry.number}`,
        String(entry.number),
        entry.question,
        entry.answer,
        ...entry.references,
      )
    ) {
      results.push({
        documentSlug: 'catecismo-maior',
        documentTitle: 'Catecismo Maior',
        label: `Pergunta ${entry.number}`,
        excerpt: excerpt(entry.question),
        href: `/catecismo-maior/pergunta/${entry.number}`,
      });
    }
    if (results.length >= MAX_RESULTS) return results;
  }

  for (const entry of shortCatechism) {
    if (
      matches(
        normalizedQuery,
        `Pergunta ${entry.number}`,
        String(entry.number),
        entry.question,
        entry.answer,
        ...entry.references,
      )
    ) {
      results.push({
        documentSlug: 'breve-catecismo',
        documentTitle: 'Breve Catecismo',
        label: `Pergunta ${entry.number}`,
        excerpt: excerpt(entry.question),
        href: `/breve-catecismo/pergunta/${entry.number}`,
      });
    }
    if (results.length >= MAX_RESULTS) return results;
  }

  for (const chapter of confessionChapters) {
    for (const paragraph of chapter.paragraphs) {
      if (
        matches(
          normalizedQuery,
          `Capítulo ${chapter.number}.${paragraph.number}`,
          String(chapter.number),
          chapter.title,
          String(paragraph.number),
          paragraph.statement,
          ...paragraph.references,
        )
      ) {
        results.push({
          documentSlug: 'confissao-de-fe',
          documentTitle: 'Confissão de Fé',
          label: `Capítulo ${chapter.number}.${paragraph.number}`,
          excerpt: excerpt(paragraph.statement),
          href: `/confissao-de-fe/${chapter.number}/${paragraph.number}`,
        });
      }
      if (results.length >= MAX_RESULTS) return results;
    }
  }

  for (const thesis of thesesDocument.theses) {
    if (
      matches(
        normalizedQuery,
        `Tese ${thesis.number}`,
        String(thesis.number),
        thesis.text,
      )
    ) {
      results.push({
        documentSlug: '95-teses',
        documentTitle: '95 Teses de Lutero',
        label: `Tese ${thesis.number}`,
        excerpt: excerpt(thesis.text),
        href: `/95-teses#tese-${thesis.number}`,
      });
    }
    if (results.length >= MAX_RESULTS) return results;
  }

  return results;
}
