import type { Metadata } from 'next';
import HomePage from '@/components/home-page';

export const metadata: Metadata = {
  title: 'REFORMATA',
  description:
    'Explore os catecismos de Westminster, a Confissão de Fé e as 95 Teses em uma biblioteca digital para leitura e estudo.',
};

export default function Home() {
  return <HomePage />;
}
