export default async function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "https://idhikingwonosobo.com";

  const now = new Date();

  // Ambil semua produk
  let products = [];
  try {
    const res = await fetch(`${base}/api/products`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      products = (data.products || []).map((p) => ({
        url: `${base}/produk/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (e) {}

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },

    ...products,
  ];
}
