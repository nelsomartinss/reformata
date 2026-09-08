import { NextResponse } from 'next/server';
import {
  BibleServiceError,
  getBibleChapter,
  getBibleReferenceLinks,
} from '@/lib/bible';
import { getBibleBookById } from '@/lib/bible/catalog';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const book = (url.searchParams.get('book') ?? '').toUpperCase();
  const chapter = Number(url.searchParams.get('chapter'));
  const version = url.searchParams.get('version') ?? undefined;
  const bibleBook = getBibleBookById(book);

  if (!bibleBook || !Number.isInteger(chapter) || chapter < 1 || chapter > bibleBook.chapters) {
    return NextResponse.json(
      { error: 'CAPITULO_INVALIDO' },
      { status: 400 },
    );
  }

  try {
    const result = await getBibleChapter(version, bibleBook.id, chapter);
    return NextResponse.json(
      {
        ...result,
        verses: result.verses.map((verse) => ({
          ...verse,
          references: getBibleReferenceLinks(bibleBook.id, chapter, verse.number),
        })),
      },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800' } },
    );
  } catch (error) {
    const code = error instanceof BibleServiceError ? error.code : 'API_INDISPONIVEL';
    const status = error instanceof BibleServiceError ? error.status : 502;
    return NextResponse.json({ error: code }, { status });
  }
}
