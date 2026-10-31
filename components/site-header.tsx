'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchDialog from '@/components/search-dialog';
import SiteBrand from '@/components/site-brand';
import ThemeToggle from '@/components/theme-toggle';
import { findDocumentByPath, siteDocuments } from '@/lib/documents';
import { cn } from '@/lib/utils';

const tabs = [{ slug: 'inicio', href: '/', label: 'Início' }, ...siteDocuments];

export default function SiteHeader() {
  const pathname = usePathname();
  const activeSlug =
    pathname === '/' ? 'inicio' : findDocumentByPath(pathname)?.slug;
  const navRef = useRef<HTMLElement>(null);

  // No celular as abas rolam de lado: garante que a aba atual fique visível.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const navBox = nav.getBoundingClientRect();
    const tabBox = active.getBoundingClientRect();
    if (tabBox.left < navBox.left || tabBox.right > navBox.right) {
      nav.scrollLeft +=
        tabBox.left - navBox.left - (navBox.width - tabBox.width) / 2;
    }
  }, [activeSlug]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-subtle/95 backdrop-blur supports-backdrop-filter:bg-subtle/85">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <SiteBrand />
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
        </div>
      </div>
      <nav
        ref={navRef}
        aria-label="Textos"
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 [scrollbar-width:none] sm:px-4 lg:px-6"
      >
        {tabs.map((tab) => {
          const active = tab.slug === activeSlug;
          return (
            <Link
              key={tab.slug}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative shrink-0 px-2 py-1.5 pb-2.5 text-sm whitespace-nowrap transition-colors focus-visible:outline-none',
                active
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="block rounded-md px-2 py-1 transition-colors group-hover:bg-accent group-focus-visible:outline-2 group-focus-visible:outline-ring">
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
