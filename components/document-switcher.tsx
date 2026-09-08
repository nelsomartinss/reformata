import Link from 'next/link';
import { ChevronDown, Library } from 'lucide-react';

type DocumentSwitcherProps = {
  currentSlug: string;
  tone?: 'green' | 'sand';
};

const documents = [
  {
    slug: 'biblia',
    label: 'Bíblia',
    href: '/biblia',
  },
  {
    slug: 'catecismo-maior',
    label: 'Catecismo Maior',
    href: '/catecismo-maior',
  },
  {
    slug: 'breve-catecismo',
    label: 'Breve Catecismo',
    href: '/breve-catecismo',
  },
  {
    slug: 'confissao-de-fe',
    label: 'Confissão de Fé',
    href: '/confissao-de-fe',
  },
  {
    slug: '95-teses',
    label: '95 Teses de Martinho Lutero',
    href: '/95-teses',
  },
];

export default function DocumentSwitcher({
  currentSlug,
  tone = 'green',
}: DocumentSwitcherProps) {
  const isSand = tone === 'sand';
  const triggerClass = isSand
    ? 'border-[#d5cec0] bg-[#f7f2e8] text-[#625d53] hover:bg-white/70'
    : 'border-[#ccd8cf] bg-white/60 text-[#52665a] hover:bg-white/85';
  const menuClass = isSand
    ? 'border-[#d5cec0] bg-[#f7f2e8]'
    : 'border-[#d7dfd8] bg-[#fbfcfa]';
  const activeClass = isSand
    ? 'bg-white text-[#302f2a]'
    : 'bg-[#e2ede5] text-[#2c5140]';
  const inactiveClass = isSand
    ? 'text-[#817b70] hover:bg-white/70 hover:text-[#302f2a]'
    : 'text-[#65746c] hover:bg-white/70 hover:text-[#24302d]';

  return (
    <details className="relative shrink-0 md:hidden">
      <summary
        className={`flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a5d] [&::-webkit-details-marker]:hidden ${triggerClass}`}
      >
        <Library className="size-4" />
        <span>Acervos</span>
        <ChevronDown className="size-3.5" />
      </summary>
      <nav
        aria-label="Selecionar acervo"
        className={`absolute right-0 top-[calc(100%+0.5rem)] z-30 w-64 min-w-60 rounded-2xl border p-2 shadow-[0_18px_45px_rgba(55,72,61,0.15)] ${menuClass}`}
      >
        <p
          className={`px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${isSand ? 'text-[#9a7045]' : 'text-[#718078]'}`}
        >
          Mudar de acervo
        </p>
        {documents.map((document) => {
          const active = document.slug === currentSlug;
          return (
            <Link
              key={document.slug}
              href={document.href}
              aria-current={active ? 'page' : undefined}
              className={`block rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#527a5d] ${active ? activeClass : inactiveClass}`}
            >
              {document.label}
            </Link>
          );
        })}
      </nav>
    </details>
  );
}
