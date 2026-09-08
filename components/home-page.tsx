import Link from 'next/link';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  FileText,
  Library,
  Search,
  ScrollText,
} from 'lucide-react';
import HomeSearch from '@/components/home-search';
import SiteBrand from '@/components/site-brand';
import { greaterCatechism } from '@/lib/catechism';
import { confessionChapters, confessionParagraphs } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';
import { thesesDocument } from '@/lib/theses';

const quote = shortCatechism[0];

const documentCards = [
  {
    href: '/biblia',
    eyebrow: 'Leitura bíblica',
    title: 'Bíblia',
    description: 'Leia os capítulos bíblicos nas traduções autorizadas e encontre as referências ligadas aos documentos.',
    count: 'Livros e capítulos',
    icon: Library,
    tone: 'blue',
  },
  {
    href: '/catecismo-maior',
    eyebrow: 'Westminster · maior',
    title: 'Catecismo Maior',
    description:
      'Uma exposição ampla da doutrina cristã em perguntas, respostas e referências bíblicas.',
    count: `${greaterCatechism.length} perguntas`,
    icon: BookOpen,
    tone: 'green',
  },
  {
    href: '/breve-catecismo',
    eyebrow: 'Westminster · breve',
    title: 'Breve Catecismo',
    description:
      'Uma síntese para memorizar, consultar e revisitar os fundamentos da fé reformada.',
    count: `${shortCatechism.length} perguntas`,
    icon: BookMarked,
    tone: 'sage',
  },
  {
    href: '/confissao-de-fe',
    eyebrow: 'Westminster · confissão',
    title: 'Confissão de Fé',
    description:
      'Capítulos e afirmações que organizam a doutrina reformada para leitura contínua.',
    count: `${confessionChapters.length} capítulos · ${confessionParagraphs.length} afirmações`,
    icon: FileText,
    tone: 'olive',
  },
  {
    href: '/95-teses',
    eyebrow: 'Reforma · Wittenberg',
    title: '95 Teses de Lutero',
    description:
      'O debate de 1517 que marcou o início de uma conversa decisiva sobre a igreja e a graça.',
    count: `${thesesDocument.theses.length} teses · ${thesesDocument.date}`,
    icon: ScrollText,
    tone: 'sand',
  },
] as const;

const toneStyles = {
  green: {
    number: 'bg-[#24302d] text-[#f6f3ed]',
    icon: 'bg-[#e4eee6] text-[#45694f]',
    eyebrow: 'text-[#52705c]',
    arrow: 'text-[#52705c]',
  },
  sage: {
    number: 'bg-[#52705c] text-[#f6f3ed]',
    icon: 'bg-[#eef4ef] text-[#52705c]',
    eyebrow: 'text-[#52705c]',
    arrow: 'text-[#52705c]',
  },
  olive: {
    number: 'bg-[#68725c] text-[#f6f3ed]',
    icon: 'bg-[#edf0e7] text-[#68725c]',
    eyebrow: 'text-[#68725c]',
    arrow: 'text-[#68725c]',
  },
  sand: {
    number: 'bg-[#9a7045] text-[#f7f2e8]',
    icon: 'bg-[#f3eadd] text-[#9a7045]',
    eyebrow: 'text-[#9a7045]',
    arrow: 'text-[#9a7045]',
  },
  blue: {
    number: 'bg-[#416273] text-[#f6f3ed]',
    icon: 'bg-[#e5eef1] text-[#416273]',
    eyebrow: 'text-[#416273]',
    arrow: 'text-[#416273]',
  },
} as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#24302d]">
      <header className="border-b border-[#dddcd2] bg-[#f6f3ed]/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-340 items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <SiteBrand href="/" />
          <nav
            aria-label="Documentos"
            className="hidden items-center gap-1 lg:flex"
          >
            <a
              className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#24302d]"
              href="#acervo"
              aria-current="page"
            >
              Acervo
            </a>
            <a
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="#buscar"
            >
              Buscar
            </a>
            <a
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="#como-ler"
            >
              Como ler
            </a>
          </nav>
          <Link
            href="#acervo"
            className="hidden items-center gap-2 rounded-full bg-[#24302d] px-4 py-2 text-sm font-semibold text-[#f6f3ed] shadow-sm transition hover:bg-[#34443d] sm:inline-flex"
          >
            Explorar documentos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="relative border-b border-[#dddcd2]">
        <div className="pointer-events-none absolute -right-36 -top-28 size-96 rounded-full border border-[#d7dfd8]/70" />
        <div className="pointer-events-none absolute -right-20 -top-12 size-64 rounded-full border border-[#d7dfd8]/60" />
        <div className="mx-auto grid max-w-340 gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-12 lg:py-24">
          <div className="relative">
            <div className="flex items-center gap-3 text-[#52705c]">
              <span className="h-px w-8 bg-[#a7bfae]" />
              <p className="eyebrow text-[#52705c]">
                Biblioteca reformada digital
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-[#24302d] sm:text-6xl lg:text-[4.6rem]">
              Leia, pesquise e percorra os textos da tradição reformada.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#65736b] sm:text-lg">
              Uma biblioteca para ler com calma os textos que moldaram a fé
              reformada — com navegação simples, busca por temas e referências
              bíblicas para continuar o estudo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/catecismo-maior"
                className="inline-flex items-center gap-2 rounded-full bg-[#24302d] px-5 py-3 text-sm font-semibold text-[#f6f3ed] shadow-[0_10px_25px_rgba(36,48,45,0.14)] transition hover:bg-[#34443d]"
              >
                Começar a leitura
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#buscar"
                className="inline-flex items-center gap-2 rounded-full border border-[#cbd8ce] bg-white/50 px-5 py-3 text-sm font-semibold text-[#52705c] transition hover:bg-white"
              >
                <Search className="size-4" />
                Buscar um tema
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:justify-self-end">
            <div className="absolute -inset-3 rounded-4xl border border-[#d6ddd4]" />
            <div className="relative rounded-[1.75rem] border border-[#cbd8ce] bg-[#eef4ef] p-6 shadow-[0_24px_70px_rgba(55,72,61,0.1)] sm:p-9">
              <div className="flex items-center justify-between text-[#52705c]">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em]">
                  Uma pergunta para começar
                </p>
                <span className="font-serif text-2xl">✦</span>
              </div>
              <blockquote className="mt-10 font-serif text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#304a39] sm:text-3xl">
                “{quote.answer}”
              </blockquote>
              <div className="mt-9 flex items-end justify-between gap-4 border-t border-[#cbd8ce] pt-5">
                <p className="max-w-xs text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-[#718078]">
                  Breve Catecismo de Westminster · pergunta {quote.number}
                </p>
                <span className="font-serif text-4xl text-[#a7bfae]">01</span>
              </div>
            </div>
            <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#84938a]">
              Escritura · doutrina · história
            </p>
          </div>
        </div>
      </section>

      <section id="buscar" className="scroll-mt-6 border-b border-[#dddcd2]">
        <div className="mx-auto max-w-340 px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow">Consulta rápida</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.025em] text-[#2f4037] sm:text-4xl">
                Encontre um trecho no acervo.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#718078]">
                Pesquise por uma palavra, pergunta, capítulo, tese ou referência
                bíblica.
              </p>
            </div>
            <HomeSearch />
          </div>
        </div>
      </section>

      <section id="acervo" className="scroll-mt-6">
        <div className="mx-auto max-w-340 px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">01 · O acervo</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-[-0.025em] text-[#2f4037] sm:text-4xl">
                Cinco caminhos para uma leitura mais profunda.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#718078]">
              Comece por uma coleção ou siga as referências até onde elas
              levarem.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {documentCards.map((document, index) => {
              const styles = toneStyles[document.tone];
              const Icon = document.icon;
              return (
                <Link
                  key={document.href}
                  href={document.href}
                  className="group flex min-h-80 flex-col rounded-3xl border border-[#d8e0d8] bg-white/65 p-5 shadow-[0_12px_40px_rgba(55,72,61,0.04)] transition hover:-translate-y-1 hover:border-[#b8cdbd] hover:bg-white hover:shadow-[0_20px_50px_rgba(55,72,61,0.09)] motion-reduce:transition-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`grid size-11 place-items-center rounded-2xl ${styles.icon}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`grid size-8 place-items-center rounded-full text-xs font-bold ${styles.number}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    className={`mt-8 text-[10px] font-bold uppercase tracking-[0.16em] ${styles.eyebrow}`}
                  >
                    {document.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#2f4037]">
                    {document.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#718078]">
                    {document.description}
                  </p>
                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-[#e0e6df] pt-4">
                    <span className="text-xs font-semibold leading-5 text-[#84938a]">
                      {document.count}
                    </span>
                    <ArrowRight
                      className={`size-5 transition-transform group-hover:translate-x-1 ${styles.arrow}`}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="como-ler"
        className="border-y border-[#dddcd2] bg-[#eeeae1] scroll-mt-6"
      >
        <div className="mx-auto max-w-340 px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow text-[#9a7045]">02 · Como ler</p>
              <h2 className="mt-3 max-w-sm font-serif text-3xl font-semibold tracking-[-0.025em] text-[#403e35] sm:text-4xl">
                Uma biblioteca feita para permanecer aberta.
              </h2>
            </div>
            <ol className="grid gap-7 sm:grid-cols-3 sm:gap-5">
              {[
                {
                  number: '01',
                  title: 'Escolha um acervo',
                  text: 'Entre por Westminster, pela Confissão ou pelas teses históricas.',
                },
                {
                  number: '02',
                  title: 'Leia no seu ritmo',
                  text: 'Use o índice, a busca e a navegação por pergunta ou capítulo.',
                },
                {
                  number: '03',
                  title: 'Consulte as referências',
                  text: 'Continue o estudo nas passagens bíblicas associadas a cada texto.',
                },
              ].map((step) => (
                <li
                  key={step.number}
                  className="border-t border-[#cfc5b5] pt-4"
                >
                  <span className="font-serif text-2xl text-[#b08b5e]">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#403e35]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#817b70]">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dddcd2] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-340 flex-col justify-between gap-4 text-xs leading-5 text-[#84938a] sm:flex-row">
          <p>
            © {new Date().getFullYear()} REFORMATA · A fé reformada em seus
            textos.
          </p>
          <p className="max-w-lg sm:text-right">
            Conteúdo editorial organizado para estudo. O texto bíblico depende
            de uma tradução licenciada e da atribuição de seus editores.
          </p>
        </div>
      </footer>
    </main>
  );
}
