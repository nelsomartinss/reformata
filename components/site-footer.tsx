import { bibleTranslation } from '@/lib/bible/translation';

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 pt-6 pb-20 sm:pr-24 sm:pb-6 lg:pr-24 text-xs leading-5 text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p>
            © {new Date().getFullYear()} Reformata · A fé reformada em seus
            textos.
          </p>
          <p>
            Feito por{' '}
            <a
              href="https://nelsondev-blue.vercel.app/pt"
              className="font-medium text-link hover:underline"
              target="_blank"
              rel="noopener"
            >
              Nelson Martins
            </a>{' '}
            com <span aria-hidden="true">☕</span>
            <span className="sr-only">café</span> e{' '}
            <span aria-hidden="true">✳️</span>
            <span className="sr-only">Claude</span>
          </p>
        </div>
        <p className="max-w-xl sm:text-right">
          {bibleTranslation.attribution}{' '}
          <a
            href={bibleTranslation.licenseUrl}
            className="underline underline-offset-2 hover:text-foreground"
            rel="license noreferrer"
            target="_blank"
          >
            Ver licença
          </a>
        </p>
      </div>
    </footer>
  );
}
