import type { Metadata } from "next";
import Reader from "@/components/reader";
import { shortCatechism } from "@/lib/short-catechism";

export const metadata: Metadata = {
  title: "Breve Catecismo de Westminster | REFORMATA",
  description:
    "Leia as 107 perguntas e respostas do Breve Catecismo de Westminster com suas referências bíblicas.",
};

export default function ShortCatechismPage() {
  return (
    <Reader
      entries={shortCatechism}
      initialNumber={1}
      documentTitle="Breve Catecismo de Westminster"
      documentSlug="breve-catecismo"
    />
  );
}
