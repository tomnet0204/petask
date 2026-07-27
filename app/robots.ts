import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/petask/checker/result/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://petask-gules.vercel.app'}/sitemap.xml`,
  };
}
