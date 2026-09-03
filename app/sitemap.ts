import type { MetadataRoute } from 'next';
import { greaterCatechism } from '@/lib/catechism';
import { confessionChapters } from '@/lib/confession';
import { shortCatechism } from '@/lib/short-catechism';

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reformata.example.com';
  return [
    { url: base + '/catecismo-maior', changeFrequency: 'monthly', priority: 1 },
    ...greaterCatechism.map((entry) => ({
      url: base + '/catecismo-maior/pergunta/' + entry.number,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: base + '/breve-catecismo', changeFrequency: 'monthly', priority: 1 },
    ...shortCatechism.map((entry) => ({
      url: base + '/breve-catecismo/pergunta/' + entry.number,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: base + '/confissao-de-fe', changeFrequency: 'monthly', priority: 1 },
    ...confessionChapters.flatMap((chapter) =>
      chapter.paragraphs.map((paragraph) => ({
        url:
          base + '/confissao-de-fe/' + chapter.number + '/' + paragraph.number,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ),
    { url: base + '/95-teses', changeFrequency: 'monthly', priority: 0.9 },
  ];
}
