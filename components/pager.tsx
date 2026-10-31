import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PagerTarget = { href?: string; onSelect?: () => void; label: string };

type PagerProps = {
  previous?: PagerTarget;
  next?: PagerTarget;
  status?: React.ReactNode;
  compact?: boolean;
  className?: string;
};

const buttonClass =
  'inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-45';

function PagerButton({
  target,
  direction,
  compact,
}: {
  target?: PagerTarget;
  direction: 'previous' | 'next';
  compact?: boolean;
}) {
  const text = direction === 'previous' ? 'Anterior' : 'Próxima';
  const content = (
    <>
      {direction === 'previous' && (
        <ChevronLeft className="size-4" aria-hidden="true" />
      )}
      <span className={compact ? 'sr-only' : 'hidden sm:inline'}>{text}</span>
      {direction === 'next' && (
        <ChevronRight className="size-4" aria-hidden="true" />
      )}
    </>
  );
  const ariaLabel = target ? `${text}: ${target.label}` : text;

  if (target?.href) {
    return (
      <Link
        href={target.href}
        className={buttonClass}
        aria-label={ariaLabel}
        title={target.label}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={buttonClass}
      disabled={!target}
      onClick={target?.onSelect}
      aria-label={ariaLabel}
      title={target?.label}
    >
      {content}
    </button>
  );
}

export default function Pager({
  previous,
  next,
  status,
  compact,
  className,
}: PagerProps) {
  return (
    <nav
      aria-label="Navegar entre trechos"
      className={cn('flex items-center justify-between gap-3', className)}
    >
      <PagerButton target={previous} direction="previous" compact={compact} />
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      <PagerButton target={next} direction="next" compact={compact} />
    </nav>
  );
}
