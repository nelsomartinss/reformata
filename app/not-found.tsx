import Link from 'next/link';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Página não encontrada
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
          Não encontramos o que você procurava.
        </h1>
        <p className="mt-3 text-muted-foreground">
          O endereço pode estar incorreto ou o trecho mudou de lugar. Escolha um
          texto na página inicial para continuar a leitura.
        </p>
        <Link
          className="mt-8 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          href="/"
        >
          Voltar ao início
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
