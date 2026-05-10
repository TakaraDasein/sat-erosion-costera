/**
 * API Endpoint: /api/coastlines
 * Sirve datos de líneas costeras procesadas desde Google Earth Engine
 */

import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const year = url.searchParams.get('year');
    const format = url.searchParams.get('format') || 'geojson';

    console.log('[API] Request URL:', url.toString());
    console.log('[API] Year param:', year);
    console.log('[API] CWD:', process.cwd());

    const dataDir = path.join(process.cwd(), 'public', 'data', 'coastlines');
    console.log('[API] Data dir:', dataDir);

    // Si no se especifica año, devolver resumen
    if (!year) {
      try {
        const summaryPath = path.join(dataDir, 'summary.json');
        const summaryData = await fs.readFile(summaryPath, 'utf-8');
        const summary = JSON.parse(summaryData);

        return new Response(JSON.stringify(summary), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600', // Cache 1 hora
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Summary not found',
            message: 'No coastline data available. Run scripts/extract_coastlines.py first.',
            hint: 'See scripts/INSTALLATION.md for setup instructions'
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Validar año
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2024) {
      return new Response(
        JSON.stringify({
          error: 'Invalid year',
          message: 'Year must be between 2000 and 2024',
          received: year
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Leer archivo de línea costera
    const coastlineFile = path.join(dataDir, `coastline_${year}.geojson`);
    const metadataFile = path.join(dataDir, `metadata_${year}.json`);

    try {
      const coastlineData = await fs.readFile(coastlineFile, 'utf-8');
      const coastline = JSON.parse(coastlineData);

      // Leer metadata si existe
      let metadata = {};
      try {
        const metadataData = await fs.readFile(metadataFile, 'utf-8');
        metadata = JSON.parse(metadataData);
      } catch {
        // Metadata opcional
      }

      // Formato de respuesta
      const response = {
        year: yearNum,
        type: 'FeatureCollection',
        metadata: {
          ...metadata,
          location: 'Dibulla-Palomino, La Guajira, Colombia',
          source: 'Google Earth Engine - Landsat',
          algorithm: 'MNDWI + NDWI',
          resolution: '30m',
          crs: 'EPSG:4326',
        },
        features: coastline.features || [],
        properties: {
          featureCount: coastline.features?.length || 0,
          bounds: {
            north: 11.35,
            south: 11.15,
            east: -73.25,
            west: -73.45,
          },
        },
      };

      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/geo+json',
          'Cache-Control': 'public, max-age=86400', // Cache 24 horas
          'Access-Control-Allow-Origin': '*', // CORS
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Coastline not found',
          message: `No data available for year ${year}`,
          hint: 'Run scripts/extract_coastlines.py to generate data',
          year: yearNum
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

// Opciones CORS
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
