import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryGrid({ categories, selectedCategory, onSelectCategory }: CategoryGridProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getColorClasses = (color: string, isSelected: boolean, isHovered: boolean) => {
    const baseColors = {
      cyan: {
        bg: isSelected ? 'bg-cyan-500/20' : isHovered ? 'bg-cyan-500/10' : 'bg-white/5',
        border: isSelected ? 'border-cyan-400' : isHovered ? 'border-cyan-500/50' : 'border-white/10',
        text: isSelected ? 'text-cyan-400' : 'text-cyan-300',
        icon: 'text-cyan-400'
      },
      emerald: {
        bg: isSelected ? 'bg-emerald-500/20' : isHovered ? 'bg-emerald-500/10' : 'bg-white/5',
        border: isSelected ? 'border-emerald-400' : isHovered ? 'border-emerald-500/50' : 'border-white/10',
        text: isSelected ? 'text-emerald-400' : 'text-emerald-300',
        icon: 'text-emerald-400'
      },
      teal: {
        bg: isSelected ? 'bg-teal-500/20' : isHovered ? 'bg-teal-500/10' : 'bg-white/5',
        border: isSelected ? 'border-teal-400' : isHovered ? 'border-teal-500/50' : 'border-white/10',
        text: isSelected ? 'text-teal-400' : 'text-teal-300',
        icon: 'text-teal-400'
      },
      green: {
        bg: isSelected ? 'bg-green-500/20' : isHovered ? 'bg-green-500/10' : 'bg-white/5',
        border: isSelected ? 'border-green-400' : isHovered ? 'border-green-500/50' : 'border-white/10',
        text: isSelected ? 'text-green-400' : 'text-green-300',
        icon: 'text-green-400'
      },
      blue: {
        bg: isSelected ? 'bg-blue-500/20' : isHovered ? 'bg-blue-500/10' : 'bg-white/5',
        border: isSelected ? 'border-blue-400' : isHovered ? 'border-blue-500/50' : 'border-white/10',
        text: isSelected ? 'text-blue-400' : 'text-blue-300',
        icon: 'text-blue-400'
      }
    };

    return baseColors[color as keyof typeof baseColors] || baseColors.emerald;
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Filtrar por Categoría</h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          const colors = getColorClasses(category.color, isSelected, isHovered);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? null : category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`
                relative p-6 rounded-2xl border-2 backdrop-blur-sm
                transition-all duration-300 cursor-pointer text-left
                ${colors.bg} ${colors.border}
                ${isSelected ? 'scale-105 shadow-2xl' : isHovered ? 'scale-102' : ''}
              `}
            >
              {/* Icon */}
              <div className={`text-5xl mb-3 ${colors.icon}`}>
                {category.icon}
              </div>

              {/* Name */}
              <h4 className={`font-bold text-lg mb-2 ${colors.text}`}>
                {category.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {category.description}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <svg className={`w-6 h-6 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
