/**
 * Auditoria das referências bíblicas do Catecismo Maior, do Breve Catecismo e
 * da Confissão de Fé, comparadas com as provas bíblicas de Westminster.
 *
 * Uso:
 *   node scripts/audit-references.mjs <pasta-das-fontes> <pasta-de-saída> [--apply]
 *
 * Cada documento é comparado com DUAS fontes independentes. Uma correção só é
 * "confirmada" quando as duas fontes trazem a forma corrigida, nenhuma traz a
 * forma original e não há outra correção possível. Todo o resto fica como
 * "variante editorial" ou "pendente de revisão" e não é alterado.
 *
 * Arquivos esperados em <pasta-das-fontes> (os de URL são baixados se faltarem):
 *   westminster_larger_catechism.json, westminster_confession_of_faith.json
 *     https://github.com/NonlinearFruit/Creeds.json (edição de 1647, domínio público)
 *   tws_larger_catechism.html, tws_shorter_catechism.html, tws_confession.html
 *     https://thewestminsterstandard.org
 *   opc_shorter_catechism.txt
 *     texto extraído de https://opc.org/documents/SCLayout.pdf (extraia com
 *     qualquer leitor de PDF para texto e salve com esse nome)
 *
 * Sem --apply, apenas gera o relatório. Com --apply, aplica nos arquivos de
 * conteúdo somente as correções classificadas como "confirmada".
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [sourcesDir, outputDir] = process.argv.slice(2);
const apply = process.argv.includes('--apply');
if (!sourcesDir || !outputDir) {
  console.error(
    'Uso: node scripts/audit-references.mjs <fontes> <saída> [--apply]',
  );
  process.exit(1);
}
mkdirSync(sourcesDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const FILES = {
  creedsWlc: {
    file: 'westminster_larger_catechism.json',
    url: 'https://raw.githubusercontent.com/NonlinearFruit/Creeds.json/master/creeds/westminster_larger_catechism.json',
    label:
      'Catecismo Maior, edição de 1647 (The Humble Advice), via Creeds.json',
  },
  creedsWcf: {
    file: 'westminster_confession_of_faith.json',
    url: 'https://raw.githubusercontent.com/NonlinearFruit/Creeds.json/master/creeds/westminster_confession_of_faith.json',
    label:
      'Confissão de Fé, edição de 1647 (The Humble Advice), via Creeds.json',
  },
  twsWlc: {
    file: 'tws_larger_catechism.html',
    url: 'https://thewestminsterstandard.org/westminster-larger-catechism/',
    label: 'Catecismo Maior, provas tradicionais, thewestminsterstandard.org',
  },
  twsWsc: {
    file: 'tws_shorter_catechism.html',
    url: 'https://thewestminsterstandard.org/westminster-shorter-catechism/',
    label: 'Breve Catecismo, provas tradicionais, thewestminsterstandard.org',
  },
  twsWcf: {
    file: 'tws_confession.html',
    url: 'https://thewestminsterstandard.org/the-westminster-confession/',
    label: 'Confissão de Fé, notas tradicionais, thewestminsterstandard.org',
  },
  opcWsc: {
    file: 'opc_shorter_catechism.txt',
    label: 'Breve Catecismo, provas da OPC (opc.org/documents/SCLayout.pdf)',
  },
};

for (const source of Object.values(FILES)) {
  const target = path.join(sourcesDir, source.file);
  if (existsSync(target)) continue;
  if (!source.url)
    throw new Error(
      `Fonte ausente: ${target}. Veja as instruções no topo do script.`,
    );
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`Falha ao baixar ${source.url}`);
  writeFileSync(target, await response.text());
}
const read = (key) =>
  readFileSync(path.join(sourcesDir, FILES[key].file), 'utf8');

// ---------------------------------------------------------------------------
// Bíblia Livre e leitor de referências do próprio site
const jiti = createJiti(import.meta.url);
const { bibleBooks } = await jiti.import(
  path.join(root, 'lib/bible/catalog.ts'),
);
const { parseBibleReferenceList, WHOLE_CHAPTER } = await jiti.import(
  path.join(root, 'lib/bible/parser.ts'),
);
const chapterSizes = new Map();
const bibleText = new Map();
const bibleDir = path.join(root, 'content/biblia-livre');
for (const file of readdirSync(bibleDir)) {
  const { id, chapters } = JSON.parse(
    readFileSync(path.join(bibleDir, file), 'utf8'),
  );
  chapterSizes.set(
    id,
    chapters.map((verses) => verses.length),
  );
  bibleText.set(id, chapters);
}
const verseTexts = (keys) =>
  keys.map((key) => {
    const [book, c, v] = key.split('.');
    return bibleText.get(book)?.[Number(c) - 1]?.[Number(v) - 1] ?? '';
  });
const bookName = new Map(bibleBooks.map((book) => [book.id, book.name]));

const ptAbbreviations = {
  GEN: 'Gn',
  EXO: 'Êx',
  LEV: 'Lv',
  NUM: 'Nm',
  DEU: 'Dt',
  JOS: 'Js',
  JDG: 'Jz',
  RUT: 'Rt',
  '1SA': '1Sm',
  '2SA': '2Sm',
  '1KI': '1Rs',
  '2KI': '2Rs',
  '1CH': '1Cr',
  '2CH': '2Cr',
  EZR: 'Ed',
  NEH: 'Ne',
  EST: 'Et',
  JOB: 'Jó',
  PSA: 'Sl',
  PRO: 'Pv',
  ECC: 'Ec',
  SNG: 'Ct',
  ISA: 'Is',
  JER: 'Jr',
  LAM: 'Lm',
  EZK: 'Ez',
  DAN: 'Dn',
  HOS: 'Os',
  JOL: 'Jl',
  AMO: 'Am',
  OBA: 'Ob',
  JON: 'Jn',
  MIC: 'Mq',
  NAM: 'Na',
  HAB: 'Hc',
  ZEP: 'Sf',
  HAG: 'Ag',
  ZEC: 'Zc',
  MAL: 'Ml',
  MAT: 'Mt',
  MRK: 'Mc',
  LUK: 'Lc',
  JHN: 'Jo',
  ACT: 'At',
  ROM: 'Rm',
  '1CO': '1Co',
  '2CO': '2Co',
  GAL: 'Gl',
  EPH: 'Ef',
  PHP: 'Fp',
  COL: 'Cl',
  '1TH': '1Ts',
  '2TH': '2Ts',
  '1TI': '1Tm',
  '2TI': '2Tm',
  TIT: 'Tt',
  PHM: 'Fm',
  HEB: 'Hb',
  JAS: 'Tg',
  '1PE': '1Pe',
  '2PE': '2Pe',
  '1JN': '1Jo',
  '2JN': '2Jo',
  '3JN': '3Jo',
  JUD: 'Jd',
  REV: 'Ap',
};

const osisOrder =
  'Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev'.split(
    ' ',
  );
const osisToId = new Map(
  osisOrder.map((code, index) => [code, bibleBooks[index].id]),
);

const englishBooks = {
  gen: 'GEN',
  exod: 'EXO',
  ex: 'EXO',
  exo: 'EXO',
  lev: 'LEV',
  num: 'NUM',
  deut: 'DEU',
  josh: 'JOS',
  judg: 'JDG',
  ruth: 'RUT',
  '1sam': '1SA',
  '2sam': '2SA',
  '1kings': '1KI',
  '2kings': '2KI',
  '1kgs': '1KI',
  '2kgs': '2KI',
  '1chron': '1CH',
  '2chron': '2CH',
  '1chr': '1CH',
  '2chr': '2CH',
  ezra: 'EZR',
  neh: 'NEH',
  esth: 'EST',
  esther: 'EST',
  job: 'JOB',
  ps: 'PSA',
  psa: 'PSA',
  psalm: 'PSA',
  psalms: 'PSA',
  prov: 'PRO',
  eccl: 'ECC',
  eccles: 'ECC',
  ecc: 'ECC',
  song: 'SNG',
  cant: 'SNG',
  isa: 'ISA',
  jer: 'JER',
  lam: 'LAM',
  ezek: 'EZK',
  dan: 'DAN',
  hos: 'HOS',
  hosea: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obad: 'OBA',
  jonah: 'JON',
  mic: 'MIC',
  micah: 'MIC',
  nah: 'NAM',
  hab: 'HAB',
  zeph: 'ZEP',
  hag: 'HAG',
  zech: 'ZEC',
  mal: 'MAL',
  matt: 'MAT',
  mat: 'MAT',
  mark: 'MRK',
  luke: 'LUK',
  john: 'JHN',
  acts: 'ACT',
  rom: 'ROM',
  '1cor': '1CO',
  '2cor': '2CO',
  gal: 'GAL',
  eph: 'EPH',
  phil: 'PHP',
  col: 'COL',
  '1thess': '1TH',
  '2thess': '2TH',
  '1thes': '1TH',
  '2thes': '2TH',
  '1tim': '1TI',
  '2tim': '2TI',
  tit: 'TIT',
  titus: 'TIT',
  philem: 'PHM',
  phlm: 'PHM',
  heb: 'HEB',
  hebrews: 'HEB',
  matthew: 'MAT',
  nahum: 'NAM',
  zec: 'ZEC',
  est: 'EST',
  '1peter': '1PE',
  '2peter': '2PE',
  '1kin': '1KI',
  '2kin': '2KI',
  james: 'JAS',
  jas: 'JAS',
  '1pet': '1PE',
  '2pet': '2PE',
  '1john': '1JN',
  '2john': '2JN',
  '3john': '3JN',
  jude: 'JUD',
  rev: 'REV',
};
const singleChapterBooks = new Set(['OBA', 'PHM', '2JN', '3JN', 'JUD']);

// ---------------------------------------------------------------------------
// Intervalos e conjuntos de versículos
const chapterSize = (book, chapter) => chapterSizes.get(book)?.[chapter - 1];

function expand({ book, chapter, start, end, endChapter = chapter }) {
  const keys = [];
  for (let c = chapter; c <= endChapter; c += 1) {
    const size = chapterSize(book, c);
    if (!size) return null;
    const first = c === chapter ? start : 1;
    const last = c === endChapter ? (end === WHOLE_CHAPTER ? size : end) : size;
    if (first < 1 || last > size || last < first) return null;
    for (let v = first; v <= last; v += 1) keys.push(`${book}.${c}.${v}`);
  }
  return keys;
}

function formatRange(range, names = ptAbbreviations) {
  const abbr =
    names === ptAbbreviations
      ? ptAbbreviations[range.book]
      : bookName.get(range.book);
  if (range.end === WHOLE_CHAPTER) return `${abbr} ${range.chapter}`;
  if (range.endChapter && range.endChapter !== range.chapter)
    return `${abbr} ${range.chapter}:${range.start}-${range.endChapter}:${range.end}`;
  return `${abbr} ${range.chapter}:${range.start}${range.end !== range.start ? '-' + range.end : ''}`;
}

// ---------------------------------------------------------------------------
// Leitores das fontes
function parseOsis(reference) {
  const results = [];
  for (const part of reference.split(',')) {
    const [from, to] = part.split('-');
    const a = from.split('.');
    const book = osisToId.get(a[0]);
    if (!book) throw new Error(`Livro OSIS desconhecido: ${part}`);
    const chapter = Number(a[1]);
    if (!a[2]) {
      const endChapter = to ? Number(to.split('.')[1]) : chapter;
      results.push({ book, chapter, start: 1, end: WHOLE_CHAPTER, endChapter });
      continue;
    }
    const start = Number(a[2]);
    if (!to) {
      results.push({ book, chapter, start, end: start });
      continue;
    }
    const b = to.split('.');
    if (b.length === 3)
      results.push({
        book,
        chapter,
        start,
        end: Number(b[2]),
        endChapter: Number(b[1]),
      });
    else results.push({ book, chapter, start, end: Number(b[b.length - 1]) });
  }
  return results;
}

const unparsed = [];
function parseEnglishList(text, context) {
  const results = [];
  let previousBook;
  let previousChapter;
  const pieces = text
    .replace(/[–—]/g, '-')
    .replace(/\s+\./g, '.')
    .replace(/\s+with\s+/gi, ';')
    .replace(/\s+and\s+/gi, ';')
    .replace(/\s+compared together/gi, '')
    .replace(/song of songs/gi, 'Song')
    .replace(/:\s+(?=[1-3]?\s*[A-Za-z])/g, ';')
    .replace(/\b(\d+)\s+title\b/gi, '$1:1')
    .split(/;|,\s*(?=[1-3]?\s*[A-Za-z]+\.?\s+\d)/)
    .map((piece) => piece.trim().replace(/[.\s]+$/, ''))
    .filter(Boolean);
  for (const piece of pieces) {
    let match;
    let book;
    let chapter;
    let endChapter;
    let verses;
    if (
      (match = piece.match(
        /^([1-3]?\s*[A-Za-z]+)\.?\s+(\d+)(?:-(\d+))?\s+throughout$/i,
      ))
    ) {
      book = englishBooks[match[1].replace(/\s+/g, '').toLowerCase()];
      chapter = Number(match[2]);
      endChapter = Number(match[3] ?? match[2]);
    } else if (
      (match = piece.match(/^([1-3]?\s*[A-Za-z]+)\.?\s+(\d+)-(\d+)$/))
    ) {
      // "Heb. 8-10": capítulos inteiros
      book = englishBooks[match[1].replace(/\s+/g, '').toLowerCase()];
      chapter = Number(match[2]);
      endChapter = Number(match[3]);
    } else if (
      (match = piece.match(/^(\d+)(?:-(\d+))?\s+throughout$/i)) &&
      previousBook
    ) {
      book = previousBook;
      chapter = Number(match[1]);
      endChapter = Number(match[2] ?? match[1]);
    } else if (
      (match = piece.match(/^([1-3]?\s*[A-Za-z]+)\.?\s+(\d+)(?::\s*(.+))?$/))
    ) {
      book = englishBooks[match[1].replace(/\s+/g, '').toLowerCase()];
      chapter = Number(match[2]);
      verses = match[3];
      if (book && singleChapterBooks.has(book) && !verses) {
        verses = match[2];
        chapter = 1;
      }
    } else if ((match = piece.match(/^(\d+):\s*(.+)$/)) && previousBook) {
      book = previousBook;
      chapter = Number(match[1]);
      verses = match[2];
    } else if (
      (match = piece.match(/^(?:ver(?:se)?s?\.?\s*)?(\d+(?:\s*-\s*\d+)?)$/i)) &&
      previousBook
    ) {
      book = previousBook;
      chapter = previousChapter;
      verses = match[1];
    }
    if (!book || !chapter) {
      unparsed.push(`${context}: ${piece}`);
      continue;
    }
    previousBook = book;
    previousChapter = chapter;
    if (endChapter) {
      results.push({ book, chapter, start: 1, end: WHOLE_CHAPTER, endChapter });
      continue;
    }
    if (!verses) {
      results.push({ book, chapter, start: 1, end: WHOLE_CHAPTER });
      continue;
    }
    for (const chunk of verses.split(',')) {
      const range = chunk.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!range) {
        unparsed.push(`${context}: ${piece}`);
        continue;
      }
      results.push({
        book,
        chapter,
        start: Number(range[1]),
        end: Number(range[2] ?? range[1]),
      });
    }
  }
  return results;
}

const stripHtml = (value) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;| /g, ' ')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

function loadCreedsWlc() {
  const items = new Map();
  for (const question of JSON.parse(read('creedsWlc')).Data) {
    items.set(
      String(question.Number),
      (question.Proofs ?? []).flatMap((proof) =>
        proof.References.flatMap((reference) =>
          parseOsis(reference).map((range) => ({ ...range, note: proof.Id })),
        ),
      ),
    );
  }
  return items;
}

function loadCreedsWcf() {
  const items = new Map();
  for (const chapter of JSON.parse(read('creedsWcf')).Data) {
    chapter.Sections.forEach((section, index) => {
      items.set(
        `${chapter.Chapter}.${index + 1}`,
        (section.Proofs ?? []).flatMap((proof) =>
          proof.References.flatMap((reference) =>
            parseOsis(reference).map((range) => ({ ...range, note: proof.Id })),
          ),
        ),
      );
    });
  }
  return items;
}

function loadTwsCatechism(key, context) {
  const html = read(key);
  const body = html.slice(html.indexOf('<div class="entry-content">'));
  const items = new Map();
  for (const chunk of body.split('<b>Q. </b>').slice(1)) {
    const number = Number(chunk.match(/^(\d+)\./)?.[1]);
    if (!number) continue;
    const proofs = [...chunk.matchAll(/<em>([\s\S]*?)<\/em>/g)]
      .map((m) => stripHtml(m[1]))
      .filter((text) => /\d+:\d+/.test(text))
      .join('; ');
    items.set(String(number), parseEnglishList(proofs, `${context} ${number}`));
  }
  return items;
}

const romanToNumber = (roman) => {
  const values = { I: 1, V: 5, X: 10, L: 50 };
  let total = 0;
  for (let i = 0; i < roman.length; i += 1) {
    const value = values[roman[i]];
    total += value < (values[roman[i + 1]] ?? 0) ? -value : value;
  }
  return total;
};

function loadTwsWcf() {
  const html = read('twsWcf');
  const items = new Map();
  let chapter;
  let paragraph;
  for (const match of html.matchAll(
    /name="Chapter ([IVXL]+)"|<p[^>]*>([\s\S]*?)<\/p>/g,
  )) {
    if (match[1]) {
      chapter = romanToNumber(match[1]);
      paragraph = undefined;
      continue;
    }
    if (!chapter) continue;
    const text = stripHtml(match[2]);
    const heading = text.match(/^([IVXL]+)\.\s/);
    if (heading) {
      paragraph = romanToNumber(heading[1]);
      items.set(`${chapter}.${paragraph}`, []);
      continue;
    }
    if (!paragraph || !/^[a-z]{1,2}\.\s/.test(text)) continue;
    const list = items.get(`${chapter}.${paragraph}`);
    for (const note of text.split('•')) {
      const noteMatch = note.trim().match(/^([a-z]{1,2})\.\s*([\s\S]*)$/);
      if (!noteMatch) continue;
      for (const range of parseEnglishList(
        noteMatch[2],
        `Confissão ${chapter}.${paragraph}${noteMatch[1]}`,
      ))
        list.push({ ...range, note: noteMatch[1] });
    }
  }
  return items;
}

function loadOpcWsc() {
  const text = read('opcWsc')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/[–—]/g, '-');
  const items = new Map();
  const parts = text.split(/Q\. (\d+)\. /);
  for (let i = 1; i < parts.length; i += 2) {
    const number = parts[i];
    const block = parts[i + 1];
    const ranges = [];
    const pattern =
      /(?:^|[\s(;])((?:[1-3] ?)?[A-Z][a-z]+)\.? (\d{1,3}):(\d{1,3}(?:-\d{1,3})?(?:, ?\d{1,3}(?:-\d{1,3})?)*)/g;
    for (const m of block.matchAll(pattern)) {
      const book = englishBooks[m[1].replace(/\s+/g, '').toLowerCase()];
      if (!book) continue;
      for (const chunk of m[3].split(',')) {
        const r = chunk.trim().match(/^(\d+)(?:-(\d+))?$/);
        if (r)
          ranges.push({
            book,
            chapter: Number(m[2]),
            start: Number(r[1]),
            end: Number(r[2] ?? r[1]),
          });
      }
    }
    if (!items.has(number)) items.set(number, ranges);
  }
  return items;
}

const SOURCES = {
  wlc: [
    { name: 'A', label: FILES.creedsWlc.label, items: loadCreedsWlc() },
    {
      name: 'B',
      label: FILES.twsWlc.label,
      items: loadTwsCatechism('twsWlc', 'Maior'),
    },
  ],
  wsc: [
    {
      name: 'A',
      label: FILES.twsWsc.label,
      items: loadTwsCatechism('twsWsc', 'Breve'),
    },
    { name: 'B', label: FILES.opcWsc.label, items: loadOpcWsc() },
  ],
  wcf: [
    { name: 'A', label: FILES.creedsWcf.label, items: loadCreedsWcf() },
    { name: 'B', label: FILES.twsWcf.label, items: loadTwsWcf() },
  ],
};

// ---------------------------------------------------------------------------
// Conteúdo do projeto
const contentFiles = {
  wlc: 'content/catecismo-maior.json',
  wsc: 'content/breve-catecismo.json',
  wcf: 'content/confissao-de-fe.json',
};
const content = Object.fromEntries(
  Object.entries(contentFiles).map(([doc, file]) => [
    doc,
    JSON.parse(readFileSync(path.join(root, file), 'utf8')),
  ]),
);
const committed = Object.fromEntries(
  Object.entries(contentFiles).map(([doc, file]) => {
    try {
      return [
        doc,
        JSON.parse(
          execFileSync('git', ['show', `HEAD:${file}`], {
            cwd: root,
            encoding: 'utf8',
            maxBuffer: 1 << 26,
          }),
        ),
      ];
    } catch {
      return [doc, null];
    }
  }),
);

// Capítulo 31: a revisão americana suprimiu o §2 de 1647 e renumerou os demais.
const wcfSourceKey = (chapter, paragraph) =>
  chapter === 31 && paragraph >= 2
    ? `31.${paragraph + 1}`
    : `${chapter}.${paragraph}`;
// Seções reescritas na revisão americana (edição adotada no Brasil).
const REVISED_SECTIONS = new Set(['20.4', '23.3', '31.1']);

/**
 * Decisões tomadas pelo responsável pela revisão. Elas prevalecem sobre a
 * análise automática e nunca são alteradas pelo script.
 */
const REVIEW_DECISIONS = [
  {
    doc: 'wlc',
    id: '7',
    label: 'Sl 90:2',
    original: 'Sl 90:2-145',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável.',
  },
  {
    doc: 'wlc',
    id: '32',
    label: 'Jo 6:27',
    original: 'Jo 326:6',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável (João 6:27 na primeira nota, com Gn 3:15 e Is 42:6).',
  },
  {
    doc: 'wlc',
    id: '176',
    label: 'Mt 28:19',
    original: 'Mc 28:19',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável; a troca anterior para Mt 26:29 foi desfeita.',
  },
  {
    doc: 'wlc',
    id: '185',
    label: 'Ef 6:18',
    original: 'Ef 3:216',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável (perseverança na oração).',
  },
  {
    doc: 'wlc',
    id: '7',
    label: 'At 7:2',
    original: 'At 5:2',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável (o Deus da glória).',
  },
  {
    doc: 'wlc',
    id: '7',
    label: 'Ml 3:6',
    original: 'Ml 2:6',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável (imutabilidade de Deus).',
  },
  {
    doc: 'wcf',
    id: '3.8',
    label: 'Rm. 11:33; 9:20; 11:5-6, 20; 8:33',
    original: 'Rm. 5:33, 9:20, 11:5-6, 10, 23',
    status: 'confirmada',
    note: 'Correção confirmada na revisão do responsável; demais provas do parágrafo preservadas.',
  },
  {
    doc: 'wcf',
    id: '4.1',
    label: 'Rm. 1:20',
    original: 'Rm. 1:20, 9:36',
    status: 'pendente de revisão',
    note: 'Rm 9:36 não existe. Restaurar como Rm 11:36 apenas se a edição brasileira adotada trouxer essa prova; a edição de 1647 traz só Rm 1:20.',
  },
  {
    doc: 'wcf',
    id: '25.2',
    label: 'Mt 13:47; Cl 1:13',
    original: 'Mt 13:3 Cl 1:13',
    status: 'variante editorial',
    note: 'Mt 13:47 confirmado. Cl 1:13 não consta na edição inglesa consultada; mantido como estava até conferência na edição brasileira.',
  },
  {
    doc: 'wlc',
    id: '32',
    label: '1Sm 4:3-6',
    original: '1Sm 4:3-6',
    status: 'pendente de revisão',
    note: 'Mantido por decisão do responsável. Atenção: a citação está na pergunta 32, não na 113; ver justificativa da auditoria.',
  },
];
/**
 * Erros encontrados nas próprias fontes: as duas edições consultadas derivam
 * da mesma transcrição e compartilham alguns erros. Nesses casos a referência
 * do projeto é mantida.
 */
const SHARED_SOURCE_ERRORS = [
  {
    doc: 'wcf',
    id: '8.1',
    label: '1Tm 2:5',
    note: 'As duas fontes trazem "2 Tim 2:5" na nota a, mas a nota trata de Cristo como único Mediador (1 Tm 2:5, "há um só Mediador entre Deus e os homens"). Erro comum às fontes; referência do projeto mantida.',
  },
];
const sharedErrorFor = (doc, id, label) =>
  SHARED_SOURCE_ERRORS.find(
    (d) => d.doc === doc && d.id === id && d.label === label,
  );

const usedDecisions = new Set();
/** Cada decisão vale para uma única ocorrência da referência no trecho. */
const decisionFor = (doc, id, label, consume = false) => {
  const decision = REVIEW_DECISIONS.find(
    (d) =>
      d.doc === doc &&
      d.id === id &&
      d.label === label &&
      !usedDecisions.has(d),
  );
  if (decision && consume) usedDecisions.add(decision);
  return decision;
};

const items = [];
for (const entry of content.wlc)
  items.push({
    doc: 'wlc',
    docName: 'Catecismo Maior',
    id: String(entry.number),
    label: `Pergunta ${entry.number}`,
    refs: entry.references,
    sourceKey: String(entry.number),
  });
for (const entry of content.wsc)
  items.push({
    doc: 'wsc',
    docName: 'Breve Catecismo',
    id: String(entry.number),
    label: `Pergunta ${entry.number}`,
    refs: entry.references,
    sourceKey: String(entry.number),
  });
for (const chapter of content.wcf.chapters)
  for (const paragraph of chapter.paragraphs)
    items.push({
      doc: 'wcf',
      docName: 'Confissão de Fé',
      id: `${chapter.number}.${paragraph.number}`,
      label: `Capítulo ${chapter.number}, §${paragraph.number}`,
      refs: paragraph.references,
      sourceKey:
        chapter.number <= 33
          ? wcfSourceKey(chapter.number, paragraph.number)
          : null,
      revised: REVISED_SECTIONS.has(`${chapter.number}.${paragraph.number}`),
    });

function committedRefs(item) {
  const data = committed[item.doc];
  if (!data) return [];
  if (item.doc === 'wcf') {
    const [c, p] = item.id.split('.').map(Number);
    return (
      data.chapters
        .find((x) => x.number === c)
        ?.paragraphs.find((x) => x.number === p)?.references ?? []
    );
  }
  return (
    data.find((entry) => String(entry.number) === item.id)?.references ?? []
  );
}

// ---------------------------------------------------------------------------
// Comparação
function digitsDifferByOne(a, b) {
  a = String(a);
  b = String(b);
  if (a === b) return false;
  if (a.length === b.length)
    return [...a].filter((ch, i) => ch !== b[i]).length === 1;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.length - short.length !== 1) return false;
  return [...long].some(
    (_, i) => long.slice(0, i) + long.slice(i + 1) === short,
  );
}

function errorPattern(project, source) {
  if (
    project.book !== source.book &&
    project.chapter === source.chapter &&
    project.start === source.start
  )
    return 'livro';
  if (
    project.book === source.book &&
    project.start === source.start &&
    digitsDifferByOne(project.chapter, source.chapter)
  )
    return 'capítulo';
  if (
    project.book === source.book &&
    project.chapter === source.chapter &&
    digitsDifferByOne(project.start, source.start)
  )
    return 'versículo';
  return null;
}

const plain = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1)
    for (let j = 1; j <= b.length; j += 1)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return dp[a.length][b.length];
}
/** Abreviações que se confundem facilmente (1Ts/2Ts, At/Mt, Mt/Ml, Êx/Ez, Jo/Jó/1Jo, Ef/Et). */
const confusableBooks = (a, b) =>
  editDistance(plain(ptAbbreviations[a]), plain(ptAbbreviations[b])) <= 1;

function parseProjectLabels(labels) {
  const byLabel = new Map();
  for (const parsed of parseBibleReferenceList(labels)) {
    const list = byLabel.get(parsed.original) ?? [];
    list.push(parsed);
    byLabel.set(parsed.original, list);
  }
  return (label) =>
    (byLabel.get(label.trim()) ?? []).flatMap((parsed) =>
      parsed.ranges.map((range) => ({
        book: parsed.book,
        chapter: parsed.chapter,
        start: range.start,
        end: range.end,
      })),
    );
}

const rows = [];
const corrections = [];
const omissions = [];
const regression = [];

for (const item of items) {
  const sources = item.sourceKey
    ? SOURCES[item.doc].map((source) => {
        const ranges = (source.items.get(item.sourceKey) ?? [])
          .map((range) => ({ ...range, keys: new Set(expand(range) ?? []) }))
          .filter((range) => range.keys.size > 0);
        const keys = new Set(ranges.flatMap((range) => [...range.keys]));
        return { ...source, ranges, keys };
      })
    : [];
  const union = new Set(sources.flatMap((source) => [...source.keys]));
  const inSources = (keys) =>
    sources
      .filter((source) => keys.every((key) => source.keys.has(key)))
      .map((source) => source.name);

  const rangesOf = parseProjectLabels(item.refs);
  const projectRows = item.refs.map((label, index) => {
    const ranges = rangesOf(label);
    return {
      label,
      position: index + 1,
      ranges,
      keys: ranges.flatMap((range) => expand(range) ?? []),
    };
  });
  const covered = new Set(projectRows.flatMap((row) => row.keys));

  for (const row of projectRows) {
    const base = {
      documento: item.docName,
      trecho: item.label,
      posicao: row.position,
      referencia_original: row.label,
      referencia_corrigida: '',
      classificacao: '',
      fonte: '',
      justificativa: '',
    };
    const decision = decisionFor(item.doc, item.id, row.label, true);
    if (decision) {
      rows.push({
        ...base,
        referencia_original: decision.original,
        referencia_corrigida:
          decision.original === decision.label ? '' : decision.label,
        classificacao: decision.status,
        fonte:
          'Revisão do responsável' +
          (sources.length
            ? ` + ${sources.map((s) => s.label).join(' + ')}`
            : ''),
        justificativa:
          decision.note +
          (inSources(row.keys).length
            ? ` Consta em: fonte ${inSources(row.keys).join(' e ')}.`
            : ' Não consta nas fontes inglesas consultadas.'),
      });
      continue;
    }
    const shared = sharedErrorFor(item.doc, item.id, row.label);
    if (shared) {
      rows.push({
        ...base,
        classificacao: 'variante editorial',
        fonte: sources
          .map((source) => `${source.name}: ${source.label}`)
          .join(' | '),
        justificativa: shared.note,
      });
      continue;
    }
    if (row.keys.length === 0) {
      rows.push({
        ...base,
        classificacao: 'pendente de revisão',
        justificativa:
          'A referência não pôde ser lida ou não existe na Bíblia Livre.',
      });
      continue;
    }
    if (!item.sourceKey) {
      rows.push({
        ...base,
        classificacao: 'sem edição de referência',
        justificativa:
          'Capítulo acrescentado pela PCUS em 1903; não existe na edição de 1647.',
      });
      continue;
    }
    const found = inSources(row.keys);
    const sourceLabels = sources
      .map((source) => `${source.name}: ${source.label}`)
      .join(' | ');
    if (found.length > 0) {
      rows.push({
        ...base,
        classificacao: 'conferida',
        fonte: sourceLabels,
        justificativa: `Consta nas provas do mesmo trecho (fonte ${found.join(' e ')}).`,
      });
      continue;
    }
    const inside = row.keys.filter((key) => union.has(key)).length;
    if (inside > 0) {
      rows.push({
        ...base,
        classificacao: 'variante editorial',
        fonte: sourceLabels,
        justificativa: `Coincide em parte com as provas do trecho (${inside} de ${row.keys.length} versículos); o intervalo difere das edições consultadas.`,
      });
      continue;
    }
    if (item.revised) {
      rows.push({
        ...base,
        classificacao: 'variante editorial',
        fonte: sourceLabels,
        justificativa:
          'Seção reescrita na revisão americana adotada no Brasil; as provas diferem das de 1647.',
      });
      continue;
    }

    // Nenhum versículo em comum: procura um erro de livro, capítulo ou
    // versículo que leve a uma prova ainda não citada no projeto.
    const candidates = new Map();
    if (row.ranges.length === 1) {
      const project = row.ranges[0];
      for (const source of sources) {
        for (const range of source.ranges) {
          if ([...range.keys].some((key) => covered.has(key))) continue;
          const pattern = errorPattern(project, range);
          if (!pattern) continue;
          const fixed = { ...project };
          if (pattern === 'livro') fixed.book = range.book;
          if (pattern === 'capítulo') fixed.chapter = range.chapter;
          if (pattern === 'versículo')
            Object.assign(fixed, { start: range.start, end: range.end });
          const fixedKeys = expand(fixed);
          if (!fixedKeys) continue;
          const text = formatRange(fixed);
          const entry = candidates.get(text) ?? {
            fixed,
            pattern,
            keys: fixedKeys,
            notes: {},
          };
          entry.notes[source.name] = range.note;
          candidates.set(text, entry);
        }
      }
    }
    const confirmed = [...candidates.entries()].filter(
      ([, c]) => inSources(c.keys).length === sources.length,
    );
    const only =
      confirmed.length === 1 && candidates.size === 1 ? confirmed[0] : null;
    if (only) {
      const [text, candidate] = only;
      const sameText =
        verseTexts(row.keys).join(' ') === verseTexts(candidate.keys).join(' ');
      const strong =
        !sameText &&
        (candidate.pattern === 'capítulo' ||
          (candidate.pattern === 'livro' &&
            confusableBooks(row.ranges[0].book, candidate.fixed.book)));
      const evidence = `ambas as fontes trazem ${formatRange(candidate.fixed, 'full')}, que difere apenas no ${candidate.pattern}, e nenhuma traz "${row.label}"`;
      if (sameText) {
        rows.push({
          ...base,
          classificacao: 'variante editorial',
          fonte: sourceLabels,
          justificativa: `As fontes citam ${text}, cujo texto é idêntico ao de "${row.label}" (versificação diferente entre edições).`,
        });
        continue;
      }
      if (strong) {
        rows.push({
          ...base,
          referencia_corrigida: text,
          classificacao: 'confirmada',
          fonte: sources
            .map(
              (source) =>
                `${source.name}: ${source.label}${candidate.notes[source.name] ? `, nota ${candidate.notes[source.name]}` : ''}`,
            )
            .join(' | '),
          justificativa: `Erro de ${candidate.pattern}: ${evidence}; a forma corrigida não está citada em outra posição do trecho.`,
        });
        corrections.push({ item, label: row.label, corrected: text });
        candidate.keys.forEach((key) => covered.add(key));
        continue;
      }
      rows.push({
        ...base,
        classificacao: 'pendente de revisão',
        fonte: sourceLabels,
        justificativa: `Provável erro de ${candidate.pattern}: ${evidence}. Não aplicado automaticamente porque ${candidate.pattern === 'versículo' ? 'diferenças de um dígito no versículo também podem ser erro comum às duas fontes' : 'as abreviações não são confundíveis entre si'}; sugestão: ${text}.`,
      });
      continue;
    }
    const suggestions = [...candidates.entries()].map(
      ([text, c]) => `${text} (fonte ${inSources(c.keys).join(' e ') || '—'})`,
    );
    rows.push({
      ...base,
      classificacao: 'pendente de revisão',
      fonte: sourceLabels,
      justificativa: suggestions.length
        ? `Não consta nas fontes; possível correção não confirmada pelas duas: ${suggestions.join('; ')}.`
        : 'Não consta nas provas do trecho nas duas fontes (pode ser acréscimo da edição brasileira ou erro).',
    });
  }

  // Provas presentes nas duas fontes e ausentes no projeto (apenas informativo).
  if (sources.length === 2) {
    for (const range of sources[0].ranges) {
      if ([...range.keys].some((key) => covered.has(key))) continue;
      if (![...range.keys].every((key) => sources[1].keys.has(key))) continue;
      omissions.push({
        documento: item.docName,
        trecho: item.label,
        referencia: formatRange(range),
      });
    }
  }

  // Regressão: referências alteradas desde o último commit.
  const before = committedRefs(item);
  const removed = before.filter((label) => !item.refs.includes(label));
  const added = item.refs.filter((label) => !before.includes(label));
  if (removed.length || added.length) {
    const addedRanges = parseProjectLabels(item.refs);
    for (const label of added) {
      const keys = addedRanges(label).flatMap((range) => expand(range) ?? []);
      const found = keys.length ? inSources(keys) : [];
      const decision = decisionFor(item.doc, item.id, label);
      regression.push({
        documento: item.docName,
        trecho: item.label,
        antes: removed.join(' | '),
        depois: label,
        resolve_na_biblia_livre: keys.length > 0 ? 'sim' : 'não',
        nas_fontes: !item.sourceKey
          ? 'sem edição de referência'
          : found.length
            ? found.join(' e ')
            : 'nenhuma',
        decisao: decision ? decision.status : '',
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Aplicação das correções confirmadas
if (apply && corrections.length > 0) {
  for (const { item, label, corrected } of corrections) {
    let list;
    if (item.doc === 'wcf') {
      const [c, p] = item.id.split('.').map(Number);
      list = content.wcf.chapters
        .find((x) => x.number === c)
        .paragraphs.find((x) => x.number === p).references;
    } else {
      list = content[item.doc].find(
        (entry) => String(entry.number) === item.id,
      ).references;
    }
    const index = list.indexOf(label);
    if (index === -1)
      throw new Error(`Referência não encontrada: ${item.label} ${label}`);
    list[index] = corrected;
  }
  for (const doc of Object.keys(contentFiles)) {
    if (corrections.some((c) => c.item.doc === doc))
      writeFileSync(
        path.join(root, contentFiles[doc]),
        JSON.stringify(content[doc], null, 2) + '\n',
      );
  }
}

// ---------------------------------------------------------------------------
// Saída
function toCsv(list, columns) {
  return (
    [columns.join(',')]
      .concat(
        list.map((row) =>
          columns
            .map(
              (column) => `"${String(row[column] ?? '').replace(/"/g, '""')}"`,
            )
            .join(','),
        ),
      )
      .join('\n') + '\n'
  );
}
writeFileSync(
  path.join(outputDir, 'auditoria-referencias.csv'),
  toCsv(rows, [
    'documento',
    'trecho',
    'posicao',
    'referencia_original',
    'referencia_corrigida',
    'classificacao',
    'fonte',
    'justificativa',
  ]),
);
writeFileSync(
  path.join(outputDir, 'auditoria-omissoes.csv'),
  toCsv(omissions, ['documento', 'trecho', 'referencia']),
);
writeFileSync(
  path.join(outputDir, 'auditoria-regressao.csv'),
  toCsv(regression, [
    'documento',
    'trecho',
    'antes',
    'depois',
    'resolve_na_biblia_livre',
    'nas_fontes',
    'decisao',
  ]),
);
writeFileSync(
  path.join(outputDir, 'auditoria.json'),
  JSON.stringify(
    {
      rows,
      omissions,
      regression,
      unparsed,
      sources: Object.fromEntries(
        Object.entries(FILES).map(([k, v]) => [k, v.label]),
      ),
    },
    null,
    2,
  ),
);

const count = (status) =>
  rows.filter((row) => row.classificacao === status).length;
console.log(`Referências analisadas: ${rows.length}`);
for (const status of [
  'conferida',
  'confirmada',
  'variante editorial',
  'pendente de revisão',
  'sem edição de referência',
])
  console.log(`  ${status}: ${count(status)}`);
console.log(
  `Provas nas duas fontes e ausentes no projeto: ${omissions.length}`,
);
console.log(
  `Referências alteradas desde o último commit: ${regression.length}`,
);
console.log(`Trechos das fontes não interpretados: ${unparsed.length}`);
if (apply) console.log(`Correções aplicadas: ${corrections.length}`);
