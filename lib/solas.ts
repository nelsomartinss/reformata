import rawDocument from '@/content/5-solas.json';

export type Sola = {
  number: number;
  slug: string;
  /** Nome em latim, ex.: "Sola Scriptura". */
  name: string;
  /** Tradução em português, ex.: "Somente a Escritura". */
  translation: string;
  definition: string;
  context: string;
  references: string[];
};

export const solasDocument = rawDocument as {
  title: string;
  intro: string;
  solas: Sola[];
};

export const solas = solasDocument.solas;
