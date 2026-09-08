import rawDocument from '@/content/95-teses.json';

export type Thesis = {
  number: number;
  text: string;
  references?: string[];
};

const sourceDocument = rawDocument as {
  title: string;
  subtitle: string;
  location: string;
  intro: string;
  theses: Thesis[];
  date: string;
};

export const thesesDocument = {
  ...sourceDocument,
  theses: sourceDocument.theses.map((thesis) => ({
    ...thesis,
    references:
      thesis.references ??
      [...thesis.text.matchAll(/\[([^\]]+)\]/g)]
        .map((match) => match[1].replace(/\./g, ':'))
        .filter((reference) => /\d+\s*:\s*\d+/.test(reference)),
  })),
};

export const lutherTheses = thesesDocument.theses;
