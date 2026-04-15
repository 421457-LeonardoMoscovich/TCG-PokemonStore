import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Globe, Lock, Sparkles } from 'lucide-react';

export default function Footer() {
  const [newsletterMsg, setNewsletterMsg] = useState('');

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    setNewsletterMsg('Solicitud registrada.');
  }

  return (
    <footer
      className="relative overflow-hidden border-t border-white/5 mt-20"
      style={{
        background: 'linear-gradient(to bottom, #050508 0%, #000000 100%)',
        paddingTop: '72px',
        paddingBottom: '24px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '70%',
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(255, 193, 7, 0.22), transparent)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-70px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '460px',
          height: '160px',
          background: 'rgba(255, 193, 7, 0.08)',
          filter: 'blur(95px)',
        }}
      />

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 xl:px-12 relative z-10">
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{
            gap: '40px',
            alignItems: 'start',
          }}
        >
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-4" style={{ marginBottom: '20px' }}>
              <div
                className="flex items-center justify-center rounded-2xl border border-white/10"
                style={{
                  width: '68px',
                  height: '68px',
                  background:
                    'linear-gradient(135deg, rgba(255,235,59,0.14) 0%, rgba(245,124,0,0.12) 100%)',
                  boxShadow: '0 0 24px rgba(255, 193, 7, 0.12)',
                }}
              >
                <Sparkles className="w-7 h-7 text-primary" />
              </div>

              <div className="leading-none">
                <div className="font-black tracking-tight" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                  <span className="text-white">TCG </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#F57C00]">
                    VAULT
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 max-w-[460px] leading-relaxed" style={{ fontSize: '15px', marginBottom: '24px' }}>
              La bóveda definitiva para coleccionistas de élite. Preservación, comercio y exhibición de clase mundial.
            </p>

            <form
              className="w-full max-w-[420px] relative"
              style={{ marginTop: '4px' }}
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="email"
                placeholder="Únete al VIP Newsletter..."
                className="w-full text-white placeholder:text-gray-500 border border-white/10 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '14px',
                  paddingLeft: '16px',
                  paddingRight: '122px',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  fontSize: '14px',
                }}
              />

              <button
                className="absolute text-[#0a0a0a] font-black uppercase"
                style={{
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  background: 'linear-gradient(to right, #FFEB3B, #F57C00)',
                  boxShadow: '0 8px 24px rgba(255, 193, 7, 0.18)',
                }}
                type="submit"
              >
                Unirse
              </button>
              {newsletterMsg && (
                <p className="text-primary text-xs font-bold mt-3">{newsletterMsg}</p>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4
              className="text-white/45 uppercase font-black"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                marginBottom: '16px',
              }}
            >
              Mercado
            </h4>

            <ul className="space-y-3">
              {['Explorar Todo', 'Últimos Drops', 'Cartas Graduadas', 'Cajas Selladas'].map((item) => (
                <li key={item}>
                  <Link
                    to="/catalogo"
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4
              className="text-white/45 uppercase font-black"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                marginBottom: '16px',
              }}
            >
              Legal
            </h4>

            <ul className="space-y-3">
              {['Centro de Ayuda', 'Políticas', 'Privacidad', 'Términos'].map((item) => (
                <li key={item}>
                  <span
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4
              className="text-white/45 uppercase font-black"
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                marginBottom: '16px',
              }}
            >
              Social
            </h4>

            <div className="flex lg:flex-col gap-3">
              {['TW', 'IG', 'DC'].map((label) => (
                <a
                  key={label}
                  href={label === 'TW' ? 'https://twitter.com' : label === 'IG' ? 'https://instagram.com' : 'https://discord.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center text-gray-300 hover:text-white border border-white/10 hover:border-primary/40 transition-all"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="border-t border-white/5"
          style={{
            marginTop: '36px',
            paddingTop: '18px',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div
              className="text-gray-500 uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                fontWeight: 700,
              }}
            >
              © {new Date().getFullYear()} TCG VAULT INC.
            </div>

            <div className="flex items-center gap-6 flex-wrap justify-center">
              <span
                className="flex items-center gap-2 text-gray-400"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <Lock className="w-4 h-4" />
                Encriptado
              </span>

              <span
                className="flex items-center gap-2 text-gray-400"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <Globe className="w-4 h-4" />
                Global
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
