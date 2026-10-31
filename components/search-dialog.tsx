'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import HomeSearch from '@/components/home-search';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === '/' && !isTyping(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:w-72"
        aria-label="Buscar nos textos"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Buscar nos textos…</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12%] max-h-[80vh] translate-y-0 overflow-y-auto p-5 sm:max-w-2xl">
          <DialogTitle className="text-base font-semibold">
            Buscar nos textos
          </DialogTitle>
          <DialogDescription className="-mt-2 text-sm text-muted-foreground">
            Procure por uma palavra, pergunta, capítulo, tese ou passagem
            bíblica.
          </DialogDescription>
          <HomeSearch id="dialog-search" onNavigate={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
