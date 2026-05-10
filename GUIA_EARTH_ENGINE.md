# 🛰️ Guía: Procesar Datos Reales con Google Earth Engine

## ⚠️ Nota Importante

Por ahora estamos usando **datos de ejemplo realistas** que replican exactamente cómo se verían los datos reales. Cuando tengas acceso a Google Earth Engine, podrás procesar imágenes satelitales reales.

---

## 📋 Requisitos para Datos Reales

### 1. Cuenta de Google Earth Engine (GRATUITA)

**Registrarse:**
- URL: https://earthengine.google.com/signup/
- Llenar formulario (proyecto educativo/investigación)
- Esperar aprobación (1-3 días generalmente)
- Recibirás email de confirmación

**Tipos de cuenta:**
- ✅ **Academic/Research**: Gratis para investigación
- ✅ **Education**: Gratis para estudiantes
- ✅ **Non-profit**: Gratis para ONGs
- ⚠️ **Commercial**: Requiere pago

### 2. Python 3.9+ y Dependencias

Ya instaladas en `scripts/venv`:
```bash
earthengine-api
geemap
numpy
pandas
```

---

## 🚀 Pasos para Procesar Datos Reales

### Paso 1: Autenticar Google Earth Engine

```bash
cd scripts
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

earthengine authenticate
```

**Lo que sucederá:**
1. Se abrirá tu navegador
2. Inicia sesión con tu cuenta de Google (la misma del registro GEE)
3. Autoriza el acceso
4. Copia el código de verificación
5. Pégalo en la terminal

**Verificar autenticación:**
```bash
python3 -c "import ee; ee.Initialize(); print('✓ Autenticado')"
```

### Paso 2: Ejecutar Script CoastSat

```bash
python3 extract_coastlines_coastsat.py
```

**Esto procesará:**
- 25 años de imágenes Landsat (2000-2024)
- Área de Dibulla-Palomino
- Índice MNDWI para detección de agua
- Exportará GeoJSON con líneas costeras reales

**Tiempo estimado:** 30-60 minutos

**Salida esperada:**
```
============================================================
EXTRACTOR DE LÍNEAS COSTERAS - METODOLOGÍA COASTSAT
============================================================
Área: Dibulla-Palomino, La Guajira
Años: 2000-2024
Método: MNDWI
Resolución: 30m

============================================================
Procesando 2000 con CoastSat...
============================================================
  Misión: Landsat L7
  Periodo: 2000-12-01 a 2001-03-31
  Imágenes encontradas: 8
✓ Línea costera extraída exitosamente
✓ Guardado: ../public/data/coastlines/coastline_2000.geojson

...

============================================================
PROCESAMIENTO COMPLETADO
============================================================
Años exitosos: 23/25
Método: CoastSat (MNDWI)
Salida: ../public/data/coastlines/
```

### Paso 3: Verificar Datos Generados

```bash
ls -lh ../public/data/coastlines/

# Deberías ver:
coastline_2000.geojson  # Línea costera
metadata_2000.json      # Metadata
coastline_2001.geojson
metadata_2001.json
...
coastline_2024.geojson
metadata_2024.json
summary.json            # Resumen de todos los años
```

### Paso 4: Recargar el Mapa

El mapa ya está configurado para cargar automáticamente desde `/api/coastlines`. Simplemente:

1. Refresca el navegador (F5)
2. Los nuevos datos reales se cargarán automáticamente
3. Verás las líneas costeras procesadas desde Landsat

---

## 🔧 Configuración Avanzada

### Cambiar Índice de Agua

En `extract_coastlines_coastsat.py`:

```python
# Línea ~30
WATER_INDEX = 'mndwi'  # o 'ndwi', 'awei'
```

**Opciones:**
- `'mndwi'`: Modified NDWI (recomendado para costas)
- `'ndwi'`: Normalized Difference Water Index
- `'awei'`: Automated Water Extraction Index

### Ajustar Umbral de Nubes

```python
# Línea ~31
CLOUD_THRESHOLD = 20  # % máximo de nubes (10-50)
```

**Valores:**
- `10`: Muy estricto, menos imágenes pero más limpias
- `20`: Recomendado (balance)
- `50`: Permisivo, más imágenes pero posible ruido

### Cambiar Área de Estudio

```python
# Línea ~22-27
STUDY_AREA = ee.Geometry.Polygon([[
    [-73.45, 11.35],  # NO
    [-73.25, 11.35],  # NE
    [-73.25, 11.15],  # SE
    [-73.45, 11.15],  # SO
    [-73.45, 11.35]   # Cerrar
]])
```

**Para otra zona:**
1. Usa Google Earth para encontrar coordenadas
2. Define polígono en sentido horario
3. Formato: [longitud, latitud]

### Cambiar Resolución

```python
# Línea ~36
SPATIAL_RESOLUTION = 30  # metros (Landsat = 30m)
```

**Nota:** No cambiar a menos que uses otro satélite (ej: Sentinel-2 = 10m)

---

## 📊 Diferencia: Datos de Ejemplo vs Reales

### Datos de Ejemplo (Actuales)

```python
# Generados con generate_sample_data.py
✅ Coordenadas reales de Dibulla
✅ Simulación de erosión realista
✅ Metadata de satélites correcta
✅ 25 años de datos
⚠️ Erosión simulada matemáticamente
⚠️ No basada en imágenes reales
```

**Uso:** Demo, testing, desarrollo

### Datos Reales (Earth Engine)

```python
# Procesados con extract_coastlines_coastsat.py
✅ Imágenes Landsat reales
✅ Algoritmo CoastSat científico
✅ Erosión detectada desde satélite
✅ Validación científica
✅ Publicable en papers
✅ Precisión: ~7m RMSE
```

**Uso:** Investigación, reportes oficiales, decisiones de gestión

---

## 🔍 Validación de Datos Reales

### Cuando tengas datos reales, verifica:

```python
# Archivo metadata_2023.json
{
  "mission": "L9",            # ✓ Landsat 9
  "image_count": 12,          # ✓ >5 imágenes (buena certeza)
  "water_index": "MNDWI",     # ✓ Método usado
  "certainty": "good",        # ✓ Calidad de datos
  "length_km": 24.15          # ✓ Longitud razonable
}
```

**Indicadores de calidad:**
- ✅ `image_count >= 5`: Good certainty
- ✅ `cloud_cover < 20%`: Imágenes limpias
- ✅ `certainty == "good"`: Datos confiables
- ⚠️ `image_count < 5`: Low certainty
- ⚠️ `cloud_cover > 30%`: Posible ruido

---

## 📈 Comparación Visual Esperada

### Con Datos de Ejemplo:
```
Líneas costeras:
  - Siguen patrón de erosión general
  - Erosión uniforme en el tiempo
  - Suaves y regulares
```

### Con Datos Reales:
```
Líneas costeras:
  - Variabilidad interanual visible
  - Efectos de eventos específicos
  - Posibles irregularidades naturales
  - Datos más "ruidosos" pero reales
```

---

## ⚙️ Troubleshooting Earth Engine

### Error: "Please authenticate"

```bash
earthengine authenticate
```

### Error: "Project not found"

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo
3. En el script, especifica proyecto:

```python
ee.Initialize(project='tu-proyecto-id')
```

### Error: "Computation timed out"

Área muy grande o muchas imágenes:

```python
# Reducir área
STUDY_AREA = ee.Geometry.Polygon([...])  # Más pequeño

# O procesar menos años
YEARS = list(range(2020, 2025))  # Solo últimos 5 años
```

### Error: "No images found"

```python
# Aumentar umbral de nubes
CLOUD_THRESHOLD = 50

# O ampliar rango de fechas
start_date = f'{year}-01-01'  # Todo el año
end_date = f'{year}-12-31'
```

---

## 🎓 Referencias para Datos Reales

### Papers Científicos:

1. **Bishop-Taylor et al. (2021)**
   - "Mapping Australia's dynamic coastline"
   - Remote Sensing of Environment
   - https://doi.org/10.1016/j.rse.2021.112734

2. **Vos et al. (2019)**
   - "CoastSat: Google Earth Engine-enabled toolkit"
   - Environmental Modelling & Software
   - https://doi.org/10.1016/j.envsoft.2019.104528

### Repositorios:

- CoastSat Original: https://github.com/kvos/CoastSat
- DEA Coastlines: https://github.com/GeoscienceAustralia/dea-coastlines
- Google Earth Engine: https://developers.google.com/earth-engine/

---

## 📝 Checklist Completo

### Para Procesar Datos Reales:

- [ ] Registrarse en Google Earth Engine
- [ ] Esperar aprobación del registro
- [ ] Instalar dependencias Python
- [ ] Autenticar Earth Engine (`earthengine authenticate`)
- [ ] Verificar autenticación (`ee.Initialize()`)
- [ ] Ejecutar `extract_coastlines_coastsat.py`
- [ ] Verificar archivos generados
- [ ] Refrescar navegador para ver datos nuevos
- [ ] Validar calidad de datos (metadata)
- [ ] Documentar resultados

---

## 🌟 Mientras Tanto...

### Los datos de ejemplo son suficientes para:

✅ Desarrollar y probar el sistema
✅ Demostrar funcionalidad
✅ Mostrar visualización
✅ Presentar en hackathon
✅ Entrenar usuarios
✅ Validar UX/UI
✅ Probar API

### Necesitarás datos reales para:

📊 Publicaciones científicas
📊 Reportes oficiales a gobierno
📊 Decisiones de gestión costera
📊 Validación con mediciones de campo
📊 Comparación con otros estudios

---

## 🎯 Resumen

**Ahora mismo:**
- ✅ Sistema 100% funcional con datos de ejemplo
- ✅ Visualización idéntica a Digital Earth Africa
- ✅ Todos los componentes operativos

**Con Google Earth Engine:**
- 🚀 Datos reales de satélites Landsat
- 🚀 Precisión científica validada
- 🚀 Actualizable anualmente
- 🚀 Publicable en investigación

**Ambos escenarios son válidos y útiles!**

---

**Cuando tengas acceso a Earth Engine, simplemente ejecuta el script y los datos reales reemplazarán automáticamente los de ejemplo.** 🛰️
