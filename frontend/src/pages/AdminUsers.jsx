import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Shield, ShieldOff, Trash2,
  AlertTriangle, Mail, Calendar, Wallet, ChevronLeft, ChevronRight,
  Database, Fingerprint, Activity, Clock
} from 'lucide-react';
import api from '../services/api';

const LIMIT = 15;

/* ── Access Portal (Modal) ── */
function ConfirmModal({ message, onConfirm, onCancel, danger = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-[#121214] border ${danger ? 'border-red-500/20' : 'border-primary/20'} p-8 rounded-2xl text-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 ${danger ? 'bg-red-500' : 'bg-primary'}`}></div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${danger ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
          {danger ? <AlertTriangle className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Confirm Action</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.06] text-gray-400 font-semibold text-sm hover:text-white hover:bg-white/[0.04] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg ${danger ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:bg-primary/90 text-black shadow-primary/20'}`}>
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN COMPONENT
/* ═══════════════════════════════════════════ */

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

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
    }
  }

  async function handleDelete(userId) {
    try {
      await api.delete(`/admin/users/${userId}`);
      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }

  const totalPages = pagination.pages || 1;

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
         <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-white">User Management</h2>
            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
               <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 font-mono">{pagination.total?.toLocaleString() || 0} Users</span>
               </div>
            </div>
         </div>
      </div>

      {/* Controller Area */}
      <div className="admin-glass p-4 flex flex-col md:flex-row gap-4 items-center relative overflow-hidden z-10">
        <div className="relative flex-1 w-full flex items-center group">
          <Search className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or CID..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent border border-transparent text-sm text-white focus:bg-white/[0.02] focus:border-white/[0.06] outline-none transition-all placeholder:text-gray-600 font-medium"
          />
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="admin-glass rounded-2xl relative overflow-hidden z-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">User Identity</th>
                <th className="py-4 font-semibold">Access Level</th>
                <th className="py-4 font-semibold">Contact Node</th>
                <th className="py-4 font-semibold text-right">Credit Balance</th>
                <th className="py-4 font-semibold text-right pr-6">Security Protocols</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="inline-block w-8 h-8 border-[3px] border-white/5 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Fetching Registry...</p>
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                   <td colSpan="5" className="py-24 text-center">
                        <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No users found matching your criteria.</p>
                   </td>
                </tr>
              ) : (
                usuarios.map((user, i) => {
                  const isCurrentUser = currentUser?.id === user._id?.toString();
                  const isAdmin = user.role === 'admin';
                  
                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02, duration: 0.3 }}
                      className={`border-b border-white/5 hover:bg-purple-600/5 transition-colors group/row ${isCurrentUser ? 'bg-purple-600/10' : ''}`}
                    >
                      {/* Identity */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors ${isAdmin ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                            {(user.username || user.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white group-hover/row:text-primary transition-colors">
                                {user.username || 'NO_NAME'}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold tracking-wider">YOU</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-gray-500">
                              <Fingerprint className="w-3 h-3" />
                              <span className="text-[10px] font-mono uppercase tracking-wider">CID: {user._id.toString().slice(-8)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold tracking-wider uppercase transition-colors ${isAdmin ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/[0.04] border-white/[0.06] text-gray-400'}`}>
                          {isAdmin ? <Shield className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                          {user.role || 'user'}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <span className="text-[11px]">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-mono">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-4 text-right">
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                            <Wallet className="w-3 h-3" />
                            ${user.balance?.toLocaleString() || '0.00'}
                          </div>
                          <span className="text-[9px] text-gray-500 font-semibold uppercase mt-0.5 tracking-wider">Credits</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          {isAdmin ? (
                            <button
                              onClick={() => setConfirmAction({
                                type: 'role',
                                userId: user._id,
                                newRole: 'user',
                                message: `Are you sure you want to revoke admin privileges for "${user.username}"?`
                              })}
                              disabled={isCurrentUser}
                              className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/5 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5"
                            >
                              <ShieldOff className="w-3.5 h-3.5" />
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmAction({
                                type: 'role',
                                userId: user._id,
                                newRole: 'admin',
                                message: `Are you sure you want to promote "${user.username}" to an admin position?`
                              })}
                              className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-black transition-all flex items-center gap-1.5"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              Promote
                            </button>
                          )}

                          <button
                            onClick={() => setConfirmAction({
                              type: 'delete',
                              userId: user._id,
                              message: `Are you sure you want to permanently delete the account for "${user.username}"? This action is irreversible.`
                            })}
                            disabled={isCurrentUser}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-30 disabled:hover:bg-transparent ml-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
             <p className="text-sm text-gray-400">
                Showing {((page - 1) * LIMIT) + 1}-{Math.min(page * LIMIT, pagination.total || 0)} of {pagination.total || 0} users
             </p>
             <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white text-sm font-semibold disabled:opacity-30"
                >
                  ← Previous
                </button>
                <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold">
                  {page}
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white text-sm font-semibold disabled:opacity-30"
                >
                  Next →
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Confirmation Access Portals */}
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
