// Coordenadas del borde costero de Dibulla (de Palomino a Dibulla)
// Este es el polígono que define el área costera del municipio

export const DIBULLA_COASTAL_BOUNDS = {
  // Límites aproximados de Dibulla
  north: 11.35,  // Más al norte (cerca de Palomino)
  south: 11.15,  // Más al sur
  east: -73.25,  // Más al este (tierra adentro)
  west: -73.45,  // Más al oeste (mar)
};

// Coordenadas de los puntos clave de la costa
export const DIBULLA_COASTLINE_POINTS = [
  // Zona de Palomino (norte)
  { lat: 11.3461, lng: -73.2636, name: 'Palomino Norte' },
  { lat: 11.3385, lng: -73.2589, name: 'Palomino Centro' },
  { lat: 11.3312, lng: -73.2542, name: 'Palomino Sur' },
  
  // Zona intermedia
  { lat: 11.3156, lng: -73.2478, name: 'Zona Intermedia 1' },
  { lat: 11.2998, lng: -73.2412, name: 'Zona Intermedia 2' },
  { lat: 11.2845, lng: -73.2356, name: 'Zona Intermedia 3' },
  
  // Zona de Dibulla
  { lat: 11.2794, lng: -73.3085, name: 'Dibulla Norte' },
  { lat: 11.2738, lng: -73.3125, name: 'Dibulla Centro' },
  { lat: 11.2689, lng: -73.3168, name: 'Dibulla Sur' },
  
  // La Cachaca III (comunidad wayúu)
  { lat: 11.2612, lng: -73.3245, name: 'La Cachaca III' },
  { lat: 11.2545, lng: -73.3298, name: 'La Cachaca Sur' },
  
  // Zona sur de Dibulla
  { lat: 11.2389, lng: -73.3412, name: 'Dibulla Sur 1' },
  { lat: 11.2234, lng: -73.3478, name: 'Dibulla Sur 2' },
  { lat: 11.2089, lng: -73.3542, name: 'Zona Límite Sur' },
];

// Polígono del área costera de Dibulla
export const DIBULLA_COASTAL_POLYGON = [
  { lat: 11.35, lng: -73.26 },   // Palomino costa
  { lat: 11.32, lng: -73.25 },   // Palomino tierra
  { lat: 11.28, lng: -73.30 },   // Dibulla centro tierra
  { lat: 11.26, lng: -73.32 },   // La Cachaca tierra
  { lat: 11.21, lng: -73.35 },   // Sur tierra
  { lat: 11.20, lng: -73.36 },   // Sur costa
  { lat: 11.25, lng: -73.33 },   // La Cachaca costa
  { lat: 11.27, lng: -73.31 },   // Dibulla costa
  { lat: 11.34, lng: -73.27 },   // Palomino costa
];

// Años para análisis temporal
export const AVAILABLE_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
  2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
  2020, 2021, 2022, 2023, 2024
];

// Configuración de colores para líneas costeras por año
// Esquema Digital Earth Africa: Morado oscuro (2000) → Amarillo (2012) → Naranja → Rojo (2024)
export const getCoastlineColor = (year: number): string => {
  const minYear = 2000;
  const maxYear = 2024;
  
  // Normalizar año a rango 0-1
  const normalized = (year - minYear) / (maxYear - minYear);
  
  // Gradiente de colores estilo Digital Earth Africa
  // 2000-2008: Morado oscuro → Morado
  if (normalized < 0.33) {
    const localNorm = normalized / 0.33;
    return interpolateColor('#1a0033', '#6600cc', localNorm);
  }
  // 2009-2016: Morado → Amarillo
  else if (normalized < 0.66) {
    const localNorm = (normalized - 0.33) / 0.33;
    return interpolateColor('#6600cc', '#ffff00', localNorm);
  }
  // 2017-2024: Amarillo → Naranja → Rojo
  else {
    const localNorm = (normalized - 0.66) / 0.34;
    if (localNorm < 0.5) {
      return interpolateColor('#ffff00', '#ff9900', localNorm * 2);
    } else {
      return interpolateColor('#ff9900', '#ff0000', (localNorm - 0.5) * 2);
    }
  }
};

// Función auxiliar para interpolar entre dos colores hex
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Puntos de erosión conocidos en Dibulla
export const EROSION_HOTSPOTS = [
  {
    lat: 11.2612,
    lng: -73.3245,
    name: 'La Cachaca III',
    rateOfChange: -2.5, // metros por año
    totalChange: -57.5,  // metros totales (2000-2023)
    severity: 'crítico',
    description: 'Retroceso crítico de línea costera afectando comunidad wayúu'
  },
  {
    lat: 11.2794,
    lng: -73.3085,
    name: 'Dibulla Centro',
    rateOfChange: -1.8,
    totalChange: -41.4,
    severity: 'alto',
    description: 'Erosión significativa en zona urbana de Dibulla'
  },
  {
    lat: 11.2689,
    lng: -73.3168,
    name: 'Playa Dibulla Sur',
    rateOfChange: -2.1,
    totalChange: -48.3,
    severity: 'crítico',
    description: 'Pérdida acelerada de playa y vegetación costera'
  },
  {
    lat: 11.3385,
    lng: -73.2589,
    name: 'Palomino',
    rateOfChange: 0.5,
    totalChange: 11.5,
    severity: 'estable',
    description: 'Crecimiento ligero por acumulación sedimentaria'
  },
];

// Configuración de Google Earth Engine
export const GOOGLE_EARTH_ENGINE_CONFIG = {
  apiKey: 'AIzaSyANyOOq7IA2r5ku07DSWujhAXxOFlaVP-c',
  // Asset IDs de Landsat para diferentes años
  landsatCollections: {
    landsat5: 'LANDSAT/LT05/C02/T1_L2',  // 1984-2012
    landsat7: 'LANDSAT/LE07/C02/T1_L2',  // 1999-presente
    landsat8: 'LANDSAT/LC08/C02/T1_L2',  // 2013-presente
    landsat9: 'LANDSAT/LC09/C02/T1_L2',  // 2021-presente
  },
  // Path/Row para Dibulla
  pathRow: {
    path: 9,
    row: 53,
  },
};

// Configuración de colores para erosión
export const EROSION_COLORS = {
  crítico: '#D32F2F',    // Rojo oscuro
  alto: '#F44336',       // Rojo
  moderado: '#FF9800',   // Naranja
  bajo: '#FFC107',       // Ámbar
  estable: '#4CAF50',    // Verde
  crecimiento: '#2196F3', // Azul
};

// Centro del mapa (centro de Dibulla)
export const MAP_CENTER = {
  lat: 11.2794,
  lng: -73.3085,
};

export const MAP_DEFAULT_ZOOM = 12;
