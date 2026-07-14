export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}#produk`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}#paket`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}#trip`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}#galeri`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}#review`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}#faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
