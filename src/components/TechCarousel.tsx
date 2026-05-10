import { useState, useRef, useEffect } from 'react';

const models = [
  { name: 'Sentinel 2', icon: 'from-cyan-400 to-blue-500', bg: 'from-cyan-100 to-blue-100' },
  { name: 'Landsat 8', icon: 'from-orange-400 to-red-500', bg: 'from-orange-100 to-red-100' },
  { name: 'SAR Analysis', icon: 'from-purple-400 to-pink-500', bg: 'from-purple-100 to-pink-100', hasVideo: true },
  { name: 'IoT Sensors', icon: 'from-green-400 to-emerald-500', bg: 'from-green-100 to-emerald-100' },
  { name: 'Predictive AI', icon: 'from-cyan-400 to-teal-500', bg: 'from-cyan-100 to-teal-100' },
  { name: 'Drone Mapping', icon: 'from-yellow-400 to-orange-500', bg: 'from-yellow-100 to-orange-100' },
  { name: 'ML Forecasting', icon: 'from-indigo-400 to-purple-500', bg: 'from-indigo-100 to-purple-100' },
];

export default function TechCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 352; // 320px card width + 32px gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg className="w-6 h-6 text-[#2d1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg className="w-6 h-6 text-[#2d1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      )}

      {/* Scrollable Container */}
      <div ref={scrollRef} className="overflow-x-auto pb-8 hide-scrollbar scroll-smooth">
        <div className="flex gap-6 min-w-max px-4">
          {models.map((model, index) => (
            <div
              key={index}
              className="w-80 bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${model.icon} rounded-lg`}></div>
                <h3 className="text-xl font-bold text-[#2d1810]">{model.name}</h3>
              </div>
              <div className={`aspect-square bg-gradient-to-br ${model.bg} rounded-xl mb-4 overflow-hidden`}>
                {model.hasVideo && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
