import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ed] px-6 text-[#24302d]">
      <div className="max-w-md text-center">
        <p className="eyebrow">REFORMATA · 404</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold">
          Esta pergunta não foi encontrada.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Volte ao índice para continuar a leitura do Catecismo Maior.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-[#24302d] px-5 py-3 text-sm font-semibold text-white"
          href="/catecismo-maior"
        >
          Ir para o índice
        </Link>
      </div>
    </main>
  );
}
