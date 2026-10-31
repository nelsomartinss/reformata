'use client';

import { useEffect, useRef } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Panel, PanelHeader, PanelTitle } from '@/components/panel';
import { cn } from '@/lib/utils';

type SideIndexProps = {
  label: string;
  summary: string;
  open: boolean;
  onClose: () => void;
  search?: {
    id: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  };
  /** Muda quando o trecho aberto muda, para rolar o índice até ele. */
  activeKey?: string;
  children: React.ReactNode;
};

export default function SideIndex({
  label,
  summary,
  open,
  onClose,
  search,
  activeKey,
  children,
}: SideIndexProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !active) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = active.getBoundingClientRect();
    if (itemBox.top < listBox.top || itemBox.bottom > listBox.bottom) {
      list.scrollTop += itemBox.top - listBox.top - listBox.height / 3;
    }
  }, [activeKey, open]);

  return (
    <aside
      className={cn(open ? 'block' : 'hidden', 'lg:block')}
      aria-label={label}
    >
      <Panel className="lg:sticky lg:top-28">
        <PanelHeader className="py-2">
          <div>
            <PanelTitle>Índice</PanelTitle>
            <p className="text-xs text-muted-foreground">{summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            aria-label="Fechar índice"
          >
            <X className="size-4" />
          </button>
        </PanelHeader>
        {search && (
          <div className="border-b border-border p-2">
            <label htmlFor={search.id} className="relative block">
              <span className="sr-only">{search.placeholder}</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id={search.id}
                type="search"
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                placeholder={search.placeholder}
                className="h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/25"
              />
            </label>
          </div>
        )}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-1.5 lg:max-h-[calc(100vh-14rem)]"
        >
          {children}
        </div>
      </Panel>
    </aside>
  );
}

type IndexItemProps = {
  active: boolean;
  marker: string;
  children: React.ReactNode;
  onSelect?: () => void;
  href?: string;
};

export function IndexItem({
  active,
  marker,
  children,
  onSelect,
  href,
}: IndexItemProps) {
  const className = cn(
    'relative flex w-full items-start gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm leading-5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
    active
      ? 'bg-highlight font-medium text-highlight-foreground'
      : 'text-foreground/85 hover:bg-accent hover:text-foreground',
  );
  const content = (
    <>
      {active && (
        <span
          className="absolute top-1.5 bottom-1.5 -left-1.5 w-1 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          'w-7 shrink-0 text-xs leading-5 tabular-nums',
          active ? 'font-semibold' : 'text-muted-foreground',
        )}
      >
        {marker}
      </span>
      <span className="line-clamp-2">{children}</span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className={className}
        aria-current={active ? 'true' : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={className}
      aria-current={active ? 'true' : undefined}
    >
      {content}
    </button>
  );
}

export function IndexToggle({
  onClick,
  label = 'Índice',
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent lg:hidden"
    >
      <Menu className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
