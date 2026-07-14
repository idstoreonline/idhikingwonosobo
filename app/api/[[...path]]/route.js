import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'id_hiking_rent';

let cachedClient = null;
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
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

async function ensureSeeded(db) {
  const count = await db.collection('products').countDocuments();
  if (count > 0) return;
  await db.collection('products').insertMany(SEED_PRODUCTS.map(p => ({ id: uuidv4(), status: 'READY', createdAt: new Date(), ...p })));
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

function stripId(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
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

    if (route.startsWith('products/') && method === 'GET') {
      const id = pathArr[1];
      const product = await db.collection('products').findOne({ id });
      if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const related = (await db.collection('products').find({ category: product.category, id: { $ne: id } }).limit(4).toArray()).map(stripId);
      return NextResponse.json({ product: stripId(product), related });
    }

    if (route === 'promos' && method === 'GET') {
      const promos = (await db.collection('promos').find({ active: true }).toArray()).map(stripId);
      return NextResponse.json({ promos });
    }

    if (route === 'reviews' && method === 'GET') {
      const reviews = (await db.collection('reviews').find({}).limit(20).toArray()).map(stripId);
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
      return NextResponse.json({ order: stripId(order) });
    }

    if (route === 'orders' && method === 'GET') {
      const orders = (await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(50).toArray()).map(stripId);
      return NextResponse.json({ orders });
    }

    if (route === 'seed/reset' && method === 'POST') {
      await db.collection('products').deleteMany({});
      await db.collection('promos').deleteMany({});
      await db.collection('reviews').deleteMany({});
      await db.collection('packages').deleteMany({});
      await db.collection('faqs').deleteMany({});
      await db.collection('settings').deleteMany({});
      await ensureSeeded(db);
      return NextResponse.json({ ok: true, reset: true });
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
