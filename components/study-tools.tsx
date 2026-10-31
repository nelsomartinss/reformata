'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import { Panel, PanelBody, PanelHeader, PanelTitle } from '@/components/panel';

type StudyToolsProps = {
  reference: string;
  content: string;
};

type CopyTarget = 'link' | 'reference';
type CopyStatus = CopyTarget | 'error' | null;

const buttonClass =
  'flex min-h-9 w-full items-center gap-2 py-1.5 leading-5 rounded-md border border-border bg-background px-3 text-left text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export default function StudyTools({ reference, content }: StudyToolsProps) {
  const [status, setStatus] = useState<CopyStatus>(null);
  const resetTimeout = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimeout.current !== null) {
        window.clearTimeout(resetTimeout.current);
      }
    },
    [],
  );

  async function copy(value: string, target: CopyTarget) {
    if (resetTimeout.current !== null) {
      window.clearTimeout(resetTimeout.current);
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('CLIPBOARD_UNAVAILABLE');
      }
      await navigator.clipboard.writeText(value);
      setStatus(target);
    } catch {
      setStatus('error');
    }
    resetTimeout.current = window.setTimeout(() => {
      setStatus(null);
      resetTimeout.current = null;
    }, 2400);
  }

  const feedback =
    status === 'link'
      ? 'Link copiado.'
      : status === 'reference'
        ? 'Texto copiado.'
        : status === 'error'
          ? 'Não foi possível copiar. Tente selecionar o texto manualmente.'
          : '';

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Guardar esta leitura</PanelTitle>
      </PanelHeader>
      <PanelBody className="space-y-2 p-3 sm:p-3">
        <p className="px-1 pb-1 text-xs leading-5 text-muted-foreground">
          Copie para enviar a alguém ou colar nas suas anotações.
        </p>
        <button
          type="button"
          onClick={() => copy(window.location.href, 'link')}
          className={buttonClass}
        >
          {status === 'link' ? (
            <Check className="size-4 text-link" aria-hidden="true" />
          ) : (
            <Link2 className="size-4" aria-hidden="true" />
          )}
          Copiar link desta página
        </button>
        <button
          type="button"
          onClick={() => copy(`${reference}\n\n${content}`, 'reference')}
          className={buttonClass}
        >
          {status === 'reference' ? (
            <Check className="size-4 text-link" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          Copiar texto com referência
        </button>
        <p
          className={`min-h-5 px-1 text-xs leading-5 ${status === 'error' ? 'text-danger-foreground' : 'text-muted-foreground'}`}
          aria-live="polite"
        >
          {feedback}
        </p>
      </PanelBody>
    </Panel>
  );
}
