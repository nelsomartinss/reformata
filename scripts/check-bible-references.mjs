/**
 * Testes de regressão das referências bíblicas.
 *
 * Usa o mesmo código do site (lib/bible) para garantir que:
 *   1. toda referência dos documentos abre um texto da Bíblia Livre;
 *   2. as referências corrigidas na auditoria apontam para o versículo certo;
 *   3. capítulos inteiros e listas com vários intervalos são lidos corretamente;
 *   4. "Onde este versículo é citado" continua ligando o versículo ao trecho.
 *
 * Uso: node scripts/check-bible-references.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const jiti = createJiti(import.meta.url, { alias: { '@': root } });
const { getPassages, getChapterVerses } = await jiti.import(
  path.join(root, 'lib/bible/local.ts'),
);
const { getBibleReferenceLinks } = await jiti.import(
  path.join(root, 'lib/bible/reference-index.ts'),
);
const greater = (
  await jiti.import(path.join(root, 'content/catecismo-maior.json'))
).default;
const shorter = (
  await jiti.import(path.join(root, 'content/breve-catecismo.json'))
).default;
const confession = (
  await jiti.import(path.join(root, 'content/confissao-de-fe.json'))
).default;

const failures = [];
let checks = 0;
function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

// 1. Toda referência abre um texto.
const items = [
  ...greater.map((e) => ({
    label: `Catecismo Maior ${e.number}`,
    refs: e.references,
  })),
  ...shorter.map((e) => ({
    label: `Breve Catecismo ${e.number}`,
    refs: e.references,
  })),
  ...confession.chapters.flatMap((c) =>
    c.paragraphs.map((p) => ({
      label: `Confissão ${c.number}.${p.number}`,
      refs: p.references,
    })),
  ),
];
let total = 0;
for (const item of items) {
  const { passages, failedReferences } = getPassages(item.refs);
  total += item.refs.length;
  check(
    failedReferences.length === 0,
    `${item.label}: sem texto para ${failedReferences.join(', ')}`,
  );
  check(
    passages.every((p) => p.verses.length > 0 && p.verses.every((v) => v.text)),
    `${item.label}: passagem vazia`,
  );
}

// 2. Referências corrigidas apontam para o versículo esperado.
const find = (doc, id) =>
  doc === 'wcf'
    ? confession.chapters
        .find((c) => c.number === id[0])
        .paragraphs.find((p) => p.number === id[1]).references
    : (doc === 'wlc' ? greater : shorter).find((e) => e.number === id)
        .references;

const expectations = [
  // [documento, trecho, referência, título esperado, trecho do texto esperado]
  ['wlc', 7, 'At 7:2', 'Atos 7:2', 'Deus da glória'],
  ['wlc', 7, 'Ml 3:6', 'Malaquias 3:6', 'não me mudo'],
  ['wlc', 7, 'Sl 90:2', 'Salmos 90:2', 'eternidade'],
  ['wlc', 32, 'Jo 6:27', 'João 6:27', 'comida'],
  ['wlc', 176, 'Mt 28:19', 'Mateus 28:19', 'batizando'],
  ['wlc', 185, 'Ef 6:18', 'Efésios 6:18', 'oração'],
  ['wlc', 3, '2Tm 3:16', '2 Timóteo 3:16', 'Escritura'],
  ['wlc', 9, 'Mt 3:16-17', 'Mateus 3:16-17', 'Filho amado'],
  ['wlc', 16, '2Pe 2:4', '2 Pedro 2:4', 'anjos'],
  ['wlc', 105, 'Is 42:25', 'Isaías 42:25', 'coração'],
  ['wlc', 109, 'Is 65:3-5', 'Isaías 65:3-5', 'jardins'],
  ['wlc', 121, 'Ez 20:12', 'Ezequiel 20:12', 'sábados'],
  ['wlc', 189, 'Mt 6:9', null, null],
  ['wcf', [2, 1], 'Jo 4:24', 'João 4:24', 'Espírito'],
  ['wcf', [8, 1], '1Tm 2:5', '1 Timóteo 2:5', 'mediador'],
  ['wcf', [14, 1], 'Rm 4:11', 'Romanos 4:11', 'selo'],
  [
    'wcf',
    [3, 8],
    'Rm. 11:33; 9:20; 11:5-6, 20; 8:33',
    'Romanos 11:33; Romanos 9:20; Romanos 11:5-6, 20; Romanos 8:33',
    null,
  ],
];
for (const [doc, id, referenceValue, title, text] of expectations) {
  const refs = find(doc, id);
  const reference = String(referenceValue);
  const where = `${String(doc)} ${Array.isArray(id) ? id.join('.') : String(id)}`;
  if (title === null) {
    check(
      !refs.includes(reference),
      `${where}: "${reference}" não deveria ter sido aplicada (pendente)`,
    );
    continue;
  }
  check(
    refs.includes(reference),
    `${where}: referência "${reference}" ausente`,
  );
  const passage = getPassages([reference]).passages[0];
  check(
    passage?.reference === title,
    `${where}: título "${String(passage?.reference)}" ≠ "${String(title)}"`,
  );
  if (text)
    check(
      passage?.content.toLowerCase().includes(text.toLowerCase()),
      `${where}: texto de ${String(reference)} não contém "${String(text)}"`,
    );
}

// Referências mantidas por decisão de revisão.
check(
  find('wlc', 32).includes('1Sm 4:3-6'),
  'Catecismo Maior 32: "1Sm 4:3-6" deveria ter sido mantida',
);
check(
  find('wcf', [4, 1]).includes('Rm. 1:20'),
  'Confissão 4.1: "Rm. 1:20" deveria ter sido mantida',
);
check(
  find('wcf', [25, 2]).includes('Mt 13:47; Cl 1:13'),
  'Confissão 25.2: "Mt 13:47; Cl 1:13" deveria ter sido mantida',
);
check(
  find('wcf', [22, 2]).includes('Esdras 10:5'),
  'Confissão 22.2: "Esdras 10:5" não deveria ter sido alterada',
);

// 3. Capítulo inteiro e múltiplos intervalos.
const genesis1 = getPassages(['Gn. 1']).passages[0];
check(
  genesis1?.verses.length === getChapterVerses('GEN', 1).length,
  'Capítulo inteiro "Gn. 1" não trouxe todos os versículos',
);
const multi = getPassages(['Rm. 1:19-20, 32', '2:1, 14-15']).passages;
check(
  multi[1]?.reference === 'Romanos 2:1, 14-15',
  'Continuação "2:1, 14-15" não herdou o livro anterior',
);
check(
  multi[1]?.verses.map((v) => v.number).join(',') === '1,14,15',
  'Intervalos de "2:1, 14-15" lidos incorretamente',
);
const jude = getPassages(['Jd. 6']).passages[0];
check(
  jude?.reference === 'Judas 1:6',
  'Livro de um capítulo ("Jd. 6") lido incorretamente',
);

// 4. "Onde este versículo é citado".
const citedIn = (book, chapter, verse, href) =>
  getBibleReferenceLinks(book, chapter, verse).some(
    (link) => link.href === href,
  );
check(
  citedIn('2TI', 3, 16, '/catecismo-maior/pergunta/3'),
  '2 Timóteo 3:16 não aponta para o Catecismo Maior 3',
);
check(
  !citedIn('1TI', 3, 16, '/catecismo-maior/pergunta/3'),
  '1 Timóteo 3:16 ainda aponta para o Catecismo Maior 3',
);
check(
  citedIn('ROM', 4, 11, '/confissao-de-fe/14/1'),
  'Romanos 4:11 não aponta para a Confissão 14.1',
);
check(
  citedIn('GEN', 1, 31, '/confissao-de-fe/4/1'),
  'Capítulo inteiro Gn 1 não aponta para a Confissão 4.1',
);
check(
  citedIn('ISA', 65, 4, '/catecismo-maior/pergunta/109'),
  'Isaías 65:4 não aponta para o Catecismo Maior 109',
);

console.log(
  `Referências verificadas: ${total} | verificações: ${checks} | falhas: ${failures.length}`,
);
for (const failure of failures) console.log('  ✗ ' + failure);
process.exit(failures.length ? 1 : 0);
