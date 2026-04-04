import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Gamepad2, 
  Zap, 
  Coins, 
  CheckCircle2, 
  HelpCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const TABS = [
  { id: 'daily', label: 'Bonus Diario', icon: Calendar },
  { id: 'trivia', label: 'Trivia Pokémon', icon: Gamepad2 },
];

export default function Recompensas() {
  const [activeTab, setActiveTab] = useState('daily');
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  
  // State para Trivia
  const [trivia, setTrivia] = useState(null);
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [triviaResult, setTriviaResult] = useState(null);

  // State para Ruleta
  const [spinning, setSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState(null);

  // State para Logros
  const [logros, setLogros] = useState([]);
  const [logrosLoading, setLogrosLoading] = useState(true);

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

  const girarRuleta = async () => {
    if (spinning || estado?.energy < 2) return;
    setSpinning(true);
    setRouletteResult(null);
    
    try {
      // Simulamos un delay visual para el giro
      const res = await api.post('/recompensas/ruleta/girar');
      
      // Esperamos a que la animación de la ruleta termine (aprox 3s)
      setTimeout(() => {
        setRouletteResult(res.data);
        setSpinning(false);
        setEstado(prev => ({
          ...prev,
          energy: res.data.energiaActual,
          balance: res.data.nuevoBalance
        }));
        fetchLogros(); // Actualizar logros por si completó alguno
      }, 3000);

    } catch (err) {
      alert(err.response?.data?.error || 'Error en la ruleta');
      setSpinning(false);
    }
  };

  const reclamarDiario = async () => {
    if (claiming || !estado?.bonusDisponible) return;
    setClaiming(true);
    try {
      const res = await api.post('/recompensas/diaria');
      setEstado(prev => ({
        ...prev,
        balance: res.data.nuevoBalance,
        streak: res.data.streak,
        bonusDisponible: false,
        mensajeBonus: `Reclamado hoy. vuelve mañana!`
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reclamar');
    } finally {
      setClaiming(false);
    }
  };

  const iniciarTrivia = async () => {
    // Sincronizar estado antes de jugar si es posible
    if (estado?.energy <= 0) {
       // Intentamos un refetch rápido por si se recargó energía
       await fetchEstado();
       if (estado?.energy <= 0) return;
    }
    
    setTriviaLoading(true);
    setTriviaResult(null);
    setSelectedOption(null);
    try {
      const res = await api.get('/recompensas/trivia');
      setTrivia(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al iniciar trivia');
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
      
      // Actualizar energía y balance desde la respuesta del servidor (fuente de verdad)
      setEstado(prev => ({
        ...prev,
        energy: res.data.energiaActual !== undefined ? res.data.energiaActual : prev.energy - 1,
        balance: prev.balance + (res.data.success ? res.data.monedasGanadas : 0)
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al verificar respuesta');
      setSelectedOption(null); // Permitir reintentar si fue un error de red
    }
  };

  if (loading && !estado) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-white">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-8 pb-24">
      {/* Header Fijo / Flotante Style */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            REWARDS <span className="text-yellow-400">HUB</span>
          </h1>
          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">Status: Connected // Protocol: Cyber-Retro</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-gray-950 border border-yellow-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Coins className="text-yellow-400" size={24} />
              <span className="text-2xl font-bold text-white tabular-nums">{estado?.balance.toLocaleString()}</span>
            </div>
          </div>
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur ${estado?.energy > 0 ? 'opacity-25' : 'opacity-0'} group-hover:opacity-50 transition duration-1000`}></div>
            <div className="relative bg-gray-950 border border-blue-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Zap className={estado?.energy > 0 ? 'text-blue-400 animate-pulse' : 'text-gray-600'} size={24} />
              <span className="text-2xl font-bold text-white">{estado?.energy || 0}/5</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECCIÓN 1: BONUS DIARIO */}
      <section className="relative py-[160px]">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-transparent rounded-full opacity-20"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
            <Calendar className="text-yellow-400" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white italic">RACHA DIARIA</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
          {estado?.streakRewards.map((reward, i) => {
            const day = i + 1;
            const isCompleted = day <= estado.streak;
            const isCurrent = day === estado.streak + 1 && estado.bonusDisponible;
            
            return (
              <motion.div
                key={day}
                whileHover={{ y: -5 }}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 aspect-square transition-all ${
                  isCompleted 
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' 
                    : isCurrent 
                      ? 'bg-blue-500/10 border-blue-500/70 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/5 border-white/5 text-gray-600'
                }`}
              >
                <span className="text-[10px] font-black tracking-widest opacity-50 uppercase">DÍA {day}</span>
                {isCompleted ? <CheckCircle2 size={32} /> : <Coins size={32} />}
                <span className="font-black text-xl">{reward}</span>
                {isCurrent && (
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-blue-400/10 rounded-2xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="bg-gray-950 border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <p className="text-sm font-mono text-yellow-500/70 mb-2">// CURRENT_STREAK</p>
            <h3 className="text-5xl font-black text-white italic mb-2">
              {estado?.streak} <span className="text-gray-600 not-italic">DÍAS</span>
            </h3>
            <p className="text-gray-400 max-w-sm">{estado?.mensajeBonus}</p>
          </div>

          <button
            onClick={reclamarDiario}
            disabled={!estado?.bonusDisponible || claiming}
            className={`relative px-12 py-6 rounded-2xl font-black text-2xl transition-all ${
              estado?.bonusDisponible 
                ? 'bg-white text-black hover:bg-yellow-400 hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.2)]' 
                : 'bg-gray-900 text-gray-700 border border-white/5 cursor-not-allowed'
            }`}
          >
            {claiming ? 'CLAIMING...' : estado?.bonusDisponible ? 'CLAIM BONUS' : 'REWARDED'}
          </button>
        </div>
      </section>

      {/* SECCIÓN 2: RULETA (NUEVA) */}
      <section className="relative py-[160px]">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-transparent rounded-full opacity-20"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <Zap className="text-blue-400" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white italic">RULETA CYBERNÉTICA</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center bg-gray-950 border border-white/5 p-12 rounded-[2.5rem]">
          <div className="flex flex-col items-center justify-center relative">
            {/* Componente visual de la Ruleta (Simulada con CSS de alto nivel) */}
            <motion.div 
               animate={{ rotate: spinning ? 1800 : (rouletteResult ? 360 : 0) }}
               transition={{ duration: spinning ? 3 : 0.5, ease: "circOut" }}
               className="w-64 h-64 rounded-full border-8 border-gray-900 relative shadow-[0_0_80px_rgba(59,130,246,0.2)]"
            >
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/20 animate-spin-slow"></div>
              {/* Marcadores de premios simplificados */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 45}deg)` }}>
                   <div className={`w-1 h-8 mx-auto ${i % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-500'} rounded-full opacity-40`}></div>
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Zap className="text-black" size={32} />
                 </div>
              </div>
            </motion.div>
            
            {/* Puntero */}
            <div className="absolute top-0 left-1/2 -ml-2 -mt-4 w-4 h-8 bg-blue-400 rounded-b-full shadow-lg z-10"></div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic">Prueba tu Suerte</h3>
              <p className="text-gray-400">
                Gira la ruleta galáctica para obtener premios instantáneos. 
                Puedes ganar <span className="text-yellow-400">monedas</span>, <span className="text-blue-400">energía</span> o incluso <span className="text-purple-400 font-bold">cartas legendarias</span>.
              </p>
            </div>

            <div className="flex items-center gap-4 text-blue-400 font-mono text-sm font-bold bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
               <Zap size={18} />
               <span>COSTO: 2 PUNTOS DE ENERGÍA</span>
            </div>

            <button
               onClick={girarRuleta}
               disabled={spinning || estado?.energy < 2}
               className={`w-full py-6 rounded-2xl font-black text-2xl tracking-widest transition-all ${
                 estado?.energy >= 2 && !spinning
                   ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4)]'
                   : 'bg-gray-900 text-gray-700 border border-white/5 opacity-50 cursor-not-allowed'
               }`}
            >
              {spinning ? 'SPINNING...' : 'GIRAR AHORA'}
            </button>

            <AnimatePresence>
               {rouletteResult && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
                 >
                    <p className="text-green-400 font-bold text-lg">
                      ¡GANASTE: <span className="text-white">{rouletteResult.premio.label}</span>!
                    </p>
                    {rouletteResult.carta && (
                      <div className="mt-2 flex items-center justify-center gap-4">
                        <img src={rouletteResult.carta.image} alt={rouletteResult.carta.name} className="w-16 h-20 object-contain rounded-md" />
                        <span className="text-yellow-400 font-black">{rouletteResult.carta.name}</span>
                      </div>
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: TRIVIA */}
      <section className="relative py-[160px]">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-transparent rounded-full opacity-20"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
            <Gamepad2 className="text-purple-400" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white italic">TRIVIA MASTER</h2>
        </div>

        {!trivia && !triviaResult ? (
          <div className="bg-gray-950 border border-white/5 p-12 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mb-8 border-2 border-dashed border-purple-500/30 relative">
               <HelpCircle size={64} className="text-purple-500/40 animate-pulse" />
               <div className="absolute inset-x-0 bottom-0 whitespace-nowrap">
                 <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">New Game</span>
               </div>
            </div>
            <h3 className="text-4xl font-black text-white mb-4 italic">¿QUIÉN ES ESTE POKÉMON?</h3>
            <p className="text-gray-400 max-w-md mb-8">
              Identifica la silueta borrosa para ganar <span className="text-yellow-400">monedas</span> y subir de nivel.
            </p>
            <button
               onClick={iniciarTrivia}
               disabled={estado?.energy <= 0 || triviaLoading}
               className="px-12 py-6 rounded-2xl bg-purple-600 text-white font-black text-2xl hover:bg-purple-500 shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all"
            >
              {triviaLoading ? 'INITIALIZING...' : 'JUGAR (1 ENERGÍA)'}
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-gray-950 border border-white/5 p-8 rounded-[2.5rem]">
             <div className="relative group bg-black/40 rounded-3xl p-8 border border-white/5 aspect-square flex items-center justify-center overflow-hidden">
                <motion.img 
                  key={trivia?.imagen}
                  src={trivia?.imagen || (triviaResult ? 'TODO_IMAGE' : '')} 
                  className={`h-full object-contain transition-all duration-700 ease-out ${
                    !triviaResult 
                      ? 'blur-[35px] brightness-125 saturate-200 scale-110' 
                      : 'blur-0 brightness-100 saturate-100 scale-100'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
             </div>

             <div className="space-y-8">
                {triviaResult ? (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`p-10 rounded-3xl text-center ${
                       triviaResult.success ? 'bg-green-500/10 border-2 border-green-500/50' : 'bg-red-500/10 border-2 border-red-500/50'
                     }`}
                   >
                      <Trophy className={`mx-auto mb-4 ${triviaResult.success ? 'text-yellow-400' : 'text-gray-400'}`} size={64} />
                      <h4 className="text-3xl font-black italic text-white uppercase mb-2">{triviaResult.mensaje}</h4>
                      <p className="text-gray-400 mb-8">{triviaResult.success ? `+${triviaResult.monedasGanadas} Monedas acreditadas.` : 'No te rindas, entrenador.'}</p>
                      <button 
                         onClick={iniciarTrivia}
                         disabled={estado?.energy <= 0}
                         className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-yellow-400 transition-all"
                      >
                         PRÓXIMO ROUND
                      </button>
                   </motion.div>
                ) : (
                   <div className="space-y-4">
                      <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">// SELECT_ANSWER</p>
                      <div className="grid gap-4">
                        {trivia?.opciones.map((opc, idx) => (
                           <button
                             key={idx}
                             onClick={() => responderTrivia(opc)}
                             className="w-full py-6 px-8 rounded-2xl border-2 border-white/5 bg-gray-900/50 text-white font-black text-xl text-left hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex justify-between items-center group"
                           >
                             {opc}
                             <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                        ))}
                      </div>
                   </div>
                )}
             </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 4: LOGROS */}
      <section className="relative py-[160px]">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-transparent rounded-full opacity-20"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
            <Trophy className="text-green-400" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white italic">LOGROS DE ENTRENADOR</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           {logrosLoading ? (
             [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-950 border border-white/5 rounded-2xl animate-pulse"></div>)
           ) : (
             logros.map((logro) => (
               <motion.div 
                 key={logro.id}
                 whileHover={{ x: 5 }}
                 className={`p-6 bg-gray-950 border rounded-[1.5rem] flex items-center gap-6 relative overflow-hidden ${
                   logro.completado ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'
                 }`}
               >
                  <div className={`p-4 rounded-2xl ${logro.completado ? 'bg-green-500 text-black' : 'bg-gray-900 text-gray-500'}`}>
                    <Trophy size={32} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-lg font-black text-white italic">{logro.titulo}</h4>
                     <p className="text-xs text-gray-500 mb-4">{logro.desc}</p>
                     
                     <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                           <span>PROGRESS</span>
                           <span>{logro.actual} / {logro.meta}</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${logro.progreso}%` }}
                             className={`h-full ${logro.completado ? 'bg-green-500' : 'bg-blue-500'}`}
                           />
                        </div>
                     </div>
                  </div>
                  {logro.completado && (
                    <div className="absolute top-0 right-0 p-2">
                       <CheckCircle2 className="text-green-500" size={20} />
                    </div>
                  )}
               </motion.div>
             ))
           )}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="text-center py-12 border-t border-white/5">
         <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
           Antigravity TCG Engine v1.0 // Pokemon Vault Secure Connection
         </p>
      </footer>
    </div>
  );
}
