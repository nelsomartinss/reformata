import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reader from "@/components/reader";
import { getShortEntry, shortCatechism } from "@/lib/short-catechism";

export function generateStaticParams() {
  return shortCatechism.map((entry) => ({ number: String(entry.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}): Promise<Metadata> {
  const { number } = await params;
  const entry = getShortEntry(Number(number));
  return entry
    ? {
        title: "Pergunta " + entry.number + " — Breve Catecismo | REFORMATA",
        description: entry.question,
      }
    : { title: "Pergunta não encontrada | REFORMATA" };
}

export default async function ShortQuestionPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const entry = getShortEntry(Number(number));
  if (!entry) notFound();
  return (
    <Reader
      entries={shortCatechism}
      initialNumber={entry.number}
      documentTitle="Breve Catecismo de Westminster"
      documentSlug="breve-catecismo"
    />
  );
}
