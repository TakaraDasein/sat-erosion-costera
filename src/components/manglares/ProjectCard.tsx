interface Project {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  region: string;
  category: string;
  status: string;
  startYear: number;
  area: {
    total: number;
    restored: number;
    unit: string;
  };
  impact: {
    carbonSequestration?: {
      value: number;
      unit: string;
    };
    biodiversity?: {
      species: number;
      increase?: number;
    };
    socialBenefit?: {
      households: number;
      jobs: number;
    };
  };
  images: {
    hero: string;
  };
}

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (projectId: string) => void;
}

export default function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'carbono-azul': 'cyan',
      'restauracion-comunitaria': 'emerald',
      'proteccion-biodiversidad': 'teal',
      'restauracion-masiva': 'green',
      'restauracion-integral': 'blue'
    };
    return colors[category as keyof typeof colors] || 'emerald';
  };

  const color = getCategoryColor(project.category);

  const colorClasses = {
    cyan: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      progress: 'bg-cyan-500',
      stat: 'text-cyan-400',
      button: 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
    },
    emerald: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      progress: 'bg-emerald-500',
      stat: 'text-emerald-400',
      button: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
    },
    teal: {
      badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      progress: 'bg-teal-500',
      stat: 'text-teal-400',
      button: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
    },
    green: {
      badge: 'bg-green-500/20 text-green-300 border-green-400/30',
      progress: 'bg-green-500',
      stat: 'text-green-400',
      button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
    },
    blue: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      progress: 'bg-blue-500',
      stat: 'text-blue-400',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
    }
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  const restorationProgress = (project.area.restored / project.area.total) * 100;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-102 group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${classes.badge}`}>
            {project.status === 'activo' ? 'Activo' : 'Completado'}
          </span>
        </div>

        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-50">🌳</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{project.location}, {project.country}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          {project.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {project.subtitle}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Area */}
          <div>
            <div className={`text-2xl font-bold ${classes.stat}`}>
              {project.area.restored.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">ha restauradas</div>
          </div>

          {/* Carbon or Biodiversity */}
          {project.impact.carbonSequestration && (
            <div>
              <div className={`text-2xl font-bold ${classes.stat}`}>
                {project.impact.carbonSequestration.value > 1000
                  ? `${(project.impact.carbonSequestration.value / 1000).toFixed(1)}K`
                  : project.impact.carbonSequestration.value}
              </div>
              <div className="text-xs text-gray-400">ton CO₂/año</div>
            </div>
          )}

          {/* Households */}
          {project.impact.socialBenefit && (
            <div>
              <div className={`text-2xl font-bold ${classes.stat}`}>
                {project.impact.socialBenefit.households > 1000
                  ? `${(project.impact.socialBenefit.households / 1000).toFixed(1)}K`
                  : project.impact.socialBenefit.households}
              </div>
              <div className="text-xs text-gray-400">familias</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progreso de restauración</span>
            <span>{restorationProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${classes.progress} transition-all duration-500`}
              style={{ width: `${restorationProgress}%` }}
            ></div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewDetails?.(project.id)}
          className={`w-full ${classes.button} text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
        >
          <span>Ver Caso Completo</span>
          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
