import { confessionParagraphs } from '@/lib/confession';
import { greaterCatechism } from '@/lib/catechism';
import { lutherTheses } from '@/lib/theses';
import { shortCatechism } from '@/lib/short-catechism';
import { parseBibleReferenceList } from './parser';
import type { BibleReferenceLink } from './types';

function createIndex() {
  const links: BibleReferenceLink[] = [];

  function addEntry(args: {
    documentSlug: string;
    documentTitle: string;
    kind: BibleReferenceLink['kind'];
    label: string;
    excerpt: string;
    href: string;
    references: string[];
  }) {
    let parsedReferences;
    try {
      parsedReferences = parseBibleReferenceList(args.references);
    } catch (error) {
      console.warn('[Reformata] referência ignorada no índice bíblico', args, error);
      return;
    }

    for (const parsed of parsedReferences) {
      for (const range of parsed.ranges) {
        links.push({
          id: `${args.documentSlug}-${args.label}-${parsed.normalized}`,
          book: parsed.book,
          chapter: parsed.chapter,
          verseStart: range.start,
          verseEnd: range.end,
          documentSlug: args.documentSlug,
          documentTitle: args.documentTitle,
          label: args.label,
          excerpt: args.excerpt,
          href: args.href,
          kind: args.kind,
          sourceReference: parsed.normalized,
        });
      }
    }
  }

  greaterCatechism.forEach((entry) =>
    addEntry({
      documentSlug: 'catecismo-maior',
      documentTitle: 'Catecismo Maior de Westminster',
      kind: 'question',
      label: `Pergunta ${entry.number}`,
      excerpt: entry.question,
      href: `/catecismo-maior/pergunta/${entry.number}`,
      references: entry.references,
    }),
  );

  shortCatechism.forEach((entry) =>
    addEntry({
      documentSlug: 'breve-catecismo',
      documentTitle: 'Breve Catecismo de Westminster',
      kind: 'question',
      label: `Pergunta ${entry.number}`,
      excerpt: entry.question,
      href: `/breve-catecismo/pergunta/${entry.number}`,
      references: entry.references,
    }),
  );

  confessionParagraphs.forEach(({ chapter, paragraph }) =>
    addEntry({
      documentSlug: 'confissao-de-fe',
      documentTitle: 'Confissão de Fé de Westminster',
      kind: 'paragraph',
      label: `Capítulo ${chapter.roman}, §${paragraph.number}`,
      excerpt: paragraph.statement,
      href: `/confissao-de-fe/${chapter.number}/${paragraph.number}`,
      references: paragraph.references,
    }),
  );

  lutherTheses.forEach((thesis) =>
    addEntry({
      documentSlug: '95-teses',
      documentTitle: '95 Teses de Martinho Lutero',
      kind: 'thesis',
      label: `Tese ${thesis.number}`,
      excerpt: thesis.text,
      href: `/95-teses#tese-${thesis.number}`,
      references: thesis.references ?? [],
    }),
  );

  return links;
}

export const bibleReferenceIndex = createIndex();

export function getBibleReferenceLinks(book: string, chapter: number, verse: number) {
  return bibleReferenceIndex.filter(
    (link) =>
      link.book === book &&
      link.chapter === chapter &&
      verse >= link.verseStart &&
      verse <= link.verseEnd,
  );
}
