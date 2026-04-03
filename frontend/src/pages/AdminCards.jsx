import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight,
  ArrowLeft, CreditCard, Filter, CheckSquare, Square, AlertTriangle
} from 'lucide-react';
import api from '../services/api';

const TYPES = ['', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Colorless'];
const RARITIES = ['', '◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆', '☆☆', '☆☆☆', 'Crown Rare'];
const LIMIT = 15;

/* ── Modal de Formulario ── */
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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.type) {
      setError('Nombre y Tipo son requeridos');
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
      setError(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-white/10 p-6"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16162a)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">{card?._id ? 'Editar Carta' : 'Nueva Carta'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Nombre *</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">HP</label>
              <input name="hp" type="number" value={form.hp} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Tipo *</label>
              <select name="type" value={form.type} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors">
                {TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Rareza</label>
              <select name="rarity" value={form.rarity} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors">
                {RARITIES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Set</label>
              <input name="set_name" value={form.set_name} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Nro. Carta</label>
              <input name="card_number" type="number" value={form.card_number} onChange={onChange} className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">URL Imagen</label>
            <input name="image" value={form.image} onChange={onChange} placeholder="https://..." className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">URL Detalle</label>
            <input name="url" value={form.url} onChange={onChange} placeholder="https://..." className="w-full px-3 py-2.5 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors" />
          </div>

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-md border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-md bg-[#7C4DFF] text-white font-bold text-sm hover:bg-[#6a3de8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? '...' : <><Check className="w-4 h-4" /> {card?._id ? 'Guardar' : 'Crear'}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── Modal de Confirmación ── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-red-500/20 p-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #1e1028)' }}
      >
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-white font-bold mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-md border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-md bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
═══════════════════════════════════════════ */

export default function AdminCards() {
  const [cartas, setCartas] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', type: '', page: 1 });
  const [modalCard, setModalCard] = useState(null); // null=closed, {}=new, {_id,...}=edit
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
      console.error(err);
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
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20vh] right-0 w-[50vw] h-[50vh] rounded-full blur-[180px] bg-[#7C4DFF]/8" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-md border border-white/10 hover:bg-white/5 text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#7C4DFF]" /> Gestión de Cartas
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">{pagination.total?.toLocaleString() || 0} cartas en la base de datos</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setModalCard({})}
            className="flex items-center gap-2 px-5 py-3 rounded-md bg-[#7C4DFF] text-white font-bold text-sm shadow-lg shadow-[#7C4DFF]/30 hover:bg-[#6a3de8] transition-colors"
          >
            <Plus className="w-5 h-5" /> Nueva Carta
          </motion.button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
              className="px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C4DFF] focus:outline-none transition-colors"
            >
              <option value="">Todos los tipos</option>
              {TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <span className="text-sm font-bold text-red-300">{selected.size} seleccionada(s)</span>
              <button
                onClick={() => setBulkConfirm(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar seleccionadas
              </button>
              <button onClick={() => setSelected(new Set())} className="p-2 rounded-lg hover:bg-white/10 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="rounded-lg border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {/* Table Header */}
          <div className="grid grid-cols-[40px_60px_1fr_100px_80px_120px_100px] gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] text-[10px] uppercase tracking-widest text-gray-500 font-bold items-center">
            <button onClick={toggleAll} className="flex items-center justify-center">
              {selected.size === cartas.length && cartas.length > 0 ? <CheckSquare className="w-4 h-4 text-[#7C4DFF]" /> : <Square className="w-4 h-4" />}
            </button>
            <span>Img</span>
            <span>Nombre</span>
            <span>Tipo</span>
            <span>HP</span>
            <span>Rareza</span>
            <span className="text-right">Acciones</span>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">Cargando...</div>
          ) : cartas.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No se encontraron cartas</div>
          ) : (
            cartas.map((carta, i) => (
              <motion.div
                key={carta._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`grid grid-cols-[40px_60px_1fr_100px_80px_120px_100px] gap-3 px-4 py-3 border-b border-white/[0.03] items-center hover:bg-white/[0.03] transition-colors ${selected.has(carta._id) ? 'bg-[#7C4DFF]/5' : ''}`}
              >
                <button onClick={() => toggleSelect(carta._id)} className="flex items-center justify-center">
                  {selected.has(carta._id) ? <CheckSquare className="w-4 h-4 text-[#7C4DFF]" /> : <Square className="w-4 h-4 text-gray-600" />}
                </button>
                <div className="w-10 h-14 rounded-lg overflow-hidden border border-white/10 bg-black/30">
                  {carta.image ? <img src={carta.image} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-white/5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{carta.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{carta.set_name || '—'}</p>
                </div>
                <span className="text-xs font-bold text-gray-300">{carta.type || '—'}</span>
                <span className="text-xs font-mono text-gray-300">{carta.hp || '—'}</span>
                <span className="text-xs text-gray-400">{carta.rarity || '—'}</span>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setModalCard(carta)}
                    className="p-2 rounded-lg hover:bg-[#7C4DFF]/20 text-gray-400 hover:text-[#7C4DFF] transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(carta)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page <= 1}
              className="p-2 rounded-md border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-gray-400 px-4">
              {filters.page} / {totalPages}
            </span>
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
              disabled={filters.page >= totalPages}
              className="p-2 rounded-md border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalCard !== null && (
          <CardModal card={modalCard} onClose={() => setModalCard(null)} onSave={() => { setModalCard(null); fetchCartas(); }} />
        )}
        {confirmDelete && (
          <ConfirmModal message={`¿Eliminar "${confirmDelete.name}"?`} onConfirm={() => handleDelete(confirmDelete._id)} onCancel={() => setConfirmDelete(null)} />
        )}
        {bulkConfirm && (
          <ConfirmModal message={`¿Eliminar ${selected.size} carta(s)?`} onConfirm={handleBulkDelete} onCancel={() => setBulkConfirm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
