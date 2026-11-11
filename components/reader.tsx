'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentHeader from '@/components/document-header';
import Pager from '@/components/pager';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import PassagePanel from '@/components/passage-panel';
import SideIndex, { IndexItem, IndexToggle } from '@/components/side-index';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import StudyTools from '@/components/study-tools';
import type { PassageBatchResponse } from '@/lib/bible/types';
import { searchEntries, type CatechismEntry } from '@/lib/catechism';

type ReaderProps = {
  entries: CatechismEntry[];
  initialNumber: number;
  /** Textos bíblicos da pergunta inicial, montados no servidor. */
  initialPassages?: PassageBatchResponse;
  documentTitle?: string;
  documentSlug?: string;
};

const descriptions: Record<string, string> = {
  'catecismo-maior':
    'Uma exposição ampla da fé cristã em perguntas e respostas, com as passagens bíblicas que as fundamentam.',
  'breve-catecismo':
    'Um resumo da fé cristã em perguntas e respostas curtas, feito para memorizar e revisitar.',
};

export default function Reader({
  entries,
  initialNumber,
  initialPassages,
  documentTitle = 'Catecismo Maior de Westminster',
  documentSlug = 'catecismo-maior',
}: ReaderProps) {
  const router = useRouter();
  const firstEntry =
    entries.find((entry) => entry.number === initialNumber) ?? entries[0];
  const [selectedNumber, setSelectedNumber] = useState(firstEntry.number);
  const [query, setQuery] = useState('');
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);

  const entry =
    entries.find((item) => item.number === selectedNumber) ?? entries[0];
  const studyReference = `${documentTitle} · Pergunta ${entry.number}`;
  const studyContent = [
    `Pergunta: ${entry.question}`,
    `Resposta: ${entry.answer}`,
    `Referências: ${entry.references.join(', ')}`,
  ].join('\n');
  const results = useMemo(
    () => searchEntries(entries, query),
    [entries, query],
  );
  const currentPosition = entries.findIndex(
    (item) => item.number === entry.number,
  );
  const previous = entries[currentPosition - 1];
  const next = entries[currentPosition + 1];

  function selectQuestion(number: number) {
    setSelectedNumber(number);
    setMobileIndexOpen(false);
    router.push('/' + documentSlug + '/pergunta/' + number);
  }

  const pagerProps = {
    previous: previous && {
      label: `Pergunta ${previous.number}`,
      onSelect: () => selectQuestion(previous.number),
    },
    next: next && {
      label: `Pergunta ${next.number}`,
      onSelect: () => selectQuestion(next.number),
    },
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DocumentHeader
          title={documentTitle}
          description={descriptions[documentSlug]}
          meta={[`${entries.length} perguntas`, 'Assembleia de Westminster']}
          current={`Pergunta ${entry.number}`}
          actions={
            <IndexToggle onClick={() => setMobileIndexOpen((open) => !open)} />
          }
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_16rem]">
          <SideIndex
            label={'Índice do ' + documentTitle}
            summary={`${entries.length} perguntas`}
            open={mobileIndexOpen}
            activeKey={String(entry.number)}
            onClose={() => setMobileIndexOpen(false)}
            search={{
              id: 'question-search',
              value: query,
              placeholder: 'Filtrar perguntas…',
              onChange: setQuery,
            }}
          >
            {results.map((item) => (
              <IndexItem
                key={item.number}
                active={item.number === entry.number}
                marker={String(item.number)}
                onSelect={() => selectQuestion(item.number)}
              >
                {item.question}
              </IndexItem>
            ))}
            {query && results.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                Nenhuma pergunta encontrada.
              </p>
            )}
          </SideIndex>

          <div className="min-w-0 space-y-6">
            <Panel>
              <PanelHeader>
                <p className="text-sm">
                  <span className="font-semibold">Pergunta {entry.number}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    de {entries.length}
                  </span>
                </p>
                <Pager {...pagerProps} compact />
              </PanelHeader>
              <PanelBody className="sm:p-8">
                <h2 className="font-serif text-xl leading-snug font-semibold sm:text-2xl">
                  {entry.question}
                </h2>
                <div className="mt-5 border-l-3 border-primary/60 pl-4 sm:pl-5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Resposta
                  </p>
                  <p className="mt-1 font-serif text-lg leading-8 sm:text-[1.1875rem] sm:leading-9">
                    {entry.answer}
                  </p>
                </div>
              </PanelBody>
            </Panel>

            <PassagePanel
              references={entry.references}
              documentSlug={documentSlug}
              entryNumber={entry.number}
              initialData={
                entry.number === initialNumber ? initialPassages : undefined
              }
            />

            <div className="xl:hidden">
              <StudyTools reference={studyReference} content={studyContent} />
            </div>

            <Pager
              {...pagerProps}
              status={`${entry.number} de ${entries.length}`}
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
