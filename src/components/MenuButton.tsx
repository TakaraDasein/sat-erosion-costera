import { Menu } from 'lucide-react';

export default function MenuButton() {
  return (
    <button className="liquid-glass px-6 py-2 rounded-full flex items-center gap-2 text-sm text-white hover:scale-105 transition-transform active:scale-95">
      <Menu className="w-4 h-4" />
      <span>Menú</span>
    </button>
  );
}
