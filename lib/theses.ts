import rawDocument from '@/content/95-teses.json';

export type Thesis = {
  number: number;
  text: string;
};

export const thesesDocument = rawDocument as {
  title: string;
  subtitle: string;
  location: string;
  intro: string;
  theses: Thesis[];
  date: string;
};

export const lutherTheses = thesesDocument.theses;
