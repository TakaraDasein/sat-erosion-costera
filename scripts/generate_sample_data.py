#!/usr/bin/env python3
"""
Genera datos de ejemplo de líneas costeras para Dibulla-Palomino
Simula erosión progresiva de 2000 a 2024
"""

import json
from datetime import datetime

# Coordenadas base de la línea costera de Dibulla-Palomino
# De norte (Palomino) a sur (Dibulla)
BASE_COASTLINE = [
    [-73.2636, 11.3461],  # Palomino Norte
    [-73.2589, 11.3385],  # Palomino Centro
    [-73.2542, 11.3312],  # Palomino Sur
    [-73.2478, 11.3156],  # Zona Intermedia 1
    [-73.2412, 11.2998],  # Zona Intermedia 2
    [-73.2356, 11.2845],  # Zona Intermedia 3
    [-73.2678, 11.2794],  # Dibulla Norte (ajustado más al oeste)
    [-73.2845, 11.2738],  # Dibulla Centro
    [-73.2985, 11.2689],  # Dibulla Sur
    [-73.3128, 11.2612],  # La Cachaca III (zona crítica)
    [-73.3245, 11.2545],  # La Cachaca Sur
    [-73.3345, 11.2389],  # Dibulla Sur 1
    [-73.3445, 11.2234],  # Dibulla Sur 2
    [-73.3542, 11.2089],  # Zona Límite Sur
]

# Tasas de erosión por segmento (metros por año)
# Negativo = erosión (retroceso hacia el este)
# Positivo = acreción (avance hacia el oeste)
EROSION_RATES = [
    0.5,   # Palomino Norte - ligera acreción
    0.3,   # Palomino Centro
    0.2,   # Palomino Sur
    -0.5,  # Zona Intermedia 1 - erosión leve
    -1.2,  # Zona Intermedia 2 - erosión moderada
    -1.5,  # Zona Intermedia 3 - erosión moderada
    -1.8,  # Dibulla Norte - erosión alta
    -2.1,  # Dibulla Centro - erosión alta
    -2.0,  # Dibulla Sur - erosión alta
    -2.5,  # La Cachaca III - EROSIÓN CRÍTICA
    -2.3,  # La Cachaca Sur - erosión crítica
    -1.8,  # Dibulla Sur 1 - erosión alta
    -1.5,  # Dibulla Sur 2 - erosión moderada
    -1.2,  # Zona Límite Sur - erosión moderada
]

def meters_to_degrees_lng(meters, latitude):
    """
    Convierte metros a grados de longitud
    1 grado de longitud ≈ 111,320 * cos(lat) metros
    """
    import math
    lat_rad = math.radians(latitude)
    meters_per_degree = 111320 * math.cos(lat_rad)
    return meters / meters_per_degree

def generate_coastline_for_year(year, base_year=2000):
    """
    Genera línea costera para un año específico
    Aplica erosión/acreción desde el año base
    """
    years_elapsed = year - base_year
    
    coastline = []
    for i, (lng, lat) in enumerate(BASE_COASTLINE):
        # Aplicar erosión/acreción
        erosion_rate = EROSION_RATES[i]  # m/año
        total_change_meters = erosion_rate * years_elapsed
        
        # Convertir a cambio en longitud (este-oeste)
        # Negativo = erosión = se mueve al este (aumenta lng)
        # Positivo = acreción = se mueve al oeste (disminuye lng)
        lng_change = meters_to_degrees_lng(-total_change_meters, lat)
        
        new_lng = lng + lng_change
        
        # Agregar variación aleatoria pequeña para hacer más natural
        import random
        random.seed(year * (i + 1))  # Seed consistente por año y punto
        noise = random.uniform(-0.0001, 0.0001)
        
        coastline.append([new_lng + noise, lat])
    
    return coastline

def create_geojson(year, coastline):
    """
    Crea GeoJSON para una línea costera
    """
    # Simular metadata realista
    satellites = {
        range(2000, 2012): 'L5',
        range(2012, 2013): 'L7',
        range(2013, 2021): 'L8',
        range(2021, 2025): 'L9',
    }
    
    satellite = 'L7'
    for year_range, sat in satellites.items():
        if year in year_range:
            satellite = sat
            break
    
    # Fecha simulada (diciembre-marzo, época seca)
    import random
    random.seed(year)
    month = random.choice([12, 1, 2, 3])
    day = random.randint(1, 28)
    if month == 12:
        date_str = f"{year}-12-{day:02d}"
    else:
        date_str = f"{year+1 if month == 12 else year}-{month:02d}-{day:02d}"
    
    cloud_cover = round(random.uniform(2.0, 18.0), 1)
    
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coastline
                },
                "properties": {
                    "year": year,
                    "date": date_str,
                    "satellite": satellite,
                    "cloud_cover": cloud_cover,
                    "threshold": 0.0,
                    "index_type": "MNDWI+NDWI",
                    "location": "Dibulla-Palomino, La Guajira, Colombia",
                    "length_km": calculate_length(coastline)
                }
            }
        ]
    }
    
    return geojson

def calculate_length(coords):
    """
    Calcula longitud aproximada de la línea en km
    """
    import math
    total = 0
    for i in range(len(coords) - 1):
        lng1, lat1 = coords[i]
        lng2, lat2 = coords[i + 1]
        
        # Haversine simplificado para distancias cortas
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        total += 6371 * c  # Radio de la Tierra en km
    
    return round(total, 2)

def create_metadata(year, geojson):
    """
    Crea archivo de metadata
    """
    feature = geojson['features'][0]
    props = feature['properties']
    
    return {
        "date": props['date'],
        "satellite": props['satellite'],
        "cloud_cover": props['cloud_cover'],
        "features_count": len(geojson['features']),
        "length_km": props['length_km'],
        "year": year
    }

def create_summary(years_data):
    """
    Crea archivo resumen
    """
    return {
        "location": "Dibulla-Palomino, La Guajira, Colombia",
        "bounds": {
            "north": 11.35,
            "south": 11.15,
            "east": -73.25,
            "west": -73.45
        },
        "years": [y for y, _ in years_data],
        "total_years": len(years_data),
        "processing_date": datetime.now().isoformat(),
        "files": [
            {
                "year": year,
                "file": f"coastline_{year}.geojson",
                "metadata": metadata
            }
            for year, metadata in years_data
        ],
        "erosion_summary": {
            "critical_zones": [
                {
                    "name": "La Cachaca III",
                    "rate": -2.5,
                    "total_2000_2024": -60.0
                },
                {
                    "name": "Dibulla Centro",
                    "rate": -2.1,
                    "total_2000_2024": -50.4
                }
            ],
            "average_erosion_rate": -1.4,
            "total_coastline_retreat": -33.6
        }
    }

def main():
    """
    Genera todos los archivos
    """
    import os
    
    output_dir = "../public/data/coastlines"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("GENERADOR DE DATOS DE LÍNEAS COSTERAS - DIBULLA-PALOMINO")
    print("="*60)
    print(f"Generando datos de ejemplo (2000-2024)...")
    print()
    
    years_data = []
    
    # Generar para años clave
    years = list(range(2000, 2025))
    
    for year in years:
        print(f"Generando año {year}...", end=" ")
        
        # Generar línea costera
        coastline = generate_coastline_for_year(year)
        
        # Crear GeoJSON
        geojson = create_geojson(year, coastline)
        
        # Crear metadata
        metadata = create_metadata(year, geojson)
        
        # Guardar GeoJSON
        geojson_file = os.path.join(output_dir, f"coastline_{year}.geojson")
        with open(geojson_file, 'w') as f:
            json.dump(geojson, f, indent=2)
        
        # Guardar metadata
        metadata_file = os.path.join(output_dir, f"metadata_{year}.json")
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        years_data.append((year, metadata))
        
        print(f"✓ ({metadata['length_km']} km)")
    
    # Crear resumen
    summary = create_summary(years_data)
    summary_file = os.path.join(output_dir, "summary.json")
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print()
    print("="*60)
    print("✓ GENERACIÓN COMPLETADA")
    print("="*60)
    print(f"Total de años: {len(years_data)}")
    print(f"Archivos generados: {len(years_data) * 2 + 1}")
    print(f"Ubicación: {output_dir}/")
    print()
    print("Estadísticas de erosión:")
    print(f"  Erosión promedio: {summary['erosion_summary']['average_erosion_rate']} m/año")
    print(f"  Retroceso total (2000-2024): {summary['erosion_summary']['total_coastline_retreat']} m")
    print(f"  Zona más crítica: La Cachaca III (-2.5 m/año)")
    print("="*60)

if __name__ == "__main__":
    main()
