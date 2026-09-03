import type { Metadata } from 'next';
import ConfessionReader from '@/components/confession-reader';
import { confessionChapters } from '@/lib/confession';

export const metadata: Metadata = {
  title: 'Confissão de Fé de Westminster | REFORMATA',
  description:
    'Leia os 35 capítulos da Confissão de Fé de Westminster com suas afirmações e referências bíblicas.',
};

export default function ConfessionPage() {
  return (
    <ConfessionReader
      chapters={confessionChapters}
      initialChapter={1}
      initialParagraph={1}
    />
  );
}
