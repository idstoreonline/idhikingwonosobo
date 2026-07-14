import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  metadataBase: new URL('https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com'),
  title: 'ID Hiking Rent Wonosobo — Sewa Alat Hiking & Camping Premium',
  description: 'Sewa alat hiking, tenda, carrier, sleeping bag, & perlengkapan camping premium di Wonosobo. Partner petualanganmu di Gunung Prau, Sindoro, Sumbing & Dieng. Fast response, alat bersih & terawat.',
  keywords: [
    'Sewa Alat Hiking Wonosobo',
    'Rental Tenda Wonosobo',
    'Rental Carrier Wonosobo',
    'Sewa Alat Camping Dieng',
    'Rental Outdoor Wonosobo',
    'Sewa Sleeping Bag Wonosobo',
    'Rental Gunung Prau',
    'Sewa Alat Naik Gunung',
    'ID Hiking Rent'
  ],
  authors: [{ name: 'ID Hiking Rent Wonosobo' }],
  openGraph: {
    title: 'ID Hiking Rent Wonosobo — Sewa Alat Hiking Premium',
    description: 'Partner petualanganmu di Gunung Prau, Sindoro & Dieng. Alat bersih, lengkap, dan siap menemani petualanganmu.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'ID Hiking Rent Wonosobo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ID Hiking Rent Wonosobo',
    description: 'Sewa Alat Hiking Premium di Wonosobo.'
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050505',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ID Hiking Rent Wonosobo',
    image: 'https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com/og.jpg',
    '@id': 'https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com',
    telephone: '+6287777728727',
    priceRange: 'Rp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wonosobo, Jawa Tengah',
      addressLocality: 'Wonosobo',
      addressRegion: 'Jawa Tengah',
      addressCountry: 'ID'
    },
    geo: { '@type': 'GeoCoordinates', latitude: -7.361, longitude: 109.9 },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00', closes: '22:00'
    }],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1000' }
  };

  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" theme="dark" richColors />
      </body>
    </html>
  );
}
