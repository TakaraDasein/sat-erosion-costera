import { MessageCircle, Share2, Heart, ArrowRight } from 'lucide-react';

export default function SocialBar() {
  return (
    <div className="liquid-glass px-4 py-2 rounded-full flex items-center gap-3">
      <a 
        href="#" 
        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-colors hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
      </a>
      <a 
        href="#" 
        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-colors hover:scale-105"
      >
        <Share2 className="w-4 h-4" />
      </a>
      <a 
        href="#" 
        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 transition-colors hover:scale-105"
      >
        <Heart className="w-4 h-4" />
      </a>
      <div className="w-px h-6 bg-white/20 mx-1" />
      <ArrowRight className="w-4 h-4 text-white/60" />
    </div>
  );
}
