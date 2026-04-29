import { useState } from 'react';
import { Home, Map, Bell, Settings, Menu } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-32 left-6 z-50">
      {/* Navbar Vertical con Botones */}
      <div className="flex flex-col items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Botones - Se muestran/ocultan */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <a
            href="#inicio"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all border border-white/20"
          >
            <Home className="w-5 h-5 text-white" />
          </a>

          <a
            href="#mapa"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all border border-white/20"
          >
            <Map className="w-5 h-5 text-white" />
          </a>

          <a
            href="#alertas"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all border border-white/20"
          >
            <Bell className="w-5 h-5 text-white" />
          </a>

          <a
            href="#configuracion"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all border border-white/20"
          >
            <Settings className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}
