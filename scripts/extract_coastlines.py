#!/usr/bin/env python3
"""
Script para extraer líneas costeras de Dibulla-Palomino usando Google Earth Engine
Procesa imágenes Landsat de 2000-2024 y genera GeoJSON con las líneas costeras
"""

import ee
import geemap
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

# Inicializar Earth Engine
try:
    ee.Initialize()
    print("✓ Google Earth Engine inicializado correctamente")
except Exception as e:
    print(f"Error al inicializar Earth Engine: {e}")
    print("Ejecuta: earthengine authenticate")
    exit(1)

# Área de estudio: Dibulla - Palomino
# Coordenadas del polígono costero
DIBULLA_BOUNDS = ee.Geometry.Polygon([[
    [-73.45, 11.35],  # NO - Palomino mar
    [-73.25, 11.35],  # NE - Palomino tierra
    [-73.25, 11.15],  # SE - Sur tierra
    [-73.45, 11.15],  # SO - Sur mar
    [-73.45, 11.35]   # Cerrar polígono
]])

# Punto central para visualización
CENTER_POINT = [-73.3085, 11.2794]  # Dibulla centro

# Años a procesar
YEARS = list(range(2000, 2025))

# Configuración de colecciones Landsat
LANDSAT_COLLECTIONS = {
    'L5': {
        'id': 'LANDSAT/LT05/C02/T1_L2',
        'years': (1984, 2012),
        'bands': {'green': 'SR_B2', 'nir': 'SR_B4', 'swir': 'SR_B5'}
    },
    'L7': {
        'id': 'LANDSAT/LE07/C02/T1_L2',
        'years': (1999, 2024),
        'bands': {'green': 'SR_B2', 'nir': 'SR_B4', 'swir': 'SR_B5'}
    },
    'L8': {
        'id': 'LANDSAT/LC08/C02/T1_L2',
        'years': (2013, 2024),
        'bands': {'green': 'SR_B3', 'nir': 'SR_B5', 'swir': 'SR_B6'}
    },
    'L9': {
        'id': 'LANDSAT/LC09/C02/T1_L2',
        'years': (2021, 2024),
        'bands': {'green': 'SR_B3', 'nir': 'SR_B5', 'swir': 'SR_B6'}
    }
}


def calculate_mndwi(image, bands):
    """
    Calcula el Modified Normalized Difference Water Index (MNDWI)
    MNDWI = (Green - SWIR) / (Green + SWIR)
    Valores > 0 generalmente indican agua
    """
    green = image.select(bands['green'])
    swir = image.select(bands['swir'])
    
    mndwi = green.subtract(swir).divide(green.add(swir)).rename('MNDWI')
    return mndwi


def calculate_ndwi(image, bands):
    """
    Calcula el Normalized Difference Water Index (NDWI)
    NDWI = (Green - NIR) / (Green + NIR)
    Complementario al MNDWI para mejor detección de agua
    """
    green = image.select(bands['green'])
    nir = image.select(bands['nir'])
    
    ndwi = green.subtract(nir).divide(green.add(nir)).rename('NDWI')
    return ndwi


def get_best_image_for_year(year, collection_name, bounds):
    """
    Obtiene la mejor imagen Landsat para un año específico
    Criterios: menos nubes, más cerca del verano (menos lluvia)
    """
    config = LANDSAT_COLLECTIONS[collection_name]
    
    # Verificar que el año está en el rango de la colección
    if year < config['years'][0] or year > config['years'][1]:
        return None
    
    # Definir rango de fechas (preferir meses secos: diciembre-marzo)
    start_date = f'{year}-12-01'
    end_date = f'{year+1}-03-31'
    
    # Si es el último año, ajustar fechas
    if year == 2024:
        start_date = f'{year}-01-01'
        end_date = f'{year}-12-31'
    
    # Cargar colección
    collection = ee.ImageCollection(config['id']) \
        .filterBounds(bounds) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUD_COVER', 20))  # Menos del 20% de nubes
    
    # Obtener tamaño de la colección
    size = collection.size().getInfo()
    if size == 0:
        return None
    
    # Ordenar por menor cobertura de nubes y tomar la mejor
    best_image = collection.sort('CLOUD_COVER').first()
    
    return best_image, config['bands']


def extract_coastline(mndwi_image, threshold=0.0):
    """
    Extrae la línea costera del índice MNDWI
    threshold: valor para separar agua de tierra (0.0 por defecto)
    """
    # Crear máscara de agua (MNDWI > threshold)
    water_mask = mndwi_image.gt(threshold)
    
    # Aplicar filtro morfológico para limpiar ruido
    water_mask_cleaned = water_mask.focal_mode(radius=30, kernelType='circle', units='meters')
    
    # Detectar bordes (transición agua-tierra)
    coastline = water_mask_cleaned.reduceToVectors(
        geometry=DIBULLA_BOUNDS,
        scale=30,  # Resolución de 30m (Landsat)
        geometryType='polygon',
        eightConnected=False,
        maxPixels=1e9
    )
    
    return coastline


def simplify_coastline(coastline_features, tolerance=50):
    """
    Simplifica la geometría de la línea costera
    tolerance: metros de tolerancia para simplificación
    """
    def simplify_feature(feature):
        geom = feature.geometry()
        simplified = geom.simplify(maxError=tolerance)
        return feature.setGeometry(simplified)
    
    return coastline_features.map(simplify_feature)


def process_year(year):
    """
    Procesa un año completo y extrae la línea costera
    """
    print(f"\n{'='*60}")
    print(f"Procesando año {year}...")
    print(f"{'='*60}")
    
    # Intentar con diferentes colecciones Landsat
    collections_to_try = ['L9', 'L8', 'L7', 'L5']
    
    for collection_name in collections_to_try:
        result = get_best_image_for_year(year, collection_name, DIBULLA_BOUNDS)
        
        if result is not None:
            image, bands = result
            
            # Obtener información de la imagen
            try:
                image_info = image.getInfo()
                image_date = image_info['properties'].get('DATE_ACQUIRED', 'N/A')
                cloud_cover = image_info['properties'].get('CLOUD_COVER', 'N/A')
                
                print(f"✓ Imagen encontrada: {collection_name}")
                print(f"  Fecha: {image_date}")
                print(f"  Nubes: {cloud_cover}%")
                
                # Calcular índices de agua
                mndwi = calculate_mndwi(image, bands)
                ndwi = calculate_ndwi(image, bands)
                
                # Combinar índices (promedio ponderado)
                water_index = mndwi.multiply(0.7).add(ndwi.multiply(0.3))
                
                # Extraer línea costera
                print("  Extrayendo línea costera...")
                coastline = extract_coastline(water_index, threshold=0.0)
                
                # Simplificar geometría
                print("  Simplificando geometría...")
                coastline_simplified = simplify_coastline(coastline, tolerance=30)
                
                # Convertir a GeoJSON
                print("  Convirtiendo a GeoJSON...")
                coastline_geojson = coastline_simplified.getInfo()
                
                # Agregar metadata
                for feature in coastline_geojson.get('features', []):
                    feature['properties'] = {
                        'year': year,
                        'date': image_date,
                        'satellite': collection_name,
                        'cloud_cover': cloud_cover,
                        'threshold': 0.0,
                        'index_type': 'MNDWI+NDWI',
                        'location': 'Dibulla-Palomino, La Guajira, Colombia'
                    }
                
                print(f"✓ Procesamiento completado: {len(coastline_geojson.get('features', []))} features")
                
                return {
                    'year': year,
                    'geojson': coastline_geojson,
                    'metadata': {
                        'date': image_date,
                        'satellite': collection_name,
                        'cloud_cover': cloud_cover,
                        'features_count': len(coastline_geojson.get('features', []))
                    }
                }
                
            except Exception as e:
                print(f"✗ Error procesando {collection_name}: {e}")
                continue
    
    print(f"✗ No se encontraron imágenes válidas para {year}")
    return None


def save_coastline_data(data, output_dir='../public/data/coastlines'):
    """
    Guarda los datos de línea costera en archivos GeoJSON
    """
    # Crear directorio si no existe
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    year = data['year']
    geojson = data['geojson']
    
    # Guardar GeoJSON individual
    filename = output_path / f'coastline_{year}.geojson'
    with open(filename, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"✓ Guardado: {filename}")
    
    # Guardar metadata
    metadata_file = output_path / f'metadata_{year}.json'
    with open(metadata_file, 'w') as f:
        json.dump(data['metadata'], f, indent=2)
    
    return str(filename)


def create_summary_file(all_data, output_dir='../public/data/coastlines'):
    """
    Crea archivo resumen con todos los años procesados
    """
    output_path = Path(output_dir)
    
    summary = {
        'location': 'Dibulla-Palomino, La Guajira, Colombia',
        'bounds': {
            'north': 11.35,
            'south': 11.15,
            'east': -73.25,
            'west': -73.45
        },
        'years': [],
        'total_years': 0,
        'processing_date': datetime.now().isoformat(),
        'files': []
    }
    
    for data in all_data:
        if data is not None:
            summary['years'].append(data['year'])
            summary['files'].append({
                'year': data['year'],
                'file': f'coastline_{data["year"]}.geojson',
                'metadata': data['metadata']
            })
    
    summary['total_years'] = len(summary['years'])
    summary['years'].sort()
    
    # Guardar resumen
    summary_file = output_path / 'summary.json'
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✓ Resumen guardado: {summary_file}")
    print(f"  Total de años procesados: {summary['total_years']}")
    print(f"  Años: {', '.join(map(str, summary['years']))}")
    print(f"{'='*60}")


def main():
    """
    Función principal
    """
    print("="*60)
    print("EXTRACTOR DE LÍNEAS COSTERAS - DIBULLA-PALOMINO")
    print("="*60)
    print(f"Área de estudio: {DIBULLA_BOUNDS.getInfo()}")
    print(f"Años a procesar: {YEARS[0]} - {YEARS[-1]}")
    print(f"Total: {len(YEARS)} años")
    
    all_results = []
    
    # Procesar cada año
    for year in YEARS:
        result = process_year(year)
        
        if result is not None:
            # Guardar datos
            save_coastline_data(result)
            all_results.append(result)
        
        # Pausa pequeña para no saturar la API
        import time
        time.sleep(1)
    
    # Crear archivo resumen
    create_summary_file(all_results)
    
    print("\n" + "="*60)
    print("PROCESAMIENTO COMPLETADO")
    print("="*60)
    print(f"Años exitosos: {len(all_results)}/{len(YEARS)}")
    print(f"Archivos generados en: public/data/coastlines/")
    print("="*60)


if __name__ == "__main__":
    main()
