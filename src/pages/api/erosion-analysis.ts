/**
 * API Endpoint: /api/erosion-analysis
 * Calcula cambios en la línea costera entre dos años
 */

import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

interface Point {
  lat: number;
  lng: number;
}

interface CoastlineFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: any;
}

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
function calculateDistance(point1: Point, point2: Point): number {
  const R = 6371000; // Radio de la Tierra en metros
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Extraer puntos de geometría GeoJSON
function extractPoints(geometry: any): Point[] {
  const coords = geometry.coordinates;
  const points: Point[] = [];

  function processCoords(coord: any) {
    if (Array.isArray(coord[0])) {
      // Es un array de arrays
      coord.forEach(processCoords);
    } else {
      // Es un punto [lng, lat]
      points.push({ lng: coord[0], lat: coord[1] });
    }
  }

  processCoords(coords);
  return points;
}

// Calcular cambio promedio entre dos líneas costeras
function calculateCoastlineChange(
  coastline1: CoastlineFeature[],
  coastline2: CoastlineFeature[]
): {
  averageChange: number;
  maxChange: number;
  minChange: number;
  changedPoints: number;
  changeRate: number;
  yearsDiff: number;
} {
  const points1 = coastline1.flatMap((feature) => extractPoints(feature.geometry));
  const points2 = coastline2.flatMap((feature) => extractPoints(feature.geometry));

  if (points1.length === 0 || points2.length === 0) {
    return {
      averageChange: 0,
      maxChange: 0,
      minChange: 0,
      changedPoints: 0,
      changeRate: 0,
      yearsDiff: 0,
    };
  }

  // Calcular distancias mínimas para cada punto
  const distances: number[] = [];

  // Muestrear puntos para mejor rendimiento (cada 10 puntos)
  const sampleRate = Math.max(1, Math.floor(points1.length / 100));

  for (let i = 0; i < points1.length; i += sampleRate) {
    const point1 = points1[i];
    let minDistance = Infinity;

    // Encontrar el punto más cercano en coastline2
    for (let j = 0; j < points2.length; j += sampleRate) {
      const point2 = points2[j];
      const distance = calculateDistance(point1, point2);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    if (minDistance !== Infinity) {
      distances.push(minDistance);
    }
  }

  if (distances.length === 0) {
    return {
      averageChange: 0,
      maxChange: 0,
      minChange: 0,
      changedPoints: 0,
      changeRate: 0,
      yearsDiff: 0,
    };
  }

  const averageChange = distances.reduce((a, b) => a + b, 0) / distances.length;
  const maxChange = Math.max(...distances);
  const minChange = Math.min(...distances);

  return {
    averageChange,
    maxChange,
    minChange,
    changedPoints: distances.length,
    changeRate: 0, // Se calculará con años
    yearsDiff: 0, // Se calculará con años
  };
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const year1Param = url.searchParams.get('year1');
    const year2Param = url.searchParams.get('year2');

    if (!year1Param || !year2Param) {
      return new Response(
        JSON.stringify({
          error: 'Missing parameters',
          message: 'Both year1 and year2 are required',
          example: '/api/erosion-analysis?year1=2000&year2=2023',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const year1 = parseInt(year1Param);
    const year2 = parseInt(year2Param);

    if (isNaN(year1) || isNaN(year2) || year1 < 2000 || year2 > 2024 || year1 >= year2) {
      return new Response(
        JSON.stringify({
          error: 'Invalid years',
          message: 'Years must be between 2000-2024 and year1 < year2',
          received: { year1: year1Param, year2: year2Param },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const dataDir = path.join(process.cwd(), 'public', 'data', 'coastlines');

    // Leer ambas líneas costeras
    const file1 = path.join(dataDir, `coastline_${year1}.geojson`);
    const file2 = path.join(dataDir, `coastline_${year2}.geojson`);

    try {
      const [data1, data2] = await Promise.all([
        fs.readFile(file1, 'utf-8'),
        fs.readFile(file2, 'utf-8'),
      ]);

      const coastline1 = JSON.parse(data1);
      const coastline2 = JSON.parse(data2);

      // Calcular cambios
      const analysis = calculateCoastlineChange(coastline1.features, coastline2.features);

      const yearsDiff = year2 - year1;
      analysis.yearsDiff = yearsDiff;
      analysis.changeRate = analysis.averageChange / yearsDiff;

      // Determinar si es erosión o acreción
      const isErosion = analysis.averageChange > 20; // > 20m de cambio promedio indica erosión
      const severity = analysis.averageChange > 50 ? 'crítico' : analysis.averageChange > 30 ? 'alto' : 'moderado';

      const response = {
        comparison: {
          year1,
          year2,
          yearsDiff,
        },
        analysis: {
          averageChange: Math.round(analysis.averageChange * 100) / 100,
          maxChange: Math.round(analysis.maxChange * 100) / 100,
          minChange: Math.round(analysis.minChange * 100) / 100,
          changeRate: Math.round(analysis.changeRate * 100) / 100,
          changedPoints: analysis.changedPoints,
          unit: 'meters',
        },
        classification: {
          type: isErosion ? 'erosion' : 'stable',
          severity,
          description: isErosion
            ? `Erosión ${severity} detectada: ${Math.round(analysis.averageChange)}m de retroceso promedio`
            : 'Línea costera relativamente estable',
        },
        metadata: {
          location: 'Dibulla-Palomino, La Guajira, Colombia',
          method: 'Haversine distance calculation',
          sampleRate: 'Every 10th point',
          algorithm: 'Minimum distance between coastlines',
        },
      };

      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Data not found',
          message: `Could not load coastline data for years ${year1} and/or ${year2}`,
          hint: 'Run scripts/extract_coastlines.py to generate data',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
