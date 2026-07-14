import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'id_hiking_rent';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || '';
const ADMIN_WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6287777728727';

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

function slugify(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

async function sendFonnteNotification(order) {
  if (!FONNTE_TOKEN) return { skipped: true };
  const message = `\ud83d\udd14 *BOOKING BARU - ID HIKING RENT*\n\nInvoice: ${order.invoiceNo}\nBarang: ${order.productName}\nJumlah: ${order.qty} pcs\nTanggal Sewa: ${order.startDate}\nTanggal Kembali: ${order.endDate}\nDurasi: ${order.days} hari\nTotal: Rp ${(order.total || 0).toLocaleString('id-ID')}\n${order.customerName ? 'Pemesan: ' + order.customerName + '\\n' : ''}\nCek dashboard admin untuk konfirmasi.`;
  try {
    const resp = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ target: ADMIN_WA_NUMBER, message, countryCode: '62' }).toString(),
    });
    return { ok: resp.ok };
  } catch (e) {
    return { error: e.message };
  }
}

const IMG = {
  bp1: 'https://images.unsplash.com/photo-1585501954260-372cec60d355?w=800&q=80',
  bp2: 'https://images.unsplash.com/photo-1597671053855-1132c40cc1ce?w=800&q=80',
  boot1: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
  boot2: 'https://images.unsplash.com/photo-1542838776-096d877b5aa2?w=800&q=80',
  tent1: 'https://images.unsplash.com/photo-1629098527294-df268352e232?w=800&q=80',
  tent2: 'https://images.unsplash.com/photo-1600052927546-d70e9f016ca5?w=800&q=80',
  compass1: 'https://images.unsplash.com/photo-1578532009320-10258506d6c8?w=800&q=80',
  compass2: 'https://images.unsplash.com/photo-1700659145327-65692f7a6e71?w=800&q=80',
  compass3: 'https://images.unsplash.com/photo-1598944999410-e93772fc48a5?w=800&q=80',
  flash: 'https://images.unsplash.com/photo-1602223876473-c37ee6c2a4e2?w=800&q=80',
  mountain1: 'https://images.unsplash.com/photo-1611366376326-5eaf36b54355?w=800&q=80',
  mountain2: 'https://images.unsplash.com/photo-1654362248566-6804dbcc5bdc?w=800&q=80',
  mountain3: 'https://images.unsplash.com/photo-1519614218660-ea0a24a43b4c?w=800&q=80',
};

const SEED_PRODUCTS = [
  { name: 'Carrier Consina 60L', category: 'Carrier', size: '60L', stock: 3, price: 30000, image: IMG.bp1, badge: 'BEST SELLER', description: 'Carrier premium 60 liter dengan padding empuk, rain cover included, cocok untuk pendakian 2-3 hari.', specs: { kapasitas: '60 Liter', berat: '1.9 kg', material: 'Ripstop Nylon 420D', warna: 'Hitam / Abu' }, included: ['Rain Cover', 'Chest Strap', 'Hip Belt'] },
  { name: 'Tenda Dome Eiger 4P', category: 'Tenda', size: '4 Orang', stock: 2, price: 45000, image: IMG.tent1, badge: 'FAVORITE', description: 'Tenda dome kapasitas 4 orang, double layer, waterproof 3000mm, cocok untuk kondisi hujan.', specs: { kapasitas: '4 Orang', berat: '3.2 kg', waterproof: '3000 mm', frame: 'Fiberglass' }, included: ['Flysheet', 'Frame', 'Pasak', 'Tas Simpan'] },
  { name: 'Sleeping Bag Polar', category: 'Sleeping Bag', size: 'Standard', stock: 5, price: 15000, image: IMG.bp2, badge: 'BEST SELLER', description: 'Sleeping bag polar tebal hangat sampai 5\u00b0C. Bersih dan sudah dicuci.', specs: { suhu: 'Comfort 5\u00b0C', berat: '900 g', material: 'Polar + Polyester' }, included: ['Compression Bag'] },
  { name: 'Headlamp Boruit 3-LED', category: 'Lampu', size: 'Universal', stock: 8, price: 10000, image: IMG.flash, badge: 'NEW', description: 'Headlamp super terang 6000 lumens, 3 mode cahaya, tahan hujan.', specs: { lumens: '6000 lm', batere: '2x 18650', tahan_air: 'IPX4' }, included: ['Baterai', 'Kabel Charger'] },
  { name: 'Kompor Portable Windproof', category: 'Kompor', size: 'Mini', stock: 6, price: 12000, image: IMG.compass1, description: 'Kompor gas portable anti angin, kokoh, aman untuk masak di gunung.', specs: { bahan: 'Alumunium Alloy', berat: '250 g' }, included: ['Case'] },
  { name: 'Matras Aluminium Foil', category: 'Matras', size: '180x50cm', stock: 10, price: 8000, image: IMG.compass2, description: 'Matras aluminium foil peredam suhu tanah, ringan mudah dilipat.', specs: { ukuran: '180 x 50 cm', berat: '250 g' }, included: [] },
  { name: 'Trekking Pole Aluminium', category: 'Aksesoris', size: 'Adjustable', stock: 7, price: 12000, image: IMG.compass3, badge: 'DISKON', description: 'Trekking pole aluminium 3 stage, anti slip, ringan.', specs: { panjang: '65-135 cm', berat: '260 g/pcs', material: '7075 Aluminium' }, included: ['Karet Ujung', 'Snow Basket'] },
  { name: 'Nesting Set Cooking', category: 'Cooking', size: '4-in-1', stock: 4, price: 15000, image: IMG.bp1, description: 'Nesting set anti lengket, wajan + panci + tutup + tempat.', specs: { material: 'Aluminium Anodized', kapasitas: '1.2 L' }, included: ['Panci', 'Wajan', 'Tutup', 'Sarung'] },
  { name: 'Rain Coat / Jas Hujan', category: 'Jaket', size: 'M/L/XL', stock: 8, price: 8000, image: IMG.boot1, description: 'Jas hujan setelan jaket + celana, bahan tebal anti tembus.', specs: { material: 'PVC Polyester', warna: 'Hitam' }, included: ['Jaket', 'Celana', 'Tas'] },
  { name: 'Jaket Gunung Windbreaker', category: 'Jaket', size: 'M/L/XL', stock: 5, price: 20000, image: IMG.boot2, badge: 'PREMIUM GEAR', description: 'Jaket windbreaker tahan angin & gerimis, hangat, ringkas.', specs: { material: 'Polyester + Fleece', suhu: 'Comfort 8\u00b0C' }, included: [] },
  { name: 'Sepatu Gunung Consina', category: 'Sepatu', size: '39-44', stock: 4, price: 25000, image: IMG.boot1, badge: 'FAVORITE', description: 'Sepatu gunung mid-cut, anti slip Vibram, waterproof.', specs: { material: 'Suede + Mesh', outsole: 'Vibram' }, included: [] },
  { name: 'Sarung Tangan Gunung', category: 'Aksesoris', size: 'Universal', stock: 12, price: 5000, image: IMG.compass1, description: 'Sarung tangan gunung windproof, hangat, touchscreen compatible.', specs: { material: 'Polyester + Fleece' }, included: [] },
  { name: 'Buff / Balaclava', category: 'Aksesoris', size: 'Universal', stock: 15, price: 5000, image: IMG.compass2, description: 'Multi function neck gaiter, penutup wajah anti dingin.', specs: { material: 'Microfiber' }, included: [] },
  { name: 'Kaos Kaki Gunung Tebal', category: 'Aksesoris', size: '39-44', stock: 20, price: 5000, image: IMG.compass3, description: 'Kaos kaki wol tebal, hangat, anti lecet.', specs: { material: 'Wool Blend' }, included: [] },
  { name: 'Gaiter Anti Pacet', category: 'Aksesoris', size: 'M/L', stock: 6, price: 8000, image: IMG.flash, description: 'Gaiter pelindung kaki dari pacet, lumpur, & duri.', specs: { material: 'Ripstop Waterproof' }, included: [] },
  { name: 'Carrier Deuter 40L', category: 'Carrier', size: '40L', stock: 4, price: 25000, image: IMG.bp2, badge: 'NEW', description: 'Daypack carrier 40L, cocok untuk tektok / summit day.', specs: { kapasitas: '40 Liter', berat: '1.4 kg' }, included: ['Rain Cover'] },
  { name: 'Tenda Ultralight 2P', category: 'Tenda', size: '2 Orang', stock: 3, price: 35000, image: IMG.tent2, badge: 'PREMIUM GEAR', description: 'Tenda ultralight 2P double layer, ringan hanya 1.8 kg.', specs: { kapasitas: '2 Orang', berat: '1.8 kg', waterproof: '3000 mm' }, included: ['Flysheet','Frame','Pasak'] },
  { name: 'Kompor Spirtus Trangia', category: 'Kompor', size: 'Compact', stock: 5, price: 10000, image: IMG.compass1, description: 'Kompor spirtus tradisional Trangia, hemat & anti angin.', specs: { bahan: 'Brass' }, included: [] },
  { name: 'Water Bladder 2L', category: 'Aksesoris', size: '2L', stock: 6, price: 8000, image: IMG.compass2, description: 'Kantung air minum 2 liter, hydration bladder.', specs: { kapasitas: '2 Liter' }, included: [] },
  { name: 'Powerbank 20000mAh', category: 'Aksesoris', size: '20K mAh', stock: 7, price: 15000, image: IMG.flash, badge: 'LIMITED STOCK', description: 'Powerbank fast charging 20000 mAh, 2 port USB.', specs: { kapasitas: '20000 mAh', output: '2.1A' }, included: ['Kabel Micro USB'] },
  { name: 'Sleeping Bag Mumy Down', category: 'Sleeping Bag', size: 'Standard', stock: 3, price: 25000, image: IMG.bp1, badge: 'PREMIUM GEAR', description: 'Sleeping bag mummy dengan isian bulu angsa, comfort -5\u00b0C.', specs: { suhu: 'Comfort -5\u00b0C', berat: '1.1 kg' }, included: ['Compression Bag'] },
  { name: 'Flysheet 3x4m', category: 'Tenda', size: '3x4m', stock: 5, price: 15000, image: IMG.tent1, description: 'Flysheet 3x4 meter untuk shelter/tenda darurat.', specs: { ukuran: '3 x 4 m', material: 'Polyester Waterproof' }, included: ['Tali', 'Pasak'] },
];

const SEED_PROMOS = [
  { title: 'Sewa 3 Hari Bayar 2 Hari', subtitle: 'Berlaku untuk semua carrier & tenda', discount: 33, endsAt: null, color: 'from-amber-500 to-yellow-600' },
  { title: 'Promo Weekend Special', subtitle: 'Diskon 15% untuk booking Jumat-Minggu', discount: 15, endsAt: null, color: 'from-yellow-600 to-amber-800' },
  { title: 'Diskon Mahasiswa 20%', subtitle: 'Tunjukkan KTM saat pengambilan alat', discount: 20, endsAt: null, color: 'from-amber-600 to-yellow-500' },
  { title: 'Paket Couple Camping', subtitle: 'Hemat 30% untuk sewa berpasangan', discount: 30, endsAt: null, color: 'from-yellow-700 to-amber-500' },
  { title: 'Paket Premium Hemat', subtitle: 'Sewa lengkap 7 item hanya 150K/hari', discount: 25, endsAt: null, color: 'from-amber-500 to-yellow-700' },
];

const SEED_REVIEWS = [
  { name: 'Rizky P.', avatar: 'https://i.pravatar.cc/100?u=rizky', rating: 5, review: 'Alat lengkap, bersih, wangi. Owner ramah banget! Recommended banget buat pendaki Wonosobo.' },
  { name: 'Sari W.', avatar: 'https://i.pravatar.cc/100?u=sari', rating: 5, review: 'Fast response di WhatsApp, harga bersahabat, alatnya premium semua. Prau makin nikmat!' },
  { name: 'Fajar S.', avatar: 'https://i.pravatar.cc/100?u=fajar', rating: 5, review: 'Sewa tenda + carrier untuk Sindoro. Kondisi perfect, gak ada bocor, packing rapi banget.' },
  { name: 'Dinda A.', avatar: 'https://i.pravatar.cc/100?u=dinda', rating: 4, review: 'Pertama kali sewa disini dan puas! Diantar juga ke kos, jadi ga ribet. Terimakasih!' },
  { name: 'Bayu N.', avatar: 'https://i.pravatar.cc/100?u=bayu', rating: 5, review: 'Sleeping bag tebal & hangat, cocok banget summit Dieng malem-malem. Mantap ID Hiking!' },
  { name: 'Alya K.', avatar: 'https://i.pravatar.cc/100?u=alya', rating: 5, review: 'Harga transparan, tidak ada biaya tersembunyi. Alat baru semua, worth every rupiah!' },
];

const SEED_PACKAGES = [
  { name: 'Paket Beginner', price: 75000, subtitle: 'Cocok untuk pemula naik gunung', items: ['Carrier 40L', 'Sleeping Bag', 'Matras', 'Headlamp', 'Rain Coat'], badge: 'POPULER' },
  { name: 'Paket Couple', price: 140000, subtitle: 'Paket berdua romantis di gunung', items: ['Tenda 2P', 'Carrier 40L x2', 'Sleeping Bag x2', 'Matras x2', 'Nesting', 'Headlamp x2'], badge: 'HEMAT' },
  { name: 'Paket Family', price: 220000, subtitle: 'Paket keluarga / grup 4 orang', items: ['Tenda 4P', 'Carrier 60L x2', 'Sleeping Bag x4', 'Matras x4', 'Cooking Set', 'Headlamp x4'] },
  { name: 'Paket Premium All-in', price: 175000, subtitle: 'Lengkap tanpa kurang satu apapun', items: ['Carrier 60L', 'Tenda 2P', 'Sleeping Bag Down', 'Matras', 'Jaket', 'Sepatu', 'Trekking Pole', 'Headlamp', 'Cooking Set'], badge: 'PREMIUM' },
];

const SEED_FAQS = [
  { q: 'Bagaimana cara sewa alat?', a: 'Cukup pilih alat di website, klik BOOKING SEKARANG, pilih tanggal, lalu kirim ke WhatsApp kami untuk konfirmasi. Fast response < 5 menit!' },
  { q: 'Apakah alat sudah dicuci & bersih?', a: 'Tentu! Setiap alat kami cuci, jemur, dan sterilkan setelah setiap pemakaian. Sleeping bag & tenda selalu dalam kondisi wangi dan segar.' },
  { q: 'Apakah bisa diantar (delivery)?', a: 'Bisa! Delivery gratis untuk area Wonosobo kota. Untuk luar kota / basecamp kami sediakan dengan biaya delivery menyesuaikan lokasi.' },
  { q: 'Berapa lama minimal sewa?', a: 'Minimal sewa 1 hari (24 jam). Sewa 3 hari kami hitung bayar 2 hari (promo aktif).' },
  { q: 'Apakah ada DP (down payment)?', a: 'Ya, DP 50% via transfer bank / QRIS untuk booking, sisanya dibayar saat pengambilan alat.' },
  { q: 'Apa yang terjadi jika alat rusak?', a: 'Kerusakan wajar tidak dikenakan biaya. Namun kerusakan berat / kehilangan akan diganti sesuai harga barang. Detail di Syarat & Ketentuan.' },
  { q: 'Bisa cancel booking?', a: 'Bisa cancel gratis H-2 sebelum tanggal sewa. Setelah itu DP tidak dapat dikembalikan namun bisa reschedule.' },
];

const SEED_GALLERY = [
  { url: IMG.mountain1, caption: 'Sunrise Gunung Prau', category: 'Summit' },
  { url: IMG.mountain2, caption: 'Golden Hour di Sindoro', category: 'Summit' },
  { url: IMG.mountain3, caption: 'Camping Bersama di Dieng', category: 'Camping' },
  { url: IMG.tent1, caption: 'Setup Tenda Premium', category: 'Alat' },
  { url: IMG.tent2, caption: 'Tenda Ultralight 2P', category: 'Alat' },
  { url: IMG.bp1, caption: 'Carrier Consina 60L', category: 'Alat' },
  { url: IMG.bp2, caption: 'Sleeping Bag Bersih', category: 'Alat' },
  { url: IMG.boot1, caption: 'Sepatu Trekking', category: 'Alat' },
  { url: IMG.compass1, caption: 'Perlengkapan Navigasi', category: 'Alat' },
];

async function ensureSeeded(db) {
  const count = await db.collection('products').countDocuments();
  if (count === 0) {
    await db.collection('products').insertMany(SEED_PRODUCTS.map(p => {
      const base = Number(p.price) || 0;
      // Auto duration pricing: day2 = 1.6x, day3 = 2.1x, then +price per day (approx 3-hari-bayar-2)
      const pricingTiers = [
        { days: 1, price: base },
        { days: 2, price: Math.round(base * 1.8) },
        { days: 3, price: Math.round(base * 2.2) },
        { days: 4, price: Math.round(base * 3.0) },
        { days: 5, price: Math.round(base * 3.6) },
        { days: 7, price: Math.round(base * 4.8) },
      ];
      return {
        id: uuidv4(),
        slug: slugify(p.name),
        status: 'READY',
        images: [p.image],
        pricingTiers,
        createdAt: new Date(),
        ...p,
      };
    }));
    await db.collection('promos').insertMany(SEED_PROMOS.map(p => ({ id: uuidv4(), active: true, ...p })));
    await db.collection('reviews').insertMany(SEED_REVIEWS.map(r => ({ id: uuidv4(), createdAt: new Date(), ...r })));
    await db.collection('packages').insertMany(SEED_PACKAGES.map(p => ({ id: uuidv4(), ...p })));
    await db.collection('faqs').insertMany(SEED_FAQS.map(f => ({ id: uuidv4(), ...f })));
    await db.collection('settings').insertOne({
      id: 'main',
      whatsapp: '6287777728727',
      address: 'Jl. Dieng KM 3, Wonosobo, Jawa Tengah 56311',
      hours: 'Setiap Hari 08:00 - 22:00 WIB',
      bank: 'BCA 1234567890 a/n ID Hiking Rent',
      qris: true,
      delivery: true,
      maps: 'https://maps.google.com/?q=Wonosobo',
    });
  }
  // Ensure gallery seed exists even if other collections already seeded
  const gCount = await db.collection('gallery').countDocuments();
  if (gCount === 0) {
    await db.collection('gallery').insertMany(SEED_GALLERY.map((g, i) => ({ id: uuidv4(), order: i, createdAt: new Date(), ...g })));
  }
  // Backfill missing slug / images / pricingTiers on existing products
  const legacy = await db.collection('products').find({ $or: [ { slug: { $exists: false } }, { images: { $exists: false } }, { pricingTiers: { $exists: false } } ] }).toArray();
  for (const p of legacy) {
    const upd = {};
    if (!p.slug) upd.slug = slugify(p.name);
    if (!p.images || p.images.length === 0) upd.images = p.image ? [p.image] : [];
    if (!p.pricingTiers) {
      const base = Number(p.price) || 0;
      upd.pricingTiers = [
        { days: 1, price: base },
        { days: 2, price: Math.round(base * 1.8) },
        { days: 3, price: Math.round(base * 2.2) },
        { days: 4, price: Math.round(base * 3.0) },
        { days: 5, price: Math.round(base * 3.6) },
        { days: 7, price: Math.round(base * 4.8) },
      ];
    }
    if (Object.keys(upd).length) await db.collection('products').updateOne({ id: p.id }, { $set: upd });
  }
}

function stripId(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

function isAdmin(request) {
  const token = request.headers.get('x-admin-token') || '';
  return token === ADMIN_PASSWORD;
}

// Check overlap: (a1 < b2) && (b1 < a2)  -- dates as YYYY-MM-DD strings
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

async function getBookedQtyForRange(db, productId, start, end) {
  const orders = await db.collection('orders').find({ productId, status: { $ne: 'CANCELLED' } }).toArray();
  let booked = 0;
  for (const o of orders) {
    if (o.startDate && o.endDate && overlaps(start, end, o.startDate, o.endDate)) {
      booked += Number(o.qty || 0);
    }
  }
  return booked;
}

async function computeBookedDates(db, productId, product, days = 60) {
  const now = new Date();
  const orders = await db.collection('orders').find({ productId, status: { $ne: 'CANCELLED' } }).toArray();
  const fullBooked = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now); d.setDate(d.getDate() + i);
    const dayStr = d.toISOString().slice(0, 10);
    const nextStr = new Date(d.getTime() + 86400000).toISOString().slice(0, 10);
    let booked = 0;
    for (const o of orders) {
      if (o.startDate && o.endDate && overlaps(dayStr, nextStr, o.startDate, o.endDate)) {
        booked += Number(o.qty || 0);
      }
    }
    if (booked >= (product.stock || 0)) fullBooked.push(dayStr);
  }
  return fullBooked;
}

async function handler(request, { params }) {
  try {
    const db = await getDb();
    await ensureSeeded(db);
    const method = request.method;
    const resolvedParams = await params;
    const pathArr = (resolvedParams?.path) || [];
    const route = pathArr.join('/');
    const url = new URL(request.url);

    if (route === '' && method === 'GET') {
      return NextResponse.json({ ok: true, name: 'ID Hiking Rent API' });
    }

    // ============ PUBLIC ============
    if (route === 'products' && method === 'GET') {
      const q = url.searchParams.get('q') || '';
      const category = url.searchParams.get('category') || '';
      const sort = url.searchParams.get('sort') || 'default';
      const filter = {};
      if (q) filter.name = { $regex: q, $options: 'i' };
      if (category && category !== 'Semua') filter.category = category;
      let cursor = db.collection('products').find(filter);
      if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
      else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });
      else if (sort === 'stock') cursor = cursor.sort({ stock: -1 });
      const products = (await cursor.toArray()).map(stripId);
      return NextResponse.json({ products });
    }

    if (route.startsWith('products/') && pathArr.length === 2 && method === 'GET') {
      const id = pathArr[1];
      // Try id first, fallback to slug
      let product = await db.collection('products').findOne({ id });
      if (!product) product = await db.collection('products').findOne({ slug: id });
      if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const related = (await db.collection('products').find({ category: product.category, id: { $ne: product.id } }).limit(4).toArray()).map(stripId);
      return NextResponse.json({ product: stripId(product), related });
    }

    // GET /api/products/slug/:slug (explicit slug lookup)
    if (route.startsWith('products/slug/') && method === 'GET') {
      const slug = pathArr[2];
      const product = await db.collection('products').findOne({ slug });
      if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const related = (await db.collection('products').find({ category: product.category, id: { $ne: product.id } }).limit(4).toArray()).map(stripId);
      return NextResponse.json({ product: stripId(product), related });
    }

    // GET /api/products/:id/availability?start=&end=
    if (route.startsWith('products/') && pathArr[2] === 'availability' && method === 'GET') {
      const id = pathArr[1];
      const start = url.searchParams.get('start');
      const end = url.searchParams.get('end');
      const product = await db.collection('products').findOne({ id });
      if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 });
      let bookedQty = 0;
      let remaining = product.stock;
      if (start && end) {
        bookedQty = await getBookedQtyForRange(db, id, start, end);
        remaining = Math.max(0, (product.stock || 0) - bookedQty);
      }
      const fullBookedDates = await computeBookedDates(db, id, product, 60);
      return NextResponse.json({
        stock: product.stock,
        bookedQty,
        remaining,
        available: remaining > 0,
        fullBookedDates,
      });
    }

    if (route === 'promos' && method === 'GET') {
      const promos = (await db.collection('promos').find({ active: true }).toArray()).map(stripId);
      return NextResponse.json({ promos });
    }

    if (route === 'reviews' && method === 'GET') {
      const reviews = (await db.collection('reviews').find({}).limit(50).toArray()).map(stripId);
      return NextResponse.json({ reviews });
    }

    if (route === 'packages' && method === 'GET') {
      const packages = (await db.collection('packages').find({}).toArray()).map(stripId);
      return NextResponse.json({ packages });
    }

    if (route === 'faqs' && method === 'GET') {
      const faqs = (await db.collection('faqs').find({}).toArray()).map(stripId);
      return NextResponse.json({ faqs });
    }

    if (route === 'settings' && method === 'GET') {
      const s = await db.collection('settings').findOne({ id: 'main' });
      return NextResponse.json({ settings: stripId(s) });
    }

    if (route === 'gallery' && method === 'GET') {
      const items = (await db.collection('gallery').find({}).sort({ order: 1, createdAt: -1 }).toArray()).map(stripId);
      return NextResponse.json({ gallery: items });
    }

    if (route === 'orders' && method === 'POST') {
      const body = await request.json();
      const order = {
        id: uuidv4(),
        invoiceNo: 'IDH-' + Date.now().toString().slice(-8),
        ...body,
        status: 'PENDING',
        createdAt: new Date(),
      };
      await db.collection('orders').insertOne(order);
      // Save admin notification for dashboard badge
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        type: 'NEW_ORDER',
        orderId: order.id,
        invoiceNo: order.invoiceNo,
        title: `Booking Baru: ${order.productName}`,
        message: `${order.qty} pcs \u00d7 ${order.days} hari = Rp ${(order.total || 0).toLocaleString('id-ID')}`,
        read: false,
        createdAt: new Date(),
      });
      // Optional Fonnte auto WA notification
      const notif = await sendFonnteNotification(order);
      return NextResponse.json({ order: stripId(order), notification: notif });
    }

    // ============ ADMIN ============
    if (route === 'admin/login' && method === 'POST') {
      const body = await request.json();
      if (body.password === ADMIN_PASSWORD) {
        return NextResponse.json({ ok: true, token: ADMIN_PASSWORD });
      }
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // From here, require admin token
    const isProtected = route.startsWith('admin/');
    if (isProtected && !isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (route === 'admin/stats' && method === 'GET') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const [todayOrders, monthOrders, allProducts, activePromos, lowStock, totalOrdersCount] = await Promise.all([
        db.collection('orders').find({ createdAt: { $gte: startOfDay } }).toArray(),
        db.collection('orders').find({ createdAt: { $gte: startOfMonth } }).toArray(),
        db.collection('products').find({}).toArray(),
        db.collection('promos').countDocuments({ active: true }),
        db.collection('products').find({ stock: { $lte: 2 } }).toArray(),
        db.collection('orders').countDocuments({}),
      ]);
      const monthRevenue = monthOrders.reduce((s, o) => s + Number(o.total || 0), 0);
      // top product by number of orders (count)
      const productCounts = {};
      const allOrders = await db.collection('orders').find({}).toArray();
      allOrders.forEach(o => { if (o.productName) productCounts[o.productName] = (productCounts[o.productName] || 0) + Number(o.qty || 1); });
      const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
      return NextResponse.json({
        todayBookings: todayOrders.length,
        monthRevenue,
        topProduct: topProduct ? { name: topProduct[0], count: topProduct[1] } : null,
        activePromos,
        lowStock: lowStock.map(stripId),
        totalCustomers: totalOrdersCount,
        productsCount: allProducts.length,
      });
    }

    // Generic collection CRUD via /admin/{collection} etc.
    const COLLECTIONS = {
      'admin/products': 'products',
      'admin/promos': 'promos',
      'admin/reviews': 'reviews',
      'admin/packages': 'packages',
      'admin/faqs': 'faqs',
      'admin/gallery': 'gallery',
      'admin/orders': 'orders',
    };

    // GET list under admin
    for (const [routeKey, col] of Object.entries(COLLECTIONS)) {
      if (route === routeKey && method === 'GET') {
        const items = (await db.collection(col).find({}).sort({ createdAt: -1 }).toArray()).map(stripId);
        return NextResponse.json({ items });
      }
      if (route === routeKey && method === 'POST') {
        const body = await request.json();
        const doc = { id: uuidv4(), createdAt: new Date(), ...body };
        if (col === 'products') {
          if (!doc.status) doc.status = 'READY';
          if (!doc.slug) doc.slug = slugify(doc.name);
          if (!doc.images && doc.image) doc.images = [doc.image];
          if (!doc.pricingTiers && doc.price) {
            const base = Number(doc.price) || 0;
            doc.pricingTiers = [
              { days: 1, price: base },
              { days: 2, price: Math.round(base * 1.8) },
              { days: 3, price: Math.round(base * 2.2) },
              { days: 5, price: Math.round(base * 3.6) },
            ];
          }
        }
        if (col === 'promos' && doc.active === undefined) doc.active = true;
        await db.collection(col).insertOne(doc);
        return NextResponse.json({ item: stripId(doc) });
      }
      if (route.startsWith(routeKey + '/') && pathArr.length === 3) {
        const id = pathArr[2];
        if (method === 'PUT') {
          const body = await request.json();
          delete body._id;
          delete body.id;
          if (col === 'products') {
            if (body.name && !body.slug) body.slug = slugify(body.name);
            if (body.image && (!body.images || body.images.length === 0)) body.images = [body.image];
          }
          await db.collection(col).updateOne({ id }, { $set: body });
          const updated = await db.collection(col).findOne({ id });
          return NextResponse.json({ item: stripId(updated) });
        }
        if (method === 'DELETE') {
          await db.collection(col).deleteOne({ id });
          return NextResponse.json({ ok: true });
        }
      }
    }

    // Settings
    if (route === 'admin/settings' && method === 'PUT') {
      const body = await request.json();
      delete body._id;
      await db.collection('settings').updateOne({ id: 'main' }, { $set: body }, { upsert: true });
      const s = await db.collection('settings').findOne({ id: 'main' });
      return NextResponse.json({ settings: stripId(s) });
    }

    if (route === 'admin/settings' && method === 'GET') {
      const s = await db.collection('settings').findOne({ id: 'main' });
      return NextResponse.json({ settings: stripId(s) });
    }

    // Notifications
    if (route === 'admin/notifications' && method === 'GET') {
      const items = (await db.collection('notifications').find({}).sort({ createdAt: -1 }).limit(50).toArray()).map(stripId);
      const unread = items.filter(n => !n.read).length;
      return NextResponse.json({ items, unread });
    }
    if (route === 'admin/notifications/read-all' && method === 'POST') {
      await db.collection('notifications').updateMany({ read: false }, { $set: { read: true } });
      return NextResponse.json({ ok: true });
    }
    if (route.startsWith('admin/notifications/') && pathArr.length === 3 && method === 'DELETE') {
      await db.collection('notifications').deleteOne({ id: pathArr[2] });
      return NextResponse.json({ ok: true });
    }

    if (route === 'seed/reset' && method === 'POST') {
      await db.collection('products').deleteMany({});
      await db.collection('promos').deleteMany({});
      await db.collection('reviews').deleteMany({});
      await db.collection('packages').deleteMany({});
      await db.collection('faqs').deleteMany({});
      await db.collection('settings').deleteMany({});
      await db.collection('gallery').deleteMany({});
      await ensureSeeded(db);
      return NextResponse.json({ ok: true, reset: true });
    }

    if (route === 'orders' && method === 'GET') {
      const orders = (await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(50).toArray()).map(stripId);
      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: 'Route not found', route, method }, { status: 404 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const dynamic = 'force-dynamic';
