export type BibleVersion = {
  id: string;
  abbreviation: string;
  name: string;
  publisher: string;
  configured: boolean;
  copyright?: string;
};

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

export type BibleVerse = {
  number: number;
  text: string;
};

export type PassageResponse = {
  label: string;
  passageId: string;
  content: string;
  reference: string;
  verses: BibleVerse[];
  translation: BibleVersion;
  copyright?: string;
};

export type PassageBatchResponse = {
  passages: PassageResponse[];
  failedReferences: string[];
};

export type BibleApiBible = {
  id: string;
  abbreviation?: string;
  abbreviationLocal?: string;
  name?: string;
  nameLocal?: string;
  language?: {
    id?: string;
    name?: string;
    nameLocal?: string;
  };
  copyright?: string;
  description?: string;
  descriptionLocal?: string;
  type?: string;
};

export type BibleApiBook = {
  id: string;
  abbreviation?: string;
  name?: string;
  nameLong?: string;
};

export type BibleApiPassage = {
  id?: string;
  bibleId?: string;
  content?: string;
  reference?: string;
  verseCount?: number;
  copyright?: string;
};

export type BibleApiEnvelope<T> = {
  data?: T;
};

export type BibleErrorCode =
  | 'API_CHAVE_NAO_CONFIGURADA'
  | 'TRADUCAO_NAO_CONFIGURADA'
  | 'TRADUCAO_NAO_ENCONTRADA'
  | 'REFERENCIA_INVALIDA'
  | 'LIVRO_NAO_ENCONTRADO'
  | 'API_NAO_AUTORIZADA'
  | 'LIMITE_API'
  | 'API_NAO_ENCONTRADA'
  | 'API_INDISPONIVEL'
  | 'API_TIMEOUT';

export class BibleServiceError extends Error {
  code: BibleErrorCode;
  status: number;

  constructor(code: BibleErrorCode, status: number, message: string) {
    super(message);
    this.name = 'BibleServiceError';
    this.code = code;
    this.status = status;
  }
}
