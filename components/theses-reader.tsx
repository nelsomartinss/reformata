import Image from 'next/image';
import DocumentHeader from '@/components/document-header';
import { Panel, PanelBody, PanelHeader, PanelTitle } from '@/components/panel';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { thesesDocument } from '@/lib/theses';

export default function ThesesReader() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DocumentHeader
          title="95 Teses de Martinho Lutero"
          description={`${thesesDocument.title}, ${thesesDocument.subtitle}.`}
          meta={[
            `${thesesDocument.theses.length} teses`,
            `${thesesDocument.location} · ${thesesDocument.date}`,
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_16rem]">
          <aside aria-label="Índice das 95 Teses">
            <Panel className="lg:sticky lg:top-28">
              <PanelHeader className="py-2">
                <div>
                  <PanelTitle>Ir para a tese</PanelTitle>
                  <p className="text-xs text-muted-foreground">
                    Toque em um número
                  </p>
                </div>
              </PanelHeader>
              <nav className="grid max-h-[calc(100vh-14rem)] grid-cols-8 gap-1 overflow-y-auto p-2 sm:grid-cols-12 lg:grid-cols-5">
                {thesesDocument.theses.map((thesis) => (
                  <a
                    key={thesis.number}
                    href={'#tese-' + thesis.number}
                    className="grid h-8 place-items-center rounded-md text-xs font-medium tabular-nums text-muted-foreground transition-colors hover:bg-highlight hover:text-highlight-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {thesis.number}
                  </a>
                ))}
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
                  {thesesDocument.intro}
                </p>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <PanelTitle>As {thesesDocument.theses.length} teses</PanelTitle>
              </PanelHeader>
              <ol className="divide-y divide-border">
                {thesesDocument.theses.map((thesis) => (
                  <li
                    key={thesis.number}
                    id={'tese-' + thesis.number}
                    className="flex scroll-mt-32 gap-4 px-4 py-5 target:bg-highlight sm:gap-6 sm:px-8 sm:py-6"
                  >
                    <span className="w-8 shrink-0 pt-0.5 text-right font-serif text-xl font-semibold tabular-nums text-link">
                      {thesis.number}
                    </span>
                    <p className="font-serif text-lg leading-8">
                      {thesis.text}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="border-t border-border bg-subtle px-4 py-3 text-center font-serif text-sm italic text-muted-foreground sm:px-8">
                {thesesDocument.location}, {thesesDocument.date}
              </p>
            </Panel>
          </article>

          <aside className="hidden xl:block">
            <figure className="sticky top-28 overflow-hidden rounded-md border border-border bg-card">
              <div className="relative aspect-1076/737">
                <Image
                  src="/95-teses-pintura.webp"
                  alt="Martinho Lutero diante das 95 Teses em Wittenberg"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-border px-4 py-3">
                <p className="text-sm font-semibold">A Reforma · 1517</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  Martinho Lutero em Wittenberg.
                </p>
              </figcaption>
            </figure>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
