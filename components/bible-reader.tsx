'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import BibleVersionSelect from '@/components/bible-version-select';
import BibleVerseBlock from '@/components/bible-verse';
import DocumentSwitcher from '@/components/document-switcher';
import SiteBrand from '@/components/site-brand';
import type { BibleBook, BibleChapterResponse } from '@/lib/bible';
import { bibleBooks, getAdjacentBibleChapter } from '@/lib/bible/catalog';

type BibleReaderProps = { book: BibleBook; chapter: number; initialVersion: string };
type ReaderState = 'idle' | 'loading' | 'ready' | 'error' | 'unavailable';

function chapterHref(book: BibleBook, chapter: number, version?: string) {
  const query = version ? `?versao=${encodeURIComponent(version)}` : '';
  return `/biblia/${book.slug}/${chapter}${query}`;
}

export default function BibleReader({ book, chapter, initialVersion }: BibleReaderProps) {
  const router = useRouter();
  const [version, setVersion] = useState(initialVersion);
  const [data, setData] = useState<BibleChapterResponse | null>(null);
  const [state, setState] = useState<ReaderState>(initialVersion ? 'loading' : 'idle');

  useEffect(() => {
    if (!initialVersion) {
      const saved = window.localStorage.getItem('cw-bible-version');
      if (saved) window.setTimeout(() => setVersion(saved), 0);
    } else window.setTimeout(() => setVersion(initialVersion), 0);
  }, [initialVersion]);

  useEffect(() => {
    const stateTimer = window.setTimeout(() => setState(version ? 'loading' : 'idle'), 0);
    if (!version) return () => window.clearTimeout(stateTimer);
    const controller = new AbortController();
    fetch(`/api/bible/chapter?book=${book.id}&chapter=${chapter}&version=${encodeURIComponent(version)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as BibleChapterResponse | { error?: string };
        if (!response.ok) throw new Error('error' in payload ? payload.error : 'API_INDISPONIVEL');
        return payload as BibleChapterResponse;
      })
      .then((payload) => { setData(payload); setState('ready'); })
      .catch((error: Error) => {
        if (error.name === 'AbortError') return;
        setState(error.message === 'TRADUCAO_NAO_CONFIGURADA' || error.message === 'API_CHAVE_NAO_CONFIGURADA' ? 'unavailable' : 'error');
      });
    return () => { window.clearTimeout(stateTimer); controller.abort(); };
  }, [book.id, chapter, version]);

  const selectVersion = useCallback((nextVersion: string) => {
    if (!nextVersion) return;
    setVersion(nextVersion);
    window.localStorage.setItem('cw-bible-version', nextVersion);
    router.replace(chapterHref(book, chapter, nextVersion), { scroll: false });
  }, [book, chapter, router]);

  const selectChapter = useCallback((value: string) => {
    const [nextBookSlug, nextChapter] = value.split(':');
    const nextBook = bibleBooks.find((item) => item.slug === nextBookSlug);
    if (nextBook) router.push(chapterHref(nextBook, Number(nextChapter), version));
  }, [router, version]);

  const previous = useMemo(() => getAdjacentBibleChapter(book, chapter, -1), [book, chapter]);
  const next = useMemo(() => getAdjacentBibleChapter(book, chapter, 1), [book, chapter]);

  return (
    <main className='bible-reader-page'>
      <header className='bible-reader-header'>
        <div className='bible-reader-header-inner'>
          <SiteBrand href='/' />
          <nav aria-label='Documentos' className='bible-reader-nav'>
            <Link href='/catecismo-maior'>Catecismo Maior</Link>
            <Link href='/breve-catecismo'>Breve Catecismo</Link>
            <Link href='/confissao-de-fe'>Confiss&atilde;o de F&eacute;</Link>
            <Link href='/95-teses'>95 Teses</Link>
            <Link className='active' href='/biblia' aria-current='page'>B&iacute;blia</Link>
          </nav>
          <DocumentSwitcher currentSlug='biblia' />
        </div>
      </header>

      <section className='bible-reader-controls'>
        <div className='bible-reader-controls-inner'>
          <label className='bible-chapter-select'>
            <span className='sr-only'>Livro e cap&iacute;tulo</span>
            <select value={`${book.slug}:${chapter}`} onChange={(event) => selectChapter(event.target.value)}>
              {bibleBooks.map((item) => Array.from({ length: item.chapters }, (_, index) => {
                const number = index + 1;
                return <option key={`${item.slug}:${number}`} value={`${item.slug}:${number}`}>{item.name} {number}</option>;
              }))}
            </select>
          </label>
          <div className='bible-version-control'>
            <label htmlFor='bible-reader-version' className='sr-only'>Tradu&ccedil;&atilde;o b&iacute;blica</label>
            <BibleVersionSelect id='bible-reader-version' value={version} onChange={selectVersion} />
          </div>
        </div>
      </section>

      <div className='bible-reader-content'>
        {previous && <Link className='bible-side-nav bible-side-nav-left' href={chapterHref(previous.book, previous.chapter, version)} aria-label={`Cap&iacute;tulo anterior: ${previous.book.name} ${previous.chapter}`}><ChevronLeft className='size-5' /></Link>}
        {next && <Link className='bible-side-nav bible-side-nav-right' href={chapterHref(next.book, next.chapter, version)} aria-label={`Pr&oacute;ximo cap&iacute;tulo: ${next.book.name} ${next.chapter}`}><ChevronRight className='size-5' /></Link>}

        <div className='bible-reading-column'>
          <div className='bible-chapter-heading'>
            <div className='bible-chapter-icon'><BookOpen className='size-5' /></div>
            <p>Leitura b&iacute;blica</p>
            <h1>{book.name} {chapter}</h1>
          </div>

          <div className='bible-text-content'>
            {state === 'idle' && <div className='bible-message'>Selecione uma tradu&ccedil;&atilde;o para iniciar a leitura.</div>}
            {state === 'loading' && <div className='bible-message'><LoaderCircle className='size-4 animate-spin' /> Carregando o cap&iacute;tulo...</div>}
            {state === 'unavailable' && <div className='bible-message bible-message-warning'>A tradu&ccedil;&atilde;o selecionada ainda n&atilde;o est&aacute; configurada para uso neste ambiente.</div>}
            {state === 'error' && <div className='bible-message bible-message-error'>N&atilde;o foi poss&iacute;vel carregar este cap&iacute;tulo agora. Tente novamente em alguns instantes.</div>}
            {state === 'ready' && data && (
              <article aria-label={`Texto de ${book.name} cap&iacute;tulo ${chapter}`}>
                {data.verses.map((verse) => <BibleVerseBlock key={verse.number} verse={verse} />)}
                <footer className='bible-copyright'>
                  <p>{data.translation.name} · Texto fornecido por provedor b&iacute;blico autorizado.</p>
                  {data.copyright && <p>{data.copyright}</p>}
                </footer>
              </article>
            )}
          </div>

          <div className='bible-mobile-nav'>
            {previous ? <Link className='bible-mobile-button' href={chapterHref(previous.book, previous.chapter, version)}><ChevronLeft className='size-4' /> Anterior</Link> : <span />}
            {next ? <Link className='bible-mobile-button' href={chapterHref(next.book, next.chapter, version)}>Pr&oacute;ximo <ChevronRight className='size-4' /></Link> : <span />}
          </div>
        </div>
      </div>
    </main>
  );
}
