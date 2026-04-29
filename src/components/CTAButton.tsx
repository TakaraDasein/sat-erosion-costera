import { Download } from 'lucide-react';

export default function CTAButton() {
  return (
    <button className="liquid-glass-strong px-8 py-4 rounded-full flex items-center gap-4 text-white hover:scale-105 transition-transform active:scale-95">
      <span className="font-medium text-lg">Explorar Ahora</span>
      <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
        <Download className="w-4 h-4" />
      </div>
    </button>
  );
}
