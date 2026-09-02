import { readFile } from 'node:fs/promises';

const entries = JSON.parse(await readFile(new URL('../content/catecismo-maior.json', import.meta.url), 'utf8'));
const failures = [];

if (entries.length !== 196) failures.push(`Esperadas 196 perguntas; encontradas ${entries.length}.`);
const numbers = new Set();
const referencePattern = /^(?:[1-3]?\s*[A-Za-zÀ-ÿ]+)\s+\d+(?:[:.]|\s+)\d+(?:\s*[-–]\s*\d+)?$/;

for (const entry of entries) {
  if (!Number.isInteger(entry.number) || entry.number < 1 || entry.number > 196) failures.push(`Número inválido: ${entry.number}.`);
  if (numbers.has(entry.number)) failures.push(`Número duplicado: ${entry.number}.`);
  numbers.add(entry.number);
  if (!entry.question?.trim()) failures.push(`Pergunta vazia: ${entry.number}.`);
  else if (!entry.question.trim().endsWith('?')) failures.push(`Pergunta sem interrogação final: ${entry.number}.`);
  if (!entry.answer?.trim()) failures.push(`Resposta vazia: ${entry.number}.`);
  if (!Array.isArray(entry.references)) failures.push(`Referências inválidas: ${entry.number}.`);
  for (const reference of entry.references ?? []) if (!referencePattern.test(reference)) failures.push(`Referência não normalizada em ${entry.number}: ${reference}.`);
}

for (let number = 1; number <= 196; number += 1) if (!numbers.has(number)) failures.push(`Número ausente: ${number}.`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Conteúdo válido: ${entries.length} perguntas, ${entries.reduce((total, entry) => total + entry.references.length, 0)} referências.`);
