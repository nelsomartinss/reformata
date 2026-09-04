import { canonicalBookIds, normalizeBookName } from './books';
import { parseBibleReference, rangePassageId } from './parser';
import {
  BibleServiceError,
  type BibleApiBible,
  type BibleApiBook,
  type BibleApiEnvelope,
  type BibleApiPassage,
  type BibleVersion,
  type PassageResponse,
  type PassageBatchResponse,
  type ParsedBibleReference,
} from './types';

export const API_BASE_URL = 'https://rest.api.bible';
const CACHE_SECONDS = 60 * 60 * 24;
const REQUEST_TIMEOUT_MS = 12_000;

function getApiKey() {
  const apiKey = process.env.BIBLE_API_KEY?.trim();
  if (!apiKey || apiKey === 'COLE_AQUI_SUA_CHAVE_DA_API_BIBLE') {
    throw new BibleServiceError(
      'API_CHAVE_NAO_CONFIGURADA',
      503,
      'A chave da API.Bible nao esta configurada.',
    );
  }
  return apiKey;
}

function mapResponseError(status: number, endpoint: string) {
  if (status === 401 || status === 403) {
    return new BibleServiceError(
      'API_NAO_AUTORIZADA',
      status,
      'A API.Bible nao autorizou a solicitacao.',
    );
  }
  if (status === 404) {
    return new BibleServiceError(
      'API_NAO_ENCONTRADA',
      404,
      'O recurso biblico nao foi encontrado.',
    );
  }
  if (status === 429) {
    return new BibleServiceError(
      'LIMITE_API',
      429,
      'O limite de requisicoes da API.Bible foi atingido.',
    );
  }
  console.error('[API.Bible]', status, endpoint);
  return new BibleServiceError(
    'API_INDISPONIVEL',
    502,
    'A API.Bible esta temporariamente indisponivel.',
  );
}

async function request<T>(path: string, searchParams?: URLSearchParams) {
  const url = new URL(path, API_BASE_URL);
  if (searchParams) url.search = searchParams.toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'api-key': getApiKey(),
      },
      next: { revalidate: CACHE_SECONDS },
      signal: controller.signal,
    });
    if (!response.ok) throw mapResponseError(response.status, path);
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof BibleServiceError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new BibleServiceError(
        'API_TIMEOUT',
        504,
        'A API.Bible demorou demais para responder.',
      );
    }
    console.error('[API.Bible]', path, error);
    throw new BibleServiceError(
      'API_INDISPONIVEL',
      502,
      'Nao foi possivel acessar a API.Bible.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

function toVersion(bible: BibleApiBible, configuredId?: string): BibleVersion {
  return {
    id: bible.id,
    abbreviation: bible.abbreviationLocal ?? bible.abbreviation ?? bible.id,
    name: bible.nameLocal ?? bible.name ?? 'Traducao biblica',
    publisher: 'API.Bible',
    configured: bible.id === configuredId,
    copyright: bible.copyright,
  };
}

export async function getAvailablePortugueseBibles(): Promise<BibleVersion[]> {
  const params = new URLSearchParams({
    language: 'por',
    'include-full-details': 'true',
  });
  const response = await request<BibleApiEnvelope<BibleApiBible[]>>(
    '/v1/bibles',
    params,
  );
  return (response.data ?? []).map((bible) =>
    toVersion(bible, process.env.BIBLE_ID?.trim()),
  );
}

async function getBooks(bibleId: string) {
  const params = new URLSearchParams({ 'include-chapters': 'false' });
  const response = await request<BibleApiEnvelope<BibleApiBook[]>>(
    '/v1/bibles/' + encodeURIComponent(bibleId) + '/books',
    params,
  );
  return response.data ?? [];
}

async function resolveBookId(bibleId: string, parsed: ParsedBibleReference) {
  const books = await getBooks(bibleId);
  const direct = books.find(
    (book) => book.id.trim().toUpperCase() === parsed.book.toUpperCase(),
  );
  if (direct) return direct.id;
  const normalized = normalizeBookName(parsed.book);
  const matchingBook = books.find((book) =>
    [book.abbreviation, book.name, book.nameLong]
      .filter(Boolean)
      .some(
        (value) =>
          normalizeBookName(value as string) === normalized ||
          (value as string).trim().toUpperCase() === parsed.book.toUpperCase(),
      ),
  );
  if (matchingBook) return matchingBook.id;
  if (canonicalBookIds.includes(parsed.book)) return parsed.book;
  throw new BibleServiceError(
    'LIVRO_NAO_ENCONTRADO',
    422,
    'O livro biblico nao existe nesta traducao.',
  );
}

function cleanContent(content: string) {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function createVerses(content: string, parsed: ParsedBibleReference) {
  const clean = cleanContent(content);
  const matches = [
    ...clean.matchAll(
      /(?:^|\s)(\d{1,3})[.)]?\s+(.+?)(?=\s+\d{1,3}[.)]?\s+|$)/g,
    ),
  ];
  if (matches.length > 0) {
    return matches.map((match) => ({
      number: Number(match[1]),
      text: match[2].trim(),
    }));
  }
  return [{ number: parsed.ranges[0].start, text: clean }];
}

async function fetchRange(bibleId: string, passageId: string) {
  const params = new URLSearchParams({
    'content-type': 'text',
    'include-notes': 'false',
    'include-titles': 'false',
    'include-chapter-numbers': 'false',
    'include-verse-numbers': 'true',
    'include-verse-spans': 'false',
  });
  const response = await request<BibleApiEnvelope<BibleApiPassage>>(
    '/v1/bibles/' +
      encodeURIComponent(bibleId) +
      '/passages/' +
      encodeURIComponent(passageId),
    params,
  );
  if (!response.data) {
    throw new BibleServiceError(
      'API_NAO_ENCONTRADA',
      404,
      'A passagem biblica nao foi encontrada.',
    );
  }
  return response.data;
}

export async function getBiblePassage(
  reference: string,
  bibleId: string,
  translation: BibleVersion,
): Promise<PassageResponse> {
  let parsed: ParsedBibleReference;
  try {
    parsed = parseBibleReference(reference);
  } catch {
    throw new BibleServiceError(
      'REFERENCIA_INVALIDA',
      400,
      'A referencia biblica nao e valida.',
    );
  }
  const apiBookId = await resolveBookId(bibleId, parsed);
  const ranges = await Promise.all(
    parsed.ranges.map((range) =>
      fetchRange(bibleId, rangePassageId(apiBookId, parsed.chapter, range)),
    ),
  );
  const contents = ranges.map((passage) => cleanContent(passage.content ?? ''));
  const verses = ranges.flatMap((passage, index) =>
    createVerses(passage.content ?? '', {
      ...parsed,
      ranges: [parsed.ranges[index]],
    }),
  );
  return {
    label: reference,
    passageId: ranges
      .map(
        (passage, index) =>
          passage.id ??
          rangePassageId(apiBookId, parsed.chapter, parsed.ranges[index]),
      )
      .join(','),
    content: contents.filter(Boolean).join(' '),
    reference: ranges[0]?.reference ?? parsed.normalized,
    verses,
    translation,
    copyright:
      ranges.find((passage) => passage.copyright)?.copyright ??
      translation.copyright,
  };
}

export async function fetchPassages(
  requestedBibleId: string | undefined,
  references: string[],
): Promise<PassageBatchResponse> {
  const bibles = await getAvailablePortugueseBibles();
  const configuredId = process.env.BIBLE_ID?.trim();
  const bibleId =
    bibles.find((bible) => bible.id === requestedBibleId)?.id ??
    bibles.find((bible) => bible.id === configuredId)?.id;
  if (!bibleId) {
    throw new BibleServiceError(
      'TRADUCAO_NAO_CONFIGURADA',
      503,
      'Nenhuma traducao portuguesa foi selecionada.',
    );
  }
  const translation = bibles.find((bible) => bible.id === bibleId);
  if (!translation) {
    throw new BibleServiceError(
      'TRADUCAO_NAO_ENCONTRADA',
      404,
      'A traducao selecionada nao foi encontrada.',
    );
  }
  const uniqueReferences = [
    ...new Set(references.map((reference) => reference.trim())),
  ];
  const cache = new Map<string, Promise<PassageResponse>>();
  const results = await Promise.allSettled(
    uniqueReferences.map((reference) => {
      const key = bibleId + ':' + reference;
      const cached = cache.get(key);
      if (cached) return cached;
      const passage = getBiblePassage(reference, bibleId, translation);
      cache.set(key, passage);
      return passage;
    }),
  );
  const passages = results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );
  const failedReferences = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return [];
    console.error(
      '[API.Bible] referencia ignorada',
      uniqueReferences[index],
      result.reason,
    );
    return [uniqueReferences[index]];
  });
  if (passages.length === 0 && failedReferences.length > 0) {
    const firstFailure = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );
    throw firstFailure?.reason;
  }
  return { passages, failedReferences };
}
