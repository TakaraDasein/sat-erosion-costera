import { User, Bell, Settings, Map, FileText, Home } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#2d2d2d]/95 backdrop-blur-md border-b border-white/10 px-8 lg:px-16 py-4">
      <div className="flex items-center justify-between">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Achiki O'pala" 
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" 
            />
            <span className="text-white font-bold text-lg hidden md:block">Achiki O'pala</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Inicio
            </a>
            <a href="/mapa" className="text-white/80 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-2">
              <Map className="w-4 h-4" />
              Mapa Interactivo
            </a>
            <a href="/documentacion" className="text-white/80 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentación
            </a>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Desktop Action Buttons */}
          <button className="hidden md:block btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hidden md:block btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>
          <button className="hidden md:block btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
          <nav className="flex flex-col gap-3">
            <a href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5">
              <Home className="w-4 h-4" />
              Inicio
            </a>
            <a href="/mapa" className="text-white/80 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5">
              <Map className="w-4 h-4" />
              Mapa Interactivo
            </a>
            <a href="/documentacion" className="text-white/80 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5">
              <FileText className="w-4 h-4" />
              Documentación
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
