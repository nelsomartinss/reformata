import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ConfessionReader from '@/components/confession-reader';
import { confessionChapters, getConfessionParagraph } from '@/lib/confession';

export function generateStaticParams() {
  return confessionChapters.flatMap((chapter) =>
    chapter.paragraphs.map((paragraph) => ({
      chapter: String(chapter.number),
      paragraph: String(paragraph.number),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; paragraph: string }>;
}): Promise<Metadata> {
  const { chapter, paragraph } = await params;
  const entry = getConfessionParagraph(Number(chapter), Number(paragraph));
  return entry
    ? {
        title: `Capítulo ${entry.chapter.roman}, afirmação ${entry.paragraph.roman} | REFORMATA`,
        description: entry.paragraph.statement,
      }
    : { title: 'Afirmação não encontrada | REFORMATA' };
}

export default async function ConfessionParagraphPage({
  params,
}: {
  params: Promise<{ chapter: string; paragraph: string }>;
}) {
  const { chapter, paragraph } = await params;
  const entry = getConfessionParagraph(Number(chapter), Number(paragraph));
  if (!entry) notFound();
  return (
    <ConfessionReader
      chapters={confessionChapters}
      initialChapter={entry.chapter.number}
      initialParagraph={entry.paragraph.number}
    />
  );
}
