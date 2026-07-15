'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

import {
  Mountain,
  Star,
  ShoppingBag,
  MessageCircle,
  Search,
  Filter,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Sparkles,
  Award,
  Flame,
  Shield,
  Zap,
  PackageCheck,
  Compass,
  Tent,
  Backpack,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Sunrise,
  Sunset,
  Phone,
  Instagram,
  Facebook,
  Check,
  ChevronUp,
  Calendar as CalendarIcon,
  ImagePlus,
  ZoomIn,
  AlertTriangle
} from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6287777728727';
const rupiah = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');
const fmtDate = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};
const diffDays = (from, to) => {
  if (!from || !to) return 1;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  const d = Math.ceil(ms / 86400000);
  return Math.max(1, d);
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

/* ===================== LOADING SCREEN ===================== */
function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15),transparent_70%)]" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
       <div className="relative flex items-center justify-center">
  <Image
    src="/logopng.png"
    alt="ID Hiking Rent Wonosobo"
    width={320}
    height={160}
    priority
    className="w-[280px] md:w-[320px] h-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.45)]"
  />
</div>
        <h1 className="font-heading text-2xl md:text-4xl mt-6 tracking-widest gold-text">
         Menyediakan Alat Hiking
        </h1>
        <p className="text-[10px] md:text-xs tracking-[0.4em] text-white/60 mt-1">Terlengkap</p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 text-xs md:text-sm text-white/70 max-w-xs text-center"
        >
          Partner Petualanganmu di Gunung Prau, Sindoro, Sumbing, Dieng & Lainnya.
        </motion.p>
        <div className="mt-8 h-[2px] w-40 bg-white/10 overflow-hidden rounded-full">
          <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} className="h-full w-1/2 gold-gradient-bg" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===================== TOP NAV ===================== */
function TopNav({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 return (
  <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'py-2 dark-glass border-b border-white/5' : 'py-3'}`}>
    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6">
      <a href="#top" className="flex items-center">
        <Image
          src="/logopng.png"
          alt="ID Hiking Rent Wonosobo"
          width={170}
          height={60}
          priority
          className="w-[140px] md:w-[170px] h-auto object-contain"
        />
      </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
          <a href="#produk" className="hover:text-gold transition">Rental</a>
          <a href="#paket" className="hover:text-gold transition">Paket</a>
          <a href="#trip" className="hover:text-gold transition">Trip Planner</a>
          <a href="#review" className="hover:text-gold transition">Review</a>
          <a href="#faq" className="hover:text-gold transition">FAQ</a>
        </nav>
        <button onClick={onBook} className="text-xs md:text-sm px-3.5 md:px-5 py-2 md:py-2.5 rounded-full gold-gradient-bg text-black font-semibold gold-glow-sm hover:scale-105 transition">
          Booking
        </button>
      </div>
    </header>
  );
}

/* ===================== HERO ===================== */
function Hero({ onExplore }) {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 pb-14">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1611366376326-5eaf36b54355?w=1920&q=80"
          alt="Sunrise Gunung Prau Wonosobo"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_60%)]" />
        {/* fog layers */}
        <div className="absolute inset-x-0 bottom-1/3 h-40 fog-layer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-1/4 h-32 fog-layer bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ animationDelay: '5s', animationDuration: '25s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-6 w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark-glass mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] md:text-xs tracking-widest uppercase text-white/80">Rental Outdoor #1 di Wonosobo</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="hero-title text-3xl sm:text-5xl md:text-7xl leading-[1.02] tracking-tight uppercase"
        >
          <span className="text-white">SEWA ALAT </span>
          <span className="gold-text">HIKING PREMIUM</span>
          <br />
          <span className="text-white text-2xl sm:text-4xl md:text-5xl">DI WONOSOBO</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-5 md:mt-6 text-sm md:text-lg text-white/70 max-w-xl mx-auto"
        >
          Lengkap, Bersih, dan Siap Menemani Petualanganmu di Gunung Prau, Sindoro, Sumbing & Dieng.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-7 md:mt-9 flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <button onClick={onExplore} className="w-full sm:w-auto group px-6 py-3.5 rounded-full gold-gradient-bg text-black font-semibold flex items-center justify-center gap-2 pulse-gold">
            Lihat Alat Rental <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo ID Hiking Rent, saya ingin bertanya soal sewa alat hiking.')}`} target="_blank" rel="noopener" className="w-full sm:w-auto px-6 py-3.5 rounded-full dark-glass border border-white/15 text-white flex items-center justify-center gap-2 hover:border-gold-30 transition">
            <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp
          </a>
        </motion.div>

        {/* trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: PackageCheck, label: 'Alat Bersih & Terawat' },
            { icon: Zap, label: 'Fast Response' },
            { icon: Truck, label: 'Delivery Tersedia' },
            { icon: Award, label: 'Harga Terjangkau' },
          ].map((b, i) => (
            <div key={i} className="dark-glass rounded-xl px-3 py-2.5 md:py-3 flex items-center gap-2 text-left">
              <b.icon className="w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0" />
              <span className="text-[11px] md:text-sm text-white/80 font-medium">{b.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce text-white/40">
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}

/* ===================== MARQUEE ===================== */
function Marquee() {
  const items = [
    'ALAT BERSIH & TERAWAT', '★', 'DELIVERY GRATIS AREA WONOSOBO', '★',
    'FAST RESPONSE < 5 MENIT', '★', 'HARGA MULAI RP 5.000/HARI', '★',
    'RATING 4.9/5 DARI 1000+ PENYEWA', '★', 'PARTNER PENDAKI SEJAK 2019', '★',
  ];
  return (
    <div className="border-y border-white/5 py-3 bg-black overflow-hidden">
      <div className="flex marquee-track whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className={`mx-6 text-xs md:text-sm tracking-[0.2em] ${t === '★' ? 'text-gold' : 'text-white/60'}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ===================== STATS ===================== */
function Stats() {
  const stats = [
    { value: '1000+', label: 'Penyewa Puas' },
    { value: '4.9/5', label: 'Rating Bintang' },
    { value: '50+', label: 'Peralatan Outdoor' },
    { value: '< 5m', label: 'Fast Response' },
    { value: '24/7', label: 'Delivery Ready' },
  ];
  return (
    <section className="py-12 md:py-16 relative">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="dark-glass rounded-2xl p-4 md:p-6 text-center"
            >
              <div className="font-heading text-2xl md:text-4xl gold-text font-bold">{s.value}</div>
              <div className="text-[10px] md:text-xs tracking-widest uppercase text-white/60 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PROMO SLIDER ===================== */
function PromoSlider({ promos, onBook }) {
  const [idx, setIdx] = useState(0);
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 59 });
  useEffect(() => {
    if (!promos.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % promos.length), 3500);
    return () => clearInterval(t);
  }, [promos]);
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(({ h, m, s }) => {
        let ns = s - 1, nm = m, nh = h;
        if (ns < 0) { ns = 59; nm--; }
        if (nm < 0) { nm = 59; nh--; }
        if (nh < 0) { nh = 23; nm = 59; ns = 59; }
        return { h: nh, m: nm, s: ns };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  if (!promos.length) return null;
  const p = promos[idx];
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-3xl border border-gold-30 gold-glow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className={`relative bg-gradient-to-r ${p.color} p-6 md:p-10`}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 text-[10px] tracking-widest text-white uppercase mb-3">
                    <Flame className="w-3 h-3 text-gold" /> Promo Aktif
                  </div>
                  <h3 className="font-heading text-2xl md:text-4xl text-white font-bold leading-tight">{p.title}</h3>
                  <p className="mt-2 text-white/85 text-sm md:text-base">{p.subtitle}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-4xl md:text-5xl font-bold gold-text">-{p.discount}%</span>
                    <span className="text-xs text-white/70 leading-tight">Hemat<br/>sekarang</span>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                  <div className="text-[10px] tracking-widest text-white/70 uppercase">Berakhir dalam</div>
                  <div className="flex gap-2">
                    {[{v:pad(countdown.h), l:'JAM'}, {v:pad(countdown.m), l:'MNT'}, {v:pad(countdown.s), l:'DTK'}].map((t,i) => (
                      <div key={i} className="dark-glass border-white/10 rounded-xl px-3 py-2 min-w-[52px] text-center">
                        <div className="font-heading text-xl md:text-2xl gold-text font-bold">{t.v}</div>
                        <div className="text-[9px] tracking-widest text-white/60">{t.l}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={onBook} className="mt-1 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 hover:scale-105 transition">
                    Klaim Promo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {promos.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`h-1 rounded-full transition-all ${i === idx ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== PRODUCTS ===================== */
const CATEGORIES = ['Semua', 'Carrier', 'Tenda', 'Sleeping Bag', 'Lampu', 'Kompor', 'Matras', 'Cooking', 'Jaket', 'Sepatu', 'Aksesoris'];

function BadgeChip({ label }) {
  const styles = {
    'BEST SELLER': 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black',
    'FAVORITE': 'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
    'NEW': 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
    'LIMITED STOCK': 'bg-gradient-to-r from-red-600 to-orange-600 text-white',
    'PREMIUM GEAR': 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white',
    'DISKON': 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
  };
  return (
    <span className={`text-[8px] md:text-[10px] font-bold tracking-wider px-2 py-1 rounded-full ${styles[label] || 'bg-white/10 text-white'}`}>
      {label}
    </span>
  );
}

function ProductCard({ p, onClick }) {
  const low = p.stock <= 2;
  return (
    <motion.a
      href={`/produk/${p.slug || p.id}`}
      onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}
      whileHover={{ y: -4 }}
      className="product-card group relative text-left bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl overflow-hidden border border-white/5 block"
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        <img src={(p.images && p.images[0]) || p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        {p.badge && (
          <div className="absolute top-2 left-2"><BadgeChip label={p.badge} /></div>
        )}
        {p.status === 'BOOKED' && (
          <div className="absolute top-2 right-2 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full bg-red-600/90 text-white">BOOKED</div>
        )}
        {p.status !== 'BOOKED' && (
          <div className="absolute top-2 right-2 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-600/90 text-white">READY</div>
        )}
      </div>
      <div className="p-2.5 md:p-3.5">
        <div className="text-[9px] md:text-[10px] tracking-widest text-gold uppercase">{p.category}</div>
        <div className="font-heading text-white text-xs md:text-sm mt-0.5 line-clamp-2 leading-tight uppercase">{p.name}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] md:text-xs text-white/50">
          <span>{p.size}</span>
          <span>•</span>
          <span className={low ? 'text-orange-400' : ''}>Sisa {p.stock}</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="font-heading text-sm md:text-base gold-text leading-none">{rupiah(p.price)}</div>
            <div className="text-[9px] md:text-[10px] text-white/40 mt-0.5">/ hari</div>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 group-hover:gold-gradient-bg group-hover:text-black flex items-center justify-center transition text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function ProductsSection({ products, onOpen }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Semua');
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(12);

  const filtered = useMemo(() => {
    let r = products;
    if (cat !== 'Semua') r = r.filter(p => p.category === cat);
    if (q) r = r.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'price_asc') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'stock') r = [...r].sort((a, b) => b.stock - a.stock);
    return r;
  }, [products, q, cat, sort]);

  return (
    <section id="produk" className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between gap-4 mb-5 md:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
              <Sparkles className="w-3 h-3" /> Rental Terlaris
            </div>
            <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
              Alat <span className="gold-text">Favorit Pendaki</span>
            </h2>
            <p className="text-xs md:text-sm text-white/60 mt-1">Paling banyak disewa minggu ini di Wonosobo</p>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="flex-1 flex items-center gap-2 dark-glass rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-white/50" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari carrier, tenda, sleeping bag..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40 text-white" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="dark-glass rounded-full px-4 py-2.5 text-sm text-white outline-none border border-white/10">
            <option value="default">Urutkan</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="stock">Stok Terbanyak</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 -mx-5 px-5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition ${cat === c ? 'gold-gradient-bg text-black font-semibold' : 'dark-glass text-white/70 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {filtered.slice(0, visible).map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {visible < filtered.length && (
          <div className="mt-6 flex justify-center">
            <button onClick={() => setVisible(v => v + 12)} className="dark-glass px-6 py-3 rounded-full text-sm text-white/80 border border-white/10 hover:border-gold-30 transition">
              Tampilkan Lebih Banyak ({filtered.length - visible})
            </button>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/50 text-sm">Tidak ada alat yang cocok. Coba kata kunci lain.</div>
        )}
      </div>
    </section>
  );
}

/* ===================== PACKAGES ===================== */
function PackagesSection({ packages, onBookText }) {
  return (
    <section id="paket" className="py-12 md:py-20 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <PackageCheck className="w-3 h-3" /> Paket Hemat
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">Paket <span className="gold-text">Bundling</span></h2>
          <p className="text-xs md:text-sm text-white/60 mt-2 max-w-md mx-auto">Lebih hemat dengan paket lengkap. Pilih paket sesuai kebutuhan pendakianmu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {packages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="dark-glass rounded-2xl p-5 md:p-6 flex flex-col hover:border-gold-30 transition relative"
            >
              {p.badge && (
                <div className="absolute -top-2 right-4"><BadgeChip label={p.badge} /></div>
              )}
              <div className="text-[10px] tracking-widest text-gold uppercase">Paket</div>
              <h3 className="font-heading text-xl md:text-2xl text-white font-bold mt-1">{p.name}</h3>
              <p className="text-xs text-white/60 mt-1">{p.subtitle}</p>
              <div className="mt-4 space-y-1.5 flex-1">
                {p.items.map((it, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                    <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/5 flex items-end justify-between">
                <div>
                  <div className="font-heading text-lg md:text-xl gold-text font-bold">{rupiah(p.price)}</div>
                  <div className="text-[10px] text-white/40">/ hari</div>
                </div>
                <button onClick={() => onBookText(`Halo ID Hiking Rent, saya tertarik dengan ${p.name} (${rupiah(p.price)}/hari). Mohon info lebih lanjut.`)} className="px-3.5 py-2 rounded-full gold-gradient-bg text-black text-xs font-semibold">
                  Booking
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== TRIP PLANNER ===================== */
const MOUNTAINS = [
  { name: 'Gunung Prau', elev: '2.590 mdpl', duration: '1-2 hari', level: 'Pemula', needs: ['Carrier 40L', 'Tenda 2P', 'Sleeping Bag', 'Matras', 'Jaket', 'Headlamp', 'Nesting'] },
  { name: 'Gunung Sindoro', elev: '3.153 mdpl', duration: '2 hari', level: 'Menengah', needs: ['Carrier 60L', 'Tenda 2P', 'Sleeping Bag Down', 'Matras', 'Jaket', 'Headlamp', 'Trekking Pole', 'Cooking Set'] },
  { name: 'Gunung Sumbing', elev: '3.371 mdpl', duration: '2 hari', level: 'Menengah', needs: ['Carrier 60L', 'Tenda 2P', 'Sleeping Bag Down', 'Matras', 'Jaket', 'Headlamp', 'Trekking Pole', 'Sepatu Gunung'] },
  { name: 'Gunung Merbabu', elev: '3.145 mdpl', duration: '2 hari', level: 'Menengah', needs: ['Carrier 60L', 'Tenda 2P', 'Sleeping Bag', 'Matras', 'Jaket', 'Headlamp', 'Cooking Set'] },
  { name: 'Gunung Lawu', elev: '3.265 mdpl', duration: '2 hari', level: 'Menengah', needs: ['Carrier 60L', 'Tenda 2P', 'Sleeping Bag Down', 'Matras', 'Jaket', 'Sepatu Gunung', 'Trekking Pole'] },
  { name: 'Dieng Plateau', elev: '2.100 mdpl', duration: '1 hari', level: 'Wisata', needs: ['Daypack', 'Jaket', 'Headlamp', 'Buff'] },
  { name: 'Gunung Bismo', elev: '2.365 mdpl', duration: '1 hari', level: 'Pemula', needs: ['Daypack 40L', 'Jaket', 'Headlamp', 'Trekking Pole'] },
];

function TripPlanner({ products, onBookText }) {
  const [selected, setSelected] = useState(MOUNTAINS[0]);
  const rec = useMemo(() => {
    const map = new Map(products.map(p => [p.name.toLowerCase(), p]));
    const items = [];
    selected.needs.forEach(need => {
      const key = need.toLowerCase();
      let match = products.find(p => key.includes(p.category.toLowerCase()) || p.name.toLowerCase().includes(key.split(' ')[0].toLowerCase()));
      if (!match) match = products.find(p => p.name.toLowerCase().includes(need.split(' ')[0].toLowerCase()));
      if (match && !items.find(i => i.id === match.id)) items.push(match);
    });
    return items;
  }, [selected, products]);
  const total = rec.reduce((sum, p) => sum + p.price, 0);
  return (
    <section id="trip" className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <Compass className="w-3 h-3" /> Trip Planner
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
            Pilih Gunungmu, <span className="gold-text">Kami Siapkan Alatnya</span>
          </h2>
          <p className="text-xs md:text-sm text-white/60 mt-2 max-w-md mx-auto">Rekomendasi peralatan otomatis berdasarkan destinasi pendakianmu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="dark-glass rounded-2xl p-4 space-y-2 h-fit">
            <div className="text-[10px] tracking-widest text-white/50 uppercase px-2 py-1">Destinasi</div>
            {MOUNTAINS.map(m => (
              <button key={m.name} onClick={() => setSelected(m)} className={`w-full text-left p-3 rounded-xl transition ${selected.name === m.name ? 'gold-gradient-bg text-black' : 'hover:bg-white/5 text-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className={`text-[10px] mt-0.5 ${selected.name === m.name ? 'text-black/70' : 'text-white/50'}`}>{m.elev} • {m.duration}</div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${selected.name === m.name ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'}`}>{m.level}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="dark-glass rounded-2xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-heading text-xl md:text-2xl text-white font-bold">{selected.name}</h3>
                  <p className="text-xs text-white/60 mt-1">{selected.elev} • Estimasi {selected.duration} • Level {selected.level}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-widest text-white/50 uppercase">Estimasi</div>
                  <div className="font-heading text-lg md:text-xl gold-text font-bold">{rupiah(total)}<span className="text-xs text-white/50">/hari</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {rec.map(p => (
                  <div key={p.id} className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/5">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-white truncate font-medium">{p.name}</div>
                      <div className="text-[10px] text-gold">{rupiah(p.price)}/hari</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onBookText(`Halo ID Hiking Rent, saya mau naik ${selected.name} (${selected.duration}).\n\nSaya butuh paket:\n${rec.map(p => `• ${p.name} - ${rupiah(p.price)}/hari`).join('\n')}\n\nTotal estimasi: ${rupiah(total)}/hari.\n\nMohon info ketersediaannya, terima kasih!`)}
                className="mt-5 w-full py-3 rounded-full gold-gradient-bg text-black font-semibold flex items-center justify-center gap-2 text-sm gold-glow-sm"
              >
                <MessageCircle className="w-4 h-4" /> Booking Paket Ini
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== WEATHER (STATIC) ===================== */
function Weather() {
  const data = [
    { name: 'Prau', temp: '9°C', rain: '20%', wind: '15 km/h', sunrise: '05:12', sunset: '17:38' },
    { name: 'Sindoro', temp: '6°C', rain: '30%', wind: '25 km/h', sunrise: '05:14', sunset: '17:39' },
    { name: 'Dieng', temp: '11°C', rain: '15%', wind: '10 km/h', sunrise: '05:12', sunset: '17:38' },
    { name: 'Sumbing', temp: '5°C', rain: '35%', wind: '28 km/h', sunrise: '05:14', sunset: '17:40' },
  ];
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <Cloud className="w-3 h-3" /> Cuaca Terkini
          </div>
          <h2 className="font-heading text-2xl md:text-3xl text-white font-bold">Info <span className="gold-text">Cuaca Gunung</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {data.map(d => (
            <div key={d.name} className="dark-glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-white font-semibold">Gunung {d.name}</div>
                  <div className="text-[10px] text-white/50">Hari ini</div>
                </div>
                <Sun className="w-6 h-6 text-gold" />
              </div>
              <div className="font-heading text-3xl gold-text font-bold">{d.temp}</div>
              <div className="mt-3 space-y-1 text-[11px] text-white/70">
                <div className="flex items-center gap-1.5"><Sunrise className="w-3 h-3 text-gold" /> Sunrise {d.sunrise}</div>
                <div className="flex items-center gap-1.5"><Sunset className="w-3 h-3 text-gold" /> Sunset {d.sunset}</div>
                <div className="flex items-center gap-1.5"><CloudRain className="w-3 h-3 text-gold" /> Hujan {d.rain}</div>
                <div className="flex items-center gap-1.5"><Wind className="w-3 h-3 text-gold" /> Angin {d.wind}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== HOW TO RENT ===================== */
function HowToRent() {
  const steps = [
    { n: '01', title: 'Chat WhatsApp', desc: 'Pilih alat & tanggal, kirim ke WhatsApp kami. Kami balas fast response < 5 menit.', icon: MessageCircle },
    { n: '02', title: 'Transfer DP', desc: 'DP 50% via BCA / QRIS untuk mengunci booking. Sisanya bayar saat ambil alat.', icon: CreditCard },
    { n: '03', title: 'Pick Up / Delivery', desc: 'Ambil di toko kami di Wonosobo atau minta diantar (gratis area kota).', icon: Truck },
    { n: '04', title: 'Kembali Tepat Waktu', desc: 'Kembalikan alat sesuai jadwal. Kami cek bareng, selesai, safe trip!', icon: PackageCheck },
  ];
  return (
    <section className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <Zap className="w-3 h-3" /> Cara Sewa
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
            <span className="gold-text">4 Langkah</span> Mudah Sewa Alat
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="dark-glass rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-gold-30 transition"
            >
              <div className="absolute top-4 right-4 font-heading text-4xl md:text-5xl gold-text opacity-30 font-bold">{s.n}</div>
              <s.icon className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-lg text-white font-bold">{s.title}</h3>
              <p className="text-xs md:text-sm text-white/60 mt-2 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== REVIEWS ===================== */
function Reviews({ reviews }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!reviews.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 3000);
    return () => clearInterval(t);
  }, [reviews]);
  if (!reviews.length) return null;
  return (
    <section id="review" className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <Star className="w-3 h-3" /> Testimoni
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
            Kata <span className="gold-text">Pendaki</span> Tentang Kami
          </h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="dark-glass rounded-2xl p-6 md:p-10 text-center"
            >
              <div className="flex justify-center mb-4">
                {[...Array(reviews[idx].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-current" />
                ))}
              </div>
              <p className="text-base md:text-lg text-white/85 italic leading-relaxed">"{reviews[idx].review}"</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <img src={reviews[idx].avatar} alt={reviews[idx].name} className="w-11 h-11 rounded-full border-2 border-gold" />
                <div className="text-left">
                  <div className="text-sm text-white font-semibold">{reviews[idx].name}</div>
                  <div className="text-[10px] text-white/50">Pendaki Terverifikasi</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-5 flex justify-center gap-1.5">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-gold' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== STORE INFO ===================== */
function StoreInfo({ settings }) {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="dark-glass rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31667.34!2d109.9!3d-7.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sWonosobo!5e0!3m2!1sen!2sid!4v1"
              width="100%" height="100%" style={{ minHeight: 340, border: 0, filter: 'invert(0.92) hue-rotate(180deg)' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="ID Hiking Rent Location"
            />
          </div>
          <div className="dark-glass rounded-2xl p-5 md:p-7">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
              <MapPin className="w-3 h-3" /> Lokasi Toko
            </div>
            <h3 className="font-heading text-xl md:text-2xl text-white font-bold">Kunjungi Toko Kami</h3>
            <div className="mt-5 space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-white/80">{settings?.address || 'Wonosobo, Jawa Tengah'}</div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-white/80">{settings?.hours || 'Setiap Hari 08:00 - 22:00 WIB'}</div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-white/80">+62 877 7772 8727 (Fast Response)</div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-white/80">{settings?.bank || 'BCA / QRIS / Cash on the Spot'}</div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-white/80">Delivery gratis area Wonosobo kota</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['QRIS', 'Transfer Bank', 'Cash', 'Delivery', 'Pick Up'].map(t => (
                <span key={t} className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== FAQ ===================== */
function FAQSection({ faqs }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <Sparkles className="w-3 h-3" /> Bantuan
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
            Pertanyaan <span className="gold-text">Sering Ditanya</span>
          </h2>
        </div>
        <div className="space-y-2.5">
          {faqs.map((f, i) => (
            <div key={f.id} className={`dark-glass rounded-2xl overflow-hidden transition ${open === i ? 'border-gold-30' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4">
                <span className="text-sm md:text-base text-white font-medium">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-gold flex-shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 text-xs md:text-sm text-white/70 leading-relaxed">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA ===================== */
function CTA({ onBook }) {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-3xl border border-gold-30 gold-glow-sm">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1519614218660-ea0a24a43b4c?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/90" />
          </div>
          <div className="relative p-8 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-3">
              <Mountain className="w-3 h-3" /> Ready to Adventure
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-white font-bold leading-tight">
              SIAP MENDAKI <span className="gold-text">GUNUNG?</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/70 max-w-xl mx-auto">
              Booking sekarang dan nikmati promo spesial minggu ini. Alat terbatas, cepat sebelum kehabisan!
            </p>
            <button onClick={onBook} className="mt-7 px-8 py-4 rounded-full gold-gradient-bg text-black font-bold text-sm md:text-base flex items-center gap-2 mx-auto pulse-gold">
              BOOKING SEKARANG <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
function Footer() {
  return (
    <footer className="pt-14 pb-24 md:pb-14 border-t border-white/5 bg-black/50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logopng.png"
                alt="ID Hiking Rent Wonosobo"
                width={360}
                height={140}
                className="w-[180px] h-auto object-contain"
                priority
              />
            </div>
                  
            <p className="text-xs md:text-sm text-white/60 max-w-sm leading-relaxed">
              Rental alat hiking & camping premium di Wonosobo. Melayani pendaki menuju Gunung Prau, Sindoro, Sumbing, Bismo & Dieng Plateau sejak 2019.
            </p>
            <div className="mt-4 flex gap-2">
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener" className="w-9 h-9 rounded-full dark-glass flex items-center justify-center hover:border-gold-30 transition">
                <MessageCircle className="w-4 h-4 text-gold" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-full dark-glass flex items-center justify-center hover:border-gold-30 transition">
                <Instagram className="w-4 h-4 text-gold" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-full dark-glass flex items-center justify-center hover:border-gold-30 transition">
                <Facebook className="w-4 h-4 text-gold" />
              </a>
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-white/50 uppercase mb-3">Destinasi</div>
            <ul className="space-y-1.5 text-xs md:text-sm text-white/70">
              <li>Gunung Prau</li>
              <li>Gunung Sindoro</li>
              <li>Gunung Sumbing</li>
              <li>Gunung Bismo</li>
              <li>Dieng Plateau</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-white/50 uppercase mb-3">Layanan</div>
            <ul className="space-y-1.5 text-xs md:text-sm text-white/70">
              <li>Sewa Alat Hiking</li>
              <li>Rental Tenda</li>
              <li>Rental Carrier</li>
              <li>Sewa Sleeping Bag</li>
              <li>Delivery Wonosobo</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
          <div>© 2025 ID Hiking Rent Wonosobo. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#faq" className="hover:text-gold transition">FAQ</a>
            <a href="#terms" className="hover:text-gold transition">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===================== GALLERY + LIGHTBOX ===================== */
function Gallery({ items }) {
  const [zoom, setZoom] = useState(null);
  if (!items?.length) return null;
  return (
    <section id="galeri" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
            <ImagePlus className="w-3 h-3" /> Galeri
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-white font-bold">
            <span className="gold-text">Momen</span> Pendakian
          </h2>
          <p className="text-xs md:text-sm text-white/60 mt-2 max-w-md mx-auto">Foto-foto summit, camping & alat rental kami. Nikmati momen bersama ID Hiking Rent.</p>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 space-y-2 md:space-y-3">
          {items.map((g, i) => (
            <motion.button
              key={g.id}
              onClick={() => setZoom(g)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 8) * 0.06 }}
              viewport={{ once: true }}
              className={`relative w-full block break-inside-avoid overflow-hidden rounded-xl md:rounded-2xl group ${i % 3 === 0 ? 'aspect-[3/4]' : i % 4 === 0 ? 'aspect-[4/3]' : 'aspect-square'}`}
            >
              <img src={g.url} alt={g.caption || 'Gallery'} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition" />
              <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
                <div className="text-[10px] md:text-xs text-white font-medium text-left line-clamp-1">{g.caption}</div>
                <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center backdrop-blur">
                  <ZoomIn className="w-3 h-3 text-gold" />
                </div>
              </div>
              {g.category && (
                <div className="absolute top-2 left-2 text-[8px] px-2 py-0.5 rounded-full bg-black/60 text-gold uppercase tracking-widest backdrop-blur">{g.category}</div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4"
          >
            <button onClick={() => setZoom(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 z-10">
              <X className="w-5 h-5" />
            </button>
            <motion.img
              key={zoom.id}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              src={zoom.url}
              alt={zoom.caption}
              className="max-w-full max-h-[85svh] object-contain rounded-xl"
            />
            {zoom.caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 dark-glass rounded-full px-5 py-2.5 text-sm text-white">
                {zoom.caption}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ===================== FLOATING WA ===================== */
function FloatingWA() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo ID Hiking Rent, saya ingin sewa alat hiking.')}`}
      target="_blank" rel="noopener"
      className="fixed bottom-5 right-5 z-40 group"
      aria-label="Chat WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-emerald-500 blur-xl opacity-40 group-hover:opacity-60 transition" />
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl hover:scale-110 transition float-anim">
        <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor">
          <path d="M20.52 3.48A11.86 11.86 0 0012.05 0C5.49 0 .16 5.33.16 11.89c0 2.09.55 4.15 1.59 5.96L0 24l6.31-1.66a11.86 11.86 0 005.73 1.46h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.18-1.24-6.16-3.41-8.43zM12.06 21.8h-.01a9.85 9.85 0 01-5.03-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.83 9.83 0 01-1.52-5.25c0-5.46 4.44-9.89 9.9-9.89 2.65 0 5.13 1.03 7 2.9a9.79 9.79 0 012.9 6.99c0 5.46-4.44 9.9-9.89 9.9zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9.03 9.03 0 01-1.66-2.06c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.06.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35z" />
        </svg>
      </div>
    </a>
  );
}

/* ===================== BOOKING SHEET ===================== */
function BookingSheet({ product, onClose, onSubmit, allProducts }) {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(addDaysISO(2));
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState(1); // 1 dates, 2 summary
  const [availability, setAvailability] = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const days = diffDays(startDate, endDate);
  const total = (product?.price || 0) * qty * days;

  // Load availability whenever product or dates change
  useEffect(() => {
    if (!product) return;
    setLoadingAvail(true);
    fetch(`/api/products/${product.id}/availability?start=${startDate}&end=${endDate}`)
      .then(r => r.json())
      .then(d => setAvailability(d))
      .catch(() => setAvailability(null))
      .finally(() => setLoadingAvail(false));
  }, [product, startDate, endDate]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  }, [product, allProducts]);

  const frequentlyRented = useMemo(() => {
    if (!product) return [];
    // Basic pairing logic based on category
    const pairings = {
      'Carrier': ['Sleeping Bag', 'Matras'],
      'Tenda': ['Matras', 'Sleeping Bag'],
      'Sleeping Bag': ['Matras', 'Carrier'],
      'Kompor': ['Cooking'],
      'Cooking': ['Kompor'],
    };
    const targetCats = pairings[product.category] || ['Aksesoris'];
    return allProducts.filter(p => targetCats.includes(p.category)).slice(0, 3);
  }, [product, allProducts]);

  if (!product) return null;

  const handleBook = () => {
    const message = `Halo ID Hiking Rent.\n\nSaya ingin menyewa:\n\nNama Barang : ${product.name}\nJumlah : ${qty} pcs\nTanggal Sewa : ${fmtDate(startDate)}\nTanggal Pengembalian : ${fmtDate(endDate)}\nDurasi : ${days} hari\nTotal Harga : ${rupiah(total)}\n\nTerima kasih.`;
    onSubmit({ productId: product.id, productName: product.name, qty, startDate, endDate, days, total, message });
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      >
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30 }}
          className="w-full max-w-2xl max-h-[92svh] overflow-y-auto bg-[#0a0a0a] border-t border-x border-gold-30 md:border md:rounded-3xl rounded-t-3xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                <X className="w-4 h-4" />
              </button>
              <div>
                <div className="text-[10px] tracking-widest text-gold uppercase">Detail Booking</div>
                <div className="text-sm text-white font-semibold">{step === 1 ? 'Pilih Tanggal & Jumlah' : 'Ringkasan Booking'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2].map(n => (
                <div key={n} className={`h-1.5 rounded-full transition-all ${step >= n ? 'w-6 bg-gold' : 'w-3 bg-white/20'}`} />
              ))}
            </div>
          </div>

          {/* Product summary */}
          <div className="p-5 border-b border-white/5">
            <div className="flex gap-3">
              <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover border border-white/10" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-widest text-gold uppercase">{product.category}</div>
                <h3 className="font-heading text-lg text-white font-bold leading-tight">{product.name}</h3>
                <div className="text-xs text-white/50 mt-1">Ukuran: {product.size} • Sisa {product.stock}</div>
                <div className="mt-1.5 font-heading text-lg gold-text font-bold">{rupiah(product.price)}<span className="text-xs text-white/50">/hari</span></div>
              </div>
            </div>
            {product.description && (
              <p className="mt-3 text-xs text-white/60 leading-relaxed">{product.description}</p>
            )}
            {product.included && product.included.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.included.map((it, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">✓ {it}</span>
                ))}
              </div>
            )}
          </div>

          {step === 1 && (
            <>
              {/* Dates */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] tracking-widest text-white/50 uppercase">Tanggal Sewa</label>
                  <input type="date" value={startDate} min={todayISO()} onChange={e => { setStartDate(e.target.value); if (new Date(e.target.value) >= new Date(endDate)) setEndDate(e.target.value); }} className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-white/50 uppercase">Tanggal Kembali</label>
                  <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold" />
                </div>

                {/* Qty */}
                <div>
                  <label className="text-[10px] tracking-widest text-white/50 uppercase">Jumlah</label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold transition">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center font-heading text-2xl gold-text font-bold">{qty}</div>
                    <button onClick={() => setQty(q => Math.min(availability?.remaining ?? product.stock, q + 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 text-center">
                    {availability ? `${availability.remaining} tersedia dari ${product.stock} unit` : `Maks ${product.stock} pcs tersedia`}
                  </div>
                </div>

                {/* Availability */}
                {availability && (
                  <div className={`rounded-2xl p-3.5 border ${availability.remaining <= 0 ? 'bg-red-500/10 border-red-500/30 text-red-200' : availability.remaining < 3 ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'} text-xs flex items-start gap-2`}>
                    {availability.remaining <= 0 ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      {availability.remaining <= 0 ? (
                        <><b>FULL BOOKED.</b> Stok sudah habis untuk tanggal ini. Silakan pilih tanggal lain atau hubungi kami untuk alternatif.</>
                      ) : (
                        <><b>{availability.remaining} unit tersedia</b> pada tanggal {fmtDate(startDate)} — {fmtDate(endDate)}{availability.bookedQty > 0 ? ` (${availability.bookedQty} sudah dibooking)` : ''}.</>
                      )}
                    </div>
                  </div>
                )}

                {/* Total live */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-800/5 border border-gold-30 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>{rupiah(product.price)} × {qty} × {days} hari</span>
                    <span>{rupiah(total)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-white font-semibold">Total Harga</span>
                    <span className="font-heading text-2xl gold-text font-bold">{rupiah(total)}</span>
                  </div>
                </div>

                {/* Recommendations */}
                {frequentlyRented.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span className="text-[11px] tracking-widest text-gold uppercase">Sering Disewa Bersama</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {frequentlyRented.map(rp => (
                        <div key={rp.id} className="bg-white/5 rounded-xl p-2 border border-white/5">
                          <img src={rp.image} alt={rp.name} className="w-full aspect-square object-cover rounded-lg" />
                          <div className="text-[10px] text-white/80 mt-1.5 line-clamp-1">{rp.name}</div>
                          <div className="text-[10px] text-gold">{rupiah(rp.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky footer */}
              <div className="sticky bottom-0 sticky-cta p-4 border-t border-white/5">
                <button
                  onClick={() => setStep(2)}
                  disabled={availability && availability.remaining <= 0}
                  className="w-full py-3.5 rounded-full gold-gradient-bg text-black font-semibold flex items-center justify-center gap-2 gold-glow-sm disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {availability && availability.remaining <= 0 ? 'Tanggal Full Booked' : (<>Lanjut ke Ringkasan <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="p-5 space-y-4">
                <div className="dark-glass rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Barang</span>
                    <span className="text-white font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Jumlah</span>
                    <span className="text-white font-medium">{qty} pcs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tanggal Sewa</span>
                    <span className="text-white font-medium">{fmtDate(startDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tanggal Kembali</span>
                    <span className="text-white font-medium">{fmtDate(endDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Durasi</span>
                    <span className="text-white font-medium">{days} hari</span>
                  </div>
                  <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="font-heading text-2xl gold-text font-bold">{rupiah(total)}</span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200 flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <b>Aman & Transparan.</b> Tidak ada biaya tersembunyi. Klik tombol di bawah untuk mengirim booking ini ke WhatsApp kami. Fast response &lt; 5 menit!
                  </div>
                </div>

                {related.length > 0 && (
                  <div>
                    <div className="text-[11px] tracking-widest text-gold uppercase mb-2">Kamu Mungkin Butuh</div>
                    <div className="grid grid-cols-3 gap-2">
                      {related.map(rp => (
                        <div key={rp.id} className="bg-white/5 rounded-xl p-2">
                          <img src={rp.image} alt={rp.name} className="w-full aspect-square object-cover rounded-lg" />
                          <div className="text-[10px] text-white/80 mt-1.5 line-clamp-1">{rp.name}</div>
                          <div className="text-[10px] text-gold">{rupiah(rp.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 sticky-cta p-4 border-t border-white/5 space-y-2">
                <button onClick={handleBook} className="w-full py-3.5 rounded-full bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 gold-glow-sm hover:bg-emerald-400 transition">
                  <MessageCircle className="w-4 h-4" /> Kirim Booking ke WhatsApp
                </button>
                <button onClick={() => setStep(1)} className="w-full py-2.5 text-xs text-white/60 hover:text-white transition">
                  ← Kembali edit
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [bookingProduct, setBookingProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, pr, r, pk, f, s, g] = await Promise.all([
          fetch('/api/products').then(x => x.json()),
          fetch('/api/promos').then(x => x.json()),
          fetch('/api/reviews').then(x => x.json()),
          fetch('/api/packages').then(x => x.json()),
          fetch('/api/faqs').then(x => x.json()),
          fetch('/api/settings').then(x => x.json()),
          fetch('/api/gallery').then(x => x.json()),
        ]);
        setProducts(p.products || []);
        setPromos(pr.promos || []);
        setReviews(r.reviews || []);
        setPackages(pk.packages || []);
        setFaqs(f.faqs || []);
        setSettings(s.settings || null);
        setGallery(g.gallery || []);
      } catch (e) {
        console.error('Load error', e);
      }
    })();
  }, []);

  const openBooking = (product) => {
    if (product) setBookingProduct(product);
    else {
      // pick a best-seller default
      const bs = products.find(p => p.badge === 'BEST SELLER') || products[0];
      if (bs) setBookingProduct(bs);
    }
  };

  const scrollToProducts = () => {
    document.getElementById('produk')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitOrder = async (data) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      toast.success('Booking dikirim ke WhatsApp!');
    } catch (e) {
      // do not block WA redirect
    }
  };

  const openWATextOnly = (text) => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <TopNav onBook={() => openBooking()} />

      <main>
        <Hero onExplore={scrollToProducts} />
        <Marquee />
        <Stats />
        <PromoSlider promos={promos} onBook={() => openBooking()} />
        <ProductsSection products={products} onOpen={setBookingProduct} />
        <PackagesSection packages={packages} onBookText={openWATextOnly} />
        <TripPlanner products={products} onBookText={openWATextOnly} />
        <Weather />
        <HowToRent />
        <Reviews reviews={reviews} />
        <Gallery items={gallery} />
        <StoreInfo settings={settings} />
        <FAQSection faqs={faqs} />
        <CTA onBook={() => openBooking()} />
        <Footer />
      </main>

      <FloatingWA />

      <AnimatePresence>
        {bookingProduct && (
          <BookingSheet
            product={bookingProduct}
            onClose={() => setBookingProduct(null)}
            onSubmit={submitOrder}
            allProducts={products}
          />
        )}
      </AnimatePresence>
    </>
  );
}
