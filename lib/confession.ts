import rawDocument from '@/content/confissao-de-fe.json';

export type ConfessionParagraph = {
  number: number;
  roman: string;
  statement: string;
  references: string[];
  globalNumber: number;
};

export type ConfessionChapter = {
  number: number;
  roman: string;
  title: string;
  paragraphs: ConfessionParagraph[];
};

export const confessionDocument = rawDocument as {
  title: string;
  chapters: ConfessionChapter[];
};

export const confessionChapters = confessionDocument.chapters;

export const confessionParagraphs = confessionChapters.flatMap((chapter) =>
  chapter.paragraphs.map((paragraph) => ({ chapter, paragraph })),
);

export function getConfessionParagraph(
  chapterNumber: number,
  paragraphNumber: number,
) {
  const chapter = confessionChapters.find(
    (item) => item.number === chapterNumber,
  );
  const paragraph = chapter?.paragraphs.find(
    (item) => item.number === paragraphNumber,
  );
  return chapter && paragraph ? { chapter, paragraph } : undefined;
}
