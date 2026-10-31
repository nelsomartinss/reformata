import { NextResponse } from 'next/server';
import { getPassages } from '@/lib/bible/local';
import { greaterCatechism } from '@/lib/catechism';
import { getConfessionParagraph } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';

export async function GET(request: Request) {
  const url = new URL(request.url);
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
    return NextResponse.json({ error: 'TRECHO_INVALIDO' }, { status: 400 });

  return NextResponse.json(getPassages(references), {
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
}
