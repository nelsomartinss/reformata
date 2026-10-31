'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, Search, X } from 'lucide-react';
import Notice from '@/components/notice';
import type { GlobalSearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

type SearchState = 'idle' | 'loading' | 'ready' | 'error';

type HomeSearchProps = {
  id?: string;
  /**
   * Mostra os resultados num painel flutuante sobre a página, sem empurrar o
   * conteúdo (usado na página inicial). Sem ele, os resultados ficam abaixo do
   * campo (usado na janela de busca).
   */
  floating?: boolean;
  onNavigate?: () => void;
};

export default function HomeSearch({
  id = 'global-search',
  floating,
  onNavigate,
}: HomeSearchProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [state, setState] = useState<SearchState>('idle');

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setState('loading');
      try {
        const response = await fetch(
          '/api/search?q=' + encodeURIComponent(normalizedQuery),
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('SEARCH_UNAVAILABLE');
        const data = (await response.json()) as {
          results?: GlobalSearchResult[];
        };
        setResults(data.results ?? []);
        setState('ready');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setResults([]);
        setState('error');
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups = new Map<string, GlobalSearchResult[]>();
    for (const result of results) {
      const group = groups.get(result.documentTitle) ?? [];
      group.push(result);
      groups.set(result.documentTitle, group);
    }
    return [...groups.entries()];
  }, [results]);

  const hasQuery = query.trim().length >= 2;

  // No painel flutuante, clicar fora fecha os resultados.
  useEffect(() => {
    if (!floating) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setPanelOpen(false);
    }
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [floating]);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setPanelOpen(true);
    if (nextQuery.trim().length < 2) {
      setResults([]);
      setState('idle');
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="sr-only">
        Buscar nos textos
      </label>
      <div className="flex h-11 items-center gap-2.5 rounded-md border border-input bg-background px-3 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25">
        {state === 'loading' ? (
          <LoaderCircle
            className="size-4 shrink-0 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => setPanelOpen(true)}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            // O navegador limpa campos de busca com Esc; aqui o primeiro Esc só fecha os resultados.
            if (floating && panelOpen && hasQuery) {
              event.preventDefault();
              setPanelOpen(false);
            } else if (query) {
              event.stopPropagation();
              handleQueryChange('');
            }
          }}
          aria-controls={`${id}-resultados`}
          placeholder="Ex.: santificação, Escritura, tese 36…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange('')}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Digite pelo menos duas letras para buscar em todos os textos.
      </p>

      <div
        id={`${id}-resultados`}
        aria-live="polite"
        aria-atomic="true"
        hidden={!hasQuery || state === 'idle' || (floating && !panelOpen)}
        className={cn(
          'mt-2 max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain rounded-md border border-border bg-card',
          floating && 'absolute inset-x-0 top-11 z-20 shadow-lg',
        )}
      >
        {state === 'loading' && results.length === 0 && (
          <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />{' '}
            Buscando…
          </p>
        )}
        {state !== 'error' &&
          groupedResults.map(([documentTitle, documentResults]) => (
            <section key={documentTitle} aria-label={documentTitle}>
              <p className="sticky top-0 border-b border-border bg-subtle px-4 py-2 text-xs font-semibold text-muted-foreground">
                {documentTitle}{' '}
                <span className="font-normal">({documentResults.length})</span>
              </p>
              <ul className="divide-y divide-border border-b border-border last:border-b-0">
                {documentResults.map((result) => (
                  <li key={result.href}>
                    <Link
                      href={result.href}
                      onClick={onNavigate}
                      className="block px-4 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    >
                      <span className="block text-sm font-semibold text-link">
                        {result.label}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                        {result.excerpt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        {state === 'ready' && groupedResults.length === 0 && (
          <Notice className="m-2">
            Nada encontrado para “{query.trim()}”. Tente outra palavra.
          </Notice>
        )}
        {state === 'error' && (
          <Notice tone="danger" className="m-2">
            Não foi possível buscar agora. Tente novamente em alguns instantes.
          </Notice>
        )}
      </div>
    </div>
  );
}
