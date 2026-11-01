import { BookOpen } from 'lucide-react';
import DocumentHeader from '@/components/document-header';
import { Panel, PanelBody, PanelHeader, PanelTitle } from '@/components/panel';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { getPassages } from '@/lib/bible/local';
import { solas, solasDocument } from '@/lib/solas';

export default function SolasReader() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DocumentHeader
          title={solasDocument.title}
          description="Um estudo sobre as cinco convicções que resumem a fé da Reforma, cada uma com o seu fundamento bíblico."
          meta={[`${solas.length} solas`, 'Reforma Protestante · séc. XVI']}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside aria-label="Índice das 5 Solas">
            <Panel className="lg:sticky lg:top-28">
              <PanelHeader className="py-2">
                <PanelTitle>Ir para a sola</PanelTitle>
              </PanelHeader>
              <nav>
                <ol className="divide-y divide-border">
                  {solas.map((sola) => (
                    <li key={sola.slug}>
                      <a
                        href={'#' + sola.slug}
                        className="flex items-baseline gap-3 px-4 py-2.5 transition-colors hover:bg-highlight focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="w-3 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                          {sola.number}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-sm font-semibold tracking-wide text-link">
                            {sola.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {sola.translation}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Panel>
          </aside>

          <article className="min-w-0 space-y-6">
            <Panel>
              <PanelHeader>
                <PanelTitle>Introdução</PanelTitle>
              </PanelHeader>
              <PanelBody className="sm:p-8">
                <p className="font-serif text-lg leading-8 sm:text-xl sm:leading-9">
                  {solasDocument.intro}
                </p>
              </PanelBody>
            </Panel>

            {solas.map((sola) => {
              const { passages } = getPassages(sola.references);
              return (
                <Panel
                  key={sola.slug}
                  id={sola.slug}
                  aria-labelledby={sola.slug + '-titulo'}
                  className="scroll-mt-32"
                >
                  <PanelHeader>
                    <span className="text-xs font-medium text-muted-foreground">
                      Sola {sola.number} de {solas.length}
                    </span>
                    <span className="rounded-full border border-border px-2 py-px text-xs text-muted-foreground">
                      {sola.references.join(', ')}
                    </span>
                  </PanelHeader>
                  <PanelBody className="sm:p-8">
                    <h2
                      id={sola.slug + '-titulo'}
                      className="font-display text-2xl font-semibold tracking-wide text-link sm:text-3xl"
                    >
                      {sola.name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {sola.translation}
                    </p>

                    <dl className="mt-6 space-y-5">
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Definição
                        </dt>
                        <dd className="mt-1.5 font-serif text-lg leading-8">
                          {sola.definition}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Contexto
                        </dt>
                        <dd className="mt-1.5 font-serif text-lg leading-8">
                          {sola.context}
                        </dd>
                      </div>
                    </dl>

                    {passages.map((passage) => (
                      <figure
                        key={passage.reference}
                        className="mt-6 rounded-md border border-border bg-subtle"
                      >
                        <figcaption className="flex items-center gap-1.5 border-b border-border px-4 py-2 text-sm font-semibold text-link">
                          <BookOpen className="size-3.5" aria-hidden="true" />
                          {passage.reference}
                        </figcaption>
                        <blockquote className="px-4 py-3.5 font-serif text-[1.0625rem] leading-7 sm:px-5">
                          {passage.verses.map((verse, index) => (
                            <span key={verse.number}>
                              {passage.verses.length > 1 && (
                                <sup className="mr-1 font-sans text-[0.68em] font-semibold text-muted-foreground">
                                  {verse.number}
                                </sup>
                              )}
                              {verse.text}
                              {index < passage.verses.length - 1 && ' '}
                            </span>
                          ))}
                        </blockquote>
                      </figure>
                    ))}
                  </PanelBody>
                </Panel>
              );
            })}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
