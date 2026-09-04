'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import BibleVersionSelect from '@/components/bible-version-select';
import PassagePanel from '@/components/passage-panel';
import { normalizeSearchText } from '@/lib/catechism';
import type { ConfessionChapter } from '@/lib/confession';

type ConfessionReaderProps = {
  chapters: ConfessionChapter[];
  initialChapter: number;
  initialParagraph: number;
};

export default function ConfessionReader({
  chapters,
  initialChapter,
  initialParagraph,
}: ConfessionReaderProps) {
  const router = useRouter();
  const firstChapter =
    chapters.find((chapter) => chapter.number === initialChapter) ??
    chapters[0];
  const firstParagraph =
    firstChapter.paragraphs.find((item) => item.number === initialParagraph) ??
    firstChapter.paragraphs[0];
  const [selected, setSelected] = useState({
    chapterNumber: firstChapter.number,
    paragraphNumber: firstParagraph.number,
  });
  const [query, setQuery] = useState('');
  const [version, setVersion] = useState('');
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem('cw-bible-version');
    if (saved) window.setTimeout(() => setVersion(saved), 0);
  }, []);
  const [openChapters, setOpenChapters] = useState<string[]>([
    String(firstChapter.number),
  ]);
  const chapter =
    chapters.find((item) => item.number === selected.chapterNumber) ??
    firstChapter;
  const entry =
    chapter.paragraphs.find(
      (item) => item.number === selected.paragraphNumber,
    ) ?? firstParagraph;
  const sequence = useMemo(
    () =>
      chapters.flatMap((item) =>
        item.paragraphs.map((paragraph) => ({ chapter: item, paragraph })),
      ),
    [chapters],
  );
  const currentPosition = sequence.findIndex(
    (item) =>
      item.chapter.number === chapter.number &&
      item.paragraph.number === entry.number,
  );
  const previous = sequence[currentPosition - 1];
  const next = sequence[currentPosition + 1];
  const normalizedQuery = normalizeSearchText(query);
  const visibleChapters = useMemo(
    () =>
      chapters
        .map((item) => ({
          ...item,
          paragraphs: item.paragraphs.filter((paragraph) => {
            if (!normalizedQuery) return true;
            const haystack = normalizeSearchText(
              `${item.number} ${item.title} ${paragraph.number} ${paragraph.statement} ${paragraph.references.join(' ')}`,
            );
            return haystack.includes(normalizedQuery);
          }),
        }))
        .filter((item) => item.paragraphs.length > 0),
    [chapters, normalizedQuery],
  );

  function selectParagraph(chapterNumber: number, paragraphNumber: number) {
    setSelected({ chapterNumber, paragraphNumber });
    setOpenChapters((current) =>
      current.includes(String(chapterNumber))
        ? current
        : [...current, String(chapterNumber)],
    );
    setMobileIndexOpen(false);
    router.push(`/confissao-de-fe/${chapterNumber}/${paragraphNumber}`);
  }

  function selectVersion(nextVersion: string) {
    if (!nextVersion) return;
    setVersion(nextVersion);
    window.localStorage.setItem('cw-bible-version', nextVersion);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#24302d]">
      <header className="sticky top-0 z-20 border-b border-[#dddcd2] bg-[#f6f3ed]/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-340 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            href="/confissao-de-fe"
            className="flex items-center gap-3"
            aria-label="Reformata, início"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-[#24302d] text-white shadow-sm">
              <BookOpen className="size-5" />
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold leading-none">
                REFORMATA
              </span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#718078] sm:block">
                A fé reformada em seus textos
              </span>
            </span>
          </Link>
          <nav
            aria-label="Documentos"
            className="hidden items-center gap-1 md:flex"
          >
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/catecismo-maior"
            >
              Catecismo Maior
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/breve-catecismo"
            >
              Breve Catecismo
            </Link>
            <Link
              className="rounded-full bg-white/70 px-4 py-2 text-sm text-[#24302d]"
              href="/confissao-de-fe"
            >
              Confissão de Fé
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/95-teses"
            >
              95 Teses de Martinho Lutero
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#718078]">
            <span className="hidden sm:inline">Edição de estudo</span>
            <span className="size-2 rounded-full bg-[#a7bfae]" />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-340 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_minmax(0,760px)] lg:gap-14 lg:px-12 lg:py-12 xl:grid-cols-[280px_minmax(0,760px)_220px]">
        <aside
          className={`${mobileIndexOpen ? 'block' : 'hidden'} lg:block`}
          aria-label="Índice da Confissão de Fé"
        >
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Índice</p>
                <h2 className="mt-1 font-serif text-xl font-semibold">
                  35 capítulos
                </h2>
              </div>
              <Button
                className="size-8 rounded-full lg:hidden"
                variant="ghost"
                size="icon"
                onClick={() => setMobileIndexOpen(false)}
                aria-label="Fechar índice"
              >
                <X className="size-4" />
              </Button>
            </div>
            <label htmlFor="confession-search" className="relative mt-5 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#84938a]" />
              <Input
                id="confession-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar afirmação…"
                className="h-11 rounded-xl border-[#d6ddd7] bg-white/75 pl-9"
              />
            </label>
            <div className="mt-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
              <Accordion
                multiple
                value={openChapters}
                onValueChange={setOpenChapters}
              >
                {visibleChapters.map((item) => (
                  <AccordionItem
                    key={item.number}
                    value={String(item.number)}
                    className="border-[#dfe5df]"
                  >
                    <AccordionTrigger className="w-full px-3 text-[#435c4b] hover:no-underline">
                      <span className="flex min-w-0 items-start gap-3 pr-2">
                        <span className="mt-0.5 w-8 shrink-0 text-xs font-bold text-[#91a097]">
                          {item.roman}
                        </span>
                        <span className="text-left text-sm leading-5">
                          {item.title}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-2">
                      <div className="space-y-1 border-l border-[#d7e1d9] pl-3">
                        {item.paragraphs.map((paragraph) => (
                          <button
                            key={`${item.number}-${paragraph.number}`}
                            type="button"
                            onClick={() =>
                              selectParagraph(item.number, paragraph.number)
                            }
                            className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${item.number === chapter.number && paragraph.number === entry.number ? 'bg-[#e2ede5] text-[#2c5140]' : 'text-[#65746c] hover:bg-white/70 hover:text-[#24302d]'}`}
                          >
                            <span className="mt-0.5 w-6 shrink-0 text-xs font-bold text-[#9aa69e]">
                              {paragraph.roman}
                            </span>
                            <span className="line-clamp-2 text-sm leading-5">
                              {paragraph.statement}
                            </span>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {visibleChapters.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  Nenhuma afirmação encontrada.
                </p>
              )}
            </div>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <div>
              <p className="eyebrow">Leitura guiada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Capítulo {chapter.roman} · afirmação {entry.roman}
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-[#ccd8cf] bg-white/60"
              onClick={() => setMobileIndexOpen((open) => !open)}
            >
              <Menu className="size-4" /> Índice
            </Button>
          </div>
          <div className="mb-8 flex items-start justify-between gap-5">
            <div>
              <p className="eyebrow">Confissão de Fé de Westminster</p>
              <h1 className="mt-2 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-[#24302d] sm:text-5xl">
                Capítulo {chapter.roman}
              </h1>
              <p className="mt-3 max-w-2xl font-serif text-xl text-[#64736a]">
                {chapter.title}
              </p>
            </div>
            <div className="hidden rounded-2xl border border-[#d7dfd8] bg-white/60 p-3 text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#84938a]">
                Progresso
              </p>
              <p className="mt-1 text-lg font-semibold text-[#426d53]">
                {chapter.number}{' '}
                <span className="text-sm font-normal text-[#95a199]">/ 35</span>
              </p>
            </div>
          </div>
          <Card className="overflow-visible border-[#d9ded8] bg-white shadow-[0_20px_60px_rgba(55,72,61,0.08)]">
            <CardContent className="p-6 sm:p-9 lg:p-11">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-[#e2ede5] px-3 py-1 text-[#426d53] hover:bg-[#e2ede5]">
                  Afirmação {entry.roman}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Capítulo {chapter.number} · {chapter.title}
                </span>
              </div>
              <div className="mt-6 rounded-2xl border border-[#e8ebe6] bg-[#fbfcfa] p-5 sm:p-7">
                <p className="eyebrow">Texto confessional</p>
                <p className="mt-4 font-serif text-xl leading-9 text-[#3d4c44] sm:text-2xl sm:leading-10">
                  {entry.statement}
                </p>
              </div>
              <div className="mt-9 rounded-2xl border border-[#dce6df] bg-[#f4f8f4] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label
                      htmlFor="confession-bible-version"
                      className="block text-sm font-bold text-[#365541]"
                    >
                      Tradução bíblica
                    </label>
                    <p className="mt-1 text-xs text-[#728178]">
                      Escolha como deseja ler as referências abaixo.
                    </p>
                  </div>
                  <BibleVersionSelect
                    id="confession-bible-version"
                    value={version}
                    onChange={selectVersion}
                  />
                </div>
              </div>
              <div className="mt-8">
                <p className="eyebrow">Provas das Escrituras</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.references.map((reference) => (
                    <span
                      key={reference}
                      className="rounded-full border border-[#d7e1d9] bg-[#fbfdfb] px-3 py-1.5 text-sm font-semibold text-[#52705c]"
                    >
                      {reference}
                    </span>
                  ))}
                </div>
              </div>
              <PassagePanel
                key={`${chapter.number}-${entry.number}-${version}`}
                references={entry.references}
                version={version}
                documentSlug="confissao-de-fe"
                chapterNumber={chapter.number}
                paragraphNumber={entry.number}
              />
            </CardContent>
          </Card>
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="h-11 rounded-full border-[#cfd9d1] bg-white/60 px-4"
              disabled={!previous}
              onClick={() =>
                previous &&
                selectParagraph(
                  previous.chapter.number,
                  previous.paragraph.number,
                )
              }
            >
              <ChevronLeft className="size-4" />{' '}
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <p className="text-xs font-semibold text-[#84938a]">
              {entry.globalNumber} / {sequence.length}
            </p>
            <Button
              variant="outline"
              className="h-11 rounded-full border-[#cfd9d1] bg-white/60 px-4"
              disabled={!next}
              onClick={() =>
                next &&
                selectParagraph(next.chapter.number, next.paragraph.number)
              }
            >
              <span className="hidden sm:inline">Próxima</span>{' '}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </section>
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-[#d7dfd8] bg-[#eaf2eb] p-5">
              <Check className="size-5 text-[#527a5d]" />
              <p className="mt-4 text-sm font-semibold leading-6 text-[#365541]">
                Os acordeons acompanham cada capítulo; as setas seguem a leitura
                sem interromper o fluxo.
              </p>
            </div>
            <div className="rounded-2xl border border-[#deded4] bg-[#fbfaf5] p-5">
              <p className="eyebrow">Fonte</p>
              <p className="mt-3 text-sm leading-6 text-[#6c776f]">
                Texto organizado para leitura digital e estudo pessoal a partir
                da edição fornecida.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <footer className="border-t border-[#dddcd2] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-340 flex-col justify-between gap-3 text-xs leading-5 text-[#84938a] sm:flex-row">
          <p>
            © {new Date().getFullYear()} REFORMATA · A fé reformada em seus
            textos. Todos os direitos reservados.
          </p>
          <p>
            O texto bíblico depende de uma tradução licenciada e da atribuição
            de seus editores.
          </p>
        </div>
      </footer>
    </main>
  );
}
