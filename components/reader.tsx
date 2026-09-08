"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BibleVersionSelect from "@/components/bible-version-select";
import DocumentSwitcher from "@/components/document-switcher";
import SiteBrand from "@/components/site-brand";
import StudyTools from "@/components/study-tools";
import { searchEntries, type CatechismEntry } from "@/lib/catechism";
import type { PassageBatchResponse, PassageResponse } from "@/lib/bible";

function PassagePanel({
  entry,
  version,
  documentSlug,
}: {
  entry: CatechismEntry;
  version: string;
  documentSlug: string;
}) {
  const [passages, setPassages] = useState<PassageResponse[]>([]);
  const [failedReferences, setFailedReferences] = useState<string[]>([]);
  const [state, setState] = useState<
    "loading" | "ready" | "unavailable" | "error" | "empty"
  >(entry.references.length === 0 ? "empty" : "loading");

  useEffect(() => {
    let active = true;
    if (entry.references.length === 0) {
      return () => {
        active = false;
      };
    }
    fetch(
      "/api/bible/passages?document=" +
        documentSlug +
        "&number=" +
        entry.number +
        "&version=" +
        version,
    )
      .then(async (response) => {
        const data = (await response.json()) as {
          error?: string;
          passages?: PassageResponse[];
          failedReferences?: string[];
        };
        if (!response.ok) throw new Error(data.error ?? "ERRO");
        return {
          passages: data.passages ?? [],
          failedReferences: data.failedReferences ?? [],
        } satisfies PassageBatchResponse;
      })
      .then((data) => {
        if (!active) return;
        setPassages(data.passages);
        setFailedReferences(data.failedReferences);
        setState("ready");
      })
      .catch((error: Error) => {
        if (!active) return;
        setState(
          error.message === "TRADUCAO_NAO_CONFIGURADA" ||
            error.message === "API_CHAVE_NAO_CONFIGURADA"
            ? "unavailable"
            : "error",
        );
      });
    return () => {
      active = false;
    };
  }, [documentSlug, entry.number, entry.references.length, version]);

  return (
    <section className="mt-8" aria-labelledby="references-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Referências bíblicas</p>
          <h2
            id="references-heading"
            className="mt-1 font-serif text-2xl font-semibold text-foreground"
          >
            Textos que fundamentam esta resposta
          </h2>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-[#c7d5cc] bg-[#eef4ef] px-3 py-1 text-[#3f5e4b]"
        >
          {version ? "API.Bible" : "—"}
        </Badge>
      </div>
      {state === "loading" && (
        <output className="mt-5 rounded-2xl border border-dashed border-[#c9d3cc] bg-white/60 p-5 text-sm text-muted-foreground">
          Consultando as passagens autorizadas…
        </output>
      )}
      {state === "unavailable" && (
        <div className="mt-5 rounded-2xl border border-[#e0d4ba] bg-[#fffaf0] p-5 text-sm leading-6 text-[#6d6048]">
          A tradução selecionada ainda não está conectada a uma licença neste
          ambiente. As referências continuam disponíveis acima; o texto bíblico
          será exibido assim que a chave autorizada for configurada.
        </div>
      )}
      {state === "error" && (
        <div className="mt-5 rounded-2xl border border-[#e5c5bd] bg-[#fff7f4] p-5 text-sm leading-6 text-[#875348]">
          Não foi possível carregar as passagens agora. Tente novamente em
          alguns instantes.
        </div>
      )}
      {state === "empty" && (
        <div className="mt-5 rounded-2xl border border-[#d7dfd8] bg-white/60 p-5 text-sm leading-6 text-muted-foreground">
          Esta edição do catecismo não registra referências bíblicas adicionais
          para esta pergunta.
        </div>
      )}
      {state === "ready" && (
        <div className="mt-5 space-y-4">
          {failedReferences.length > 0 && (
            <p className="rounded-2xl border border-[#e0d4ba] bg-[#fffaf0] p-4 text-sm leading-6 text-[#6d6048]">
              Algumas referências não estão disponíveis nesta tradução:{" "}
              {failedReferences.join(", ")}.
            </p>
          )}
          {passages.map((passage) => (
            <article
              key={passage.passageId}
              className="rounded-2xl border border-[#dbe4dd] bg-[#f7faf7] p-5 sm:p-6"
            >
              <h3 className="text-sm font-bold tracking-wide text-[#476452]">
                {passage.reference}
              </h3>
              <p className="mt-3 font-serif text-lg leading-8 text-[#2d3b34]">
                {passage.content}
              </p>
            </article>
          ))}
          <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Texto fornecido por provedor
            bíblico autorizado. Direitos reservados ao editor da tradução.
          </p>
          {passages[0]?.copyright && (
            <p className="text-xs leading-5 text-muted-foreground">
              {passages[0].copyright}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

type ReaderProps = {
  entries: CatechismEntry[];
  initialNumber: number;
  documentTitle?: string;
  documentSlug?: string;
};

export default function Reader({
  entries,
  initialNumber,
  documentTitle = "Catecismo Maior de Westminster",
  documentSlug = "catecismo-maior",
}: ReaderProps) {
  const router = useRouter();
  const firstEntry =
    entries.find((entry) => entry.number === initialNumber) ?? entries[0];
  const [selectedNumber, setSelectedNumber] = useState(firstEntry.number);
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState("");
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("cw-bible-version");
    if (saved) window.setTimeout(() => setVersion(saved), 0);
  }, []);
  const entry =
    entries.find((item) => item.number === selectedNumber) ?? entries[0];
  const studyReference = `${documentTitle} · Pergunta ${entry.number}`;
  const studyContent = [
    `Pergunta: ${entry.question}`,
    `Resposta: ${entry.answer}`,
    `Referências: ${entry.references.join(", ")}`,
  ].join("\n");
  const results = useMemo(
    () => searchEntries(entries, query),
    [entries, query],
  );
  const currentPosition = entries.findIndex(
    (item) => item.number === entry.number,
  );
  const previous = entries[currentPosition - 1];
  const next = entries[currentPosition + 1];
  function selectQuestion(number: number) {
    setSelectedNumber(number);
    setMobileIndexOpen(false);
    router.push("/" + documentSlug + "/pergunta/" + number);
  }
  function selectVersion(nextVersion: string) {
    if (!nextVersion) return;
    setVersion(nextVersion);
    window.localStorage.setItem("cw-bible-version", nextVersion);
  }
  const noResults = Boolean(query) && results.length === 0;

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#24302d]">
      <header className="sticky top-0 z-20 border-b border-[#dddcd2] bg-[#f6f3ed]/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-340 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <SiteBrand href="/" />
          <nav
            aria-label="Documentos"
            className="hidden items-center gap-1 md:flex"
          >
            <Link
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/biblia"
            >
              Bíblia
            </Link>
            <Link
              className={
                documentSlug === "catecismo-maior"
                  ? "rounded-full bg-white/70 px-4 py-2 text-sm text-[#24302d]"
                  : "rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              }
              href="/catecismo-maior"
            >
              Catecismo Maior
            </Link>
            <Link
              className={
                documentSlug === "breve-catecismo"
                  ? "rounded-full bg-white/70 px-4 py-2 text-sm text-[#24302d]"
                  : "rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              }
              href="/breve-catecismo"
            >
              Breve Catecismo
            </Link>
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/confissao-de-fe"
            >
              Confissão de Fé
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70"
              href="/95-teses"
            >
              95 Teses de Martinho Lutero
            </Link>
          </nav>
          <DocumentSwitcher currentSlug={documentSlug} />
          <div className="flex items-center gap-2 text-xs font-semibold text-[#718078]">
            <span className="hidden sm:inline">Edição de estudo</span>
            <span className="size-2 rounded-full bg-[#a7bfae]" />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-340 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[260px_minmax(0,760px)] lg:gap-14 lg:px-12 lg:py-12 xl:grid-cols-[260px_minmax(0,760px)_220px]">
        <aside
          className={`${mobileIndexOpen ? "block" : "hidden"} lg:block`}
          aria-label={"Índice do " + documentTitle}
        >
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Índice</p>
                <h2 className="mt-1 font-serif text-xl font-semibold">
                  {entries.length} perguntas
                </h2>
              </div>
              <Button
                className="size-8 rounded-full lg:hidden"
                variant="ghost"
                size="icon"
                onClick={() => setMobileIndexOpen(false)}
                aria-label="Fechar índice"
              >
                <X className="size-4" />
              </Button>
            </div>
            <label htmlFor="question-search" className="relative mt-5 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#84938a]" />
              <Input
                id="question-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar pergunta…"
                className="h-11 rounded-xl border-[#d6ddd7] bg-white/75 pl-9"
              />
            </label>
            <div className="mt-4 max-h-[calc(100vh-240px)] space-y-1 overflow-y-auto pr-1">
              {results.map((item) => (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => selectQuestion(item.number)}
                  className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${item.number === entry.number ? "bg-[#e2ede5] text-[#2c5140]" : "text-[#65746c] hover:bg-white/70 hover:text-[#24302d]"}`}
                >
                  <span
                    className={`mt-0.5 w-8 shrink-0 text-xs font-bold ${item.number === entry.number ? "text-[#426d53]" : "text-[#9aa69e]"}`}
                  >
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span className="line-clamp-2 text-sm leading-5">
                    {item.question}
                  </span>
                </button>
              ))}
              {noResults && (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  Nenhuma pergunta encontrada.
                </p>
              )}
            </div>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <div>
              <p className="eyebrow">Leitura guiada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pergunta {entry.number} de {entries.length}
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-[#ccd8cf] bg-white/60"
              onClick={() => setMobileIndexOpen((open) => !open)}
            >
              <Menu className="size-4" /> Índice
            </Button>
          </div>
          <div className="mb-8 flex items-start justify-between gap-5">
            <div>
              <p className="eyebrow">{documentTitle}</p>
              <h1 className="mt-2 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-[#24302d] sm:text-5xl">
                Pergunta {entry.number}
              </h1>
            </div>
            <div className="hidden rounded-2xl border border-[#d7dfd8] bg-white/60 p-3 text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#84938a]">
                Progresso
              </p>
              <p className="mt-1 text-lg font-semibold text-[#426d53]">
                {String(entry.number).padStart(2, "0")}{" "}
                <span className="text-sm font-normal text-[#95a199]">
                  / {entries.length}
                </span>
              </p>
            </div>
          </div>
          <Card className="overflow-visible border-[#d9ded8] bg-white shadow-[0_20px_60px_rgba(55,72,61,0.08)]">
            <CardContent className="p-6 sm:p-9 lg:p-11">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-[#e2ede5] px-3 py-1 text-[#426d53] hover:bg-[#e2ede5]">
                  Pergunta {entry.number}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Doutrina cristã reformada
                </span>
              </div>
              <h2 className="mt-6 font-serif text-2xl font-semibold leading-tight text-[#26362e] sm:text-[2rem]">
                {entry.question}
              </h2>
              <div className="my-8 h-px bg-[#e8ebe6]" />
              <div>
                <p className="eyebrow">Resposta</p>
                <p className="mt-3 font-serif text-xl leading-9 text-[#3d4c44] sm:text-2xl sm:leading-10">
                  {entry.answer}
                </p>
              </div>
              <div className="mt-9 rounded-2xl border border-[#dce6df] bg-[#f4f8f4] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label
                      htmlFor="bible-version"
                      className="block text-sm font-bold text-[#365541]"
                    >
                      Tradução bíblica
                    </label>
                    <p className="mt-1 text-xs text-[#728178]">
                      Escolha como deseja ler as referências abaixo.
                    </p>
                  </div>
                  <BibleVersionSelect
                    id="bible-version"
                    value={version}
                    onChange={selectVersion}
                  />
                </div>
              </div>
              <div className="mt-8">
                <p className="eyebrow">Provas das Escrituras</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.references.map((reference) => (
                    <span
                      key={reference}
                      className="rounded-full border border-[#d7e1d9] bg-[#fbfdfb] px-3 py-1.5 text-sm font-semibold text-[#52705c]"
                    >
                      {reference}
                    </span>
                  ))}
                </div>
              </div>
              <PassagePanel
                key={`${entry.number}-${version}`}
                entry={entry}
                version={version}
                documentSlug={documentSlug}
              />
            </CardContent>
          </Card>
          <div className="mt-6 xl:hidden">
            <StudyTools reference={studyReference} content={studyContent} />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="h-11 rounded-full border-[#cfd9d1] bg-white/60 px-4"
              disabled={!previous}
              onClick={() => previous && selectQuestion(previous.number)}
            >
              <ChevronLeft className="size-4" />{" "}
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <p className="text-xs font-semibold text-[#84938a]">
              {entry.number} / {entries.length}
            </p>
            <Button
              variant="outline"
              className="h-11 rounded-full border-[#cfd9d1] bg-white/60 px-4"
              disabled={!next}
              onClick={() => next && selectQuestion(next.number)}
            >
              <span className="hidden sm:inline">Próxima</span>{" "}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </section>
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <StudyTools reference={studyReference} content={studyContent} />
          </div>
        </aside>
      </div>
      <footer className="border-t border-[#dddcd2] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-340 flex-col justify-between gap-3 text-xs leading-5 text-[#84938a] sm:flex-row">
          <p>
            © {new Date().getFullYear()} REFORMATA · A fé reformada em seus
            textos. Todos os direitos reservados.
          </p>
          <p>
            O texto bíblico depende de uma tradução licenciada e da atribuição
            de seus editores.
          </p>
        </div>
      </footer>
    </main>
  );
}
