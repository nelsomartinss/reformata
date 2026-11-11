import type { Metadata, Viewport } from 'next';
import { Geist, Source_Serif_4 } from 'next/font/google';
import FeedbackWidget from '@/components/feedback-widget';
import { DARK_QUERY, THEME_STORAGE_KEY } from '@/lib/theme';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const sourceSerif = Source_Serif_4({
  variable: '--font-reading',
  subsets: ['latin'],
});
// O itálico aparece em poucos lugares: sem pré-carga, só baixa onde for usado.
const sourceSerifItalic = Source_Serif_4({
  variable: '--font-reading-italic',
  subsets: ['latin'],
  style: ['italic'],
  preload: false,
});

// Antes da primeira pintura: usa a escolha manual, se houver; senão, o tema do sistema.
const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('${DARK_QUERY}').matches?'dark':'light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reformata.example.com',
  ),
  title: {
    default: 'Reformata · A fé reformada',
    template: '%s · Reformata',
  },
  description:
    'Uma leitura simples e cuidadosa dos textos reformados com suas referências bíblicas.',
  applicationName: 'Reformata',
  openGraph: {
    title: 'Reformata · A fé reformada em seus textos',
    description: 'A fé reformada com referências bíblicas.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${sourceSerif.variable} ${sourceSerifItalic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background font-sans text-foreground antialiased"
      >
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
