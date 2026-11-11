'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DocumentHeader from '@/components/document-header';
import Pager from '@/components/pager';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import PassagePanel from '@/components/passage-panel';
import SideIndex, { IndexItem, IndexToggle } from '@/components/side-index';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import StudyTools from '@/components/study-tools';
import type { PassageBatchResponse } from '@/lib/bible/types';
import { normalizeSearchText } from '@/lib/catechism';
import type { ConfessionChapter } from '@/lib/confession';

type ConfessionReaderProps = {
  chapters: ConfessionChapter[];
  initialChapter: number;
  initialParagraph: number;
  /** Textos bíblicos do parágrafo inicial, montados no servidor. */
  initialPassages?: PassageBatchResponse;
};

export default function ConfessionReader({
  chapters,
  initialChapter,
  initialParagraph,
  initialPassages,
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
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
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
  const studyReference = `Confissão de Fé de Westminster · Capítulo ${chapter.roman}, parágrafo ${entry.roman}`;
  const studyContent = [
    `${chapter.title}`,
    `${entry.statement}`,
    `Referências: ${entry.references.join(', ')}`,
  ].join('\n');
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
  const paragraphCount = sequence.length;

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

  const pagerProps = {
    previous: previous && {
      label: `Capítulo ${previous.chapter.roman}, parágrafo ${previous.paragraph.roman}`,
      onSelect: () =>
        selectParagraph(previous.chapter.number, previous.paragraph.number),
    },
    next: next && {
      label: `Capítulo ${next.chapter.roman}, parágrafo ${next.paragraph.roman}`,
      onSelect: () =>
        selectParagraph(next.chapter.number, next.paragraph.number),
    },
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DocumentHeader
          title="Confissão de Fé de Westminster"
          description="A fé reformada organizada em capítulos, do ensino sobre as Escrituras até o juízo final."
          meta={[
            `${chapters.length} capítulos`,
            `${paragraphCount} parágrafos`,
          ]}
          current={`Capítulo ${chapter.roman}`}
          actions={
            <IndexToggle onClick={() => setMobileIndexOpen((open) => !open)} />
          }
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_16rem]">
          <SideIndex
            label="Índice da Confissão de Fé"
            summary={`${chapters.length} capítulos`}
            open={mobileIndexOpen}
            activeKey={`${chapter.number}-${entry.number}`}
            onClose={() => setMobileIndexOpen(false)}
            search={{
              id: 'confession-search',
              value: query,
              placeholder: 'Filtrar por palavra…',
              onChange: setQuery,
            }}
          >
            <Accordion
              multiple
              value={openChapters}
              onValueChange={setOpenChapters}
            >
              {visibleChapters.map((item) => (
                <AccordionItem
                  key={item.number}
                  value={String(item.number)}
                  className="border-none"
                >
                  <AccordionTrigger className="w-full rounded-md px-2.5 py-1.5 text-sm hover:bg-accent hover:no-underline">
                    <span className="flex min-w-0 items-start gap-2.5 pr-2">
                      <span className="w-7 shrink-0 text-xs leading-5 text-muted-foreground">
                        {item.roman}
                      </span>
                      <span className="text-left leading-5 font-medium">
                        {item.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <div className="ml-5 space-y-0.5 border-l border-border pl-2">
                      {item.paragraphs.map((paragraph) => (
                        <IndexItem
                          key={`${item.number}-${paragraph.number}`}
                          active={
                            item.number === chapter.number &&
                            paragraph.number === entry.number
                          }
                          marker={paragraph.roman}
                          onSelect={() =>
                            selectParagraph(item.number, paragraph.number)
                          }
                        >
                          {paragraph.statement}
                        </IndexItem>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {visibleChapters.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                Nada encontrado.
              </p>
            )}
          </SideIndex>

          <div className="min-w-0 space-y-6">
            <Panel>
              <PanelHeader>
                <p className="text-sm">
                  <span className="font-semibold">
                    Capítulo {chapter.roman}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    · parágrafo {entry.roman}
                  </span>
                </p>
                <Pager {...pagerProps} compact />
              </PanelHeader>
              <PanelBody className="sm:p-8">
                <h2 className="font-serif text-xl leading-snug font-semibold sm:text-2xl">
                  {chapter.title}
                </h2>
                <p className="mt-5 font-serif text-lg leading-8 sm:text-[1.1875rem] sm:leading-9">
                  <span className="mr-2 align-baseline text-sm font-semibold text-link">
                    {entry.roman}.
                  </span>
                  {entry.statement}
                </p>
              </PanelBody>
            </Panel>

            <PassagePanel
              references={entry.references}
              documentSlug="confissao-de-fe"
              chapterNumber={chapter.number}
              paragraphNumber={entry.number}
              initialData={
                chapter.number === initialChapter &&
                entry.number === initialParagraph
                  ? initialPassages
                  : undefined
              }
            />

            <div className="xl:hidden">
              <StudyTools reference={studyReference} content={studyContent} />
            </div>

            <Pager
              {...pagerProps}
              status={`${entry.globalNumber} de ${paragraphCount}`}
            />
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-28">
              <StudyTools reference={studyReference} content={studyContent} />
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
