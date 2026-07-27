import type { MetadataRoute } from 'next';
import { DOG_SYMPTOMS, CAT_SYMPTOMS } from '@/data/symptoms';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://petask-gules.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/petask`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/dogs`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/cats`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/emergency`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/petask/disclaimer`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  const dogPages: MetadataRoute.Sitemap = DOG_SYMPTOMS.map((s) => ({
    url: `${BASE}/petask/symptoms/dog/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  const catPages: MetadataRoute.Sitemap = CAT_SYMPTOMS.map((s) => ({
    url: `${BASE}/petask/symptoms/cat/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPages, ...dogPages, ...catPages];
}
