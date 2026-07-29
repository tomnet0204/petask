import type { MetadataRoute } from 'next';
import { DOG_SYMPTOMS, CAT_SYMPTOMS } from '@/data/symptoms';
import { getQuestions } from '@/lib/petask/db/questions';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://petask-gules.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/petask`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/dogs`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/cats`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/petask/emergency`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/petask/disclaimer`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE}/petask/checker`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/petask/q-and-a`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/petask/vets`, priority: 0.7, changeFrequency: 'weekly' },
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

  let qaPages: MetadataRoute.Sitemap = [];
  try {
    const questions = await getQuestions({ limit: 100, status: 'answered' });
    qaPages = questions.map((q) => ({
      url: `${BASE}/petask/q-and-a/${q.id}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: new Date(q.createdAt),
    }));
  } catch {
    // Supabase不通時はスキップ
  }

  return [...staticPages, ...dogPages, ...catPages, ...qaPages];
}
