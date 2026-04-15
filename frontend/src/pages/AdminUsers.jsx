import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Shield,
  User,
  Mail,
  Clock3,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Square,
  CheckSquare,
  AlertTriangle,
  Trash2,
  X,
  Crown,
  Fingerprint,
} from 'lucide-react';
import api from '../services/api';

const LIMIT = 12;

function roleAccent(role) {
  if (String(role).toLowerCase() === 'admin') {
    return {
      color: '#d8b4fe',
      bg: 'rgba(168,85,247,0.16)',
      border: 'rgba(168,85,247,0.30)',
      glow: 'rgba(168,85,247,0.20)',
      icon: <Shield className="w-3.5 h-3.5" />,
      label: 'ADMIN',
    };
  }

  return {
    color: '#cbd5e1',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    glow: 'transparent',
    icon: <User className="w-3.5 h-3.5" />,
    label: 'USER',
  };
}

function initials(name = '') {
  return name.trim()?.[0]?.toUpperCase() || '?';
}

function formatDate(dateValue) {
  if (!dateValue) return 'Unknown date';

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return String(dateValue);

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCredits(value) {
  const num = Number(value || 0);
  return `$${num.toLocaleString('es-AR')}`;
}

function SearchInput({ value, onChange }) {
  return (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, or CID..."
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
  );
}

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

function UserRow({
  user,
  index,
  isSelected,
  onToggleSelect,
  onDelete,
  currentUserEmail,
}) {
  const role = roleAccent(user.role);
  const isYou =
    user.isYou ||
    (currentUserEmail &&
      typeof user.email === 'string' &&
      user.email.toLowerCase() === currentUserEmail.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.035, duration: 0.24 }}
      className="group"
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: '22px',
          padding: '16px 18px',
          background: isYou
            ? 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(88,28,135,0.16) 45%, rgba(10,10,18,0.96) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
          border: isYou
            ? '1px solid rgba(168,85,247,0.26)'
            : '1px solid rgba(255,255,255,0.05)',
          boxShadow: isYou
            ? '0 14px 28px rgba(168,85,247,0.08)'
            : '0 10px 24px rgba(0,0,0,0.18)',
          transition: 'all 180ms ease',
        }}
      >
        <div
          className="absolute top-0 left-0 bottom-0"
          style={{
            width: '3px',
            borderRadius: '10px',
            background: role.color,
            boxShadow: `0 0 12px ${role.glow}`,
          }}
        />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            borderRadius: '22px',
            background:
              'linear-gradient(90deg, transparent, rgba(168,85,247,0.05), transparent)',
            transition: 'opacity 180ms ease',
          }}
        />

        <div
          className="relative z-10 grid"
          style={{
            gridTemplateColumns: '34px 56px minmax(180px, 1.4fr) minmax(140px, 0.8fr) minmax(230px, 1.3fr) minmax(130px, 0.7fr) 48px',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => onToggleSelect(user._id)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '10px',
              background: isSelected
                ? 'rgba(168,85,247,0.16)'
                : 'rgba(255,255,255,0.03)',
              border: isSelected
                ? '1px solid rgba(168,85,247,0.30)'
                : '1px solid rgba(255,255,255,0.05)',
              color: isSelected ? '#c084fc' : 'rgba(255,255,255,0.42)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>

          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: isYou
                ? 'linear-gradient(135deg, rgba(168,85,247,0.34), rgba(99,102,241,0.22))'
                : 'linear-gradient(135deg, rgba(31,41,55,1), rgba(17,24,39,1))',
              border: isYou
                ? '1px solid rgba(168,85,247,0.30)'
                : '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              color: '#fff',
              boxShadow: isYou ? '0 0 18px rgba(168,85,247,0.14)' : 'none',
            }}
          >
            {initials(user.username || user.name || user.email)}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              className="flex items-center gap-2 flex-wrap"
              style={{ marginBottom: '4px' }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.1,
                }}
              >
                {user.username || user.name || 'Usuario sin nombre'}
              </span>

              {isYou && (
                <span
                  className="flex items-center gap-1"
                  style={{
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    background: 'rgba(168,85,247,0.18)',
                    border: '1px solid rgba(168,85,247,0.26)',
                    color: '#d8b4fe',
                    textTransform: 'uppercase',
                  }}
                >
                  <Crown className="w-3 h-3" />
                  You
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-2"
              style={{
                color: 'rgba(255,255,255,0.42)',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              CID: {user.cid || user._id?.slice(-8)?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>

          <div>
            <div
              className="inline-flex items-center gap-2"
              style={{
                padding: '7px 11px',
                borderRadius: '12px',
                background: role.bg,
                border: `1px solid ${role.border}`,
                color: role.color,
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                boxShadow: `0 0 12px ${role.glow}`,
              }}
            >
              {role.icon}
              {role.label}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              className="flex items-center gap-2"
              style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '6px',
                minWidth: 0,
              }}
            >
              <Mail className="w-4 h-4 text-[rgba(255,255,255,0.35)] shrink-0" />
              <span className="truncate">{user.email || 'No email'}</span>
            </div>

            <div
              className="flex items-center gap-2"
              style={{
                color: 'rgba(255,255,255,0.40)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Clock3 className="w-3.5 h-3.5 shrink-0" />
              {formatDate(user.createdAt || user.updatedAt || user.date)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              className="flex items-center justify-end gap-2"
              style={{
                color: '#00f5b0',
                fontSize: '14px',
                fontWeight: 900,
                fontFamily: 'monospace',
                marginBottom: '4px',
              }}
            >
              <Wallet className="w-4 h-4" />
              {formatCredits(user.credits ?? user.creditBalance ?? user.balance ?? 0)}
            </div>

            <div
              style={{
                color: 'rgba(255,255,255,0.34)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              Credits
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onDelete(user)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.14)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', page: 1 });
  const [selected, setSelected] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  const currentUserEmail = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return parsed?.email || '';
    } catch {
      return '';
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page: filters.page };
      if (filters.q) params.q = filters.q;

      const { data } = await api.get('/admin/users', { params });

      const list = data.users || data.usuarios || data.items || [];
      const pg = data.pagination || {
        total: list.length,
        page: filters.page,
        pages: 1,
      };

      setUsers(list);
      setPagination(pg);
    } catch (err) {
      console.error('User registry fetch error:', err);
      setUsers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.q]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
    setSelected(new Set());
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (users.length === 0) return;

    if (selected.size === users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users.map((u) => u._id)));
    }
  }

  async function handleDelete(userId) {
    try {
      await api.delete(`/admin/users/${userId}`);
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(Array.from(selected).map((id) => api.delete(`/admin/users/${id}`)));
      setBulkConfirm(false);
      setSelected(new Set());
      fetchUsers();
    } catch (err) {
      console.error(err);
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
        className="relative overflow-hidden"
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
            background:
              'linear-gradient(90deg, transparent, rgba(168,85,247,0.45), rgba(30,136,229,0.35), transparent)',
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
              Operator Access Grid
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
              User Management
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
                <Users className="w-4 h-4 text-[#c084fc]" />
                <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 800 }}>
                  {pagination.total?.toLocaleString() || users.length || 0}
                </span>
                <span>Users</span>
              </div>
              <span style={{ opacity: 0.35 }}>•</span>
              <span>Monitor profiles, access levels and credit balance.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2"
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
              {selected.size === users.length && users.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[#c084fc]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select Page
            </button>
          </div>
        </div>
      </div>

      {/* Controller */}
      <div
        className="relative overflow-hidden"
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

        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
          <SearchInput value={filters.q} onChange={(value) => setFilter('q', value)} />
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
                  {selected.size} operators selected
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(new Set())}
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
                  className="flex items-center gap-2"
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

      {/* Column Header */}
      {!loading && users.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '34px 56px minmax(180px, 1.4fr) minmax(140px, 0.8fr) minmax(230px, 1.3fr) minmax(130px, 0.7fr) 48px',
            gap: '16px',
            padding: '0 18px',
            color: 'rgba(255,255,255,0.34)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <div />
          <div />
          <div>User Identity</div>
          <div>Access Level</div>
          <div>Contact Node</div>
          <div style={{ textAlign: 'right' }}>Credit Balance</div>
          <div style={{ textAlign: 'right' }}>Action</div>
        </div>
      )}

      {/* Content */}
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
            Fetching Users...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div
          className="text-center"
          style={{
            padding: '90px 0',
          }}
        >
          <Users className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p
            style={{
              color: 'rgba(255,255,255,0.48)',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            No users found matching your criteria.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {users.map((user, i) => (
            <UserRow
              key={user._id}
              user={user}
              index={i}
              isSelected={selected.has(user._id)}
              onToggleSelect={toggleSelect}
              onDelete={setConfirmDelete}
              currentUserEmail={currentUserEmail}
            />
          ))}
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
            {Math.min(filters.page * LIMIT, pagination.total || 0)} of {pagination.total || 0} users
          </p>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page <= 1}
              className="flex items-center gap-2"
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
              className="flex items-center gap-2"
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
        {confirmDelete && (
          <ConfirmModal
            message={`Are you sure you want to delete "${confirmDelete.name || confirmDelete.email || 'this user'}"? This action cannot be undone.`}
            onConfirm={() => handleDelete(confirmDelete._id)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {bulkConfirm && (
          <ConfirmModal
            message={`Are you sure you want to delete the ${selected.size} selected users? This action cannot be undone.`}
            onConfirm={handleBulkDelete}
            onCancel={() => setBulkConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
