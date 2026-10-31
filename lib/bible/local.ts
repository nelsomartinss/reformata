import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getBibleBookById } from './catalog';
import { parseBibleReferenceList, WHOLE_CHAPTER } from './parser';
import type {
  BibleVerse,
  PassageBatchResponse,
  PassageResponse,
} from './types';

type BookFile = { id: string; chapters: string[][] };

const contentDir = path.join(process.cwd(), 'content', 'biblia-livre');
const books = new Map<string, string[][]>();

function loadBook(bookId: string) {
  const cached = books.get(bookId);
  if (cached) return cached;
  if (!getBibleBookById(bookId)) return undefined;
  const file = JSON.parse(
    readFileSync(path.join(contentDir, `${bookId}.json`), 'utf8'),
  ) as BookFile;
  books.set(bookId, file.chapters);
  return file.chapters;
}

/** Todos os versículos de um capítulo, ou undefined se ele não existir. */
export function getChapterVerses(
  bookId: string,
  chapter: number,
): BibleVerse[] | undefined {
  const verses = loadBook(bookId)?.[chapter - 1];
  return verses?.map((text, index) => ({ number: index + 1, text }));
}

function getVerseRange(
  bookId: string,
  chapter: number,
  start: number,
  end: number,
) {
  const verses = loadBook(bookId)?.[chapter - 1];
  if (!verses) return undefined;
  const last = end === WHOLE_CHAPTER ? verses.length : end;
  if (start < 1 || last > verses.length) return undefined;
  return verses
    .slice(start - 1, last)
    .map((text, index) => ({ number: start + index, text }));
}

function formatRanges(ranges: { start: number; end: number }[]) {
  if (ranges.length === 1 && ranges[0].end === WHOLE_CHAPTER) return '';
  return ranges
    .map((range) =>
      range.start === range.end
        ? `${range.start}`
        : `${range.start}-${range.end}`,
    )
    .join(', ');
}

/**
 * Monta o texto de cada referência. Uma referência pode depender da anterior,
 * como em ["Rm 1:19-20", "2:1, 14-15"], por isso a lista é lida em sequência.
 */
export function getPassages(references: string[]): PassageBatchResponse {
  const labels = [
    ...new Set(references.map((item) => item.trim()).filter(Boolean)),
  ];
  const parsedByLabel = new Map<
    string,
    ReturnType<typeof parseBibleReferenceList>
  >();
  for (const parsed of parseBibleReferenceList(labels)) {
    const list = parsedByLabel.get(parsed.original) ?? [];
    list.push(parsed);
    parsedByLabel.set(parsed.original, list);
  }

  const passages: PassageResponse[] = [];
  const failedReferences: string[] = [];
  for (const label of labels) {
    const parsedList = parsedByLabel.get(label);
    const verses: BibleVerse[] = [];
    const titles: string[] = [];
    let valid = Boolean(parsedList?.length);
    for (const parsed of parsedList ?? []) {
      for (const range of parsed.ranges) {
        const rangeVerses = getVerseRange(
          parsed.book,
          parsed.chapter,
          range.start,
          range.end,
        );
        if (!rangeVerses) valid = false;
        else verses.push(...rangeVerses);
      }
      const bookName = getBibleBookById(parsed.book)?.name ?? parsed.book;
      titles.push(
        `${bookName} ${parsed.chapter}:${formatRanges(parsed.ranges)}`,
      );
    }
    if (!valid) {
      failedReferences.push(label);
      continue;
    }
    passages.push({
      reference: titles.join('; '),
      verses,
      content: verses.map((verse) => verse.text).join(' '),
    });
  }
  return { passages, failedReferences };
}
