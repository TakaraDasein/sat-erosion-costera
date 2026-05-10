import { useState, useRef, useEffect } from 'react';

const caseStudies = [
  {
    title: 'La Cachaca III',
    description: 'Sistema de alertas tempranas implementado con tecnología de sensores IoT y análisis geoespacial en comunidad wayúu.',
    gradient: 'from-cyan-500/30 to-blue-700/30',
  },
  {
    title: 'Monitoreo Dibulla',
    description: 'Análisis predictivo del retroceso costero usando datos satelitales y machine learning para protección territorial.',
    gradient: 'from-orange-500/30 to-red-700/30',
  },
  {
    title: 'Red Comunitaria',
    description: 'Plataforma colaborativa que integra conocimiento ancestral con datos científicos para gestión costera participativa.',
    gradient: 'from-green-500/30 to-emerald-700/30',
  },
];

export default function CaseStudyCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {caseStudies.map((study, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <div className="bg-[#2d2d2d] rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
                <div className={`aspect-video bg-gradient-to-br ${study.gradient} relative`}>
                  <div className="absolute inset-0 bg-[url('/video.mp4')] bg-cover bg-center opacity-40"></div>
                </div>
                <div className="p-8">
                  <div className="text-white/60 text-sm font-medium mb-3">Achiki O'pala Originals</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{study.title}</h3>
                  <p className="text-white/70 mb-6">{study.description}</p>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                    <span className="group-hover:underline">Ver el caso</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {caseStudies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-[#2d1810]' : 'w-2 bg-[#2d1810]/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
