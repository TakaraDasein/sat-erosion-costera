import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metrics {
  totalProjects: number;
  totalArea: number;
  totalAreaRestored: number;
  totalCarbonSequestration: number;
  totalHouseholds: number;
  totalJobs: number;
  countries: number;
}

interface ImpactDashboardProps {
  metrics: Metrics;
}

export default function ImpactDashboard({ metrics }: ImpactDashboardProps) {
  // Data for area comparison
  const areaData = [
    {
      name: 'Área Total',
      value: metrics.totalArea,
      fill: '#10B981'
    },
    {
      name: 'Restaurada',
      value: metrics.totalAreaRestored,
      fill: '#14B8A6'
    }
  ];

  // Progress percentage
  const restorationProgress = (metrics.totalAreaRestored / metrics.totalArea) * 100;

  // Distribution by impact type
  const impactDistribution = [
    { name: 'Carbono', value: 35, color: '#06B6D4' },
    { name: 'Social', value: 30, color: '#10B981' },
    { name: 'Biodiversidad', value: 20, color: '#14B8A6' },
    { name: 'Económico', value: 15, color: '#059669' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-emerald-400/30 rounded-lg p-3">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-emerald-400">
            {payload[0].value.toLocaleString()} ha
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard de Impacto Global</h2>
        <p className="text-gray-400">Métricas consolidadas de todos los proyectos</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-400/20 rounded-xl p-6">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-4xl font-bold text-cyan-400 mb-1">
            {metrics.totalProjects}
          </div>
          <div className="text-sm text-gray-300">Proyectos Activos</div>
        </div>

        {/* Total Area Restored */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-xl p-6">
          <div className="text-4xl mb-2">🌳</div>
          <div className="text-4xl font-bold text-emerald-400 mb-1">
            {(metrics.totalAreaRestored / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-300">Hectáreas Restauradas</div>
        </div>

        {/* Carbon Sequestration */}
        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-400/20 rounded-xl p-6">
          <div className="text-4xl mb-2">🌍</div>
          <div className="text-4xl font-bold text-teal-400 mb-1">
            {(metrics.totalCarbonSequestration / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-300">Ton CO₂ Capturadas/año</div>
        </div>

        {/* Households Impacted */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-4xl font-bold text-green-400 mb-1">
            {(metrics.totalHouseholds / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-300">Familias Beneficiadas</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Comparison Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Progreso de Restauración</h3>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Completado</span>
              <span className="text-emerald-400 font-bold">{restorationProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${restorationProgress}%` }}
              ></div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {areaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Distribution Pie Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Distribución de Impacto</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={impactDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {impactDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #10B981',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {impactDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">{metrics.countries}</div>
          <div className="text-sm text-gray-400 mt-1">Países</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400">
            {metrics.totalJobs.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400 mt-1">Empleos Creados</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-teal-400">
            {((metrics.totalCarbonSequestration / metrics.totalAreaRestored) * 1000).toFixed(0)}
          </div>
          <div className="text-sm text-gray-400 mt-1">kg CO₂/ha/año promedio</div>
        </div>
      </div>
    </div>
  );
}
