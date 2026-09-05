import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import packageJson from '@/package.json';

type SiteBrandProps = {
  href: string;
  tone?: 'green' | 'sand';
};

const toneStyles = {
  green: {
    icon: 'bg-[#24302d] text-white',
    version: 'border-[#c7d5cc] bg-[#eef4ef] text-[#52705c]',
    subtitle: 'text-[#718078]',
  },
  sand: {
    icon: 'bg-[#302f2a] text-[#f7f2e8]',
    version: 'border-[#d5cec0] bg-[#f7f2e8] text-[#9a7045]',
    subtitle: 'text-[#817b70]',
  },
} as const;

export default function SiteBrand({ href, tone = 'green' }: SiteBrandProps) {
  const styles = toneStyles[tone];

  return (
    <Link
      href={href}
      className="flex items-center gap-3"
      aria-label="Reformata, início"
    >
      <span
        className={`grid size-10 place-items-center rounded-2xl shadow-sm ${styles.icon}`}
      >
        <BookOpen className="size-5" />
      </span>
      <span>
        <span className="flex items-center gap-2">
          <span className="font-serif text-lg font-semibold leading-none">
            REFORMATA
          </span>
          <span
            className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-[0.08em] ${styles.version}`}
          >
            v{packageJson.version}
          </span>
        </span>
        <span
          className={`mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] sm:block ${styles.subtitle}`}
        >
          A fé reformada em seus textos
        </span>
      </span>
    </Link>
  );
}
