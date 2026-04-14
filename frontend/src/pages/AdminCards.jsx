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

const TYPE_ACCENTS = {
  Fire: '#ff6b4a',
  Water: '#4da3ff',
  Grass: '#7dff87',
  Electric: '#ffd84d',
  Psychic: '#ff66c4',
  Fighting: '#ff914d',
  Darkness: '#9aa0b4',
  Metal: '#c7d2e0',
  Dragon: '#9b6bff',
  Colorless: '#e5e7eb',
};

function getTypeAccent(type) {
  return TYPE_ACCENTS[type] || '#a855f7';
}

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
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.type) {
      setError('Faltan campos: nombre y tipo son obligatorios');
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
      setError(err.response?.data?.error || 'No se pudo guardar la carta');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full relative overflow-hidden"
        style={{
          maxWidth: '720px',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRadius: '18px',
          background: 'linear-gradient(180deg, rgba(16,17,26,0.98) 0%, rgba(8,9,16,0.99) 100%)',
          border: '1px solid rgba(168,85,247,0.16)',
          boxShadow:
            '0 30px 80px rgba(0,0,0,0.55), 0 0 30px rgba(168,85,247,0.10), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(168,85,247,0.10), transparent 22%), radial-gradient(circle at top right, rgba(30,136,229,0.10), transparent 26%)',
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.65), rgba(30,136,229,0.55), transparent)',
          }}
        />

        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '120px',
            height: '120px',
            borderTopLeftRadius: '18px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), transparent 65%)',
          }}
        />

        <div
          className="relative z-10"
          style={{
            padding: '22px',
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: '18px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(30,136,229,0.14))',
                  border: '1px solid rgba(168,85,247,0.20)',
                  boxShadow: '0 0 16px rgba(168,85,247,0.14)',
                }}
              >
                <Database className="w-5 h-5 text-[#c084fc]" />
              </div>

              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.34)',
                    margin: 0,
                  }}
                >
                  Inventory
                </p>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#fff',
                    marginTop: '4px',
                    lineHeight: 1.1,
                  }}
                >
                  {card?._id ? 'Editar carta' : 'Crear carta'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Field label="Nombre *">
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Charizard..."
                    style={inputStyle()}
                  />
                </Field>

                <Field label="Tipo *">
                  <select
                    name="type"
                    value={form.type}
                    onChange={onChange}
                    style={inputStyle({ cursor: 'pointer' })}
                  >
                    {TYPES.filter(Boolean).map((t) => (
                      <option key={t} value={t} className="bg-[#121214]">
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Coleccion">
                  <input
                    name="set_name"
                    value={form.set_name}
                    onChange={onChange}
                    style={inputStyle()}
                  />
                </Field>

                <Field label="Imagen URL">
                  <input
                    name="image"
                    value={form.image}
                    onChange={onChange}
                    placeholder="https://..."
                    style={inputStyle({ fontFamily: 'monospace' })}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Field label="HP">
                  <input
                    name="hp"
                    type="number"
                    value={form.hp}
                    onChange={onChange}
                    style={inputStyle({ fontFamily: 'monospace' })}
                  />
                </Field>

                <Field label="Rareza">
                  <select
                    name="rarity"
                    value={form.rarity}
                    onChange={onChange}
                    style={inputStyle({ cursor: 'pointer' })}
                  >
                    {RARITIES.filter(Boolean).map((r) => (
                      <option key={r} value={r} className="bg-[#121214]">
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Numero">
                  <input
                    name="card_number"
                    type="number"
                    value={form.card_number}
                    onChange={onChange}
                    style={inputStyle({ fontFamily: 'monospace' })}
                  />
                </Field>

                <Field label="Precio ($)">
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={onChange}
                    style={inputStyle({
                      fontFamily: 'monospace',
                      color: '#34d399',
                      fontWeight: 800,
                    })}
                  />
                </Field>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-3"
                style={{
                  marginTop: '14px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.20)',
                }}
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#f87171',
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <div
              className="flex justify-end"
              style={{
                gap: '12px',
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(255,255,255,0.66)',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2"
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                  color: '#050505',
                  fontWeight: 800,
                  fontSize: '14px',
                  boxShadow: '0 10px 24px rgba(216,180,254,0.18)',
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {saving ? 'Guardando...' : (
                  <>
                    <Check className="w-4 h-4" />
                    Guardar carta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '10px',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.42)',
          paddingLeft: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(extra = {}) {
  return {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(0,0,0,0.34)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 150ms ease',
    fontWeight: 600,
    ...extra,
  };
}

/* ── Confirmation HUD ── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full text-center relative overflow-hidden"
        style={{
          maxWidth: '460px',
          borderRadius: '24px',
          padding: '28px',
          background: 'linear-gradient(180deg, rgba(18,16,20,0.98) 0%, rgba(10,8,10,0.99) 100%)',
          border: '1px solid rgba(239,68,68,0.18)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.50), 0 0 30px rgba(239,68,68,0.10)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.85), transparent)',
          }}
        />

        <div
          className="mx-auto flex items-center justify-center"
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '999px',
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.20)',
            boxShadow: '0 0 20px rgba(239,68,68,0.10)',
            marginBottom: '18px',
          }}
        >
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.34)',
            marginBottom: '8px',
          }}
        >
          Critical Action
        </p>

        <h3
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '10px',
          }}
        >
          Confirm Deletion
        </h3>

        <p
          style={{
            color: 'rgba(255,255,255,0.54)',
            fontSize: '14px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          {message}
        </p>

        <div
          className="flex"
          style={{
            gap: '12px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.66)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(239,68,68,0.24)',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.96), rgba(185,28,28,0.96))',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
              boxShadow: '0 12px 24px rgba(239,68,68,0.20)',
            }}
          >
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

  useEffect(() => {
    fetchCartas();
  }, [fetchCartas]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
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
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === cartas.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(cartas.map((c) => c._id)));
    }
  }

  const totalPages = pagination.pages || 1;

  return (
    <div
      className="w-full"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '56px',
      }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        style={{
          borderRadius: '28px',
          padding: '28px 28px 24px 28px',
          background: 'linear-gradient(180deg, rgba(12,14,22,0.96) 0%, rgba(8,10,16,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(168,85,247,0.08), transparent 24%), radial-gradient(circle at top right, rgba(30,136,229,0.07), transparent 28%)',
          }}
        />

        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.45), rgba(30,136,229,0.35), transparent)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.30)',
                marginBottom: '8px',
              }}
            >
              Tactical Inventory Grid
            </p>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1,
                color: '#fff',
                letterSpacing: '-0.04em',
                marginBottom: '12px',
              }}
            >
              Inventory Management
            </h2>

            <div
              className="flex flex-wrap items-center"
              style={{
                gap: '12px',
                color: 'rgba(255,255,255,0.52)',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#c084fc]" />
                <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 800 }}>
                  {pagination.total?.toLocaleString() || 0}
                </span>
                <span>Entities</span>
              </div>
              <span style={{ opacity: 0.35 }}>•</span>
              <span>Review, modify and deploy registry records.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                padding: '12px 14px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                color: 'rgba(255,255,255,0.72)',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {selected.size === cartas.length && cartas.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[#c084fc]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select Page
            </button>

            <button
              onClick={() => setModalCard({})}
              className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                padding: '13px 18px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                color: '#050505',
                fontSize: '14px',
                fontWeight: 800,
                boxShadow: '0 12px 24px rgba(216,180,254,0.18)',
              }}
            >
              <Plus className="w-4 h-4" />
              New Entity
            </button>
          </div>
        </div>
      </div>

      {/* Controller Area */}
      <div
        className="relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        style={{
          borderRadius: '24px',
          padding: '16px',
          background: 'linear-gradient(180deg, rgba(11,12,19,0.96) 0%, rgba(8,9,14,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.24)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(168,85,247,0.05), transparent 22%), radial-gradient(circle at right, rgba(30,136,229,0.04), transparent 24%)',
          }}
        />

        <div
          className="relative z-10 flex flex-col md:flex-row gap-4 items-center"
        >
          <div
            className="relative flex-1 w-full"
            style={{
              minHeight: '58px',
            }}
          >
            <Search
              className="absolute"
              style={{
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: 'rgba(255,255,255,0.34)',
              }}
            />

            <input
              className="transition-transform duration-200 hover:scale-[1.01] focus:scale-[1.01]"
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Search by codename, name or ID..."
              style={{
                width: '100%',
                height: '58px',
                paddingLeft: '46px',
                paddingRight: '16px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>

          <div
            className="w-full md:w-auto flex items-center"
            style={{
              gap: '12px',
            }}
          >
            <div className="relative w-full md:w-auto">
              <Filter
                className="absolute"
                style={{
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'rgba(255,255,255,0.34)',
                }}
              />

              <select
                className="transition-transform duration-200 hover:scale-[1.01] focus:scale-[1.01]"
                value={filters.type}
                onChange={(e) => setFilter('type', e.target.value)}
                style={{
                  minWidth: '190px',
                  width: '100%',
                  height: '58px',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="">All Types</option>
                {TYPES.filter(Boolean).map((t) => (
                  <option key={t} value={t} className="bg-[#121214]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center justify-between flex-wrap"
              style={{
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.10), rgba(30,136,229,0.07))',
                border: '1px solid rgba(168,85,247,0.18)',
                boxShadow: '0 12px 24px rgba(168,85,247,0.08)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: '#c084fc',
                    boxShadow: '0 0 12px rgba(192,132,252,0.9)',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#d8b4fe',
                  }}
                >
                  {selected.size} entities selected
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(new Set())}
                  className="transition-colors duration-200 hover:text-white"
                  style={{
                    color: 'rgba(255,255,255,0.62)',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  Deselect All
                </button>

                <button
                  onClick={() => setBulkConfirm(true)}
                  className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    padding: '11px 14px',
                    borderRadius: '14px',
                    background: 'rgba(239,68,68,0.10)',
                    color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.18)',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid View */}
      {loading ? (
        <div
          className="text-center"
          style={{
            padding: '90px 0',
          }}
        >
          <div
            className="inline-block rounded-full animate-spin"
            style={{
              width: '34px',
              height: '34px',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#a855f7',
              marginBottom: '16px',
            }}
          />
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.40)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Fetching Cards...
          </p>
        </div>
      ) : cartas.length === 0 ? (
        <div
          className="text-center"
          style={{
            padding: '90px 0',
          }}
        >
          <Database className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p
            style={{
              color: 'rgba(255,255,255,0.48)',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            No cards found matching your criteria.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{
            gap: '20px',
          }}
        >
          {cartas.map((carta, i) => {
            const accent = getTypeAccent(carta.type);

            return (
              <motion.div
                key={carta._id}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
                className="group"
              >
                <div
                  className="relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.015]"
                  style={{
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, rgba(12,13,20,0.98) 0%, rgba(8,9,14,0.98) 100%)',
                    border: `1px solid ${accent}22`,
                    boxShadow: `0 14px 34px rgba(0,0,0,0.28), 0 0 18px ${accent}14`,
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top left, ${accent}18, transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 28%)`,
                    }}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 18%, ${accent}22, transparent 34%)`,
                    }}
                  />

                  <div
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
                    }}
                  />

                  {/* Top selector */}
                  <div
                    className="relative z-10 flex items-center justify-between"
                    style={{
                      padding: '14px 14px 0 14px',
                    }}
                  >
                    <button
                      onClick={() => toggleSelect(carta._id)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '10px',
                        background: selected.has(carta._id)
                          ? 'rgba(168,85,247,0.16)'
                          : 'rgba(255,255,255,0.03)',
                        border: selected.has(carta._id)
                          ? '1px solid rgba(168,85,247,0.30)'
                          : '1px solid rgba(255,255,255,0.05)',
                        color: selected.has(carta._id) ? '#c084fc' : 'rgba(255,255,255,0.42)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selected.has(carta._id) ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.28)',
                      }}
                    >
                      #{String(carta.card_number || 'N/A')}
                    </div>
                  </div>

                  {/* Card image */}
                  <div
                    className="relative z-10 flex items-center justify-center"
                    style={{
                      minHeight: '230px',
                      padding: '12px 18px 8px 18px',
                    }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 pointer-events-none"
                      style={{
                        height: '80px',
                        background: `linear-gradient(180deg, transparent, ${accent}10)`,
                      }}
                    />

                    {carta.image ? (
                      <img
                        src={carta.image}
                        alt={carta.name}
                        loading="lazy"
                        className="transition-transform duration-300 group-hover:scale-110"
                        style={{
                          width: '152px',
                          height: '200px',
                          objectFit: 'contain',
                          filter: `drop-shadow(0 12px 22px ${accent}18)`,
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{
                          width: '152px',
                          height: '200px',
                          borderRadius: '18px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <Database className="w-10 h-10 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    className="relative z-10"
                    style={{
                      padding: '18px 18px 16px 18px',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01))',
                    }}
                  >
                    <div
                      className="flex items-start justify-between"
                      style={{
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <h3
                          style={{
                            fontWeight: 900,
                            color: '#fff',
                            fontSize: '18px',
                            lineHeight: 1.1,
                            marginBottom: '8px',
                          }}
                        >
                          {carta.name}
                        </h3>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '999px',
                              background: `${accent}16`,
                              border: `1px solid ${accent}30`,
                              color: accent,
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '999px',
                                background: accent,
                                boxShadow: `0 0 8px ${accent}`,
                              }}
                            />
                            {carta.type || 'Unknown'}
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255,255,255,0.48)',
                              fontWeight: 700,
                            }}
                          >
                            {carta.rarity || '—'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalCard(carta)}
                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.50)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className="grid grid-cols-2"
                      style={{
                        gap: '12px',
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <StatBlock label="Stock" value="∞" valueColor="#fff" />
                      <StatBlock
                        label="Market Value"
                        value={`$${carta.price?.toFixed(2) || '0.00'}`}
                        valueColor="#fff"
                        align="right"
                      />
                    </div>

                    <button
                      onClick={() => setConfirmDelete(carta)}
                      className="flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]"
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(127,29,29,0.16))',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.18)',
                        fontWeight: 800,
                        fontSize: '14px',
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Entity
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between flex-wrap"
          style={{
            gap: '14px',
            marginTop: '6px',
            padding: '18px 20px',
            borderRadius: '22px',
            background: 'linear-gradient(180deg, rgba(10,11,17,0.96) 0%, rgba(8,9,14,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.48)',
              fontWeight: 600,
            }}
          >
            Showing {((filters.page - 1) * LIMIT) + 1}-
            {Math.min(filters.page * LIMIT, pagination.total || 0)} of {pagination.total || 0} cards
          </p>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page <= 1}
              className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:hover:translate-y-0 disabled:active:scale-100"
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: filters.page <= 1 ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.72)',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div
              style={{
                minWidth: '58px',
                textAlign: 'center',
                padding: '10px 14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.16), rgba(30,136,229,0.10))',
                border: '1px solid rgba(168,85,247,0.18)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: '0 0 16px rgba(168,85,247,0.08)',
              }}
            >
              {filters.page}
            </div>

            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
              disabled={filters.page >= totalPages}
              className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:hover:translate-y-0 disabled:active:scale-100"
              style={{
                padding: '10px 12px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: filters.page >= totalPages ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.72)',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalCard !== null && (
          <CardModal
            card={modalCard}
            onClose={() => setModalCard(null)}
            onSave={() => {
              setModalCard(null);
              fetchCartas();
            }}
          />
        )}

        {confirmDelete && (
          <ConfirmModal
            message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
            onConfirm={() => handleDelete(confirmDelete._id)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {bulkConfirm && (
          <ConfirmModal
            message={`Are you sure you want to delete the ${selected.size} selected entities? This action cannot be undone.`}
            onConfirm={handleBulkDelete}
            onCancel={() => setBulkConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBlock({ label, value, valueColor = '#fff', align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <p
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.38)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '6px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '24px',
          fontWeight: 900,
          color: valueColor,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          fontFamily: 'monospace',
        }}
      >
        {value}
      </p>
    </div>
  );
}
