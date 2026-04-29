import { Sparkles } from 'lucide-react';

export default function AccountButton() {
  return (
    <button className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
      <Sparkles className="w-5 h-5 text-white" />
    </button>
  );
}
