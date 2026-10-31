'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import VerseNumber from '@/components/verse-number';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { BibleReferenceLink } from '@/lib/bible';

type Props = {
  verseNumber: number;
  text: string;
  references: BibleReferenceLink[];
};

export default function BibleReferenceCard({
  verseNumber,
  text,
  references,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={`Versículo ${verseNumber}: citado em ${references.length} ${references.length === 1 ? 'trecho' : 'trechos'}`}
            className="block w-full rounded-sm px-1 py-0.5 text-left transition-colors hover:bg-highlight focus-visible:bg-highlight focus-visible:outline-2 focus-visible:outline-ring"
            onMouseEnter={(event) => event.currentTarget.click()}
          />
        }
      >
        <VerseNumber number={verseNumber} />
        <span className="underline decoration-primary/50 decoration-dotted underline-offset-4">
          {text}
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-[min(22rem,calc(100vw-2rem))] gap-0 rounded-md p-0"
      >
        <p className="border-b border-border bg-subtle px-4 py-2 text-xs font-semibold">
          Onde este versículo é citado
        </p>
        <ul className="max-h-72 divide-y divide-border overflow-y-auto">
          {references.map((reference) => (
            <li key={reference.id} className="px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {reference.documentTitle}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{reference.label}</p>
              <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                {reference.excerpt}
              </p>
              <Link
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-link hover:underline"
                href={reference.href}
              >
                Ler este trecho{' '}
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
