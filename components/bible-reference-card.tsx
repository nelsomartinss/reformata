'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { BibleReferenceLink } from '@/lib/bible';

type Props = { verseNumber: number; text: string; references: BibleReferenceLink[] };

export default function BibleReferenceCard({ verseNumber, text, references }: Props) {
  return (
    <Popover>
      <PopoverTrigger
        render={<button type='button' aria-label={`Versículo ${verseNumber} com referências relacionadas`} className='bible-reference-trigger' onMouseEnter={(event) => event.currentTarget.click()} />}
      >
        <span className='bible-reference-number'>{verseNumber}</span>
        <span className='bible-reference-text'>{text}</span>
      </PopoverTrigger>
      <PopoverContent side='top' align='start' className='bible-reference-popover'>
        <p className='bible-reference-heading'>Referências relacionadas</p>
        {references.map((reference) => (
          <div key={reference.id}>
            <p className='bible-reference-document'>{reference.documentTitle}</p>
            <p className='bible-reference-label'>{reference.label}</p>
            <p className='bible-reference-excerpt'>{reference.excerpt}</p>
            <Link className='bible-reference-link' href={reference.href}>Abrir conteúdo <ExternalLink className='size-3' /></Link>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
