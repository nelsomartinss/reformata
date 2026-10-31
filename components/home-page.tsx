import Link from 'next/link';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  ChevronRight,
  FileText,
  Library,
  ScrollText,
} from 'lucide-react';
import HomeSearch from '@/components/home-search';
import { Panel, PanelBody, PanelHeader, PanelTitle } from '@/components/panel';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { bibleBooks } from '@/lib/bible/catalog';
import { greaterCatechism } from '@/lib/catechism';
import { confessionChapters, confessionParagraphs } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';
import { thesesDocument } from '@/lib/theses';

const quote = shortCatechism[0];

const documents = [
  {
    href: '/biblia',
    title: 'Bíblia',
    description:
      'Leia os capítulos bíblicos e veja onde cada versículo é citado nos outros textos.',
    meta: [`${bibleBooks.length} livros`],
    icon: Library,
  },
  {
    href: '/catecismo-maior',
    title: 'Catecismo Maior de Westminster',
    description: 'Uma exposição ampla da fé cristã em perguntas e respostas.',
    meta: [`${greaterCatechism.length} perguntas`, 'Westminster'],
    icon: BookOpen,
  },
  {
    href: '/breve-catecismo',
    title: 'Breve Catecismo de Westminster',
    description: 'Um resumo da fé em respostas curtas, ótimo para memorizar.',
    meta: [`${shortCatechism.length} perguntas`, 'Westminster'],
    icon: BookMarked,
  },
  {
    href: '/confissao-de-fe',
    title: 'Confissão de Fé de Westminster',
    description:
      'A doutrina reformada organizada em capítulos para leitura contínua.',
    meta: [
      `${confessionChapters.length} capítulos`,
      `${confessionParagraphs.length} parágrafos`,
    ],
    icon: FileText,
  },
  {
    href: '/95-teses',
    title: '95 Teses de Martinho Lutero',
    description: 'O texto de 1517 que deu início à Reforma Protestante.',
    meta: [`${thesesDocument.theses.length} teses`, thesesDocument.date],
    icon: ScrollText,
  },
];

const steps = [
  {
    title: 'Escolha um texto',
    text: 'Comece pelo Breve Catecismo se é a sua primeira vez.',
  },
  {
    title: 'Leia no seu ritmo',
    text: 'Use o índice ao lado e os botões Anterior e Próxima.',
  },
  {
    title: 'Abra as passagens',
    text: 'Cada resposta mostra os versículos bíblicos que a sustentam.',
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-subtle">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center lg:gap-14 lg:px-8">
            <div className="min-w-0">
              <h1 className="max-w-2xl font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-[2.6rem]">
                Leia, pesquise e estude os textos da fé reformada.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Catecismos, Confissão de Fé, as 95 Teses e a Bíblia em um só
                lugar, com as passagens bíblicas sempre à mão.
              </p>
              <div className="mt-6 max-w-xl">
                <HomeSearch floating />
              </div>
            </div>

            <Panel>
              <PanelHeader>
                <PanelTitle>Uma pergunta para começar</PanelTitle>
              </PanelHeader>
              <PanelBody className="sm:p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {quote.question}
                </p>
                <blockquote className="mt-2 font-serif text-xl leading-snug font-semibold">
                  “{quote.answer}”
                </blockquote>
                <Link
                  href={`/breve-catecismo/pergunta/${quote.number}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
                >
                  Continuar no Breve Catecismo{' '}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </PanelBody>
            </Panel>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
          <section aria-labelledby="textos">
            <Panel>
              <PanelHeader>
                <PanelTitle id="textos">Textos disponíveis</PanelTitle>
                <span className="rounded-full bg-accent px-2 text-xs font-medium text-muted-foreground">
                  {documents.length}
                </span>
              </PanelHeader>
              <ul className="divide-y divide-border">
                {documents.map((document) => {
                  const Icon = document.icon;
                  return (
                    <li key={document.href}>
                      <Link
                        href={document.href}
                        className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-none sm:px-5"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-subtle text-muted-foreground group-hover:text-link">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-serif text-lg leading-snug font-semibold text-link group-hover:underline">
                            {document.title}
                          </span>
                          <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                            {document.description}
                          </span>
                          <span className="mt-1.5 flex flex-wrap gap-1.5">
                            {document.meta.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-border px-2 py-px text-xs text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </span>
                        </span>
                        <ChevronRight
                          className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </section>

          <section aria-labelledby="como-comecar">
            <h2 id="como-comecar" className="text-base font-semibold">
              Como começar
            </h2>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-md border border-border p-4"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-highlight text-sm font-semibold text-highlight-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
