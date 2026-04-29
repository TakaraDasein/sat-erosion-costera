import { User, Bell, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-8 lg:px-16 py-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Achiki O'pala" 
            className="w-12 h-12 object-contain transition-transform duration-300 hover:scale-110 cursor-pointer" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <Bell className="w-5 h-5" />
          </button>
          <button className="btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>
          <button className="btn-clipped bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
