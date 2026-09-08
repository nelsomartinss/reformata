export type BibleBook = {
  id: string;
  slug: string;
  name: string;
  chapters: number;
};

export const bibleBooks: BibleBook[] = [
  { id: 'GEN', slug: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'EXO', slug: 'exodo', name: 'Êxodo', chapters: 40 },
  { id: 'LEV', slug: 'levitico', name: 'Levítico', chapters: 27 },
  { id: 'NUM', slug: 'numeros', name: 'Números', chapters: 36 },
  { id: 'DEU', slug: 'deuteronomio', name: 'Deuteronômio', chapters: 34 },
  { id: 'JOS', slug: 'josue', name: 'Josué', chapters: 24 },
  { id: 'JDG', slug: 'juizes', name: 'Juízes', chapters: 21 },
  { id: 'RUT', slug: 'rute', name: 'Rute', chapters: 4 },
  { id: '1SA', slug: '1-samuel', name: '1 Samuel', chapters: 31 },
  { id: '2SA', slug: '2-samuel', name: '2 Samuel', chapters: 24 },
  { id: '1KI', slug: '1-reis', name: '1 Reis', chapters: 22 },
  { id: '2KI', slug: '2-reis', name: '2 Reis', chapters: 25 },
  { id: '1CH', slug: '1-cronicas', name: '1 Crônicas', chapters: 29 },
  { id: '2CH', slug: '2-cronicas', name: '2 Crônicas', chapters: 36 },
  { id: 'EZR', slug: 'esdras', name: 'Esdras', chapters: 10 },
  { id: 'NEH', slug: 'neemias', name: 'Neemias', chapters: 13 },
  { id: 'EST', slug: 'ester', name: 'Ester', chapters: 10 },
  { id: 'JOB', slug: 'jo', name: 'Jó', chapters: 42 },
  { id: 'PSA', slug: 'salmos', name: 'Salmos', chapters: 150 },
  { id: 'PRO', slug: 'proverbios', name: 'Provérbios', chapters: 31 },
  { id: 'ECC', slug: 'eclesiastes', name: 'Eclesiastes', chapters: 12 },
  { id: 'SNG', slug: 'cantares', name: 'Cantares', chapters: 8 },
  { id: 'ISA', slug: 'isaias', name: 'Isaías', chapters: 66 },
  { id: 'JER', slug: 'jeremias', name: 'Jeremias', chapters: 52 },
  { id: 'LAM', slug: 'lamentacoes', name: 'Lamentações', chapters: 5 },
  { id: 'EZK', slug: 'ezequiel', name: 'Ezequiel', chapters: 48 },
  { id: 'DAN', slug: 'daniel', name: 'Daniel', chapters: 12 },
  { id: 'HOS', slug: 'oseias', name: 'Oséias', chapters: 14 },
  { id: 'JOL', slug: 'joel', name: 'Joel', chapters: 3 },
  { id: 'AMO', slug: 'amos', name: 'Amós', chapters: 9 },
  { id: 'OBA', slug: 'obadias', name: 'Obadias', chapters: 1 },
  { id: 'JON', slug: 'jonas', name: 'Jonas', chapters: 4 },
  { id: 'MIC', slug: 'miqueias', name: 'Miquéias', chapters: 7 },
  { id: 'NAM', slug: 'naum', name: 'Naum', chapters: 3 },
  { id: 'HAB', slug: 'habacuque', name: 'Habacuque', chapters: 3 },
  { id: 'ZEP', slug: 'sofonias', name: 'Sofonias', chapters: 3 },
  { id: 'HAG', slug: 'ageu', name: 'Ageu', chapters: 2 },
  { id: 'ZEC', slug: 'zacarias', name: 'Zacarias', chapters: 14 },
  { id: 'MAL', slug: 'malaquias', name: 'Malaquias', chapters: 4 },
  { id: 'MAT', slug: 'mateus', name: 'Mateus', chapters: 28 },
  { id: 'MRK', slug: 'marcos', name: 'Marcos', chapters: 16 },
  { id: 'LUK', slug: 'lucas', name: 'Lucas', chapters: 24 },
  { id: 'JHN', slug: 'joao', name: 'João', chapters: 21 },
  { id: 'ACT', slug: 'atos', name: 'Atos', chapters: 28 },
  { id: 'ROM', slug: 'romanos', name: 'Romanos', chapters: 16 },
  { id: '1CO', slug: '1-corintios', name: '1 Coríntios', chapters: 16 },
  { id: '2CO', slug: '2-corintios', name: '2 Coríntios', chapters: 13 },
  { id: 'GAL', slug: 'galatas', name: 'Gálatas', chapters: 6 },
  { id: 'EPH', slug: 'efesios', name: 'Efésios', chapters: 6 },
  { id: 'PHP', slug: 'filipenses', name: 'Filipenses', chapters: 4 },
  { id: 'COL', slug: 'colossenses', name: 'Colossenses', chapters: 4 },
  { id: '1TH', slug: '1-tessalonicenses', name: '1 Tessalonicenses', chapters: 5 },
  { id: '2TH', slug: '2-tessalonicenses', name: '2 Tessalonicenses', chapters: 3 },
  { id: '1TI', slug: '1-timoteo', name: '1 Timóteo', chapters: 6 },
  { id: '2TI', slug: '2-timoteo', name: '2 Timóteo', chapters: 4 },
  { id: 'TIT', slug: 'tito', name: 'Tito', chapters: 3 },
  { id: 'PHM', slug: 'filemom', name: 'Filemom', chapters: 1 },
  { id: 'HEB', slug: 'hebreus', name: 'Hebreus', chapters: 13 },
  { id: 'JAS', slug: 'tiago', name: 'Tiago', chapters: 5 },
  { id: '1PE', slug: '1-pedro', name: '1 Pedro', chapters: 5 },
  { id: '2PE', slug: '2-pedro', name: '2 Pedro', chapters: 3 },
  { id: '1JN', slug: '1-joao', name: '1 João', chapters: 5 },
  { id: '2JN', slug: '2-joao', name: '2 João', chapters: 1 },
  { id: '3JN', slug: '3-joao', name: '3 João', chapters: 1 },
  { id: 'JUD', slug: 'judas', name: 'Judas', chapters: 1 },
  { id: 'REV', slug: 'apocalipse', name: 'Apocalipse', chapters: 22 },
];

export function getBibleBookBySlug(slug: string) {
  return bibleBooks.find((book) => book.slug === slug);
}

export function getBibleBookById(id: string) {
  return bibleBooks.find((book) => book.id === id.toUpperCase());
}

export function getAdjacentBibleChapter(book: BibleBook, chapter: number, direction: -1 | 1) {
  const index = bibleBooks.findIndex((item) => item.id === book.id);
  const targetChapter = chapter + direction;
  if (targetChapter >= 1 && targetChapter <= book.chapters) {
    return { book, chapter: targetChapter };
  }
  const targetBook = bibleBooks[index + direction];
  if (!targetBook) return undefined;
  return {
    book: targetBook,
    chapter: direction === 1 ? 1 : targetBook.chapters,
  };
}
