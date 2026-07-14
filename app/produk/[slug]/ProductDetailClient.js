'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Star, Check,
  Shield, Truck, Zap, PackageCheck, X, ZoomIn, Plus, Minus, Calendar as CalIcon,
  Mountain, AlertTriangle, ShoppingBag
} from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6287777728727';
const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const diffDays = (from, to) => {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.ceil(ms / 86400000));
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

/* Duration Pricing Calculator */
function computeTotal(product, days, qty) {
  if (product.pricingTiers && product.pricingTiers.length > 0) {
    const sorted = [...product.pricingTiers].sort((a, b) => a.days - b.days);
    // Find highest tier <= days
    let match = sorted[0];
    for (const t of sorted) if (t.days <= days) match = t;
    // If asked for more days than highest tier, extend using per-day cost of highest
    if (days > sorted[sorted.length - 1].days) {
      const top = sorted[sorted.length - 1];
      const extraDays = days - top.days;
      const perDay = product.price || Math.round(top.price / top.days);
      return (top.price + extraDays * perDay) * qty;
    }
    return match.price * qty;
  }
  return (product.price || 0) * days * qty;
}

/* IMAGE SLIDER */
function ImageSlider({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const imgs = images && images.length ? images : ['/icon.svg'];
  const next = () => setIdx(i => (i + 1) % imgs.length);
  const prev = () => setIdx(i => (i - 1 + imgs.length) % imgs.length);
  return (
    <>
      <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-black border border-white/5">
        <img src={imgs[idx]} alt={alt} loading="lazy" className="w-full h-full object-cover zoom-img" />
        <button onClick={() => setZoom(true)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-black/80 transition">
          <ZoomIn className="w-4 h-4 text-gold" />
        </button>
        {imgs.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-black/80"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-black/80"><ChevronRight className="w-5 h-5" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {imgs.slice(0, 5).map((im, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`aspect-square rounded-lg overflow-hidden border-2 ${i === idx ? 'border-gold' : 'border-white/10 hover:border-white/30'}`}>
              <img src={im} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setZoom(false)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 z-10">
              <X className="w-5 h-5" />
            </button>
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} src={imgs[idx]} alt={alt} className="max-w-full max-h-[85svh] object-contain rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* VISUAL AVAILABILITY CALENDAR */
function AvailabilityCalendar({ productId, fullBookedDates, selectedStart, selectedEnd, onPickStart, onPickEnd, product }) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const firstDay = new Date(monthDate);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon-first
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isFullBooked = (d) => {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
    const iso = dt.toISOString().slice(0, 10);
    return fullBookedDates?.includes(iso);
  };
  const isPast = (d) => {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
    dt.setHours(23, 59, 59);
    return dt < today;
  };
  const inSelectedRange = (d) => {
    if (!selectedStart || !selectedEnd) return false;
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d).toISOString().slice(0, 10);
    return dt >= selectedStart && dt <= selectedEnd;
  };
  const isSelectedStart = (d) => {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d).toISOString().slice(0, 10);
    return dt === selectedStart;
  };
  const isSelectedEnd = (d) => {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d).toISOString().slice(0, 10);
    return dt === selectedEnd;
  };

  const handleClick = (d) => {
    if (isPast(d) || isFullBooked(d)) return;
    const iso = new Date(monthDate.getFullYear(), monthDate.getMonth(), d).toISOString().slice(0, 10);
    if (!selectedStart || (selectedStart && selectedEnd)) {
      onPickStart(iso);
      onPickEnd('');
    } else if (iso < selectedStart) {
      onPickStart(iso);
    } else {
      onPickEnd(iso);
    }
  };

  return (
    <div className="dark-glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setMonthOffset(m => m - 1)} disabled={monthOffset <= 0} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="font-heading text-sm uppercase text-white">{monthName}</div>
        <button onClick={() => setMonthOffset(m => m + 1)} disabled={monthOffset >= 2} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] tracking-widest text-white/40 uppercase mb-1 text-center">
        {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;
          const full = isFullBooked(d);
          const past = isPast(d);
          const start = isSelectedStart(d);
          const end = isSelectedEnd(d);
          const inRange = inSelectedRange(d);
          const disabled = full || past;
          return (
            <button
              key={i}
              onClick={() => handleClick(d)}
              disabled={disabled}
              className={`aspect-square rounded-lg text-xs font-medium transition relative ${
                disabled ? 'text-white/20 cursor-not-allowed' :
                start || end ? 'gold-gradient-bg text-black font-bold ring-2 ring-yellow-400/50' :
                inRange ? 'bg-yellow-500/25 text-white' :
                'text-white hover:bg-white/10'
              } ${full ? 'bg-red-500/15 line-through' : ''}`}
              title={full ? 'FULL BOOKED' : ''}
            >
              {d}
              {full && <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-red-500" />}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-around text-[10px] text-white/60">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Tersedia</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Terpilih</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Full Booked</div>
      </div>
    </div>
  );
}

/* PRICING TIER DISPLAY */
function PricingTiers({ product, selected }) {
  if (!product.pricingTiers?.length) return null;
  const sorted = [...product.pricingTiers].sort((a, b) => a.days - b.days);
  return (
    <div>
      <div className="text-[10px] tracking-widest text-gold uppercase mb-2">Harga Berdasarkan Durasi</div>
      <div className="grid grid-cols-3 gap-2">
        {sorted.map(t => (
          <div key={t.days} className={`rounded-xl p-2.5 border text-center transition ${selected === t.days ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5'}`}>
            <div className="text-[11px] text-white/60">{t.days} Hari</div>
            <div className="font-heading text-sm gold-text mt-1">{rupiah(t.price)}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-white/40 mt-2 text-center">Durasi lebih panjang otomatis dihitung + {rupiah(product.price)}/hari tambahan</div>
    </div>
  );
}

/* MAIN CLIENT */
export default function ProductDetailClient({ product, related }) {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(addDaysISO(2));
  const [qty, setQty] = useState(1);
  const [availability, setAvailability] = useState(null);
  const days = diffDays(startDate, endDate);
  const total = useMemo(() => computeTotal(product, days, qty), [product, days, qty]);

  useEffect(() => {
    fetch(`/api/products/${product.id}/availability?start=${startDate}&end=${endDate}`)
      .then(r => r.json())
      .then(setAvailability)
      .catch(() => {});
  }, [product.id, startDate, endDate]);

  const submitBooking = async () => {
    if (availability?.remaining <= 0) {
      toast.error('Tanggal ini sudah full booked');
      return;
    }
    const message = `Halo ID Hiking Rent.\n\nSaya ingin menyewa:\n\nNama Barang : ${product.name}\nJumlah : ${qty} pcs\nTanggal Sewa : ${fmtDate(startDate)}\nTanggal Pengembalian : ${fmtDate(endDate)}\nDurasi : ${days} hari\nTotal Harga : ${rupiah(total)}\n\nTerima kasih.`;
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, productName: product.name, qty, startDate, endDate, days, total, message }),
      });
    } catch (e) {}
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Nav */}
      <header className="sticky top-0 z-30 dark-glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white hover:text-gold transition">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </a>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800 flex items-center justify-center">
            <Mountain className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-xs gold-text uppercase">ID Hiking Rent</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-widest text-white/50 uppercase mb-4">
          <a href="/" className="hover:text-gold">Beranda</a> <span className="mx-1">/</span>
          <a href="/#produk" className="hover:text-gold">{product.category}</a> <span className="mx-1">/</span>
          <span className="text-gold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Left: Images */}
          <div>
            <ImageSlider images={product.images && product.images.length ? product.images : [product.image]} alt={product.name} />
          </div>

          {/* Right: Info */}
          <div>
            {product.badge && (
              <div className="inline-block text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full gold-gradient-bg text-black mb-2">{product.badge}</div>
            )}
            <div className="text-[10px] tracking-widest text-gold uppercase">{product.category}</div>
            <h1 className="font-heading text-3xl md:text-4xl text-white uppercase mt-1 leading-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
              <span>Ukuran: {product.size}</span>
              <span>•</span>
              <span>Stok: {product.stock}</span>
              <span>•</span>
              <div className="flex items-center gap-0.5 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                <span className="text-white/60 ml-1">(4.9)</span>
              </div>
            </div>

            <div className="mt-4 font-heading text-3xl md:text-4xl gold-text">
              {rupiah(product.price)}<span className="text-sm text-white/50 font-normal">/hari</span>
            </div>

            {product.description && (
              <p className="mt-4 text-sm text-white/70 leading-relaxed">{product.description}</p>
            )}

            {product.included && product.included.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] tracking-widest text-gold uppercase mb-2">Termasuk dalam Paket</div>
                <div className="flex flex-wrap gap-1.5">
                  {product.included.map((it, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-gold" /> {it}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-5 dark-glass rounded-2xl p-4">
                <div className="text-[10px] tracking-widest text-gold uppercase mb-3">Spesifikasi</div>
                <div className="space-y-1.5 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/60 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                { icon: PackageCheck, label: 'Bersih & Terawat' },
                { icon: Zap, label: 'Fast Response' },
                { icon: Truck, label: 'Delivery Ready' },
                { icon: Shield, label: 'Alat Original' },
              ].map((b, i) => (
                <div key={i} className="dark-glass rounded-xl px-3 py-2 flex items-center gap-2">
                  <b.icon className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-[11px] text-white/80">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <section className="mt-10 md:mt-14">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gold uppercase mb-2">
              <CalIcon className="w-3 h-3" /> Booking
            </div>
            <h2 className="font-heading section-title text-2xl md:text-3xl text-white uppercase">
              Pilih <span className="gold-text">Tanggal</span> Sewa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <AvailabilityCalendar
                productId={product.id}
                fullBookedDates={availability?.fullBookedDates || []}
                selectedStart={startDate}
                selectedEnd={endDate}
                onPickStart={setStartDate}
                onPickEnd={setEndDate}
                product={product}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="dark-glass rounded-xl p-2.5">
                  <div className="text-[9px] tracking-widest text-white/50 uppercase">Sewa</div>
                  <div className="text-white font-medium mt-0.5">{fmtDate(startDate)}</div>
                </div>
                <div className="dark-glass rounded-xl p-2.5">
                  <div className="text-[9px] tracking-widest text-white/50 uppercase">Kembali</div>
                  <div className="text-white font-medium mt-0.5">{endDate ? fmtDate(endDate) : '-'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <PricingTiers product={product} selected={days} />

              <div>
                <div className="text-[10px] tracking-widest text-white/50 uppercase">Jumlah</div>
                <div className="mt-1.5 flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center font-heading text-2xl gold-text">{qty}</div>
                  <button onClick={() => setQty(q => Math.min(availability?.remaining ?? product.stock, q + 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-gold">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {availability && (
                <div className={`rounded-2xl p-3.5 border text-xs flex items-start gap-2 ${availability.remaining <= 0 ? 'bg-red-500/10 border-red-500/30 text-red-200' : availability.remaining < 3 ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'}`}>
                  {availability.remaining <= 0 ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  <div>
                    {availability.remaining <= 0 ? <><b>FULL BOOKED.</b> Silakan pilih tanggal lain.</> : <><b>{availability.remaining} unit tersedia</b> untuk tanggal ini.</>}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-800/5 border border-gold-30 rounded-2xl p-4">
                <div className="flex justify-between text-xs text-white/70">
                  <span>{days} hari × {qty} pcs</span>
                  <span>Berdasarkan tarif durasi</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-white font-semibold">Total</span>
                  <span className="font-heading text-2xl md:text-3xl gold-text">{rupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={submitBooking}
                disabled={availability?.remaining <= 0}
                className="w-full py-4 rounded-full gold-gradient-bg text-black font-heading uppercase text-sm flex items-center justify-center gap-2 gold-glow-sm disabled:opacity-50 disabled:cursor-not-allowed pulse-gold"
              >
                <MessageCircle className="w-4 h-4" /> Booking via WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* Related */}
        {related?.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-heading section-title text-xl md:text-2xl text-white uppercase mb-4">Produk <span className="gold-text">Serupa</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {related.map(p => (
                <a href={`/produk/${p.slug || p.id}`} key={p.id} className="product-card group text-left bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl overflow-hidden border border-white/5">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={(p.images && p.images[0]) || p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="p-2.5">
                    <div className="text-[9px] tracking-widest text-gold uppercase">{p.category}</div>
                    <div className="text-xs text-white font-medium mt-0.5 line-clamp-2">{p.name}</div>
                    <div className="font-heading text-sm gold-text mt-1">{rupiah(p.price)}<span className="text-[9px] text-white/40">/hari</span></div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 sticky-cta p-3 border-t border-white/10 md:hidden z-30">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] text-white/50">Total</div>
            <div className="font-heading text-lg gold-text">{rupiah(total)}</div>
          </div>
          <button onClick={submitBooking} disabled={availability?.remaining <= 0} className="flex-1 py-3 rounded-full gold-gradient-bg text-black font-heading uppercase text-xs disabled:opacity-50">
            Booking WA
          </button>
        </div>
      </div>
    </div>
  );
}
