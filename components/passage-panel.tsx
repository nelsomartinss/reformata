'use client';

import { useEffect, useId, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Notice from '@/components/notice';
import { Panel, PanelBody, PanelHeader, PanelTitle } from '@/components/panel';
import type { PassageBatchResponse } from '@/lib/bible/types';

type PassageTarget = {
  documentSlug: string;
  entryNumber?: number;
  chapterNumber?: number;
  paragraphNumber?: number;
};

type PassagePanelProps = PassageTarget & {
  references: string[];
};

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: PassageBatchResponse };

function PassageList({
  documentSlug,
  entryNumber,
  chapterNumber,
  paragraphNumber,
}: PassageTarget) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ document: documentSlug });
    if (chapterNumber !== undefined && paragraphNumber !== undefined) {
      params.set('chapter', String(chapterNumber));
      params.set('paragraph', String(paragraphNumber));
    } else if (entryNumber !== undefined) {
      params.set('number', String(entryNumber));
    }
    fetch('/api/bible/passages?' + params.toString(), {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('PASSAGENS_INDISPONIVEIS');
        return (await response.json()) as PassageBatchResponse;
      })
      .then((data) => setState({ status: 'ready', data }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setState({ status: 'error' });
      });
    return () => controller.abort();
  }, [chapterNumber, documentSlug, entryNumber, paragraphNumber]);

  if (state.status === 'loading') {
    return (
      <output className="block">
        <Notice>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />{' '}
          Carregando os textos bíblicos…
        </Notice>
      </output>
    );
  }
  if (state.status === 'error') {
    return (
      <Notice tone="danger">
        Não foi possível carregar os textos bíblicos agora. Verifique sua
        conexão e tente novamente.
      </Notice>
    );
  }

  const { passages, failedReferences } = state.data;
  return (
    <div className="space-y-3">
      <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
        {passages.map((passage, index) => (
          <article
            key={`${passage.reference}-${index}`}
            className="px-4 py-3.5 sm:px-5"
          >
            <h3 className="text-sm font-semibold text-link">
              {passage.reference}
            </h3>
            <p className="mt-1.5 font-serif text-[1.0625rem] leading-7">
              {passage.verses.map((verse, index) => (
                <span key={verse.number}>
                  {passage.verses.length > 1 && (
                    <sup className="mr-1 font-sans text-[0.68em] font-semibold text-muted-foreground">
                      {verse.number}
                    </sup>
                  )}
                  {verse.text}
                  {index < passage.verses.length - 1 && ' '}
                </span>
              ))}
            </p>
          </article>
        ))}
      </div>
      {failedReferences.length > 0 && (
        <Notice tone="warning">
          Não encontramos o texto de: {failedReferences.join(', ')}.
        </Notice>
      )}
    </div>
  );
}

export default function PassagePanel({
  references,
  ...target
}: PassagePanelProps) {
  const headingId = useId();

  return (
    <Panel aria-labelledby={headingId}>
      <PanelHeader>
        <PanelTitle id={headingId}>Referências bíblicas</PanelTitle>
        {references.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {references.length}{' '}
            {references.length === 1 ? 'passagem' : 'passagens'} · Bíblia Livre
          </span>
        )}
      </PanelHeader>
      <PanelBody className="space-y-4">
        {references.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Não há referências bíblicas registradas para este trecho.
          </p>
        ) : (
          <PassageList
            key={`${target.documentSlug}-${target.entryNumber}-${target.chapterNumber}-${target.paragraphNumber}`}
            {...target}
          />
        )}
      </PanelBody>
    </Panel>
  );
}
