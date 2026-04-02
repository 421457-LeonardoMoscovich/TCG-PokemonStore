import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Users, Shield, ShieldOff, Trash2, X,
  AlertTriangle, Mail, Calendar, Wallet, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../services/api';

const LIMIT = 15;

/* ── Confirm Modal ── */
function ConfirmModal({ message, onConfirm, onCancel, danger = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl border p-6 text-center ${danger ? 'border-red-500/20' : 'border-[#7C4DFF]/20'}`}
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16162a)' }}
      >
        <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${danger ? 'text-red-400' : 'text-[#7C4DFF]'}`} />
        <p className="text-white font-bold mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#7C4DFF] hover:bg-[#6a3de8]'}`}>
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
═══════════════════════════════════════════ */

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null); // { type, user, message }

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page };
      if (search) params.q = search;
      const { data } = await api.get('/admin/users', { params });
      setUsuarios(data.usuarios);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function handleSearch(q) {
    setSearch(q);
    setPage(1);
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error al cambiar rol');
    }
  }

  async function handleDelete(userId) {
    try {
      await api.delete(`/admin/users/${userId}`);
      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error al eliminar usuario');
    }
  }

  const totalPages = pagination.pages || 1;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20vh] left-[20vw] w-[50vw] h-[50vh] rounded-full blur-[180px] bg-[#E91E63]/8" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Users className="w-6 h-6 text-[#E91E63]" /> Gestión de Usuarios
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">{pagination.total?.toLocaleString() || 0} usuarios registrados</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#E91E63] focus:outline-none transition-colors"
          />
        </div>

        {/* User Cards Grid */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center text-gray-500">Cargando...</div>
          ) : usuarios.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No se encontraron usuarios</div>
          ) : (
            usuarios.map((user, i) => {
              const isCurrentUser = currentUser?.id === user._id?.toString();
              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${isCurrentUser ? 'border-[#7C4DFF]/30 bg-[#7C4DFF]/5' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shrink-0 ${user.role === 'admin' ? 'bg-gradient-to-br from-[#7C4DFF] to-[#E91E63]' : 'bg-gradient-to-br from-gray-600 to-gray-800'}`}>
                    {(user.username || user.email || '?')[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-bold text-white truncate">{user.username || 'Sin nombre'}</p>
                      {isCurrentUser && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30 font-bold">TÚ</span>
                      )}
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                      <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> ${user.balance ?? 0}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR') : '—'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Role */}
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => setConfirmAction({
                          type: 'role',
                          userId: user._id,
                          newRole: 'user',
                          message: `¿Quitar permisos de admin a "${user.username}"?`
                        })}
                        disabled={isCurrentUser}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/5 transition-colors disabled:opacity-30"
                        title={isCurrentUser ? 'No puedes quitarte admin a ti mismo' : 'Quitar Admin'}
                      >
                        <ShieldOff className="w-3.5 h-3.5" /> Quitar Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmAction({
                          type: 'role',
                          userId: user._id,
                          newRole: 'admin',
                          message: `¿Promover "${user.username}" a Admin?`
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#7C4DFF]/30 text-[#7C4DFF] text-xs font-bold hover:bg-[#7C4DFF]/10 transition-colors"
                        title="Promover a Admin"
                      >
                        <Shield className="w-3.5 h-3.5" /> Hacer Admin
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmAction({
                        type: 'delete',
                        userId: user._id,
                        message: `¿Eliminar al usuario "${user.username}"? Esta acción no se puede deshacer.`
                      })}
                      disabled={isCurrentUser}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-30"
                      title={isCurrentUser ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-gray-400 px-4">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal
            message={confirmAction.message}
            danger={confirmAction.type === 'delete'}
            onConfirm={() => {
              if (confirmAction.type === 'role') {
                handleRoleChange(confirmAction.userId, confirmAction.newRole);
              } else if (confirmAction.type === 'delete') {
                handleDelete(confirmAction.userId);
              }
            }}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
