import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const host = 'https://linkr.local';
  return {
    rules: [{ userAgent: '*', allow: ['/', '/explore', '/profiles/'] }],
    sitemap: [`${host}/sitemap.xml`],
    host,
  };
}
