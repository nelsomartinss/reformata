import type { Metadata } from 'next';
import { Cinzel } from 'next/font/google';
import SolasReader from '@/components/solas-reader';

export const metadata: Metadata = {
  title: 'As 5 Solas da Reforma Protestante',
  description:
    'Sola Scriptura, Sola Fide, Sola Gratia, Solus Christus e Soli Deo Gloria: definição, contexto histórico e fundamento bíblico de cada uma.',
};

// Fonte de destaque, usada só nos nomes em latim das 5 Solas. Carregada aqui,
// e não no layout, para não pesar nas outras páginas.
const cinzel = Cinzel({
  variable: '--font-display-face',
  subsets: ['latin'],
  weight: ['600'],
});

export default function SolasPage() {
  return (
    <div className={`contents ${cinzel.variable}`}>
      <SolasReader />
    </div>
  );
}
