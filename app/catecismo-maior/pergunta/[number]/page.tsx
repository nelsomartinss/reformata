import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reader from "@/components/reader";
import { getEntry, greaterCatechism } from "@/lib/catechism";

export function generateStaticParams() {
  return greaterCatechism.map((entry) => ({ number: String(entry.number) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}): Promise<Metadata> {
  const { number } = await params;
  const entry = getEntry(Number(number));
  return entry
    ? {
        title: `Pergunta ${entry.number} — Catecismo Maior | REFORMATA`,
        description: entry.question,
      }
    : { title: "Pergunta não encontrada | REFORMATA" };
}
export default async function QuestionPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const entry = getEntry(Number(number));
  if (!entry) notFound();
  return <Reader entries={greaterCatechism} initialNumber={entry.number} />;
}
