import { NextResponse } from 'next/server';
import { fetchPassages } from '@/lib/bible';
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
  if (!version || !references)
    return NextResponse.json(
      { error: 'Pergunta ou tradução inválida.' },
      { status: 400 },
    );
  try {
    const passages = await fetchPassages(version, references);
    return NextResponse.json(
      { passages },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800' } },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : 'ERRO_DESCONHECIDO';
    const status =
      code === 'TRADUCAO_NAO_CONFIGURADA'
        ? 503
        : code === 'PROVEDOR_429'
          ? 429
          : 502;
    return NextResponse.json({ error: code }, { status });
  }
}
