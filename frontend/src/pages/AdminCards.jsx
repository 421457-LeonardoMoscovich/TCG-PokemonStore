import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight,
  Filter, CheckSquare, Square, AlertTriangle, Database
} from 'lucide-react';
import api from '../services/api';

const TYPES = ['', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Colorless'];
const RARITIES = ['', '◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆', '☆☆', '☆☆☆', 'Crown Rare'];
const LIMIT = 15;

/* ── Access Portal (Form Modal) ── */
function CardModal({ card, onClose, onSave }) {
  const [form, setForm] = useState({
    name: card?.name || '',
    hp: card?.hp || '',
    type: card?.type || 'Fire',
    rarity: card?.rarity || '◊',
    set_name: card?.set_name || '',
    image: card?.image || '',
    url: card?.url || '',
    card_number: card?.card_number || '',
    price: card?.price || 10,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.type) {
      setError('FIELD MISSING: Name & Type required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (card?._id) {
        await api.put(`/admin/cartas/${card._id}`, form);
      } else {
        await api.post('/admin/cartas', form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'UPLINK ERROR: Failed to sync data');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-gradient-to-b from-[#121214] to-[#0a0a0c] border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
                  <Database className="w-4 h-4 text-primary relative z-10" />
              </div>
              <h2 className="text-sm font-semibold text-white">{card?._id ? 'Edit Entity Details' : 'Create New Entity'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Entity Name *</label>
                <input name="name" value={form.name} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all placeholder:text-gray-700 font-medium" placeholder="Charizard..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Hit Points (HP)</label>
                <input name="hp" type="number" value={form.hp} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all tabular-nums font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Element Type *</label>
                <select name="type" value={form.type} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all cursor-pointer appearance-none font-medium">
                  {TYPES.filter(Boolean).map(t => <option key={t} value={t} className="bg-[#121214]">{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Rarity Grade</label>
                <select name="rarity" value={form.rarity} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all cursor-pointer appearance-none font-medium">
                  {RARITIES.filter(Boolean).map(r => <option key={r} value={r} className="bg-[#121214]">{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Dataset Origin</label>
                <input name="set_name" value={form.set_name} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">System ID</label>
                <input name="card_number" type="number" value={form.card_number} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all tabular-nums font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Visual Asset URL</label>
                <input name="image" value={form.image} onChange={onChange} placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">Market Value ($)</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06] text-white text-sm focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all tabular-nums font-mono font-bold text-emerald-400" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 mt-4">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs font-semibold text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/[0.06]">
              <button type="button" onClick={onClose} className="py-2.5 px-6 rounded-xl border border-white/[0.06] text-gray-400 font-semibold text-sm hover:text-white hover:bg-white/[0.04] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="py-2.5 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Entity</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Confirmation HUD ── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#121214] border border-red-500/20 p-8 rounded-2xl text-center relative overflow-hidden shadow-[0_10px_40px_rgba(239,68,68,0.15)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.06] text-gray-400 font-semibold text-sm hover:text-white hover:bg-white/[0.04] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
/* ═══════════════════════════════════════════ */

export default function AdminCards() {
  const [cartas, setCartas] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', type: '', page: 1 });
  const [modalCard, setModalCard] = useState(null); 
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);

  const fetchCartas = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page: filters.page };
      if (filters.q) params.name = filters.q;
      if (filters.type) params.type = filters.type;
      const { data } = await api.get('/cartas', { params });
      setCartas(data.cartas);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Core Logic Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchCartas(); }, [fetchCartas]);

  function setFilter(key, value) {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
    setSelected(new Set());
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/admin/cartas/${id}`);
      setConfirmDelete(null);
      fetchCartas();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBulkDelete() {
    try {
      await api.post('/admin/cartas/bulk-delete', { ids: Array.from(selected) });
      setBulkConfirm(false);
      setSelected(new Set());
      fetchCartas();
    } catch (err) {
      console.error(err);
    }
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === cartas.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(cartas.map(c => c._id)));
    }
  }

  const totalPages = pagination.pages || 1;

  return (
    <div className="space-y-6 pb-12 mx-auto max-w-[1600px] w-full">
      {/* HUD Controller Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">Inventory Management</h2>
          <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
             <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-gray-300 font-mono">{pagination.total?.toLocaleString() || 0} Entities</span>
             </div>
             <span>•</span>
             <span>Review and modify registry records.</span>
          </div>
        </div>
        
        <div className="flex items-center">
            <button 
              onClick={() => setModalCard({})}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-primary transition-colors font-sans"
            >
              <Plus className="w-4 h-4" /> New Entity
            </button>
        </div>
      </div>

      {/* Controller Area */}
      <div className="admin-glass p-4 flex flex-col md:flex-row gap-4 items-center relative overflow-hidden z-10">
        <div className="relative flex-1 w-full flex items-center group">
          <Search className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent border border-transparent text-sm text-white focus:bg-white/[0.02] focus:border-white/[0.06] outline-none transition-all placeholder:text-gray-600 font-medium"
          />
        </div>
        <div className="h-8 w-px bg-white/[0.06] hidden md:block"></div>
        <div className="flex items-center gap-2 w-full md:w-auto relative group">
          <Filter className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-white" />
          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value)}
            className="flex-1 md:flex-initial pl-10 pr-8 py-3 rounded-xl bg-transparent border border-transparent text-sm font-semibold text-gray-400 focus:text-white outline-none cursor-pointer hover:bg-white/[0.02] focus:bg-white/[0.02] focus:border-white/[0.06] transition-all appearance-none"
          >
            <option value="">All Types</option>
            {TYPES.filter(Boolean).map(t => <option key={t} value={t} className="bg-[#121214]">{t}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk Operations Port */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-3 admin-glass flex items-center justify-between gap-4 mb-4 border-primary/30">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                   <span className="text-sm font-semibold text-primary">{selected.size} entities selected</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <button onClick={() => setSelected(new Set())} className="font-semibold text-gray-400 hover:text-white transition-colors">Deselect All</button>
                   <button onClick={() => setBulkConfirm(true)} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-lg transition-colors border border-red-500/20 group flex items-center gap-2">
                     <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Delete Selected
                   </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid View */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-[3px] border-white/5 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Fetching Cards...</p>
        </div>
      ) : cartas.length === 0 ? (
        <div className="py-24 text-center">
          <Database className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No cards found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cartas.map((carta, i) => (
            <motion.div
              key={carta._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="group"
            >
              <div className="admin-card">
                {/* Card Image */}
                <div className="admin-card-image">
                  {carta.image ? (
                    <img src={carta.image} alt={carta.name} className="w-32 h-40 object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="w-32 h-40 bg-white/5 rounded flex items-center justify-center">
                      <Database className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-black text-white mb-1">{carta.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 rounded text-xs font-bold">
                      {carta.type || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">{carta.rarity || '—'}</span>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400">Stock</p>
                      <p className="font-black text-white">∞</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="font-black text-white">${carta.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <button
                      onClick={() => setModalCard(carta)}
                      className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setConfirmDelete(carta)}
                    className="w-full mt-3 py-2 px-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-gray-400">
            Showing {((filters.page - 1) * LIMIT) + 1}-{Math.min(filters.page * LIMIT, pagination.total || 0)} of {pagination.total || 0} cards
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page <= 1}
              className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white text-sm font-semibold disabled:opacity-30"
            >
              ← Previous
            </button>
            <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold">
              {filters.page}
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
              disabled={filters.page >= totalPages}
              className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white text-sm font-semibold disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* UI Portals (Modals) */}
      <AnimatePresence>
        {modalCard !== null && (
          <CardModal card={modalCard} onClose={() => setModalCard(null)} onSave={() => { setModalCard(null); fetchCartas(); }} />
        )}
        {confirmDelete && (
          <ConfirmModal message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`} onConfirm={() => handleDelete(confirmDelete._id)} onCancel={() => setConfirmDelete(null)} />
        )}
        {bulkConfirm && (
          <ConfirmModal message={`Are you sure you want to delete the ${selected.size} selected entities? This action cannot be undone.`} onConfirm={handleBulkDelete} onCancel={() => setBulkConfirm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
