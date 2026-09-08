import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BibleReader from '@/components/bible-reader';
import { getBibleBookBySlug } from '@/lib/bible/catalog';

type PageProps = {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ versao?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book, chapter } = await params;
  const bibleBook = getBibleBookBySlug(book);
  const number = Number(chapter);
  return bibleBook && Number.isInteger(number) && number >= 1 && number <= bibleBook.chapters
    ? { title: `${bibleBook.name} ${number} | REFORMATA`, description: `Leitura de ${bibleBook.name} ${number} com referências relacionadas dos documentos reformados.` }
    : { title: 'Capítulo não encontrado | REFORMATA' };
}

export default async function BibleChapterPage({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const query = await searchParams;
  const bibleBook = getBibleBookBySlug(book);
  const number = Number(chapter);
  if (!bibleBook || !Number.isInteger(number) || number < 1 || number > bibleBook.chapters) notFound();
  const initialVersion = Array.isArray(query.versao) ? query.versao[0] ?? '' : query.versao ?? '';
  return <BibleReader book={bibleBook} chapter={number} initialVersion={initialVersion} />;
}
