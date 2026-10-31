import { getCanonicalBookId, singleChapterBookIds } from './books';
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

/** Usado quando a referência cita um capítulo inteiro (ex.: "Gn 1"). */
export const WHOLE_CHAPTER = Number.MAX_SAFE_INTEGER;

export function parseBibleReference(label: string): ParsedBibleReference {
  const original = label.trim();
  const cleaned = original
    .replace(/[()[\]]/g, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\.\s+[A-Za-z\u00c0-\u00ff].*$/u, '')
    // "Ne, 9:6" → "Ne 9:6"
    .replace(/^((?:(?:[1-3]|I{1,3})\s*)?[A-Za-z\u00c0-\u00ff]+)\s*,\s*/u, '$1 ')
    .trim();
  const match = cleaned.match(
    /^((?:(?:[1-3]|I{1,3})\s*)?[A-Za-z\u00c0-\u00ff]+)\.?\s*(\d+)(?:\s*[:.]\s*(\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*))?$/u,
  );
  if (!match) throw new Error('REFERENCIA_INVALIDA');
  const bookLabel = match[1].trim();
  const book = getCanonicalBookId(bookLabel);
  if (!book) throw new Error('REFERENCIA_INVALIDA');
  let chapter = Number(match[2]);
  let ranges: VerseRange[];
  if (match[3]) {
    ranges = parseRanges(match[3]);
  } else if (singleChapterBookIds.includes(book)) {
    // "Jd 6" = Judas, versículo 6.
    ranges = [{ start: chapter, end: chapter }];
    chapter = 1;
  } else {
    ranges = [{ start: 1, end: WHOLE_CHAPTER }];
  }
  const normalizedRanges = ranges
    .map((range) =>
      range.end === WHOLE_CHAPTER
        ? ''
        : range.start === range.end
          ? String(range.start)
          : range.start + '-' + range.end,
    )
    .join(',');
  return {
    original,
    normalized:
      bookLabel.replace(/[.]$/, '') +
      ' ' +
      chapter +
      (normalizedRanges ? ':' + normalizedRanges : ''),
    book,
    chapter,
    ranges,
  };
}

const BOOK_PATTERN = '(?:(?:[1-3]|I{1,3})\\s*)?[A-Za-z\\u00c0-\\u00ff]+';

/**
 * Corrige variações de digitação comuns nas referências dos documentos:
 * "Ne, 9:6", "Sl .2:8", "Mt I5:9", "Rm 7:23, e 6:14" e pontuação solta no fim.
 */
function normalizeLabel(label: string) {
  return label
    .replace(/\u2192/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/(^|[\s:,-])[Il](?=\d)/g, (_, prefix: string) => prefix + '1')
    .replace(
      new RegExp('^(' + BOOK_PATTERN + ')\\s*[,.]?\\s*\\.?\\s*(?=\\d)', 'u'),
      '$1 ',
    )
    .replace(/,?\s+e\s*(?=\d)/gi, ';')
    .replace(/[\s,.;:]+$/, '')
    .trim();
}

export function parseBibleReferenceList(labels: string[]) {
  let previousBook: string | undefined;
  let previousChapter: number | undefined;
  const parsed: ParsedBibleReference[] = [];

  for (const label of labels) {
    const original = label.trim();
    if (!original) continue;
    const chunks = normalizeLabel(original)
      .replace(/\s+e\s+/gi, ';')
      .split(
        /,\s*(?=(?:(?:[1-3]|I{1,3})\s*)?[A-Za-z\u00c0-\u00ff]+\.?\s*\d+\s*[:.]|\d+\s*:)/u,
      )
      .flatMap((chunk) => chunk.split(';'))
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      let candidate = chunk;
      if (previousBook && /^\d+\s*[:.]/.test(chunk)) {
        candidate = previousBook + ' ' + chunk;
      } else if (
        previousBook &&
        previousChapter &&
        /^\d+(?:\s*-\s*\d+)?$/.test(chunk)
      ) {
        candidate = previousBook + ' ' + previousChapter + ':' + chunk;
      }

      let value: ParsedBibleReference;
      try {
        value = parseBibleReference(candidate);
      } catch {
        continue;
      }
      previousBook = value.book;
      previousChapter = value.chapter;
      parsed.push({ ...value, original });
    }
  }

  return parsed;
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
