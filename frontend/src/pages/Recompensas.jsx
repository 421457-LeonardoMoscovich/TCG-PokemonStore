import { useState, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import api from '../services/api';
import { useMotionPreference } from '../hooks/useMotionPreference';
import {
  HeroBanner,
  BattlePass,
  Missions,
  Leaderboard,
  RouletteWheel,
  TriviaGame,
  AchievementCard,
} from '../components/rewards';

function AnimCounter({ to, prefix = '', suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v).toLocaleString('es-AR')}${suffix}`;
      },
    });
    return () => ctrl.stop();
  }, [to, prefix, suffix]);
  return <span ref={ref}>0</span>;
}

export default function Recompensas() {
  const prefersReducedMotion = useMotionPreference();
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [claimingLogro, setClaimingLogro] = useState(false);
  const [logros, setLogros] = useState([]);
  const [logrosLoading, setLogrosLoading] = useState(true);

  // Trivia state
  const [trivia, setTrivia] = useState(null);
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [triviaResult, setTriviaResult] = useState(null);

  // Roulette state
  const [spinning, setSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState(null);

  // Energy timer state
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchEstado();
    fetchLogros();
  }, []);

  const fetchEstado = async () => {
    try {
      const res = await api.get('/recompensas/estado');
      setEstado(res.data);
    } catch (err) {
      console.error('Error fetching rewards state:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogros = async () => {
    try {
      const res = await api.get('/recompensas/logros');
      setLogros(res.data.logros);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLogrosLoading(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (estado?.energy >= 5) {
      setTimeLeft(null);
      return;
    }

    if (estado?.nextEnergyIn !== undefined && !timeLeft) {
      setTimeLeft(estado.nextEnergyIn * 60);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchEstado();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [estado, timeLeft]);

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reclamarDiario = async () => {
    if (claimingDaily || !estado?.bonusDisponible) return;
    setClaimingDaily(true);
    try {
      const res = await api.post('/recompensas/diaria');
      setEstado((prev) => ({
        ...prev,
        balance: res.data.nuevoBalance,
        streak: res.data.streak,
        bonusDisponible: false,
        mensajeBonus: `¡Bono reclamado! Vuelve mañana para continuar.`,
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reclamar');
    } finally {
      setClaimingDaily(false);
    }
  };

  const girarRuleta = async () => {
    if (spinning || (estado?.energy || 0) < 2) return;
    setSpinning(true);
    setRouletteResult(null);

    try {
      const res = await api.post('/recompensas/ruleta/girar');

      setTimeout(() => {
        setRouletteResult(res.data);
        setSpinning(false);
        setEstado((prev) => ({
          ...prev,
          energy: res.data.energiaActual,
          balance: res.data.nuevoBalance,
        }));
        fetchLogros();
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error en la ruleta');
      setSpinning(false);
    }
  };

  const iniciarTrivia = async () => {
    if ((estado?.energy || 0) <= 0) {
      await fetchEstado();
      if ((estado?.energy || 0) <= 0) return;
    }

    setTriviaLoading(true);
    setTriviaResult(null);
    setSelectedOption(null);
    try {
      const res = await api.get('/recompensas/trivia');
      setTrivia(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al iniciar juego');
    } finally {
      setTriviaLoading(false);
    }
  };

  const responderTrivia = async (nombre) => {
    if (selectedOption || triviaResult) return;
    setSelectedOption(nombre);
    try {
      const res = await api.post('/recompensas/trivia/verificar', { respuesta: nombre });
      setTriviaResult(res.data);

      setEstado((prev) => ({
        ...prev,
        energy: res.data.energiaActual !== undefined ? res.data.energiaActual : prev.energy - 1,
        balance: prev.balance + (res.data.success ? res.data.monedasGanadas : 0),
      }));

      setTimeout(() => {
        setTriviaResult(null);
        setSelectedOption(null);
        setTrivia(null);
        fetchLogros();
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al verificar respuesta');
      setSelectedOption(null);
    }
  };

  const reclamarLogro = async (logroId) => {
    setClaimingLogro(true);
    try {
      const res = await api.post('/recompensas/logros/reclamar', { logroId });
      setEstado((prev) => ({
        ...prev,
        balance: res.data.nuevoBalance,
      }));
      setLogros((prev) => prev.map((l) => (l.id === logroId ? { ...l, reclamado: true } : l)));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reclamar logro');
    } finally {
      setClaimingLogro(false);
    }
  };

  if (loading && !estado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020202] text-white font-['Space_Grotesk']">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 border-2 border-[#ddb7ff]/20 border-t-[#ddb7ff] rounded-full mb-6"
        />
        <p className="text-[10px] font-mono text-[#ddb7ff] animate-pulse uppercase tracking-[0.5em]">
          Cargando...
        </p>
      </div>
    );
  }

  const mainVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const statsCardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e5e2e1] font-['Space_Grotesk'] selection:bg-[#ddb7ff] selection:text-black flex flex-col">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_70%)]" />

      {/* Top Bar - Stats */}
      <motion.nav
        className="sticky top-0 w-full z-40 bg-[#141313] bg-gradient-to-b from-[#1c1b1b] to-transparent shadow-[0_0_15px_rgba(221,183,255,0.05)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 h-24 max-w-[1600px] mx-auto">
          <motion.div
            className="text-2xl font-black text-[#ffe083] tracking-widest uppercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pokémon TCG
          </motion.div>

          <motion.div
            className="hidden md:flex gap-6 items-center"
            variants={mainVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Balance Card */}
            <motion.div variants={statsCardVariants} className="vault-panel px-6 py-3 rounded-lg border-l-2 border-[#ffe083]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffe083] text-sm">account_balance_wallet</span>
                <div className="text-right">
                  <p className="text-[10px] text-[#cfc2d6] font-black uppercase tracking-widest">Balance</p>
                  <p className="text-white font-black tabular-nums">
                    <AnimCounter to={estado?.balance || 0} />
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Energy Card */}
            <motion.div variants={statsCardVariants} className="vault-panel px-6 py-3 rounded-lg border-l-2 border-[#ddb7ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ddb7ff] text-sm animate-pulse">bolt</span>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {estado?.energy < 5 && (
                      <span className="text-[9px] text-[#ddb7ff]/60 font-mono">{formatTime(timeLeft)}</span>
                    )}
                    <p className="text-[10px] text-[#cfc2d6] font-black uppercase tracking-widest">Energía</p>
                  </div>
                  <p className="text-white font-black tabular-nums">
                    <AnimCounter to={estado?.energy || 0} suffix={'/5'} />
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div variants={statsCardVariants} className="vault-panel px-6 py-3 rounded-lg border-l-2 border-[#a78bfa]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a78bfa] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                <div className="text-right">
                  <p className="text-[10px] text-[#cfc2d6] font-black uppercase tracking-widest">Racha</p>
                  <p className="text-white font-black tabular-nums">
                    <AnimCounter to={estado?.streak || 0} suffix={' días'} />
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main
        className="flex-1 pt-16 pb-28 px-6 md:px-12 relative z-10 max-w-[1600px] mx-auto w-full"
        variants={mainVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Hero Banner */}
        <motion.div className="mb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <HeroBanner estado={estado} onClaim={reclamarDiario} claiming={claimingDaily} />
        </motion.div>

        {/* Section Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent mb-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />

        {/* 2. Battle Pass */}
        <motion.div className="mb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <BattlePass />
        </motion.div>

        {/* Section Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent mb-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* 3. Games Grid (2 col) */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="lg:col-span-2">
            <RouletteWheel estado={estado} onSpin={girarRuleta} spinning={spinning} result={rouletteResult} />
          </div>
          <div className="lg:col-span-1">
            <TriviaGame
              estado={estado}
              trivia={trivia}
              triviaLoading={triviaLoading}
              selectedOption={selectedOption}
              triviaResult={triviaResult}
              onStart={iniciarTrivia}
              onAnswer={responderTrivia}
            />
          </div>
        </motion.div>

        {/* Section Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent mb-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />

        {/* 4. Missions */}
        <motion.div className="mb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Missions />
        </motion.div>

        {/* Section Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent mb-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* 5. Achievements */}
        <motion.section className="mb-24" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, delay: 0.5 }}>
          <div className="mb-10 relative">
            <div className="absolute -left-8 top-0 text-[60px] font-black text-[#ddb7ff]/5 select-none leading-none">
              🎯
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Mis Logros</h2>
          </div>

          {logrosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} className="h-48 bg-white/5 border border-white/5 rounded-lg animate-pulse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={mainVariants}
              initial="hidden"
              animate="visible"
            >
              {logros.map((logro, idx) => (
                <AchievementCard
                  key={logro.id}
                  logro={logro}
                  index={idx}
                  onClaim={reclamarLogro}
                  claiming={claimingLogro}
                />
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Section Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent my-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        {/* 6. Leaderboard */}
        <motion.div className="mb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Leaderboard />
        </motion.div>

        {/* Footer */}
        <motion.footer className="text-center py-16 border-t border-[#1c1b1b] opacity-40 mt-20" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ duration: 0.8, delay: 0.7 }}>
          <p className="text-[#e5e2e1]/20 font-black tracking-widest uppercase text-[9px] mb-4">
            Rewards System v3.0 — Premium Edition
          </p>
        </motion.footer>
      </motion.main>

      {/* Mobile Bottom Nav */}
      <motion.nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-[#141313]/90 backdrop-blur-xl border-t border-[#353434] lg:hidden px-4 shadow-[0_-10px_30px_rgba(221,183,255,0.1)]"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {[
          { id: 'home', label: 'Inicio', icon: 'home', href: '/' },
          { id: 'rewards', label: 'Recompensas', icon: 'gift', href: '/recompensas', fill: true },
          { id: 'profile', label: 'Perfil', icon: 'person', href: '/perfil' },
        ].map((item, idx) => (
          <motion.a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-all ${
              item.fill ? 'text-[#ffe083] drop-shadow-[0_0_5px_#ffe083]' : 'text-[#e5e2e1]/40'
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <motion.span
              className="material-symbols-outlined text-lg"
              style={item.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
              animate={item.fill ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.icon}
            </motion.span>
            <span className="mt-1 text-[10px]">{item.label}</span>
          </motion.a>
        ))}
      </motion.nav>
    </div>
  );
}
