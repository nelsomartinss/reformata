'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PassageBatchResponse, PassageResponse } from '@/lib/bible';

type PassagePanelProps = {
  references: string[];
  version: string;
  documentSlug: string;
  entryNumber?: number;
  chapterNumber?: number;
  paragraphNumber?: number;
};

export default function PassagePanel({
  references,
  version,
  documentSlug,
  entryNumber,
  chapterNumber,
  paragraphNumber,
}: PassagePanelProps) {
  const [passages, setPassages] = useState<PassageResponse[]>([]);
  const [failedReferences, setFailedReferences] = useState<string[]>([]);
  const [state, setState] = useState<
    'loading' | 'ready' | 'unavailable' | 'error' | 'empty'
  >(references.length === 0 ? 'empty' : 'loading');

  useEffect(() => {
    let active = true;
    if (references.length === 0) {
      return () => {
        active = false;
      };
    }
    const params = new URLSearchParams({
      document: documentSlug,
      version,
    });
    if (chapterNumber !== undefined && paragraphNumber !== undefined) {
      params.set('chapter', String(chapterNumber));
      params.set('paragraph', String(paragraphNumber));
    } else if (entryNumber !== undefined) {
      params.set('number', String(entryNumber));
    }
    fetch('/api/bible/passages?' + params.toString())
      .then(async (response) => {
        const data = (await response.json()) as {
          error?: string;
          passages?: PassageResponse[];
          failedReferences?: string[];
        };
        if (!response.ok) throw new Error(data.error ?? 'ERRO');
        return {
          passages: data.passages ?? [],
          failedReferences: data.failedReferences ?? [],
        } satisfies PassageBatchResponse;
      })
      .then((data) => {
        if (!active) return;
        setPassages(data.passages);
        setFailedReferences(data.failedReferences);
        setState('ready');
      })
      .catch((error: Error) => {
        if (!active) return;
        setState(
          error.message === 'TRADUCAO_NAO_CONFIGURADA' ||
            error.message === 'API_CHAVE_NAO_CONFIGURADA'
            ? 'unavailable'
            : 'error',
        );
      });
    return () => {
      active = false;
    };
  }, [
    chapterNumber,
    documentSlug,
    entryNumber,
    paragraphNumber,
    references.length,
    version,
  ]);

  return (
    <section className="mt-8" aria-labelledby="references-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Referências bíblicas</p>
          <h2
            id="references-heading"
            className="mt-1 font-serif text-2xl font-semibold text-foreground"
          >
            Textos que fundamentam esta afirmação
          </h2>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-[#c7d5cc] bg-[#eef4ef] px-3 py-1 text-[#3f5e4b]"
        >
          {version.toUpperCase()}
        </Badge>
      </div>
      {state === 'loading' && (
        <output className="mt-5 rounded-2xl border border-dashed border-[#c9d3cc] bg-white/60 p-5 text-sm text-muted-foreground">
          Consultando as passagens autorizadas…
        </output>
      )}
      {state === 'unavailable' && (
        <div className="mt-5 rounded-2xl border border-[#e0d4ba] bg-[#fffaf0] p-5 text-sm leading-6 text-[#6d6048]">
          A tradução selecionada ainda não está conectada a uma licença neste
          ambiente. As referências continuam disponíveis acima; o texto bíblico
          será exibido assim que a chave autorizada for configurada.
        </div>
      )}
      {state === 'error' && (
        <div className="mt-5 rounded-2xl border border-[#e5c5bd] bg-[#fff7f4] p-5 text-sm leading-6 text-[#875348]">
          Não foi possível carregar as passagens agora. Tente novamente em
          alguns instantes.
        </div>
      )}
      {state === 'empty' && (
        <div className="mt-5 rounded-2xl border border-[#d7dfd8] bg-white/60 p-5 text-sm leading-6 text-muted-foreground">
          Esta edição da Confissão não registra referências bíblicas adicionais
          para esta afirmação.
        </div>
      )}
      {state === 'ready' && (
        <div className="mt-5 space-y-4">
          {failedReferences.length > 0 && (
            <p className="rounded-2xl border border-[#e0d4ba] bg-[#fffaf0] p-4 text-sm leading-6 text-[#6d6048]">
              Algumas referências não estão disponíveis nesta tradução:{' '}
              {failedReferences.join(', ')}.
            </p>
          )}
          {passages.map((passage) => (
            <article
              key={passage.passageId}
              className="rounded-2xl border border-[#dbe4dd] bg-[#f7faf7] p-5 sm:p-6"
            >
              <h3 className="text-sm font-bold tracking-wide text-[#476452]">
                {passage.reference}
              </h3>
              <p className="mt-3 font-serif text-lg leading-8 text-[#2d3b34]">
                {passage.content}
              </p>
            </article>
          ))}
          <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Texto fornecido por provedor
            bíblico autorizado. Direitos reservados ao editor da tradução.
          </p>
          {passages[0]?.copyright && (
            <p className="text-xs leading-5 text-muted-foreground">
              {passages[0].copyright}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
