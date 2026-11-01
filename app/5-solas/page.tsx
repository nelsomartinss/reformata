import type { Metadata } from 'next';
import SolasReader from '@/components/solas-reader';

export const metadata: Metadata = {
  title: 'As 5 Solas da Reforma Protestante',
  description:
    'Sola Scriptura, Sola Fide, Sola Gratia, Solus Christus e Soli Deo Gloria: definição, contexto histórico e fundamento bíblico de cada uma.',
};

export default function SolasPage() {
  return <SolasReader />;
}
