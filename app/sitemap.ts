import type { MetadataRoute } from 'next';
import { greaterCatechism } from '@/lib/catechism';
export default function sitemap(): MetadataRoute.Sitemap { const base = 'https://cw.example.com'; return [{ url: `${base}/catecismo-maior`, changeFrequency: 'monthly', priority: 1 }, ...greaterCatechism.map((entry) => ({ url: `${base}/catecismo-maior/pergunta/${entry.number}`, changeFrequency: 'monthly' as const, priority: 0.7 }))]; }
