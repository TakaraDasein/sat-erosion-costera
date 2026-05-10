# Guía de Instalación y Uso - Sistema de Procesamiento de Líneas Costeras

## 📋 Requisitos Previos

### 1. Cuenta de Google Earth Engine

Para usar este sistema necesitas una cuenta de Google Earth Engine:

1. **Registrarse**: https://earthengine.google.com/signup/
   - Usa tu cuenta de Google
   - Especifica que es para investigación/educación
   - Espera aprobación (usualmente 1-2 días)

2. **Verificar acceso**: https://code.earthengine.google.com/
   - Deberías poder acceder al Code Editor

### 2. Python 3.9+

Verifica tu versión de Python:
```bash
python3 --version
# Debe ser >= 3.9
```

Si necesitas instalar Python:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv

# macOS (con Homebrew)
brew install python@3.11

# Windows
# Descarga desde https://www.python.org/downloads/
```

## 🚀 Instalación

### Paso 1: Crear entorno virtual

```bash
cd scripts/
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows
```

### Paso 2: Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Paso 3: Autenticar Google Earth Engine

```bash
earthengine authenticate
```

Esto abrirá tu navegador para autorizar el acceso:
1. Inicia sesión con tu cuenta de Google (la misma con la que te registraste en Earth Engine)
2. Autoriza la aplicación
3. Copia el código de verificación
4. Pégalo en la terminal

Verifica que funciona:
```bash
python3 -c "import ee; ee.Initialize(); print('✓ Earth Engine OK')"
```

## 📊 Uso del Script

### Procesamiento básico

Extraer líneas costeras para todos los años (2000-2024):

```bash
python3 extract_coastlines.py
```

### Salida esperada

```
============================================================
EXTRACTOR DE LÍNEAS COSTERAS - DIBULLA-PALOMINO
============================================================
Área de estudio: Polygon (...)
Años a procesar: 2000 - 2024
Total: 25 años

============================================================
Procesando año 2000...
============================================================
✓ Imagen encontrada: L7
  Fecha: 2000-12-15
  Nubes: 5.2%
  Extrayendo línea costera...
  Simplificando geometría...
  Convirtiendo a GeoJSON...
✓ Procesamiento completado: 12 features
✓ Guardado: ../public/data/coastlines/coastline_2000.geojson

...

============================================================
PROCESAMIENTO COMPLETADO
============================================================
Años exitosos: 23/25
Archivos generados en: public/data/coastlines/
============================================================
```

### Archivos generados

```
public/data/coastlines/
├── coastline_2000.geojson    # Línea costera año 2000
├── metadata_2000.json        # Metadata (satélite, fecha, etc.)
├── coastline_2001.geojson
├── metadata_2001.json
├── ...
├── coastline_2024.geojson
├── metadata_2024.json
└── summary.json              # Resumen de todos los años
```

## 🔧 Configuración Avanzada

### Ajustar área de estudio

Edita `extract_coastlines.py`:

```python
# Línea ~18
DIBULLA_BOUNDS = ee.Geometry.Polygon([[
    [-73.45, 11.35],  # NO - Esquina noroeste
    [-73.25, 11.35],  # NE - Esquina noreste
    [-73.25, 11.15],  # SE - Esquina sureste
    [-73.45, 11.15],  # SO - Esquina suroeste
    [-73.45, 11.35]   # Cerrar polígono
]])
```

### Ajustar umbral de detección

El umbral MNDWI determina qué se considera "agua":

```python
# Línea ~197 en extract_coastline()
water_mask = mndwi_image.gt(threshold)  # threshold=0.0 por defecto

# Valores más altos (ej: 0.1) = detecta solo agua muy clara
# Valores más bajos (ej: -0.1) = detecta más área como agua
```

### Cambiar filtro de nubes

```python
# Línea ~113
.filter(ee.Filter.lt('CLOUD_COVER', 20))  # Cambiar 20 a otro valor (0-100)
```

### Ajustar resolución

```python
# Línea ~153 en extract_coastline()
scale=30,  # 30 metros (Landsat)
# Cambiar a 10 para Sentinel-2 (requiere cambiar colecciones)
```

## 📈 Procesamiento de Datos Generados

### Cargar GeoJSON en Python

```python
import json
import geopandas as gpd

# Cargar un año específico
with open('../public/data/coastlines/coastline_2023.geojson') as f:
    data = json.load(f)

# O usar GeoPandas
gdf = gpd.read_file('../public/data/coastlines/coastline_2023.geojson')
print(gdf.head())
```

### Cargar en JavaScript/TypeScript

```typescript
// En tu componente React
const [coastlineData, setCoastlineData] = useState(null);

useEffect(() => {
  fetch('/data/coastlines/coastline_2023.geojson')
    .then(res => res.json())
    .then(data => setCoastlineData(data));
}, []);
```

### Cargar en Leaflet/Google Maps

```typescript
// Leaflet
L.geoJSON(coastlineData, {
  style: { color: '#00E5FF', weight: 2 }
}).addTo(map);

// Google Maps
map.data.addGeoJson(coastlineData);
map.data.setStyle({
  strokeColor: '#00E5FF',
  strokeWeight: 2
});
```

## 🐛 Solución de Problemas

### Error: "Please authorize access to your Earth Engine account"

**Solución**: Ejecuta `earthengine authenticate` de nuevo

### Error: "Collection.load: Collection 'LANDSAT/...' not found"

**Posible causa**: Tu cuenta de Earth Engine no tiene acceso a colecciones Landsat

**Solución**: 
1. Verifica tu cuenta en https://code.earthengine.google.com/
2. Asegúrate de que tu registro fue aprobado
3. Intenta acceder a la colección en el Code Editor

### Error: "No se encontraron imágenes válidas para año X"

**Causas posibles**:
- Demasiada cobertura de nubes en ese periodo
- Área de estudio fuera del alcance del satélite
- Problema con la conexión a Earth Engine

**Solución**:
1. Aumenta el umbral de nubes: `.filter(ee.Filter.lt('CLOUD_COVER', 50))`
2. Amplía el rango de fechas
3. Verifica que el área de estudio está correcta

### Error: Memory limit exceeded

**Solución**: Reduce el área de estudio o aumenta la tolerancia de simplificación:

```python
# Línea ~203
coastline_simplified = simplify_coastline(coastline, tolerance=50)
# Aumenta tolerance a 100 o más
```

### Script muy lento

**Optimizaciones**:

1. Procesar menos años:
```python
YEARS = list(range(2020, 2025))  # Solo últimos 5 años
```

2. Reducir resolución:
```python
scale=60,  # En vez de 30m
```

3. Aumentar tolerancia de simplificación:
```python
tolerance=100  # En vez de 30m
```

## 📚 Recursos Adicionales

- **Earth Engine Docs**: https://developers.google.com/earth-engine/
- **Landsat Info**: https://www.usgs.gov/landsat-missions/
- **MNDWI Paper**: Xu, H. (2006). "Modification of normalised difference water index (NDWI)"
- **GeoPandas Docs**: https://geopandas.org/
- **GeoJSON Spec**: https://geojson.org/

## 🔑 Variables de Entorno (Opcional)

Para automatización, puedes usar variables de entorno:

```bash
# .env
EARTHENGINE_ACCOUNT=your-email@gmail.com
EARTHENGINE_PROJECT=your-project-id
OUTPUT_DIR=/path/to/output
```

Y cargarlas en el script:

```python
from dotenv import load_dotenv
load_dotenv()

output_dir = os.getenv('OUTPUT_DIR', '../public/data/coastlines')
```

## 🤝 Contribuir

Si encuentras problemas o mejoras:

1. Verifica que no sea un problema conocido
2. Crea un issue con detalles:
   - Versión de Python
   - Sistema operativo
   - Logs completos del error
   - Pasos para reproducir

## 📄 Licencia

MIT License - Ver LICENSE file
