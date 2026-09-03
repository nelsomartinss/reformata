import type { Metadata } from 'next';
import ThesesReader from '@/components/theses-reader';

export const metadata: Metadata = {
  title: '95 Teses de Martinho Lutero | REFORMATA',
  description:
    'Leia integralmente o Debate para o esclarecimento do valor das indulgências, de Martinho Lutero, publicado em 1517.',
};

export default function ThesesPage() {
  return <ThesesReader />;
}
