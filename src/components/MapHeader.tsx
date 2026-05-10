import { useState } from 'react';

interface MapHeaderProps {
  className?: string;
}

export default function MapHeader({ className = '' }: MapHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`absolute top-0 left-0 right-0 z-[2000] ${className}`}>
      <div className="bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-transparent backdrop-blur-md border-b border-slate-800/50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y Título */}
            <div className="flex items-center gap-6">
              {/* Logo Clickeable */}
              <a 
                href="/" 
                className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
                title="Volver al inicio"
              >
                <img 
                  src="/logo.png" 
                  alt="Achiki O'pala Logo" 
                  className="h-10 w-auto object-contain drop-shadow-lg"
                />
                <div className="hidden sm:block border-l border-slate-700 pl-4">
                  <h1 className="text-white text-base font-semibold leading-tight">
                    Erosión Costera
                  </h1>
                  <p className="text-slate-400 text-xs leading-tight">
                    Dibulla - Palomino
                  </p>
                </div>
              </a>

              {/* Separador */}
              <div className="hidden lg:block h-8 w-px bg-slate-700"></div>

              {/* Info del Sistema */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Sistema Activo</span>
                </div>
                
                <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-xs text-blue-400 font-mono">25 años de datos</span>
                </div>
                
                <div className="px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <span className="text-xs text-purple-400 font-mono">Landsat 5-9</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              {/* Documentación */}
              <a 
                href="/documentacion" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-500/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Documentación</span>
              </a>

              {/* Menú móvil */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
                aria-label="Menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil expandido */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-slate-800 pt-4">
              <a 
                href="/documentacion" 
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Documentación
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
