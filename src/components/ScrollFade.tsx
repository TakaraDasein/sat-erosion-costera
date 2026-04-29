import { useEffect, useRef, useState } from 'react';

interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollFade({ children, className = '' }: ScrollFadeProps) {
  const [opacity, setOpacity] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate opacity based on position in viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Distance from center of viewport
      const distance = Math.abs(elementCenter - viewportCenter);
      const maxDistance = windowHeight / 2;
      
      // Calculate opacity (1 at center, 0 at edges)
      const calculatedOpacity = Math.max(0, Math.min(1, 1 - distance / maxDistance));
      
      setOpacity(calculatedOpacity);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}
