import type { Metadata } from "next";
import Reader from "@/components/reader";
import { greaterCatechism } from "@/lib/catechism";

export const metadata: Metadata = {
  title: "Catecismo Maior de Westminster | REFORMATA",
  description:
    "Leia as 196 perguntas e respostas do Catecismo Maior de Westminster com suas referências bíblicas.",
};
export default function GreaterCatechismPage() {
  return <Reader entries={greaterCatechism} initialNumber={1} />;
}
