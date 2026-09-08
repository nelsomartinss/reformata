const aliases: Record<string, string> = {
  gn: 'GEN',
  ex: 'EXO',
  exodo: 'EXO',
  lv: 'LEV',
  nm: 'NUM',
  numeros: 'NUM',
  dt: 'DEU',
  js: 'JOS',
  jz: 'JDG',
  rt: 'RUT',
  '1sm': '1SA',
  '2sm': '2SA',
  '1rs': '1KI',
  '2rs': '2KI',
  '1cr': '1CH',
  '2cr': '2CH',
  ed: 'EZR',
  ne: 'NEH',
  et: 'EST',
  job: 'JOB',
  jo: 'JHN',
  sl: 'PSA',
  salmos: 'PSA',
  pv: 'PRO',
  proverbios: 'PRO',
  ec: 'ECC',
  ct: 'SNG',
  is: 'ISA',
  jr: 'JER',
  lm: 'LAM',
  ez: 'EZK',
  dn: 'DAN',
  os: 'HOS',
  jl: 'JOL',
  am: 'AMO',
  ob: 'OBA',
  jn: 'JON',
  mq: 'MIC',
  na: 'NAM',
  hc: 'HAB',
  sf: 'ZEP',
  ag: 'HAG',
  zc: 'ZEC',
  ml: 'MAL',
  mt: 'MAT',
  mc: 'MRK',
  lc: 'LUK',
  at: 'ACT',
  rm: 'ROM',
  '1co': '1CO',
  '2co': '2CO',
  gl: 'GAL',
  ef: 'EPH',
  fp: 'PHP',
  cl: 'COL',
  '1ts': '1TH',
  '2ts': '2TH',
  '1tm': '1TI',
  '2tm': '2TI',
  tt: 'TIT',
  fm: 'PHM',
  hb: 'HEB',
  tg: 'JAS',
  '1pe': '1PE',
  '2pe': '2PE',
  '1jo': '1JN',
  '2jo': '2JN',
  '3jo': '3JN',
  jd: 'JUD',
  ap: 'REV',
};

export function normalizeBookName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getCanonicalBookId(value: string) {
  const raw = value.trim().toLowerCase().replace(/[.]$/, '');
  if (raw === 'j\u00f3') return 'JOB';
  if (canonicalBookIds.includes(raw.toUpperCase())) return raw.toUpperCase();
  const normalized = normalizeBookName(value);
  const romanPrefix = normalized.match(/^(i{1,3})([a-z\u00c0-\u00ff]+)$/);
  if (romanPrefix) {
    const romanToArabic: Record<string, string> = { i: '1', ii: '2', iii: '3' };
    return aliases[romanToArabic[romanPrefix[1]] + romanPrefix[2]];
  }
  return aliases[normalized];
}

export const canonicalBookIds = [...new Set(Object.values(aliases))];
