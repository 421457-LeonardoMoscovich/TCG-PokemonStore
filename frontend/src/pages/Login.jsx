import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/usuarios/login' : '/usuarios/registro';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, username: form.username, password: form.password };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      navigate('/cartas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-bg-base text-white">
      {/* LEFT PANE - Master Ball Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-elevated flex-col items-center justify-center p-12 overflow-hidden border-r border-[#7C4DFF]/10">
        {/* Ambient Master Ball Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,77,255,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(233,30,99,0.12)_0%,transparent_60%)]" />
        
        <div className="relative z-10 text-center flex flex-col items-center mt-[-5%]">
          {/* Master Ball Pure CSS Drawing */}
          <div className="relative mb-16 w-72 h-72 rounded-full shadow-[0_0_100px_rgba(124,77,255,0.4)] border-[6px] border-black bg-white overflow-hidden animate-float">
            
            {/* Top Hemisphere (Deep Purple/Dragon Type) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#b052d1] to-[#603db0]" />
            
            {/* Pink Bumps (Psychic Type) */}
            <div className="absolute top-8 left-8 w-16 h-12 bg-[#df336f] rounded-full -rotate-[40deg] border-[3px] border-black/50 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.5)] z-10" />
            <div className="absolute top-8 right-8 w-16 h-12 bg-[#df336f] rounded-full rotate-[40deg] border-[3px] border-black/50 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.5)] z-10" />
            
            {/* The 'M' Badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center">
              <span className="text-7xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '-4px' }}>M</span>
            </div>
            
            {/* Middle Black Band */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 bg-black z-20 shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            
            {/* Center Button Base (Black) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black rounded-full z-30 flex items-center justify-center">
               {/* Center Button Ring (White) */}
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  {/* Inner Glow Button */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_0_20px_rgba(255,255,255,0.9)] border border-gray-400 group-hover:bg-primary transition-all duration-300" />
               </div>
            </div>

            {/* Bottom Hemisphere Texture */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-100 to-gray-400 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]" />

            {/* 3D Lighting/Shading Overlay for the entire sphere */}
            <div className="absolute inset-0 rounded-full border-[12px] border-black/15 mix-blend-overlay z-40 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.6)_0%,transparent_50%)] pointer-events-none z-50 rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.5)_0%,transparent_50%)] pointer-events-none z-50 rounded-full mix-blend-multiply" />
          </div>

          <h1 className="text-6xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Ratio de Captura <span className="bg-clip-text bg-gradient-to-r from-[#7C4DFF] to-[#E91E63] text-transparent drop-shadow-[0_0_25px_rgba(124,77,255,0.4)]">100%</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-md font-medium leading-relaxed">
            Asegura hoy mismo tus reliquias en la bóveda coleccionista definitiva de élite.
          </p>
        </div>
      </div>

      {/* RIGHT PANE - Form */}
      <main className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-hidden bg-bg-surface">
        {/* Mobile blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C4DFF]/10 blur-[100px] rounded-full lg:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E91E63]/10 blur-[100px] rounded-full lg:hidden pointer-events-none" />
        
        <div className="w-full max-w-lg relative z-10 mt-12 lg:mt-0">
          {/* Mobile Text */}
          <div className="flex flex-col items-center lg:items-start mb-12">
            <h2 className="text-4xl font-extrabold lg:text-5xl tracking-tight text-white mb-4 drop-shadow-md">
              {mode === 'login' ? 'Bienvenido a la Bóveda' : 'Crear Cuenta Élite'}
            </h2>
            <p className="text-base text-gray-400 font-medium">
              {mode === 'login' ? 'Accede a tus cartas legendarias' : 'Asegura tu colección nivel Master'}
            </p>
          </div>

          <div className="p-8 sm:p-12 relative bg-[#0a0a0c]/90 border-t border-b border-white/10 border-l-4 border-l-[#7C4DFF] border-r-4 border-r-[#E91E63] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl group/panel">
            {/* Cyber Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />

            {/* Tabs (Sharp Cyber Control) */}
            <div className="flex w-full mb-14 p-1 bg-black/80 border border-white/10">
              {['login', 'registro'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setMode(tab); setError(''); }}
                  className={`flex-1 py-4 px-4 text-xs sm:text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                    mode === tab 
                      ? 'bg-gradient-to-r from-[#7C4DFF]/10 to-[#E91E63]/10 text-white border-b-2 border-[#7C4DFF] shadow-[inset_0_0_15px_rgba(124,77,255,0.1)]' 
                      : 'text-gray-600 hover:text-gray-300 border-b-2 border-transparent hover:bg-white/5'
                  }`}
                >
                  {tab === 'login' ? 'Ingresar' : 'Registrarse'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative">
              {/* Username — solo registro */}
              {mode === 'registro' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C4DFF] mb-4 pl-1 drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
                    Usuario
                  </label>
                  <div className="relative group">
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      placeholder="Red_Champion"
                      className="w-full bg-black/60 border border-white/10 border-l-4 border-l-[#7C4DFF]/40 rounded-none px-6 py-5 text-base text-white focus:outline-none focus:border-[#7C4DFF] focus:border-l-[#E91E63] focus:bg-[#7C4DFF]/5 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C4DFF] mb-4 pl-1 drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
                  Email
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="campeon@indigo.plateau"
                    className="w-full bg-black/60 border border-white/10 border-l-4 border-l-[#7C4DFF]/40 rounded-none px-6 py-5 text-base text-white focus:outline-none focus:border-[#7C4DFF] focus:border-l-[#E91E63] focus:bg-[#7C4DFF]/5 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C4DFF] mb-4 pl-1 drop-shadow-[0_0_10px_rgba(124,77,255,0.8)]">
                  Contraseña
                </label>
                <div className="relative group">
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/60 border border-white/10 border-l-4 border-l-[#7C4DFF]/40 rounded-none pl-6 pr-16 py-5 text-base text-white focus:outline-none focus:border-[#7C4DFF] focus:border-l-[#E91E63] focus:bg-[#7C4DFF]/5 transition-all placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 border border-white/5 rounded-none"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-[#E91E63]/10 border-l-4 border-[#E91E63] text-[#E91E63] text-sm font-bold p-5 text-center shadow-[0_0_20px_rgba(233,30,99,0.2)]">
                  {error}
                </div>
              )}

              {/* Submit - Extended Sharp Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-transparent border-2 border-[#7C4DFF] text-white font-black text-sm tracking-[0.4em] uppercase py-6 shadow-[0_0_30px_rgba(124,77,255,0.3)] hover:shadow-[0_0_50px_rgba(233,30,99,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-12 group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#E91E63] opacity-20 group-hover/btn:opacity-50 transition-opacity duration-300" />
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {loading ? 'Cargando...' : (mode === 'login' ? 'INGRESAR' : 'REGISTRARSE')}
                </span>
              </button>
            </form>
          </div>

          <p className="mt-14 text-center text-sm text-gray-500 font-medium">
            Al continuar, aceptas la{' '}
            <span className="text-[#7C4DFF] cursor-pointer hover:underline hover:text-white transition-all">Regulación TCG</span>{' '}
            y la{' '}
            <span className="text-[#E91E63] cursor-pointer hover:underline hover:text-white transition-all">Encriptación Pokedex</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
