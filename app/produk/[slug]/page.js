import ProductDetailClient from './ProductDetailClient';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com';

async function fetchProduct(slug) {
  try {
    const res = await fetch(`${BASE}/api/products/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await fetchProduct(resolvedParams.slug);
  if (!data?.product) {
    return { title: 'Produk Tidak Ditemukan — ID Hiking Rent Wonosobo' };
  }
  const p = data.product;
  const title = `Sewa ${p.name} di Wonosobo — ID Hiking Rent`;
  const desc = `${p.description || `Sewa ${p.name} berkualitas premium di Wonosobo.`} Mulai Rp ${(p.price || 0).toLocaleString('id-ID')}/hari. Stok tersedia, siap antar untuk pendakian Prau, Sindoro, & Dieng.`;
  const image = (p.images && p.images[0]) || p.image;
  return {
    title,
    description: desc,
    keywords: [`Sewa ${p.name}`, `Rental ${p.category} Wonosobo`, p.name, 'ID Hiking Rent', p.category],
    alternates: { canonical: `${BASE}/produk/${p.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/produk/${p.slug}`,
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 800, alt: p.name }] : [],
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: image ? [image] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const data = await fetchProduct(resolvedParams.slug);
  if (!data?.product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl gold-text uppercase">Produk Tidak Ditemukan</h1>
          <p className="text-white/60 mt-3">Kembali ke <a href="/" className="text-gold underline">halaman utama</a></p>
        </div>
      </div>
    );
  }
  const p = data.product;
  const image = (p.images && p.images[0]) || p.image;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images && p.images.length ? p.images : [image],
    sku: p.id,
    brand: { '@type': 'Brand', name: 'ID Hiking Rent Wonosobo' },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'IDR',
      availability: (p.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${BASE}/produk/${p.slug}`,
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '128' }
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={p} related={data.related || []} />
    </>
  );
}
