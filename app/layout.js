import './globals.css';
import Script from 'next/script';
import { Toaster } from 'sonner';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com';

export const metadata = {
  metadataBase: new URL(BASE),
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
    description: 'Partner petualanganmu di Gunung Prau, Sindoro, Dieng & Dll. Alat bersih, lengkap, dan siap menemani petualanganmu.',
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
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ID Hiking Rent',
  },
  icons: {
    icon: [{ url: '/faviconfinal.webp', type: 'image/webp' }],
    apple: [{ url: '/faviconfinal.webp' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050505',
};

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ID Hiking Rent Wonosobo',
    image: `${BASE}/faviconfinal.webp`,
    '@id': BASE,
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/faviconfinal.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" theme="dark" richColors />

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {FB_PIXEL && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
