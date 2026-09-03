import { NextResponse } from 'next/server';
import { fetchPassages } from '@/lib/bible';
import { getEntry } from '@/lib/catechism';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const version = url.searchParams.get('version');
  const number = Number(url.searchParams.get('number'));
  const entry = Number.isInteger(number) ? getEntry(number) : undefined;
  if (!version || !entry) return NextResponse.json({ error: 'Pergunta ou tradução inválida.' }, { status: 400 });
  try {
    const passages = await fetchPassages(version, entry.references);
    return NextResponse.json({ passages }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800' } });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'ERRO_DESCONHECIDO';
    const status = code === 'TRADUCAO_NAO_CONFIGURADA' ? 503 : code === 'PROVEDOR_429' ? 429 : 502;
    return NextResponse.json({ error: code }, { status });
  }
}
