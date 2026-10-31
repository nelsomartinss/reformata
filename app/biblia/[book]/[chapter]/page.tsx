import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BibleReader from '@/components/bible-reader';
import { getBibleBookBySlug } from '@/lib/bible/catalog';
import { getChapterVerses } from '@/lib/bible/local';
import { getBibleReferenceLinks } from '@/lib/bible/reference-index';

type PageProps = {
  params: Promise<{ book: string; chapter: string }>;
};

// Os capítulos são gerados na primeira visita e guardados em cache.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { book, chapter } = await params;
  const bibleBook = getBibleBookBySlug(book);
  const number = Number(chapter);
  return bibleBook &&
    Number.isInteger(number) &&
    number >= 1 &&
    number <= bibleBook.chapters
    ? {
        title: `${bibleBook.name} ${number}`,
        description: `Leia ${bibleBook.name} ${number} na Bíblia Livre e veja onde cada versículo é citado nos documentos reformados.`,
      }
    : { title: 'Capítulo não encontrado' };
}

export default async function BibleChapterPage({ params }: PageProps) {
  const { book, chapter } = await params;
  const bibleBook = getBibleBookBySlug(book);
  const number = Number(chapter);
  if (!bibleBook || !Number.isInteger(number)) notFound();
  const verses = getChapterVerses(bibleBook.id, number);
  if (!verses) notFound();
  return (
    <BibleReader
      book={bibleBook}
      chapter={number}
      verses={verses.map((verse) => ({
        ...verse,
        references: getBibleReferenceLinks(bibleBook.id, number, verse.number),
      }))}
    />
  );
}
