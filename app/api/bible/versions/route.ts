import { NextResponse } from 'next/server';
import { listBibleVersions } from '@/lib/bible';

export function GET() {
  return NextResponse.json({ versions: listBibleVersions() }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
