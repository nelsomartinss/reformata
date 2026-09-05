'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LoaderCircle, Search, X } from 'lucide-react';
import type { GlobalSearchResult } from '@/lib/search';

type SearchState = 'idle' | 'loading' | 'ready' | 'error';

export default function HomeSearch() {
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

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (nextQuery.trim().length < 2) {
      setResults([]);
      setState('idle');
    }
  }

  return (
    <div className="relative">
      <label htmlFor="global-search" className="sr-only">
        Pesquisar no acervo
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-[#cbd8ce] bg-white px-4 py-3 shadow-[0_12px_35px_rgba(55,72,61,0.06)] focus-within:border-[#789980] focus-within:ring-4 focus-within:ring-[#b9cfbd]/35">
        {state === 'loading' ? (
          <LoaderCircle
            className="size-5 shrink-0 animate-spin text-[#52705c]"
            aria-hidden="true"
          />
        ) : (
          <Search
            className="size-5 shrink-0 text-[#718078]"
            aria-hidden="true"
          />
        )}
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') handleQueryChange('');
          }}
          placeholder="Ex.: santificação, Escritura, tese 36..."
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#304138] outline-none placeholder:text-[#9aa69e]"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange('')}
            className="rounded-full p-1 text-[#84938a] transition hover:bg-[#eef4ef] hover:text-[#52705c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52705c]"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div
        id="global-search-results"
        className="mt-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === 'ready' && groupedResults.length > 0 && (
          <div className="rounded-2xl border border-[#d8e0d8] bg-white/75 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {groupedResults.map(([documentTitle, documentResults]) => (
                <div key={documentTitle}>
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#718078]">
                    {documentTitle}
                  </p>
                  <div className="space-y-1">
                    {documentResults.map((result) => (
                      <Link
                        key={result.href}
                        href={result.href}
                        className="group block rounded-xl px-3 py-2.5 transition hover:bg-[#eef4ef] focus-visible:bg-[#eef4ef] focus-visible:outline-2 focus-visible:outline-[#52705c]"
                      >
                        <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#3f5e4b]">
                          {result.label}
                          <ArrowUpRight className="size-4 shrink-0 text-[#84938a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#718078]">
                          {result.excerpt}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {state === 'ready' && hasQuery && groupedResults.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#cbd8ce] bg-white/50 px-4 py-3 text-sm text-[#718078]">
            Nenhum trecho encontrado para “{query.trim()}”.
          </p>
        )}
        {state === 'error' && (
          <p className="rounded-2xl border border-[#e5c5bd] bg-[#fff7f4] px-4 py-3 text-sm text-[#875348]">
            Não foi possível pesquisar agora. Tente novamente em alguns
            instantes.
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-[#84938a]">
        Digite pelo menos duas letras para pesquisar em todo o acervo.
      </p>
    </div>
  );
}
