import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type DocumentHeaderProps = {
  title: string;
  description?: string;
  meta?: string[];
  /** Trilha extra após o título (ex.: "Pergunta 12"). */
  current?: string;
  actions?: React.ReactNode;
};

export default function DocumentHeader({
  title,
  description,
  meta = [],
  current,
  actions,
}: DocumentHeaderProps) {
  return (
    <div className="border-b border-border pb-5">
      <nav aria-label="Você está em" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="text-link hover:underline">
              Início
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li className={current ? undefined : 'font-medium text-foreground'}>
            {title}
          </li>
          {current && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="font-medium text-foreground" aria-current="page">
                {current}
              </li>
            </>
          )}
        </ol>
      </nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
          {meta.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {meta.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span
                    className="size-1.5 rounded-full bg-primary/70"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
}
