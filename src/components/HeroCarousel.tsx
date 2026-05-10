import { useState, useEffect } from 'react';

const features = [
  'Protege territorios',
  'Monitorea en 4K',
  'Prevé erosión',
  'Alertas tempranas',
  'Genera reportes',
  'Visión satelital',
  'Analiza patrones',
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getOpacity = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const wrappedDistance = Math.min(distance, features.length - distance);
    
    if (wrappedDistance === 0) return 1; // Centro - full opacity
    if (wrappedDistance === 1) return 0.4; // Adyacentes
    if (wrappedDistance === 2) return 0.2; // Más lejos
    return 0.1; // Muy lejos
  };

  return (
    <div className="space-y-3 overflow-hidden">
      {features.map((feature, index) => {
        const isActive = index === currentIndex;
        const opacity = getOpacity(index);
        
        return (
          <div
            key={feature}
            className={`transition-all duration-700 cursor-default text-4xl lg:text-5xl font-bold leading-tight ${
              isActive ? 'text-cyan-400 flex items-center gap-3' : 'text-white'
            }`}
            style={{
              opacity,
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {isActive && (
              <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            )}
            {feature}
          </div>
        );
      })}
    </div>
  );
}
