import { useState } from 'react';

const tabs = [
  { id: 'panel', label: 'Panel de Control' },
  { id: 'api', label: 'API de Sensores' },
  { id: 'satelite', label: 'Datos Satelitales' },
];

const codeExamples = {
  panel: {
    title: 'Panel de Control Interactivo',
    description: 'Visualiza todos tus sensores y datos en tiempo real desde un dashboard intuitivo.',
    code: `// Dashboard en vivo
const dashboard = new CoastalDashboard({
  sensors: ['tide', 'erosion', 'weather'],
  refreshRate: 5000,
  alerts: true
});

dashboard.on('alert', (data) => {
  console.log('Nueva alerta:', data);
});`,
  },
  api: {
    title: 'API de Sensores en Tiempo Real',
    description: 'Todo está disponible vía una API. Sin compromisos ni bloqueos de pago.',
    code: `const API_KEY = 'your-achiki-api-key';
const Headers = {
  'Content-Type': 'application/json',
  'x-achiki-api-key': API_KEY
};

// Monitoreo de erosión (Sensores)
await fetch('https://api.achiki.com/v1/sensors', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    prompt: "Persona en playa erosionada",
    model: 'coastal-analysis',
    resolution: '4K',
    aspect_ratio: 'widescreen_16_9',
  })
});`,
  },
  satelite: {
    title: 'Análisis Satelital Avanzado',
    description: 'Procesa imágenes de Sentinel-2 y Landsat para análisis geoespacial de erosión costera.',
    code: `// Análisis satelital
const satellite = await fetch('https://api.achiki.com/v1/satellite', {
  method: 'POST',
  body: JSON.stringify({
    source: 'sentinel-2',
    location: 'dibulla',
    timeRange: '2020-2024',
    analysis: ['ndvi', 'coastal-change']
  })
});

const data = await satellite.json();
console.log('Retroceso:', data.coastalChange);`,
  },
};

export default function MonitoringTabs() {
  const [activeTab, setActiveTab] = useState('api');
  const content = codeExamples[activeTab as keyof typeof codeExamples];

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#2d1810] text-white'
                : 'bg-white text-[#2d1810] border border-[#2d1810]/10 hover:border-[#2d1810]/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto bg-[#2d2d2d] rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Description */}
          <div className="p-12 lg:p-16 flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {content.title}
            </h3>
            <p className="text-white/70 text-lg mb-4 leading-relaxed">
              {content.description}
            </p>
            <a href="#" className="text-cyan-400 font-medium flex items-center gap-2 hover:gap-3 transition-all text-lg group">
              Más información
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>

            {/* Feature List */}
            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Generación de datos</h4>
                  <p className="text-white/60 text-sm">Genera imágenes con referencias multi-sensor. Cada modelo líder incluido.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Análisis predictivo</h4>
                  <p className="text-white/60 text-sm">Modela el comportamiento de la costa en los próximos años.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Audio & voz</h4>
                  <p className="text-white/60 text-sm">Alertas de voz en wayuunaiki para comunidades indígenas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Code Preview */}
          <div className="bg-[#1a1a1a] p-8 lg:p-12 relative">
            {/* Top badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-cyan-400/10 px-4 py-2 rounded-lg">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              <span className="text-cyan-400 text-sm font-medium">Generación de datos</span>
            </div>

            {/* Fake terminal dots */}
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>

            {/* Code with syntax highlighting */}
            <pre className="font-mono text-sm text-white/80 leading-relaxed overflow-x-auto">
              <code>{content.code}</code>
            </pre>

            {/* Preview image placeholder */}
            <div className="mt-8 aspect-video bg-gradient-to-br from-cyan-500/20 to-orange-500/20 rounded-xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-white/20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-white/40 text-sm">Vista previa del análisis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
