import type { Metadata } from 'next';
import ConfessionReader from '@/components/confession-reader';
import { getPassages } from '@/lib/bible/local';
import { confessionChapters } from '@/lib/confession';

export const metadata: Metadata = {
  title: 'Confissão de Fé de Westminster',
  description:
    'Leia os 35 capítulos da Confissão de Fé de Westminster com suas afirmações e referências bíblicas.',
};

export default function ConfessionPage() {
  return (
    <ConfessionReader
      chapters={confessionChapters}
      initialChapter={1}
      initialParagraph={1}
      initialPassages={getPassages(
        confessionChapters[0].paragraphs[0].references,
      )}
    />
  );
}
