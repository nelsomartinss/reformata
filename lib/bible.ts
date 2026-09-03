export type BibleVersion = {
  id: 'ntlh' | 'ara';
  abbreviation: string;
  name: string;
  publisher: string;
  configured: boolean;
};

export type ScriptureReference = { label: string; passageId: string | null };
export type PassageResponse = { label: string; passageId: string; content: string; reference: string };

const versionConfig = {
  ntlh: { abbreviation: 'NTLH', name: 'Nova Tradução na Linguagem de Hoje', publisher: 'Sociedade Bíblica do Brasil', envKey: 'YVP_NTLH_VERSION_ID' },
  ara: { abbreviation: 'ARA', name: 'Almeida Revista e Atualizada', publisher: 'Sociedade Bíblica do Brasil', envKey: 'YVP_ARA_VERSION_ID' },
} as const;

const bookAliases: Record<string, string> = {
  gn: 'GEN', ex: 'EXO', êx: 'EXO', exodo: 'EXO', êxodo: 'EXO', lv: 'LEV', lev: 'LEV', nm: 'NUM', num: 'NUM', numeros: 'NUM', números: 'NUM', dt: 'DEU', js: 'JOS', jz: 'JDG', rt: 'RUT',
  '1sm': '1SA', '1sam': '1SA', '2sm': '2SA', '2sam': '2SA', '1rs': '1KI', '2rs': '2KI', '1cr': '1CH', '2cr': '2CH', ed: 'EZR', esd: 'EZR', ne: 'NEH', et: 'EST', jo: 'JHN', jó: 'JOB', sl: 'PSA', sal: 'PSA', pv: 'PRO', ec: 'ECC', ct: 'SNG', is: 'ISA', jr: 'JER', lm: 'LAM', ez: 'EZK', dn: 'DAN', os: 'HOS', jl: 'JOL', am: 'AMO', ob: 'OBA', jn: 'JON', mq: 'MIC', na: 'NAM', hc: 'HAB', sf: 'ZEP', ag: 'HAG', zc: 'ZEC', ml: 'MAL',
  mt: 'MAT', mc: 'MRK', lc: 'LUK', at: 'ACT', rm: 'ROM', '1co': '1CO', '2co': '2CO', gl: 'GAL', ef: 'EPH', fp: 'PHP', cl: 'COL', '1ts': '1TH', '2ts': '2TH', '1tm': '1TI', '2tm': '2TI', tt: 'TIT', fm: 'PHM', hb: 'HEB', tg: 'JAS', '1pe': '1PE', '2pe': '2PE', '1jo': '1JN', '2jo': '2JN', '3jo': '3JN', jd: 'JUD', ap: 'REV',
};

function compact(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[.\s]/g, '');
}

export function parseReference(label: string): ScriptureReference {
  const normalized = label.replace(/[()]/g, '').trim();
  const match = normalized.match(/^([1-3]?\s*[A-Za-zÀ-ÿ]+)\s+(\d+)(?:[:.]|\s+)(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (!match) return { label, passageId: null };
  const rawBook = match[1].trim().toLowerCase();
  const book = rawBook.includes('ó') ? 'JOB' : bookAliases[compact(rawBook)];
  if (!book) return { label, passageId: null };
  return { label, passageId: `${book}.${match[2]}.${match[3]}${match[4] ? `-${match[4]}` : ''}` };
}

export function listBibleVersions(): BibleVersion[] {
  return (Object.keys(versionConfig) as Array<keyof typeof versionConfig>).map((id) => ({ id, abbreviation: versionConfig[id].abbreviation, name: versionConfig[id].name, publisher: versionConfig[id].publisher, configured: Boolean(process.env.YVP_APP_KEY && process.env[versionConfig[id].envKey]) }));
}

export async function fetchPassages(versionId: string, references: string[]) {
  if (versionId !== 'ntlh' && versionId !== 'ara') throw new Error('TRADUCAO_NAO_PERMITIDA');
  const config = versionConfig[versionId];
  const bibleId = process.env[config.envKey];
  const appKey = process.env.YVP_APP_KEY;
  if (!appKey || !bibleId) throw new Error('TRADUCAO_NAO_CONFIGURADA');
  const parsedReferences = references.map(parseReference);
  if (parsedReferences.some((reference) => !reference.passageId)) throw new Error('REFERENCIA_INVALIDA');
  return Promise.all(parsedReferences.map(async (reference) => {
    const response = await fetch(`https://api.youversion.com/v1/bibles/${bibleId}/passages/${reference.passageId}?format=text`, { headers: { 'X-YVP-App-Key': appKey }, next: { revalidate: 60 * 60 * 24 * 7 } });
    if (!response.ok) throw new Error(`PROVEDOR_${response.status}`);
    const data = (await response.json()) as { content?: string; reference?: string };
    return { label: reference.label, passageId: reference.passageId as string, content: data.content ?? '', reference: data.reference ?? reference.label } satisfies PassageResponse;
  }));
}
