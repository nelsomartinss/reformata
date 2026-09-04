import { NextResponse } from 'next/server';
import { BibleServiceError, fetchPassages } from '@/lib/bible';
import { greaterCatechism } from '@/lib/catechism';
import { getConfessionParagraph } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const version = url.searchParams.get('version');
  const document = url.searchParams.get('document') ?? 'catecismo-maior';
  const number = Number(url.searchParams.get('number'));
  const chapter = Number(url.searchParams.get('chapter'));
  const paragraph = Number(url.searchParams.get('paragraph'));
  const entries =
    document === 'catecismo-maior'
      ? greaterCatechism
      : document === 'breve-catecismo'
        ? shortCatechism
        : undefined;
  const entry =
    Number.isInteger(number) && entries
      ? entries.find((item) => item.number === number)
      : undefined;
  const confessionEntry =
    document === 'confissao-de-fe' &&
    Number.isInteger(chapter) &&
    Number.isInteger(paragraph)
      ? getConfessionParagraph(chapter, paragraph)
      : undefined;
  const references = entry?.references ?? confessionEntry?.paragraph.references;
  if (!references)
    return NextResponse.json(
      { error: 'Pergunta ou tradução inválida.' },
      { status: 400 },
    );
  try {
    const result = await fetchPassages(version || undefined, references);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800' },
    });
  } catch (error) {
    const code =
      error instanceof BibleServiceError ? error.code : 'API_INDISPONIVEL';
    const status = error instanceof BibleServiceError ? error.status : 502;
    return NextResponse.json({ error: code }, { status });
  }
}
