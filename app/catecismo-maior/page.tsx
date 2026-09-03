import type { Metadata } from "next";
import Reader from "@/components/reader";
import { greaterCatechism } from "@/lib/catechism";

export const metadata: Metadata = {
  title: "A fé reformada em seus textos | REFORMATA",
  description:
    "Leitor web dos textos reformados com busca, navegação por pergunta e integração segura com textos bíblicos.",
};
export default function GreaterCatechismPage() {
  return <Reader entries={greaterCatechism} initialNumber={1} />;
}
