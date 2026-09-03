import Link from 'next/link';
import { BookOpen, ScrollText } from 'lucide-react';
import { thesesDocument } from '@/lib/theses';

export default function ThesesReader() {
  return (
    <main className="min-h-screen bg-[#ebe7dc] text-[#302f2a]">
      <header className="border-b border-[#d5cec0] bg-[#ebe7dc]/95">
        <div className="mx-auto flex min-h-18 max-w-340 items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <Link
            href="/catecismo-maior"
            className="flex items-center gap-3"
            aria-label="Reformata, início"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-[#302f2a] text-[#f7f2e8] shadow-sm">
              <BookOpen className="size-5" />
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold leading-none">
                REFORMATA
              </span>
              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#817b70] sm:block">
                A fé reformada em seus textos
              </span>
            </span>
          </Link>
          <nav
            aria-label="Documentos"
            className="hidden items-center gap-1 overflow-x-auto md:flex"
          >
            <Link
              className="rounded-full px-4 py-2 text-sm text-[#817b70] hover:bg-white/60"
              href="/catecismo-maior"
            >
              Catecismo Maior
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm text-[#817b70] hover:bg-white/60"
              href="/breve-catecismo"
            >
              Breve Catecismo
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm text-[#817b70] hover:bg-white/60"
              href="/confissao-de-fe"
            >
              Confissão de Fé
            </Link>
            <Link
              className="rounded-full bg-[#f7f2e8] px-4 py-2 text-sm font-semibold text-[#302f2a] shadow-sm"
              href="/95-teses"
              aria-current="page"
            >
              95 Teses de Martinho Lutero
            </Link>
          </nav>
          <span className="hidden items-center gap-2 text-xs font-semibold text-[#817b70] sm:flex">
            <span>1517</span>
            <span className="size-2 rounded-full bg-[#b08b5e]" />
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-340 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[190px_minmax(0,820px)] lg:gap-14 lg:px-12 lg:py-14">
        <aside className="order-2 lg:order-1">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-2 text-[#9a7045]">
              <ScrollText className="size-4" />
              <p className="eyebrow text-[#9a7045]">Documento</p>
            </div>
            <p className="mt-2 font-serif text-lg font-semibold">
              Índice das teses
            </p>
            <p className="mt-1 text-xs leading-5 text-[#817b70]">
              95 proposições para leitura contínua.
            </p>
            <nav
              aria-label="Índice das 95 Teses"
              className="mt-5 grid max-h-[calc(100vh-220px)] grid-cols-5 gap-1 overflow-y-auto pr-1 sm:grid-cols-10 lg:grid-cols-5"
            >
              {thesesDocument.theses.map((thesis) => (
                <a
                  key={thesis.number}
                  href={'#tese-' + thesis.number}
                  className="grid size-8 place-items-center rounded-lg text-xs font-semibold text-[#817b70] transition hover:bg-[#f7f2e8] hover:text-[#9a7045] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7045]"
                >
                  {thesis.number}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="order-1 min-w-0 lg:order-2">
          <div className="mx-auto max-w-3xl border-y border-[#cfc5b5] py-8 text-center sm:py-11">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a7045]">
              {thesesDocument.location} · {thesesDocument.date}
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-[#302f2a] sm:text-6xl">
              {thesesDocument.title}
            </h1>
            <p className="mt-4 font-serif text-xl italic text-[#625d53]">
              {thesesDocument.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-[1.5rem] border border-[#d6cbbb] bg-[#f7f2e8] p-6 shadow-[0_18px_50px_rgba(79,63,42,0.08)] sm:mt-10 sm:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a7045]">
              Prólogo
            </p>
            <p className="mt-4 font-serif text-lg leading-8 text-[#514d44] sm:text-xl sm:leading-9">
              {thesesDocument.intro}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#cfc5b5]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7045]">
                As 95 teses
              </p>
              <span className="h-px flex-1 bg-[#cfc5b5]" />
            </div>
            <div className="divide-y divide-[#d8d0c3]">
              {thesesDocument.theses.map((thesis) => (
                <section
                  key={thesis.number}
                  id={'tese-' + thesis.number}
                  className="scroll-mt-8 py-7 first:pt-0 sm:py-9"
                >
                  <div className="flex items-start gap-4 sm:gap-7">
                    <span className="shrink-0 font-serif text-3xl font-semibold text-[#a57848] sm:text-4xl">
                      {thesis.number}
                    </span>
                    <p className="pt-1 font-serif text-lg leading-8 text-[#3f3d37] sm:text-xl sm:leading-9">
                      {thesis.text}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl border-t border-[#cfc5b5] pt-8 text-center">
            <p className="font-serif text-lg italic text-[#625d53]">
              {thesesDocument.date}
            </p>
          </div>
        </article>
      </div>

      <footer className="border-t border-[#d5cec0] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-340 flex-col justify-between gap-3 text-xs leading-5 text-[#817b70] sm:flex-row">
          <p>
            © {new Date().getFullYear()} REFORMATA · A fé reformada em seus
            textos.
          </p>
          <p>Texto histórico apresentado para leitura e estudo.</p>
        </div>
      </footer>
    </main>
  );
}
