# ID Hiking Rent Wonosobo

Premium Outdoor Rental Platform — Sewa alat hiking premium di Wonosobo.

**Live Website:** [ID Hiking Rent Wonosobo](https://05dd18aa-0ad7-490e-ad6d-50a75fbbc0ac.preview.emergentagent.com)
**Admin Dashboard:** `/admin` (default password: `admin123` — ubah di production!)

## Tech Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes
- **Database:** MongoDB (kompatibel dengan MongoDB Atlas / Railway)
- **PWA:** Service worker + manifest untuk install-to-home-screen
- **SEO:** Sitemap dinamis, JSON-LD structured data, Open Graph

## Features

### Customer-Facing
- Loading screen premium dengan gold glow
- Hero cinematic + trust badges
- Auto-slider promo dengan countdown
- Product grid mobile-first (2 per baris)
- **Booking flow < 30 detik → WhatsApp redirect**
- Product detail SEO pages (`/produk/[slug]`) dengan JSON-LD Product schema
- Multi-image gallery + fullscreen zoom
- **Visual availability calendar** dengan FULL BOOKED highlighting
- **Rental duration pricing** (harga berbeda untuk 1/2/3/5/7 hari)
- Trip planner otomatis rekomendasi alat per gunung
- Weather info 4 gunung
- Testimoni auto-slider
- Gallery masonry + lightbox
- FAQ accordion
- Floating WhatsApp button
- PWA install to home screen

### Admin Dashboard
- Login dengan password (`ADMIN_PASSWORD`)
- Overview: today bookings, monthly revenue, top product, low stock, promos aktif
- **CRUD Produk** dengan multi-image upload + pricing tier editor
- **CRUD Pesanan** dengan status update + Export Excel + Print Invoice
- **CRUD Promo, Paket, Review, FAQ, Galeri**
- Notifikasi booking baru otomatis (via Fonnte gateway opsional)
- Settings toko (WhatsApp, alamat, jam, bank, Google Maps)

## Setup

```bash
# 1. Install dependencies
yarn install

# 2. Copy env template
cp .env.example .env

# 3. Fill in variables (see .env.example)

# 4. Run development
yarn dev

# 5. Build for production
yarn build
yarn start
```

## Deployment

### Vercel (Frontend)
1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di dashboard Vercel:
   - `MONGO_URL`, `DB_NAME`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `ADMIN_PASSWORD` (WAJIB ubah!)
   - `NEXT_PUBLIC_GA_ID` (opsional)
   - `NEXT_PUBLIC_FB_PIXEL` (opsional)
   - `FONNTE_TOKEN` (opsional)
4. Deploy!

### Railway (Database)
1. Buat project di [railway.app](https://railway.app)
2. Add MongoDB service
3. Copy MongoDB connection string → set sebagai `MONGO_URL` di Vercel

## Font

Heading font menggunakan **Archivo Black** dari Google Fonts (padanan gratis untuk Nexa Black Bold).

**Untuk ganti ke Nexa Black asli:**
1. Letakkan file `NexaBlack.woff2` di `/public/fonts/`
2. Uncomment @font-face block di `app/globals.css`
3. Ubah CSS variable `--font-heading: 'Nexa Black'`

## Kontak

- WhatsApp: +62 877 7772 8727
- Alamat: Wonosobo, Jawa Tengah
