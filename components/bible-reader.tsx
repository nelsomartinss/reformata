'use client';

import { useRouter } from 'next/navigation';
import BibleVerseBlock from '@/components/bible-verse';
import DocumentHeader from '@/components/document-header';
import Pager from '@/components/pager';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import {
  bibleBooks,
  getAdjacentBibleChapter,
  type BibleBook,
} from '@/lib/bible/catalog';
import { bibleTranslation } from '@/lib/bible/translation';
import type { BibleVerse } from '@/lib/bible/types';

type BibleReaderProps = {
  book: BibleBook;
  chapter: number;
  verses: BibleVerse[];
};

function chapterHref(book: BibleBook, chapter: number) {
  return `/biblia/${book.slug}/${chapter}`;
}

export default function BibleReader({
  book,
  chapter,
  verses,
}: BibleReaderProps) {
  const router = useRouter();
  const previous = getAdjacentBibleChapter(book, chapter, -1);
  const next = getAdjacentBibleChapter(book, chapter, 1);
  const citedCount = verses.filter((verse) => verse.references?.length).length;

  function selectChapter(value: string) {
    const [nextBookSlug, nextChapter] = value.split(':');
    const nextBook = bibleBooks.find((item) => item.slug === nextBookSlug);
    if (nextBook) router.push(chapterHref(nextBook, Number(nextChapter)));
  }

  const pagerProps = {
    previous: previous && {
      label: `${previous.book.name} ${previous.chapter}`,
      href: chapterHref(previous.book, previous.chapter),
    },
    next: next && {
      label: `${next.book.name} ${next.chapter}`,
      href: chapterHref(next.book, next.chapter),
    },
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DocumentHeader
          title="Bíblia"
          description="Leia a Bíblia completa e veja onde cada versículo é citado nos catecismos e na Confissão."
          meta={[bibleTranslation.name, `${bibleBooks.length} livros`]}
          current={`${book.name} ${chapter}`}
        />

        <Panel className="mx-auto mt-6 max-w-3xl">
          <PanelHeader className="gap-2">
            <div className="flex w-full items-center gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Escolher livro e capítulo</span>
                <select
                  value={`${book.slug}:${chapter}`}
                  onChange={(event) => selectChapter(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm font-medium outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
                >
                  {bibleBooks.map((item) => (
                    <optgroup key={item.slug} label={item.name}>
                      {Array.from({ length: item.chapters }, (_, index) => {
                        const number = index + 1;
                        return (
                          <option
                            key={`${item.slug}:${number}`}
                            value={`${item.slug}:${number}`}
                          >
                            {item.name} {number}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
              </label>
              <Pager {...pagerProps} compact className="gap-2" />
            </div>
          </PanelHeader>

          <PanelBody className="px-5 py-8 sm:px-10 sm:py-10">
            <h2 className="text-center font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {book.name} {chapter}
            </h2>
            {citedCount > 0 && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Versículos sublinhados são citados nos documentos. Toque neles
                para ver onde.
              </p>
            )}
            <article
              aria-label={`Texto de ${book.name}, capítulo ${chapter}`}
              className="mt-8 font-serif text-lg leading-9 sm:text-[1.1875rem]"
            >
              {verses.map((verse) => (
                <BibleVerseBlock key={verse.number} verse={verse} />
              ))}
            </article>
          </PanelBody>
          <div className="border-t border-border px-4 py-3">
            <Pager {...pagerProps} status={`${book.name} ${chapter}`} />
          </div>
        </Panel>
      </main>
      <SiteFooter />
    </>
  );
}
