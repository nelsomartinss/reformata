export type VerseRange = {
  start: number;
  end: number;
};

export type ParsedBibleReference = {
  original: string;
  normalized: string;
  book: string;
  chapter: number;
  ranges: VerseRange[];
};

export type BibleReferenceLink = {
  id: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  documentSlug: string;
  documentTitle: string;
  label: string;
  excerpt: string;
  href: string;
  kind: 'question' | 'paragraph' | 'thesis' | 'study';
  sourceReference: string;
};

export type BibleVerse = {
  number: number;
  text: string;
  references?: BibleReferenceLink[];
};

export type PassageResponse = {
  reference: string;
  content: string;
  verses: BibleVerse[];
};

export type PassageBatchResponse = {
  passages: PassageResponse[];
  failedReferences: string[];
};
