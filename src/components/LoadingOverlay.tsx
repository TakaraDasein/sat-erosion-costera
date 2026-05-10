interface LoadingOverlayProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export default function LoadingOverlay({ 
  isLoading, 
  progress = 0, 
  message = 'Cargando datos...' 
}: LoadingOverlayProps) {
  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-8 max-w-md w-full mx-4">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
              <svg 
                className="w-8 h-8 text-white animate-spin-slow" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            {/* Anillo de pulso */}
            <div className="absolute inset-0 w-16 h-16 bg-cyan-500/30 rounded-2xl animate-ping"></div>
          </div>
        </div>

        {/* Mensaje */}
        <h3 className="text-white text-lg font-semibold text-center mb-2">
          {message}
        </h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          Procesando datos satelitales...
        </p>

        {/* Barra de progreso */}
        <div className="space-y-3">
          <div className="relative w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Porcentaje */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {progress > 0 ? `${progress}% completado` : 'Inicializando...'}
            </span>
            <span className="text-cyan-400 font-mono font-semibold">
              {progress}%
            </span>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-slate-500 mb-1">Años</div>
              <div className="text-sm text-white font-semibold">2000-2024</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Satélites</div>
              <div className="text-sm text-white font-semibold">Landsat</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Resolución</div>
              <div className="text-sm text-white font-semibold">30m</div>
            </div>
          </div>
        </div>

        {/* Indicador de actividad */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

    </div>
  );
}
