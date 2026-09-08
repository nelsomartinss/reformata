import BibleReferenceCard from '@/components/bible-reference-card';
import type { BibleVerse } from '@/lib/bible';

type BibleVerseProps = { verse: BibleVerse };

export default function BibleVerseBlock({ verse }: BibleVerseProps) {
  if (verse.references && verse.references.length > 0) {
    return <BibleReferenceCard verseNumber={verse.number} text={verse.text} references={verse.references} />;
  }

  return <p className='bible-plain-verse'><span className='bible-plain-number'>{verse.number}</span>{verse.text}</p>;
}
