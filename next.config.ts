import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // O texto bíblico é lido do disco em tempo de execução.
  outputFileTracingIncludes: {
    '/api/bible/passages': ['./content/biblia-livre/**'],
    '/biblia/[book]/[chapter]': ['./content/biblia-livre/**'],
  },
  experimental: {
    // A Vercel restaura .next/cache entre deploys; com o cache em disco do
    // Turbopack ligado no build, um deploy chegou a publicar o CSS da versão
    // anterior. Desligado, cada build compila tudo a partir do código atual.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
