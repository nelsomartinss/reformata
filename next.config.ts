import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // O texto bíblico é lido do disco em tempo de execução.
  outputFileTracingIncludes: {
    '/api/bible/passages': ['./content/biblia-livre/**'],
    '/biblia/[book]/[chapter]': ['./content/biblia-livre/**'],
  },
};

export default nextConfig;
