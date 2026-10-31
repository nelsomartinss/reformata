/**
 * Importa a Bíblia Livre (BLIVRE) a partir do arquivo "porbr2018_vpl.txt"
 * distribuído pelo eBible.org (https://ebible.org/Scriptures/porbr2018_vpl.zip).
 *
 * Uso: node scripts/import-biblia-livre.mjs caminho/para/porbr2018_vpl.txt
 *
 * Gera um arquivo por livro em content/biblia-livre/<ID>.json, no formato
 * { id, chapters: string[][] }, em que chapters[c - 1][v - 1] é o versículo v
 * do capítulo c. Os IDs seguem o padrão usado em lib/bible/catalog.ts.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = process.argv[2];
if (!source) {
  console.error('Informe o caminho do arquivo porbr2018_vpl.txt.');
  process.exit(1);
}

// Códigos do arquivo VPL que diferem dos IDs usados no projeto.
const vplToCanonical = {
  SOL: 'SNG',
  EZE: 'EZK',
  JOE: 'JOL',
  NAH: 'NAM',
  MAR: 'MRK',
  JOH: 'JHN',
  PHI: 'PHP',
  JAM: 'JAS',
  '1JO': '1JN',
  '2JO': '2JN',
  '3JO': '3JN',
};

const books = new Map();
const lines = (await readFile(source, 'utf8')).split(/\r?\n/);

for (const line of lines) {
  if (!line.trim()) continue;
  const match = line.match(/^([1-3]?[A-Z]{2,3}) (\d+):(\d+) (.*)$/);
  if (!match)
    throw new Error(`Linha em formato inesperado: ${line.slice(0, 80)}`);
  const [, code, chapterText, verseText, text] = match;
  const id = vplToCanonical[code] ?? code;
  const chapter = Number(chapterText);
  const verse = Number(verseText);
  const chapters = books.get(id) ?? [];
  books.set(id, chapters);
  chapters[chapter - 1] ??= [];
  chapters[chapter - 1][verse - 1] = text.replace(/\s+/g, ' ').trim();
}

const outputDir = new URL('../content/biblia-livre/', import.meta.url);
await mkdir(outputDir, { recursive: true });

let verseCount = 0;
for (const [id, chapters] of books) {
  chapters.forEach((verses, chapterIndex) => {
    if (!verses)
      throw new Error(`${id}: capítulo ${chapterIndex + 1} ausente.`);
    for (let index = 0; index < verses.length; index += 1) {
      // Versículos ausentes na tradução ficam como texto vazio para manter a numeração.
      verses[index] ??= '';
      verseCount += 1;
    }
  });
  await writeFile(
    new URL(`${id}.json`, outputDir),
    JSON.stringify({ id, chapters }) + '\n',
  );
}

console.log(
  `Bíblia Livre importada: ${books.size} livros, ${verseCount} versículos.`,
);
