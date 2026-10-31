import Link from 'next/link';
import LogoMark from '@/components/logo-mark';

export default function SiteBrand() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label="Reformata, página inicial"
    >
      <LogoMark className="size-8" />
      <span className="leading-tight">
        <span className="block font-serif text-base font-semibold tracking-wide">
          Reformata
        </span>
        <span className="hidden text-xs text-muted-foreground sm:block">
          A fé reformada em seus textos
        </span>
      </span>
    </Link>
  );
}
