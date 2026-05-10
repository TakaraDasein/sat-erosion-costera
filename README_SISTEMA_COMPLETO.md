# Sistema de Monitoreo de Erosión Costera - Dibulla-Palomino

<div align="center">

![Erosión Costera](https://img.shields.io/badge/Erosión-Crítica-red?style=for-the-badge)
![Google Earth Engine](https://img.shields.io/badge/Google_Earth_Engine-Enabled-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)

**Sistema completo de análisis y visualización de erosión costera usando imágenes satelitales**

[Demo](http://localhost:4321/mapa-google) · [Documentación](http://localhost:4321/documentacion) · [API](http://localhost:4321/api/coastlines)

</div>

---

## 🌊 Descripción

Sistema de monitoreo de erosión costera para la zona **Dibulla-Palomino** (La Guajira, Colombia) que procesa imágenes satelitales de Google Earth Engine (Landsat 5, 7, 8, 9) desde el año 2000 hasta 2024 para:

- ✅ Detectar líneas costeras históricas usando algoritmos MNDWI + NDWI
- ✅ Calcular tasas de erosión y acreción
- ✅ Visualizar cambios temporales en mapas interactivos
- ✅ Exportar datos en formato GeoJSON
- ✅ Servir datos vía API REST

## 🎯 Características Principales

### 📡 Procesamiento de Imágenes Satelitales

- **Google Earth Engine**: Acceso a +40 años de imágenes Landsat
- **MNDWI Algorithm**: Modified Normalized Difference Water Index
- **NDWI Algorithm**: Normalized Difference Water Index
- **Resolución**: 30 metros (Landsat)
- **Cobertura temporal**: 2000-2024 (25 años)

### 🗺️ Visualización Interactiva

**Mapa Google Maps** (`/mapa-google`):
- Vista satelital de alta resolución
- Líneas costeras históricas superpuestas
- Modo de comparación temporal (año A vs año B)
- Puntos de erosión crítica
- Análisis de cambios en tiempo real

**Mapa Leaflet** (`/mapa`):
- 100% OpenSource
- Capas base múltiples (OSM, CARTO, Esri)
- Sistema de comparación con slider
- Optimizado para bajo consumo de datos

### 🔌 API REST

**Endpoints disponibles**:

```bash
# Obtener resumen de años disponibles
GET /api/coastlines

# Obtener línea costera de un año específico
GET /api/coastlines?year=2023

# Análisis de erosión entre dos años
GET /api/erosion-analysis?year1=2000&year2=2023
```

**Ejemplo de respuesta**:

```json
{
  "year": 2023,
  "type": "FeatureCollection",
  "metadata": {
    "date": "2023-12-15",
    "satellite": "L9",
    "cloud_cover": 5.2,
    "location": "Dibulla-Palomino, La Guajira, Colombia",
    "source": "Google Earth Engine - Landsat",
    "algorithm": "MNDWI + NDWI",
    "resolution": "30m"
  },
  "features": [...]
}
```

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js 18+** y **pnpm**
- **Python 3.9+** (para procesamiento de imágenes)
- **Cuenta de Google Earth Engine** ([Registrarse](https://earthengine.google.com/signup/))

### 1. Instalar dependencias del frontend

```bash
cd astro-page
pnpm install
```

### 2. Instalar dependencias de Python

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

### 3. Autenticar Google Earth Engine

```bash
earthengine authenticate
```

Sigue las instrucciones en pantalla para autorizar el acceso.

### 4. Procesar imágenes satelitales

```bash
python3 extract_coastlines.py
```

Este script:
1. Descarga imágenes Landsat para cada año (2000-2024)
2. Calcula índices MNDWI y NDWI
3. Detecta líneas costeras
4. Exporta GeoJSON a `public/data/coastlines/`

**Tiempo estimado**: 15-30 minutos (dependiendo de conexión)

**Archivos generados**:
```
public/data/coastlines/
├── coastline_2000.geojson
├── metadata_2000.json
├── coastline_2001.geojson
├── metadata_2001.json
├── ...
├── coastline_2024.geojson
├── metadata_2024.json
└── summary.json
```

### 5. Iniciar el servidor

```bash
cd astro-page
pnpm dev
```

Abre http://localhost:4321

## 📁 Estructura del Proyecto

```
erosion-costera/
├── astro-page/                    # Frontend (Astro + React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoastalMap.tsx            # Mapa Leaflet con comparación temporal
│   │   │   ├── GoogleCoastalMap.tsx      # Mapa Google Maps con datos reales
│   │   │   ├── HeroCarousel.tsx          # Landing page hero
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── index.astro               # Landing page
│   │   │   ├── mapa.astro                # Mapa Leaflet
│   │   │   ├── mapa-google.astro         # Mapa Google Maps
│   │   │   ├── documentacion.astro       # Docs técnicas
│   │   │   │
│   │   │   └── api/
│   │   │       ├── coastlines.ts         # API: líneas costeras
│   │   │       └── erosion-analysis.ts   # API: análisis de erosión
│   │   │
│   │   ├── utils/
│   │   │   └── coastlineData.ts          # Constantes y configuración
│   │   │
│   │   └── layouts/
│   │       └── Layout.astro              # Layout base con SEO
│   │
│   ├── public/
│   │   └── data/
│   │       └── coastlines/               # Datos procesados (GeoJSON)
│   │
│   └── package.json
│
├── scripts/                       # Procesamiento de imágenes
│   ├── extract_coastlines.py            # Script principal de Earth Engine
│   ├── requirements.txt                 # Dependencias Python
│   ├── INSTALLATION.md                  # Guía de instalación detallada
│   └── venv/                            # Entorno virtual Python
│
├── README.md                      # Este archivo
└── SISTEMA_COMPARACION.md         # Guía del sistema de comparación temporal
```

## 🛠️ Stack Tecnológico

### Frontend
- **Astro 4.16**: Framework web moderno
- **React 18.3**: Componentes interactivos
- **TypeScript 5.7**: Type safety
- **Tailwind CSS**: Estilos utility-first
- **Leaflet 1.9.4**: Mapas OpenSource
- **Google Maps API**: Visualización satelital
- **Three.js**: Efectos WebGL

### Backend/Procesamiento
- **Google Earth Engine**: Procesamiento geoespacial
- **Python 3.9+**: Scripts de procesamiento
- **GeoPandas**: Análisis geoespacial
- **Shapely**: Geometrías GIS
- **Rasterio**: Procesamiento raster

### APIs y Datos
- **Landsat 5, 7, 8, 9**: Imágenes satelitales
- **OpenStreetMap**: Capa base
- **CARTO**: Tiles de mapa
- **Esri World Imagery**: Imágenes satelitales

## 🧪 Algoritmos Utilizados

### MNDWI (Modified Normalized Difference Water Index)

```python
MNDWI = (Green - SWIR) / (Green + SWIR)
```

- **Verde (Green)**: Reflectancia alta en agua
- **SWIR (Short-Wave Infrared)**: Reflectancia baja en agua
- **Umbral**: Valores > 0 generalmente indican agua

### NDWI (Normalized Difference Water Index)

```python
NDWI = (Green - NIR) / (Green + NIR)
```

- **NIR (Near-Infrared)**: Absorbido por agua
- Complementario al MNDWI para mejor detección

### Detección de Línea Costera

1. Calcular MNDWI y NDWI
2. Combinar índices (70% MNDWI + 30% NDWI)
3. Aplicar umbral para crear máscara de agua
4. Filtro morfológico para limpiar ruido
5. Detección de bordes (transición agua-tierra)
6. Simplificación de geometría (Douglas-Peucker)
7. Exportar como GeoJSON

## 📊 Análisis de Erosión

### Puntos Críticos Identificados

| Ubicación | Tasa de Erosión | Cambio Total (2000-2023) | Severidad |
|-----------|----------------|-------------------------|-----------|
| La Cachaca III | **-2.5 m/año** | -57.5 m | 🔴 Crítico |
| Dibulla Centro | **-1.8 m/año** | -41.4 m | 🟠 Alto |
| Playa Dibulla Sur | **-2.1 m/año** | -48.3 m | 🔴 Crítico |
| Palomino | **+0.5 m/año** | +11.5 m | 🟢 Estable/Crecimiento |

### Metodología de Cálculo

```typescript
// Calcular distancia Haversine entre líneas costeras
distance = calculateDistance(coastline2023, coastline2000)

// Tasa de erosión
erosionRate = distance / (2023 - 2000)  // m/año

// Clasificación
if (erosionRate > 2.0) → Crítico
else if (erosionRate > 1.0) → Alto
else if (erosionRate > 0.5) → Moderado
else → Estable
```

## 🌐 API Usage

### Ejemplo: Obtener línea costera de 2023

```bash
curl http://localhost:4321/api/coastlines?year=2023
```

### Ejemplo: Análisis de erosión

```bash
curl "http://localhost:4321/api/erosion-analysis?year1=2000&year2=2023"
```

**Respuesta**:

```json
{
  "comparison": {
    "year1": 2000,
    "year2": 2023,
    "yearsDiff": 23
  },
  "analysis": {
    "averageChange": 45.2,
    "maxChange": 89.7,
    "minChange": 12.3,
    "changeRate": 1.97,
    "unit": "meters"
  },
  "classification": {
    "type": "erosion",
    "severity": "crítico",
    "description": "Erosión crítico detectada: 45m de retroceso promedio"
  }
}
```

### Usar datos en JavaScript

```typescript
// Cargar línea costera
const response = await fetch('/api/coastlines?year=2023');
const data = await response.json();

// Agregar a Leaflet
L.geoJSON(data, {
  style: { color: '#00E5FF', weight: 2 }
}).addTo(map);

// Agregar a Google Maps
map.data.addGeoJson(data);
map.data.setStyle({
  strokeColor: '#00E5FF',
  strokeWeight: 2
});
```

## 🐛 Solución de Problemas

### Error: "No coastline data available"

**Causa**: No se han procesado las imágenes

**Solución**:
```bash
cd scripts
python3 extract_coastlines.py
```

### Error: "Earth Engine not authenticated"

**Solución**:
```bash
earthengine authenticate
```

### Error: "No se encontraron imágenes para año X"

**Posibles causas**:
- Mucha cobertura de nubes
- Área fuera del alcance del satélite

**Solución**: Ajustar filtro de nubes en `extract_coastlines.py`:
```python
.filter(ee.Filter.lt('CLOUD_COVER', 50))  # Aumentar a 50%
```

## 📈 Próximas Mejoras

- [ ] Sistema de caché para datos procesados
- [ ] Exportación de datos (Shapefile, CSV)
- [ ] Herramienta de dibujo de transectos
- [ ] Gráficos de tendencias temporales
- [ ] Integración con Sentinel-2 (10m de resolución)
- [ ] Predicción de erosión futura (Machine Learning)
- [ ] Sistema de alertas automáticas
- [ ] Dashboard administrativo

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📚 Referencias

- [Google Earth Engine Docs](https://developers.google.com/earth-engine/)
- [Landsat Missions](https://www.usgs.gov/landsat-missions/)
- [MNDWI Paper](https://doi.org/10.1080/01431160600589179) - Xu, H. (2006)
- [Digital Earth Africa](https://www.digitalearthafrica.org/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Astro Documentation](https://astro.build/)

## 👥 Contacto

**Equipo Achiki O'pala**
- Email: contacto@achikiopala.com
- GitHub: [@achikiopala](https://github.com/achikiopala)

---

<div align="center">

**Hecho con ❤️ para La Guajira, Colombia**

![Colombia](https://img.shields.io/badge/Colombia-🇨🇴-yellow?style=for-the-badge)
![La Guajira](https://img.shields.io/badge/La_Guajira-🌊-blue?style=for-the-badge)

</div>
