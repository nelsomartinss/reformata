import BibleReferenceCard from '@/components/bible-reference-card';
import VerseNumber from '@/components/verse-number';
import type { BibleVerse } from '@/lib/bible';

type BibleVerseProps = { verse: BibleVerse };

export default function BibleVerseBlock({ verse }: BibleVerseProps) {
  if (verse.references && verse.references.length > 0) {
    return (
      <BibleReferenceCard
        verseNumber={verse.number}
        text={verse.text}
        references={verse.references}
      />
    );
  }

  return (
    <p className="rounded-sm px-1 py-0.5">
      <VerseNumber number={verse.number} />
      {verse.text}
    </p>
  );
}
