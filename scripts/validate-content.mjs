import { readFile } from 'node:fs/promises';

const entries = JSON.parse(
  await readFile(
    new URL('../content/catecismo-maior.json', import.meta.url),
    'utf8',
  ),
);
const failures = [];

if (entries.length !== 196)
  failures.push(`Esperadas 196 perguntas; encontradas ${entries.length}.`);
const numbers = new Set();
const referencePattern =
  /^(?:[1-3]?\s*[A-Za-zÀ-ÿ]+)\s+\d+(?:[:.]|\s+)\d+(?:\s*[-–]\s*\d+)?$/;

for (const entry of entries) {
  if (!Number.isInteger(entry.number) || entry.number < 1 || entry.number > 196)
    failures.push(`Número inválido: ${entry.number}.`);
  if (numbers.has(entry.number))
    failures.push(`Número duplicado: ${entry.number}.`);
  numbers.add(entry.number);
  if (!entry.question?.trim())
    failures.push(`Pergunta vazia: ${entry.number}.`);
  else if (!entry.question.trim().endsWith('?'))
    failures.push(`Pergunta sem interrogação final: ${entry.number}.`);
  if (!entry.answer?.trim()) failures.push(`Resposta vazia: ${entry.number}.`);
  if (!Array.isArray(entry.references))
    failures.push(`Referências inválidas: ${entry.number}.`);
  for (const reference of entry.references ?? [])
    if (!referencePattern.test(reference))
      failures.push(
        `Referência não normalizada em ${entry.number}: ${reference}.`,
      );
}

for (let number = 1; number <= 196; number += 1)
  if (!numbers.has(number)) failures.push(`Número ausente: ${number}.`);

const shortEntries = JSON.parse(
  await readFile(
    new URL('../content/breve-catecismo.json', import.meta.url),
    'utf8',
  ),
);
const shortNumbers = new Set();
if (shortEntries.length !== 107)
  failures.push(
    `Esperadas 107 perguntas do Breve Catecismo; encontradas ${shortEntries.length}.`,
  );
for (const entry of shortEntries) {
  if (!Number.isInteger(entry.number) || entry.number < 1 || entry.number > 107)
    failures.push(`Número inválido no Breve Catecismo: ${entry.number}.`);
  if (shortNumbers.has(entry.number))
    failures.push(`Número duplicado no Breve Catecismo: ${entry.number}.`);
  shortNumbers.add(entry.number);
  if (!entry.question?.trim())
    failures.push(`Pergunta vazia no Breve Catecismo: ${entry.number}.`);
  else if (!entry.question.trim().endsWith('?'))
    failures.push(
      `Pergunta sem interrogação no Breve Catecismo: ${entry.number}.`,
    );
  if (!entry.answer?.trim())
    failures.push(`Resposta vazia no Breve Catecismo: ${entry.number}.`);
  if (!Array.isArray(entry.references) || entry.references.length === 0)
    failures.push(`Referências inválidas no Breve Catecismo: ${entry.number}.`);
  for (const reference of entry.references ?? [])
    if (!referencePattern.test(reference))
      failures.push(
        `Referência não normalizada no Breve Catecismo ${entry.number}: ${reference}.`,
      );
}
for (let number = 1; number <= 107; number += 1)
  if (!shortNumbers.has(number))
    failures.push(`Número ausente no Breve Catecismo: ${number}.`);

const confession = JSON.parse(
  await readFile(
    new URL('../content/confissao-de-fe.json', import.meta.url),
    'utf8',
  ),
);
const theses = JSON.parse(
  await readFile(new URL('../content/95-teses.json', import.meta.url), 'utf8'),
);
if (!Array.isArray(confession.chapters) || confession.chapters.length !== 35)
  failures.push(
    `Esperados 35 capítulos da Confissão; encontrados ${confession.chapters?.length ?? 0}.`,
  );
let confessionParagraphs = 0;
const globalNumbers = new Set();
for (const [chapterIndex, chapter] of (confession.chapters ?? []).entries()) {
  if (chapter.number !== chapterIndex + 1)
    failures.push(
      `Capítulo fora de sequência na Confissão: ${chapter.number}.`,
    );
  if (!chapter.title?.trim())
    failures.push(`Título vazio na Confissão: ${chapter.number}.`);
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0)
    failures.push(`Capítulo sem afirmações na Confissão: ${chapter.number}.`);
  for (const [paragraphIndex, paragraph] of (
    chapter.paragraphs ?? []
  ).entries()) {
    confessionParagraphs += 1;
    if (paragraph.number !== paragraphIndex + 1)
      failures.push(
        `Parágrafo fora de sequência na Confissão ${chapter.number}: ${paragraph.number}.`,
      );
    if (!paragraph.statement?.trim())
      failures.push(
        `Afirmação vazia na Confissão ${chapter.number}.${paragraph.number}.`,
      );
    if (
      !Array.isArray(paragraph.references) ||
      paragraph.references.some((reference) => !reference?.trim())
    )
      failures.push(
        `Referências inválidas na Confissão ${chapter.number}.${paragraph.number}.`,
      );
    if (globalNumbers.has(paragraph.globalNumber))
      failures.push(
        `Número global duplicado na Confissão: ${paragraph.globalNumber}.`,
      );
    globalNumbers.add(paragraph.globalNumber);
  }
}
if (confessionParagraphs !== 179)
  failures.push(
    `Esperadas 179 afirmações da Confissão; encontradas ${confessionParagraphs}.`,
  );

if (!Array.isArray(theses.theses) || theses.theses.length !== 95)
  failures.push(
    'Esperadas 95 Teses; encontradas ' + (theses.theses?.length ?? 0) + '.',
  );
for (const [thesisIndex, thesis] of (theses.theses ?? []).entries()) {
  if (thesis.number !== thesisIndex + 1)
    failures.push('Tese fora de sequência: ' + thesis.number + '.');
  if (!thesis.text?.trim())
    failures.push('Texto vazio na Tese ' + thesis.number + '.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  'Conteúdo válido: ' +
    entries.length +
    ' perguntas, ' +
    shortEntries.length +
    ' do Breve Catecismo, ' +
    confessionParagraphs +
    ' afirmações da Confissão e ' +
    theses.theses.length +
    ' Teses.',
);
