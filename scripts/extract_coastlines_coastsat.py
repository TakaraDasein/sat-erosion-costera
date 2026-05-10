#!/usr/bin/env python3
"""
Extractor de líneas costeras para Dibulla-Palomino usando metodología CoastSat
Basado en: https://github.com/kvos/CoastSat
Método: Digital Earth Africa Coastlines

Referencias:
- Bishop-Taylor et al. (2021) Remote Sensing of Environment
- Vos et al. (2019) CoastSat: A Google Earth Engine-enabled Python toolkit
"""

import ee
import numpy as np
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# Inicializar Earth Engine
try:
    ee.Initialize()
    print("✓ Google Earth Engine inicializado")
except:
    print("⚠ Ejecuta: earthengine authenticate")
    exit(1)

# ============================================================================
# CONFIGURACIÓN DEL ÁREA DE ESTUDIO - DIBULLA-PALOMINO
# ============================================================================

# Polígono del área costera (basado en coordenadas reales)
STUDY_AREA = ee.Geometry.Polygon([[
    [-73.45, 11.35],  # NO - Palomino mar
    [-73.25, 11.35],  # NE - Palomino tierra  
    [-73.25, 11.15],  # SE - Sur tierra
    [-73.45, 11.15],  # SO - Sur mar
    [-73.45, 11.35]   # Cerrar
]])

# Centro para visualización
CENTER = [-73.3085, 11.2794]

# Años a procesar
YEARS = list(range(2000, 2025))

# ============================================================================
# CONFIGURACIÓN COASTSAT
# ============================================================================

# Parámetros de detección de agua
WATER_INDEX = 'mndwi'  # 'mndwi', 'ndwi', 'awei'
CLOUD_THRESHOLD = 20    # % máximo de nubes
TIDE_LEVEL = 0.0       # Nivel de marea (0 = MSL - Mean Sea Level)

# Parámetros de filtrado
MIN_BEACH_WIDTH = 30   # metros
MAX_DIST_REF = 100     # metros (distancia máxima de línea de referencia)

# Resolución espacial
SPATIAL_RESOLUTION = 30  # metros (Landsat)

# ============================================================================
# FUNCIONES COASTSAT - ÍNDICES DE AGUA
# ============================================================================

def calculate_mndwi(image: ee.Image, bands: Dict[str, str]) -> ee.Image:
    """
    Modified Normalized Difference Water Index (MNDWI)
    MNDWI = (Green - SWIR) / (Green + SWIR)
    
    Mejor para separar agua de tierra en zonas costeras
    Xu (2006) - https://doi.org/10.1080/01431160600589179
    """
    green = image.select(bands['green'])
    swir = image.select(bands['swir'])
    
    mndwi = green.subtract(swir).divide(green.add(swir)).rename('MNDWI')
    return mndwi


def calculate_ndwi(image: ee.Image, bands: Dict[str, str]) -> ee.Image:
    """
    Normalized Difference Water Index (NDWI)
    NDWI = (Green - NIR) / (Green + NIR)
    
    McFeeters (1996)
    """
    green = image.select(bands['green'])
    nir = image.select(bands['nir'])
    
    ndwi = green.subtract(nir).divide(green.add(nir)).rename('NDWI')
    return ndwi


def calculate_awei(image: ee.Image, bands: Dict[str, str]) -> ee.Image:
    """
    Automated Water Extraction Index (AWEI)
    AWEI_nsh = 4 * (Green - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)
    
    Feyisa et al. (2014)
    """
    green = image.select(bands['green'])
    nir = image.select(bands['nir'])
    swir1 = image.select(bands['swir'])
    swir2 = image.select(bands.get('swir2', bands['swir']))
    
    awei = (green.subtract(swir1).multiply(4)).subtract(
        nir.multiply(0.25).add(swir2.multiply(2.75))
    ).rename('AWEI')
    
    return awei


# ============================================================================
# COLECCIONES LANDSAT
# ============================================================================

LANDSAT_MISSIONS = {
    'L5': {
        'collection': 'LANDSAT/LT05/C02/T1_L2',
        'dates': ('1984-01-01', '2012-05-05'),
        'bands': {
            'green': 'SR_B2',
            'nir': 'SR_B4',
            'swir': 'SR_B5',
            'swir2': 'SR_B7'
        },
        'qa_band': 'QA_PIXEL'
    },
    'L7': {
        'collection': 'LANDSAT/LE07/C02/T1_L2',
        'dates': ('1999-01-01', '2024-12-31'),
        'bands': {
            'green': 'SR_B2',
            'nir': 'SR_B4',
            'swir': 'SR_B5',
            'swir2': 'SR_B7'
        },
        'qa_band': 'QA_PIXEL'
    },
    'L8': {
        'collection': 'LANDSAT/LC08/C02/T1_L2',
        'dates': ('2013-04-11', '2024-12-31'),
        'bands': {
            'green': 'SR_B3',
            'nir': 'SR_B5',
            'swir': 'SR_B6',
            'swir2': 'SR_B7'
        },
        'qa_band': 'QA_PIXEL'
    },
    'L9': {
        'collection': 'LANDSAT/LC09/C02/T1_L2',
        'dates': ('2021-10-31', '2024-12-31'),
        'bands': {
            'green': 'SR_B3',
            'nir': 'SR_B5',
            'swir': 'SR_B6',
            'swir2': 'SR_B7'
        },
        'qa_band': 'QA_PIXEL'
    }
}


def mask_clouds_landsat_c2(image: ee.Image, qa_band: str = 'QA_PIXEL') -> ee.Image:
    """
    Máscara de nubes para Landsat Collection 2
    Basado en banda QA_PIXEL
    """
    qa = image.select(qa_band)
    
    # Bits de QA_PIXEL:
    # Bit 3: Cloud
    # Bit 4: Cloud Shadow
    # Bit 5: Snow
    cloud_bit = 1 << 3
    shadow_bit = 1 << 4
    snow_bit = 1 << 5
    
    mask = qa.bitwiseAnd(cloud_bit).eq(0) \
        .And(qa.bitwiseAnd(shadow_bit).eq(0)) \
        .And(qa.bitwiseAnd(snow_bit).eq(0))
    
    return image.updateMask(mask)


# ============================================================================
# EXTRACCIÓN DE LÍNEA COSTERA - MÉTODO COASTSAT
# ============================================================================

def extract_coastline_coastsat(
    year: int,
    water_index: str = 'mndwi',
    threshold: float = 0.0
) -> Optional[Dict]:
    """
    Extrae línea costera usando metodología CoastSat
    
    Pasos:
    1. Filtrar imágenes por año, nubes y área
    2. Calcular índice de agua (MNDWI/NDWI/AWEI)
    3. Calcular mediana anual
    4. Aplicar umbral para clasificar agua vs tierra
    5. Extraer borde (línea costera)
    6. Limpiar y simplificar geometría
    """
    
    print(f"\n{'='*60}")
    print(f"Procesando {year} con CoastSat...")
    print(f"{'='*60}")
    
    # Rango de fechas (priorizar meses secos: dic-mar)
    start_date = f'{year}-12-01'
    end_date = f'{year+1}-03-31'
    if year == 2024:
        start_date = f'{year}-01-01'
        end_date = f'{year}-12-31'
    
    # Seleccionar misión Landsat apropiada
    mission = None
    for sat_name, sat_config in LANDSAT_MISSIONS.items():
        sat_start, sat_end = sat_config['dates']
        if start_date >= sat_start and start_date <= sat_end:
            mission = sat_config
            mission_name = sat_name
            break
    
    if not mission:
        print(f"✗ No hay misión Landsat disponible para {year}")
        return None
    
    print(f"  Misión: Landsat {mission_name}")
    print(f"  Periodo: {start_date} a {end_date}")
    
    # Cargar colección
    collection = ee.ImageCollection(mission['collection']) \
        .filterBounds(STUDY_AREA) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUD_COVER', CLOUD_THRESHOLD))
    
    # Aplicar máscara de nubes
    collection = collection.map(lambda img: mask_clouds_landsat_c2(img, mission['qa_band']))
    
    # Verificar disponibilidad
    count = collection.size().getInfo()
    if count == 0:
        print(f"✗ No hay imágenes disponibles")
        return None
    
    print(f"  Imágenes encontradas: {count}")
    
    # Calcular índice de agua
    if water_index == 'mndwi':
        collection = collection.map(lambda img: calculate_mndwi(img, mission['bands']))
    elif water_index == 'ndwi':
        collection = collection.map(lambda img: calculate_ndwi(img, mission['bands']))
    elif water_index == 'awei':
        collection = collection.map(lambda img: calculate_awei(img, mission['bands']))
    
    # Calcular mediana anual (método CoastSat)
    median_water_index = collection.select(water_index.upper()).median()
    
    # Clasificar agua (valores > threshold)
    water_mask = median_water_index.gt(threshold)
    
    # Aplicar filtro morfológico para limpiar ruido (focal mode)
    water_mask_clean = water_mask.focal_mode(
        radius=30,  # metros
        kernelType='circle',
        units='meters'
    )
    
    # Extraer vectores (polígonos de agua)
    try:
        water_vectors = water_mask_clean.reduceToVectors(
            geometry=STUDY_AREA,
            scale=SPATIAL_RESOLUTION,
            geometryType='polygon',
            eightConnected=False,
            labelProperty='water',
            maxPixels=1e10
        )
        
        # Obtener borde externo (línea costera)
        # En CoastSat, la línea costera es el límite entre agua y tierra
        coastline = water_vectors.geometry().bounds().getInfo()
        
        # Simplificar geometría
        coastline_simplified = ee.Geometry(coastline).simplify(
            maxError=10  # metros
        ).getInfo()
        
        # Crear GeoJSON
        geojson = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': coastline_simplified,
                'properties': {
                    'year': year,
                    'mission': mission_name,
                    'water_index': water_index.upper(),
                    'threshold': threshold,
                    'image_count': count,
                    'method': 'CoastSat',
                    'location': 'Dibulla-Palomino, La Guajira, Colombia',
                    'certainty': 'good' if count >= 5 else 'low'
                }
            }]
        }
        
        print(f"✓ Línea costera extraída exitosamente")
        
        return {
            'year': year,
            'geojson': geojson,
            'metadata': {
                'mission': mission_name,
                'image_count': count,
                'water_index': water_index.upper(),
                'certainty': 'good' if count >= 5 else 'low'
            }
        }
        
    except Exception as e:
        print(f"✗ Error extrayendo vectores: {e}")
        return None


# ============================================================================
# PROCESAMIENTO PRINCIPAL
# ============================================================================

def main():
    """Procesar todos los años"""
    
    output_dir = Path('../public/data/coastlines_coastsat')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*60)
    print("EXTRACTOR DE LÍNEAS COSTERAS - METODOLOGÍA COASTSAT")
    print("="*60)
    print(f"Área: Dibulla-Palomino, La Guajira")
    print(f"Años: {YEARS[0]}-{YEARS[-1]}")
    print(f"Método: {WATER_INDEX.upper()}")
    print(f"Resolución: {SPATIAL_RESOLUTION}m")
    
    results = []
    
    for year in YEARS:
        result = extract_coastline_coastsat(year, WATER_INDEX)
        
        if result:
            # Guardar GeoJSON
            geojson_file = output_dir / f'coastline_{year}.geojson'
            with open(geojson_file, 'w') as f:
                json.dump(result['geojson'], f, indent=2)
            
            # Guardar metadata
            metadata_file = output_dir / f'metadata_{year}.json'
            with open(metadata_file, 'w') as f:
                json.dump(result['metadata'], f, indent=2)
            
            results.append(result)
            print(f"✓ Guardado: {geojson_file}")
        
        # Pausa para no saturar API
        import time
        time.sleep(2)
    
    # Resumen
    print("\n" + "="*60)
    print("PROCESAMIENTO COMPLETADO")
    print("="*60)
    print(f"Años exitosos: {len(results)}/{len(YEARS)}")
    print(f"Método: CoastSat ({WATER_INDEX.upper()})")
    print(f"Salida: {output_dir}/")


if __name__ == '__main__':
    main()
