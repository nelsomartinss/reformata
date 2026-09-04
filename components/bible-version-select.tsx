'use client';

import { useEffect, useState } from 'react';
import type { BibleVersion } from '@/lib/bible';

type BibleVersionSelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function BibleVersionSelect({
  id,
  value,
  onChange,
}: BibleVersionSelectProps) {
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>(
    'loading',
  );

  useEffect(() => {
    let active = true;
    fetch('/api/bible/versions')
      .then(async (response) => {
        const data = (await response.json()) as {
          versions?: BibleVersion[];
        };
        if (!response.ok) throw new Error('VERSIONS_UNAVAILABLE');
        return data.versions ?? [];
      })
      .then((nextVersions) => {
        if (!active) return;
        setVersions(nextVersions);
        setState('ready');
        const configured = nextVersions.find((version) => version.configured);
        if (!value && configured) onChange(configured.id);
        if (value && !nextVersions.some((version) => version.id === value)) {
          onChange(configured?.id ?? '');
        }
      })
      .catch(() => {
        if (!active) return;
        setState('unavailable');
      });
    return () => {
      active = false;
    };
  }, [onChange, value]);

  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={state === 'loading' || versions.length === 0}
      className="h-10 min-w-48 rounded-xl border border-[#cbd9cf] bg-white px-3 text-sm font-semibold text-[#365541] outline-none focus:border-[#6a9275] focus:ring-3 focus:ring-[#a9c7b1]/40 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {state === 'loading' && <option value="">Carregando traducoes...</option>}
      {state === 'unavailable' && (
        <option value="">Traducoes indisponiveis</option>
      )}
      {state === 'ready' && versions.length === 0 && (
        <option value="">Nenhuma traducao encontrada</option>
      )}
      {state === 'ready' && !value && versions.length > 0 && (
        <option value="">Selecione uma traducao</option>
      )}
      {versions.map((version) => (
        <option key={version.id} value={version.id}>
          {version.abbreviation} · {version.name}
        </option>
      ))}
    </select>
  );
}
