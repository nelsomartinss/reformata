import { getCanonicalBookId } from './books';
import type { ParsedBibleReference, VerseRange } from './types';

function parseRanges(value: string): VerseRange[] {
  return value.split(',').map((range) => {
    const match = range.trim().match(/^(\d+)(?:\s*[-\u2013\u2014]\s*(\d+))?$/);
    if (!match) throw new Error('REFERENCIA_INVALIDA');
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start) throw new Error('REFERENCIA_INVALIDA');
    return { start, end };
  });
}

export function parseBibleReference(label: string): ParsedBibleReference {
  const original = label.trim();
  const cleaned = original
    .replace(/[()[\]]/g, '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
  const match = cleaned.match(
    /^([1-3]?\s*[A-Za-z\u00c0-\u00ff]+)\.?\s+(\d+)\s*[:.]\s*(\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*)$/,
  );
  if (!match) throw new Error('REFERENCIA_INVALIDA');
  const book = getCanonicalBookId(match[1]);
  if (!book) throw new Error('REFERENCIA_INVALIDA');
  const chapter = Number(match[2]);
  const ranges = parseRanges(match[3]);
  const normalizedRanges = ranges
    .map((range) =>
      range.start === range.end
        ? String(range.start)
        : range.start + '-' + range.end,
    )
    .join(',');
  return {
    original,
    normalized:
      match[1].trim().replace(/[.]$/, '') +
      ' ' +
      chapter +
      ':' +
      normalizedRanges,
    book,
    chapter,
    ranges,
  };
}

export function rangePassageId(
  bookId: string,
  chapter: number,
  range: VerseRange,
) {
  const first = bookId + '.' + chapter + '.' + range.start;
  return range.start === range.end
    ? first
    : first + '-' + bookId + '.' + chapter + '.' + range.end;
}
