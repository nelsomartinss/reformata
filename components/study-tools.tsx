'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';

type StudyToolsProps = {
  reference: string;
  content: string;
};

type CopyTarget = 'link' | 'reference';
type CopyStatus = CopyTarget | 'error' | null;

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
        ? 'Referência copiada.'
        : status === 'error'
          ? 'Não foi possível copiar. Verifique as permissões do navegador.'
          : '';

  return (
    <div className="rounded-2xl border border-[#d7dfd8] bg-[#eaf2eb] p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#d9e9dc] text-[#527a5d]">
          <Copy className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow text-[#52705c]">Estudo pessoal</p>
          <h2 className="mt-2 text-base font-semibold text-[#365541]">
            Ferramentas de estudo
          </h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#5c7062]">
        Guarde esta leitura ou leve a referência para suas anotações.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <button
          type="button"
          onClick={() => copy(window.location.href, 'link')}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-[#c5d8c9] bg-white/70 px-3 text-left text-sm font-semibold text-[#426d53] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52705c]"
        >
          <Link2 className="size-4" aria-hidden="true" />
          Copiar link
        </button>
        <button
          type="button"
          onClick={() => copy(`${reference}\n\n${content}`, 'reference')}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-[#c5d8c9] bg-white/70 px-3 text-left text-sm font-semibold text-[#426d53] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52705c]"
        >
          <Check className="size-4" aria-hidden="true" />
          Copiar referência completa
        </button>
      </div>
      <p
        className={`mt-3 min-h-5 text-xs leading-5 ${status === 'error' ? 'text-[#875348]' : 'text-[#52705c]'}`}
        aria-live="polite"
      >
        {feedback}
      </p>
    </div>
  );
}
