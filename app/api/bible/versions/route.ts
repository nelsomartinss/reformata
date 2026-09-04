import { NextResponse } from 'next/server';
import { BibleServiceError, getAvailablePortugueseBibles } from '@/lib/bible';

export async function GET() {
  try {
    const versions = await getAvailablePortugueseBibles();
    return NextResponse.json(
      { versions },
      { headers: { 'Cache-Control': 'private, max-age=300' } },
    );
  } catch (error) {
    if (error instanceof BibleServiceError) {
      return NextResponse.json(
        { error: 'Nao foi possivel consultar as traducoes disponiveis.' },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: 'Nao foi possivel consultar as traducoes disponiveis.' },
      { status: 502 },
    );
  }
}
