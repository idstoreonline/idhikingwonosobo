'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Mountain, LayoutDashboard, ShoppingBag, TicketPercent, Star, MessageSquare,
  PackageCheck, Image as ImageIcon, Settings as SettingsIcon, LogOut, Plus,
  Edit, Trash2, Save, X, Search, Upload, Copy, FileText, TrendingUp, Users,
  Package, AlertTriangle, DollarSign, Eye, Check, ChevronDown, Filter, ClipboardList,
} from 'lucide-react';

const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

async function api(path, opts = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('idhr_admin_token') : '';
  const res = await fetch(`/api/${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
      ...(opts.headers || {}),
    },
  });
  return res.json();
}

/* ================= LOGIN ================= */
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).then(r => r.json());
    setLoading(false);
    if (res.token) {
      localStorage.setItem('idhr_admin_token', res.token);
      onLogin();
    } else {
      toast.error(res.error || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_60%)]" />
      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-md dark-glass rounded-3xl p-6 md:p-8 border border-gold-30"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800 flex items-center justify-center gold-glow-sm">
            <Mountain className="w-7 h-7 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-heading text-2xl gold-text font-bold mt-4">Admin Dashboard</h1>
          <p className="text-xs text-white/50 mt-1">ID Hiking Rent Wonosobo</p>
        </div>

        <label className="text-[10px] tracking-widest text-white/50 uppercase">Password Admin</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Masukkan password"
          className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full py-3.5 rounded-xl gold-gradient-bg text-black font-semibold disabled:opacity-50 gold-glow-sm"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <div className="mt-4 text-[11px] text-white/40 text-center">
          Default password: <span className="text-gold">admin123</span> (ubah via ENV)
        </div>
      </motion.form>
    </div>
  );
}

/* ================= COMMON UI ================= */
function ImageUploader({ value, onChange }) {
  const [preview, setPreview] = useState(value || '');
  const fileRef = useRef();
  useEffect(() => setPreview(value || ''), [value]);
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1200000) {
      toast.error('Ukuran gambar maks 1.2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onChange(reader.result);
    };
    reader.readAsDataURL(f);
  };
  return (
    <div>
      <div className="flex gap-3 items-start">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Paste URL gambar atau upload"
            value={preview.startsWith('data:') ? '' : preview}
            onChange={e => { setPreview(e.target.value); onChange(e.target.value); }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold text-white flex items-center gap-1.5"
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
          <input type="file" accept="image/*" hidden ref={fileRef} onChange={onFile} />
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4">
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full ${size === 'lg' ? 'max-w-3xl' : 'max-w-lg'} max-h-[92svh] overflow-y-auto bg-[#0a0a0a] border-t border-x border-gold-30 md:border md:rounded-2xl rounded-t-2xl`}
      >
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <h3 className="font-heading text-lg gold-text font-bold">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest text-white/50 uppercase">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Input(props) {
  return <input {...props} className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold ${props.className || ''}`} />;
}
function Textarea(props) {
  return <textarea {...props} className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold ${props.className || ''}`} />;
}

function Btn({ children, variant = 'primary', ...rest }) {
  const styles = {
    primary: 'gold-gradient-bg text-black gold-glow-sm',
    ghost: 'bg-white/5 border border-white/10 text-white hover:border-gold',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30',
  };
  return <button {...rest} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${styles[variant]} ${rest.className || ''}`}>{children}</button>;
}

/* ================= DASHBOARD OVERVIEW ================= */
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('admin/stats').then(setStats); }, []);
  if (!stats) return <div className="text-white/50 p-4">Loading...</div>;
  const cards = [
    { label: 'Booking Hari Ini', value: stats.todayBookings, icon: TrendingUp, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400' },
    { label: 'Pendapatan Bulan Ini', value: rupiah(stats.monthRevenue), icon: DollarSign, color: 'from-yellow-500/20 to-yellow-500/5', iconColor: 'text-gold' },
    { label: 'Total Penyewa', value: stats.totalCustomers, icon: Users, color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
    { label: 'Promo Aktif', value: stats.activePromos, icon: TicketPercent, color: 'from-pink-500/20 to-pink-500/5', iconColor: 'text-pink-400' },
    { label: 'Total Produk', value: stats.productsCount, icon: Package, color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400' },
    { label: 'Stok Hampir Habis', value: stats.lowStock?.length || 0, icon: AlertTriangle, color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl gold-text font-bold">Overview</h2>
        <p className="text-xs text-white/50 mt-1">Statistik toko real-time</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <div key={i} className={`bg-gradient-to-br ${c.color} border border-white/5 rounded-2xl p-4`}>
            <c.icon className={`w-5 h-5 ${c.iconColor}`} />
            <div className="mt-3 font-heading text-2xl md:text-3xl text-white font-bold">{c.value}</div>
            <div className="text-[10px] tracking-widest uppercase text-white/50 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      {stats.topProduct && (
        <div className="dark-glass rounded-2xl p-5">
          <div className="text-[10px] tracking-widest uppercase text-gold mb-2">Produk Terlaris</div>
          <div className="flex items-center justify-between">
            <div className="font-heading text-xl text-white font-bold">{stats.topProduct.name}</div>
            <div className="text-sm text-white/70">{stats.topProduct.count} kali disewa</div>
          </div>
        </div>
      )}
      {stats.lowStock?.length > 0 && (
        <div className="dark-glass rounded-2xl p-5 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <div className="text-sm text-white font-semibold">Peringatan Stok</div>
          </div>
          <div className="space-y-2">
            {stats.lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{p.name}</span>
                <span className="text-orange-400 font-semibold">Sisa {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= PRODUCTS CRUD ================= */
function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const load = () => api('admin/products').then(r => setItems(r.items || []));
  useEffect(() => { load(); }, []);
  const filtered = items.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  const del = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    await api(`admin/products/${id}`, { method: 'DELETE' });
    toast.success('Produk dihapus');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl gold-text font-bold">Produk</h2>
          <p className="text-xs text-white/50">{items.length} produk aktif</p>
        </div>
        <Btn onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Tambah</Btn>
      </div>
      <div className="flex items-center gap-2 dark-glass rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-white/50" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari produk..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="dark-glass rounded-2xl p-3 flex gap-3">
            <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-widest text-gold uppercase">{p.category}</div>
              <div className="text-sm text-white font-medium truncate">{p.name}</div>
              <div className="text-xs text-white/50 mt-0.5">{p.size} • Sisa {p.stock}</div>
              <div className="text-sm gold-text font-bold mt-1">{rupiah(p.price)}<span className="text-[10px] text-white/40">/hari</span></div>
              {p.badge && <div className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-gold text-black font-semibold">{p.badge}</div>}
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(p.id)} className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <ProductForm editing={editing} onClose={() => setEditing(null)} onSaved={load} />
    </div>
  );
}

function ProductForm({ editing, onClose, onSaved }) {
  const [f, setF] = useState({});
  useEffect(() => {
    setF({
      ...editing,
      imagesText: (editing?.images && editing.images.length ? editing.images : (editing?.image ? [editing.image] : [])).join('\n'),
      pricingText: editing?.pricingTiers?.length
        ? editing.pricingTiers.map(t => `${t.days}=${t.price}`).join('\n')
        : (editing?.price ? `1=${editing.price}\n2=${Math.round(editing.price*1.8)}\n3=${Math.round(editing.price*2.2)}\n5=${Math.round(editing.price*3.6)}` : ''),
    });
  }, [editing]);
  if (!editing) return null;
  const isNew = !editing.id;
  const addImage = (url) => {
    const arr = (f.imagesText || '').split('\n').filter(Boolean);
    arr.push(url);
    setF({ ...f, imagesText: arr.join('\n') });
  };
  const submit = async () => {
    const images = (f.imagesText || '').split('\n').map(s => s.trim()).filter(Boolean);
    const pricingTiers = (f.pricingText || '').split('\n').map(line => {
      const [d, p] = line.split('=').map(x => x.trim());
      if (!d || !p) return null;
      return { days: Number(d), price: Number(p) };
    }).filter(Boolean);
    const payload = {
      name: f.name || '',
      category: f.category || 'Aksesoris',
      size: f.size || '',
      stock: Number(f.stock || 0),
      price: Number(f.price || 0),
      image: images[0] || f.image || '',
      images,
      pricingTiers,
      badge: f.badge || '',
      description: f.description || '',
      status: f.status || 'READY',
      included: (f.included || '').toString().split(',').map(s => s.trim()).filter(Boolean),
      specs: f.specsText ? Object.fromEntries((f.specsText || '').split('\n').map(l => l.split(':').map(x => x.trim())).filter(a => a.length === 2)) : (f.specs || {}),
    };
    if (isNew) {
      await api('admin/products', { method: 'POST', body: JSON.stringify(payload) });
      toast.success('Produk ditambahkan');
    } else {
      await api(`admin/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      toast.success('Produk diperbarui');
    }
    onSaved();
    onClose();
  };
  const specsText = f.specsText !== undefined ? f.specsText : (f.specs ? Object.entries(f.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '');
  const currentImages = (f.imagesText || '').split('\n').filter(Boolean);
  return (
    <Modal open={!!editing} onClose={onClose} title={isNew ? 'Tambah Produk' : 'Edit Produk'} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Field label="Gambar Produk (Multiple)">
            <div className="space-y-2">
              {currentImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {currentImages.map((im, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img src={im} alt="" className="w-20 h-20 rounded-lg object-cover border border-white/10" />
                      <button type="button" onClick={() => {
                        const arr = currentImages.filter((_, j) => j !== i);
                        setF({ ...f, imagesText: arr.join('\n') });
                      }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              )}
              <ImageUploader value="" onChange={(url) => url && addImage(url)} />
              <Textarea rows={2} placeholder="Atau paste URL, satu per baris" value={f.imagesText || ''} onChange={e => setF({ ...f, imagesText: e.target.value })} />
              <div className="text-[10px] text-white/40">Gambar pertama = thumbnail utama. Support upload multi & paste URL.</div>
            </div>
          </Field>
        </div>
        <Field label="Nama Barang"><Input value={f.name || ''} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Kategori">
          <select value={f.category || 'Aksesoris'} onChange={e => setF({ ...f, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            {['Carrier','Tenda','Sleeping Bag','Lampu','Kompor','Matras','Cooking','Jaket','Sepatu','Aksesoris'].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
          </select>
        </Field>
        <Field label="Ukuran"><Input value={f.size || ''} onChange={e => setF({ ...f, size: e.target.value })} placeholder="60L / M/L/XL" /></Field>
        <Field label="Harga Dasar (per hari)"><Input type="number" value={f.price || ''} onChange={e => setF({ ...f, price: e.target.value })} /></Field>
        <Field label="Stok"><Input type="number" value={f.stock || ''} onChange={e => setF({ ...f, stock: e.target.value })} /></Field>
        <Field label="Badge">
          <select value={f.badge || ''} onChange={e => setF({ ...f, badge: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="" className="bg-black">Tanpa Badge</option>
            {['BEST SELLER','FAVORITE','NEW','LIMITED STOCK','PREMIUM GEAR','DISKON'].map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Harga Berdasarkan Durasi (format: hari=harga, satu per baris)">
            <Textarea rows={5} value={f.pricingText || ''} onChange={e => setF({ ...f, pricingText: e.target.value })} placeholder="1=25000&#10;2=40000&#10;3=55000&#10;4=70000&#10;5=85000" />
            <div className="text-[10px] text-white/40 mt-1">Sistem otomatis pilih tier terdekat. Kosongi = pakai harga dasar × hari.</div>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Deskripsi"><Textarea rows={3} value={f.description || ''} onChange={e => setF({ ...f, description: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Included (pisah dengan koma)">
            <Input value={Array.isArray(f.included) ? f.included.join(', ') : (f.included || '')} onChange={e => setF({ ...f, included: e.target.value })} placeholder="Rain Cover, Chest Strap, Hip Belt" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Spesifikasi (1 per baris, format kunci: nilai)">
            <Textarea rows={4} value={specsText} onChange={e => setF({ ...f, specsText: e.target.value })} placeholder="kapasitas: 60 Liter&#10;berat: 1.9 kg" />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <Btn variant="ghost" onClick={onClose}>Batal</Btn>
        <Btn onClick={submit}><Save className="w-4 h-4" /> Simpan</Btn>
      </div>
    </Modal>
  );
}

/* ================= GENERIC LIST CRUD ================= */
function SimpleCRUD({ title, endpoint, fields, renderCard, singularName }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api(endpoint).then(r => setItems(r.items || []));
  useEffect(() => { load(); }, []);
  const del = async (id) => {
    if (!confirm('Hapus item ini?')) return;
    await api(`${endpoint}/${id}`, { method: 'DELETE' });
    toast.success('Terhapus');
    load();
  };
  const submit = async (data) => {
    if (editing.id) await api(`${endpoint}/${editing.id}`, { method: 'PUT', body: JSON.stringify(data) });
    else await api(endpoint, { method: 'POST', body: JSON.stringify(data) });
    toast.success('Tersimpan');
    setEditing(null);
    load();
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl gold-text font-bold">{title}</h2>
          <p className="text-xs text-white/50">{items.length} item</p>
        </div>
        <Btn onClick={() => setEditing({})}><Plus className="w-4 h-4" /> Tambah</Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(it => (
          <div key={it.id} className="dark-glass rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">{renderCard(it)}</div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setEditing(it)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(it.id)} className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${singularName}` : `Tambah ${singularName}`}>
        <EditForm fields={fields} initial={editing || {}} onSubmit={submit} onCancel={() => setEditing(null)} />
      </Modal>
    </div>
  );
}

function EditForm({ fields, initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial);
  useEffect(() => setF(initial), [initial]);
  const submit = () => {
    const out = {};
    for (const fld of fields) {
      let v = f[fld.name];
      if (fld.type === 'number') v = Number(v || 0);
      if (fld.type === 'array') v = (v || '').toString().split(',').map(s => s.trim()).filter(Boolean);
      out[fld.name] = v ?? '';
    }
    onSubmit(out);
  };
  return (
    <div className="space-y-4">
      {fields.map(fld => (
        <Field key={fld.name} label={fld.label}>
          {fld.type === 'image' ? (
            <ImageUploader value={f[fld.name]} onChange={v => setF({ ...f, [fld.name]: v })} />
          ) : fld.type === 'textarea' ? (
            <Textarea rows={fld.rows || 3} value={f[fld.name] || ''} onChange={e => setF({ ...f, [fld.name]: e.target.value })} />
          ) : fld.type === 'select' ? (
            <select value={f[fld.name] || fld.options[0]} onChange={e => setF({ ...f, [fld.name]: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none">
              {fld.options.map(o => <option key={o} value={o} className="bg-black">{o}</option>)}
            </select>
          ) : fld.type === 'array' ? (
            <Input value={Array.isArray(f[fld.name]) ? f[fld.name].join(', ') : (f[fld.name] || '')} onChange={e => setF({ ...f, [fld.name]: e.target.value })} placeholder={fld.placeholder} />
          ) : (
            <Input type={fld.type || 'text'} value={f[fld.name] ?? ''} onChange={e => setF({ ...f, [fld.name]: e.target.value })} placeholder={fld.placeholder} />
          )}
        </Field>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="ghost" onClick={onCancel}>Batal</Btn>
        <Btn onClick={submit}><Save className="w-4 h-4" /> Simpan</Btn>
      </div>
    </div>
  );
}

/* ================= ORDERS ================= */
function OrdersAdmin() {
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const load = () => api('admin/orders').then(r => setItems(r.items || []));
  useEffect(() => { load(); }, []);
  const filtered = filter === 'ALL' ? items : items.filter(o => o.status === filter);
  const setStatus = async (id, status) => {
    await api(`admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast.success('Status diperbarui');
    load();
    setDetail(null);
  };
  const del = async (id) => {
    if (!confirm('Hapus order ini?')) return;
    await api(`admin/orders/${id}`, { method: 'DELETE' });
    toast.success('Terhapus');
    load();
    setDetail(null);
  };
  const exportCSV = () => {
    const rows = [['Invoice', 'Nama', 'Jumlah', 'Sewa', 'Kembali', 'Durasi', 'Total', 'Status']];
    items.forEach(o => rows.push([o.invoiceNo, o.productName, o.qty, o.startDate, o.endDate, o.days, o.total, o.status]));
    const csv = rows.map(r => r.map(c => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-300',
    CONFIRMED: 'bg-blue-500/20 text-blue-300',
    COMPLETED: 'bg-emerald-500/20 text-emerald-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl gold-text font-bold">Pesanan</h2>
          <p className="text-xs text-white/50">{items.length} pesanan</p>
        </div>
        <Btn variant="ghost" onClick={exportCSV}><FileText className="w-4 h-4" /> Export Excel</Btn>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs ${filter === s ? 'gold-gradient-bg text-black font-semibold' : 'bg-white/5 text-white/70'}`}>
            {s === 'ALL' ? 'Semua' : s}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(o => (
          <button key={o.id} onClick={() => setDetail(o)} className="w-full text-left dark-glass rounded-xl p-3 flex items-center justify-between gap-3 hover:border-gold-30 transition">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gold">{o.invoiceNo}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${statusColors[o.status] || 'bg-white/10 text-white'}`}>{o.status}</span>
              </div>
              <div className="text-sm text-white font-medium truncate mt-1">{o.productName} × {o.qty}</div>
              <div className="text-[11px] text-white/50">{fmtDate(o.startDate)} → {fmtDate(o.endDate)} • {o.days}d</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="gold-text font-bold text-sm">{rupiah(o.total)}</div>
              <div className="text-[10px] text-white/40">{fmtDateTime(o.createdAt)}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="text-center py-10 text-white/40 text-sm">Belum ada pesanan.</div>}
      </div>
      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.invoiceNo || 'Detail Pesanan'}>
        {detail && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-white/50">Invoice</div>
              <div className="font-mono text-gold text-sm">{detail.invoiceNo}</div>
            </div>
            <div className="dark-glass rounded-xl p-4 space-y-2">
              {[
                ['Barang', detail.productName],
                ['Jumlah', `${detail.qty} pcs`],
                ['Sewa', fmtDate(detail.startDate)],
                ['Kembali', fmtDate(detail.endDate)],
                ['Durasi', `${detail.days} hari`],
                ['Total', rupiah(detail.total)],
                ['Dibuat', fmtDateTime(detail.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/60">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-white/50 uppercase mb-2">Update Status</div>
              <div className="grid grid-cols-2 gap-2">
                {['PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
                  <button key={s} onClick={() => setStatus(detail.id, s)} className={`py-2 rounded-lg text-xs font-medium ${detail.status === s ? 'gold-gradient-bg text-black' : 'bg-white/5 border border-white/10 text-white hover:border-gold'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-white/5 flex gap-2">
              <Btn variant="ghost" onClick={() => window.print()}><FileText className="w-4 h-4" /> Print Invoice</Btn>
              <Btn variant="danger" onClick={() => del(detail.id)}><Trash2 className="w-4 h-4" /> Hapus</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= SETTINGS ================= */
function SettingsAdmin() {
  const [s, setS] = useState(null);
  useEffect(() => { api('admin/settings').then(r => setS(r.settings || {})); }, []);
  if (!s) return null;
  const save = async () => {
    await api('admin/settings', { method: 'PUT', body: JSON.stringify(s) });
    toast.success('Pengaturan tersimpan');
  };
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl gold-text font-bold">Informasi Toko</h2>
      <div className="grid grid-cols-1 gap-3">
        <Field label="WhatsApp (format 62xx)"><Input value={s.whatsapp || ''} onChange={e => setS({ ...s, whatsapp: e.target.value })} /></Field>
        <Field label="Alamat"><Textarea rows={2} value={s.address || ''} onChange={e => setS({ ...s, address: e.target.value })} /></Field>
        <Field label="Jam Buka"><Input value={s.hours || ''} onChange={e => setS({ ...s, hours: e.target.value })} /></Field>
        <Field label="Bank / Rekening"><Input value={s.bank || ''} onChange={e => setS({ ...s, bank: e.target.value })} /></Field>
        <Field label="Link Google Maps"><Input value={s.maps || ''} onChange={e => setS({ ...s, maps: e.target.value })} /></Field>
      </div>
      <div className="flex justify-end">
        <Btn onClick={save}><Save className="w-4 h-4" /> Simpan</Btn>
      </div>
    </div>
  );
}

/* ================= MAIN ADMIN ================= */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('idhr_admin_token');
    if (t) {
      // Verify by hitting stats
      fetch('/api/admin/stats', { headers: { 'x-admin-token': t } }).then(r => {
        if (r.ok) setLoggedIn(true);
        else localStorage.removeItem('idhr_admin_token');
      });
    }
  }, []);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: ShoppingBag },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'promos', label: 'Promo', icon: TicketPercent },
    { id: 'packages', label: 'Paket', icon: PackageCheck },
    { id: 'reviews', label: 'Review', icon: Star },
    { id: 'faqs', label: 'FAQ', icon: MessageSquare },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
  ];

  const promoFields = [
    { name: 'title', label: 'Judul' },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
    { name: 'discount', label: 'Diskon (%)', type: 'number' },
    { name: 'color', label: 'Warna Gradient', type: 'select', options: ['from-amber-500 to-yellow-600','from-yellow-600 to-amber-800','from-amber-600 to-yellow-500','from-yellow-700 to-amber-500','from-amber-500 to-yellow-700'] },
  ];
  const reviewFields = [
    { name: 'name', label: 'Nama' },
    { name: 'avatar', label: 'Avatar URL', type: 'image' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' },
    { name: 'review', label: 'Review', type: 'textarea' },
  ];
  const packageFields = [
    { name: 'name', label: 'Nama Paket' },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
    { name: 'price', label: 'Harga (per hari)', type: 'number' },
    { name: 'items', label: 'Item Isi Paket (pisah dengan koma)', type: 'array', placeholder: 'Carrier, Tenda 2P, Sleeping Bag' },
    { name: 'badge', label: 'Badge', type: 'select', options: ['','POPULER','HEMAT','PREMIUM'] },
  ];
  const faqFields = [
    { name: 'q', label: 'Pertanyaan' },
    { name: 'a', label: 'Jawaban', type: 'textarea', rows: 4 },
  ];
  const galleryFields = [
    { name: 'url', label: 'Gambar', type: 'image' },
    { name: 'caption', label: 'Caption' },
    { name: 'category', label: 'Kategori' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 dark-glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800 flex items-center justify-center">
              <Mountain className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-heading text-sm gold-text font-semibold">Admin Dashboard</div>
              <div className="text-[9px] tracking-widest text-white/50">ID HIKING RENT</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="text-xs text-white/60 hover:text-gold flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Lihat Website</a>
          <button onClick={() => { localStorage.removeItem('idhr_admin_token'); location.reload(); }} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white hover:text-red-300 transition"><LogOut className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-[57px] left-0 h-[calc(100svh-57px)] w-64 dark-glass border-r border-white/5 p-3 space-y-1 z-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${tab === t.id ? 'gold-gradient-bg text-black font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </aside>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-10 md:hidden" />}

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-20">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'products' && <ProductsAdmin />}
          {tab === 'orders' && <OrdersAdmin />}
          {tab === 'promos' && (
            <SimpleCRUD title="Promo" endpoint="admin/promos" singularName="Promo" fields={promoFields}
              renderCard={p => (
                <>
                  <div className="text-sm text-white font-medium">{p.title}</div>
                  <div className="text-xs text-white/60 mt-0.5">{p.subtitle}</div>
                  <div className="text-gold font-bold text-sm mt-1">-{p.discount}%</div>
                </>
              )}
            />
          )}
          {tab === 'packages' && (
            <SimpleCRUD title="Paket Bundling" endpoint="admin/packages" singularName="Paket" fields={packageFields}
              renderCard={p => (
                <>
                  <div className="text-sm text-white font-medium">{p.name}</div>
                  <div className="text-xs text-white/60 mt-0.5">{p.subtitle}</div>
                  <div className="text-gold font-bold text-sm mt-1">{rupiah(p.price)}<span className="text-[10px] text-white/40">/hari</span></div>
                  {p.items && <div className="text-[10px] text-white/50 mt-1 line-clamp-2">Isi: {(Array.isArray(p.items) ? p.items : []).join(', ')}</div>}
                </>
              )}
            />
          )}
          {tab === 'reviews' && (
            <SimpleCRUD title="Review Pelanggan" endpoint="admin/reviews" singularName="Review" fields={reviewFields}
              renderCard={r => (
                <div className="flex gap-2">
                  {r.avatar && <img src={r.avatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium">{r.name}</div>
                    <div className="flex text-gold text-[10px]">{'★'.repeat(r.rating || 0)}</div>
                    <div className="text-xs text-white/60 mt-1 line-clamp-2">{r.review}</div>
                  </div>
                </div>
              )}
            />
          )}
          {tab === 'faqs' && (
            <SimpleCRUD title="FAQ" endpoint="admin/faqs" singularName="FAQ" fields={faqFields}
              renderCard={f => (
                <>
                  <div className="text-sm text-white font-medium">{f.q}</div>
                  <div className="text-xs text-white/60 mt-1 line-clamp-2">{f.a}</div>
                </>
              )}
            />
          )}
          {tab === 'gallery' && (
            <SimpleCRUD title="Galeri Foto" endpoint="admin/gallery" singularName="Foto" fields={galleryFields}
              renderCard={g => (
                <div className="flex gap-2">
                  {g.url && <img src={g.url} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium">{g.caption}</div>
                    <div className="text-[10px] text-gold uppercase mt-1">{g.category}</div>
                  </div>
                </div>
              )}
            />
          )}
          {tab === 'settings' && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}
