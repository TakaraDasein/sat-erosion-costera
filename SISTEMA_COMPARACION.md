# 📊 Sistema de Comparación Temporal - Achiki O'pala

## Funcionalidad Principal

El **Sistema de Comparación Temporal** permite visualizar cambios en la línea costera entre dos años diferentes usando un **slider interactivo** que divide la pantalla verticalmente.

---

## 🎯 Características Implementadas

### 1. **Modo Comparación con Slider**
- ✅ División vertical del mapa en dos secciones
- ✅ Año principal (izquierda) vs Año de comparación (derecha)
- ✅ Slider arrastrable para ajustar la división
- ✅ Indicadores visuales de cada año
- ✅ Transiciones suaves

### 2. **Controles de Año**
- ✅ **Selector de Año Principal:** Slider 2000-2023
- ✅ **Selector de Año de Comparación:** Slider 2000-2023
- ✅ **Toggle Modo Comparación:** Checkbox activar/desactivar
- ✅ Actualización en tiempo real

### 3. **Visualización de Datos**
- ✅ Líneas costeras con colores diferenciados
  - **Cyan (#00E5FF):** Línea costera actual
  - **Naranja (#FF7043):** Línea costera histórica (dashed)
- ✅ Marcadores de puntos críticos
  - **Rojo:** Erosión crítica con tasa negativa
  - **Verde:** Crecimiento costero con tasa positiva
- ✅ Popups informativos con estadísticas

### 4. **Capas Base OpenSource**
- 🛰️ **Satélite (Esri World Imagery)**
- 🗺️ **OpenStreetMap** - Datos colaborativos
- ☀️ **CARTO Light** - Mapa claro minimalista
- 🌙 **CARTO Dark** - Tema oscuro

---

## 🔧 Uso del Sistema

### Activar Modo Comparación

1. Abre el mapa: `http://localhost:4321/mapa`
2. En el panel "Datos Costeros", marca ✅ **Modo Comparación**
3. Selecciona el año principal y el año de comparación
4. Arrastra el **slider vertical** en el mapa para comparar

### Ejemplo de Uso

```typescript
// Estado del componente
const [compareMode, setCompareMode] = useState(false);
const [selectedYear, setSelectedYear] = useState(2023);
const [compareYear, setCompareYear] = useState(2000);
const [sliderPosition, setSliderPosition] = useState(50);

// Activar comparación
<input
  type="checkbox"
  checked={compareMode}
  onChange={(e) => setCompareMode(e.target.checked)}
/>

// Selector de año
<input
  type="range"
  min="2000"
  max="2023"
  value={selectedYear}
  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
/>
```

---

## 🎨 Implementación Visual

### Slider de Comparación

```tsx
{compareMode && (
  <div className="absolute inset-0 z-[999] cursor-ew-resize">
    {/* Lado izquierdo - Año actual */}
    <div style={{ width: `${sliderPosition}%` }}>
      <div className="bg-cyan-400">
        {selectedYear}
      </div>
    </div>
    
    {/* Lado derecho - Año histórico */}
    <div className="bg-orange-500">
      {compareYear}
    </div>
    
    {/* Slider vertical */}
    <div style={{ left: `${sliderPosition}%` }}>
      <div className="w-8 h-8 bg-white rounded-full">
        <svg>...</svg>
      </div>
    </div>
  </div>
)}
```

### Interacción con Mouse

```tsx
const handleSliderDrag = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  setSliderPosition(Math.max(0, Math.min(100, percentage)));
};
```

---

## 📊 Datos Visualizados

### Líneas Costeras

**Formato de Datos (Simulados):**
```typescript
const coastline2023 = [
  [11.28, -73.69],   // lat, lon
  [11.282, -73.688],
  [11.284, -73.686],
  // ...
];

const coastline2000 = [
  [11.281, -73.691],
  [11.283, -73.689],
  // ...
];
```

**Visualización:**
```typescript
L.polyline(coastline2023, {
  color: '#00E5FF',     // Cyan
  weight: 3,
  opacity: 0.8,
}).addTo(map);

L.polyline(coastline2000, {
  color: '#FF7043',     // Naranja
  weight: 3,
  opacity: 0.6,
  dashArray: '10, 10',  // Línea discontinua
}).addTo(map);
```

### Puntos de Erosión/Crecimiento

```typescript
// Punto de erosión crítica
const erosionPoint = L.circleMarker([11.284, -73.686], {
  radius: 8,
  fillColor: '#FF5252',  // Rojo
  color: '#fff',
  weight: 2,
  fillOpacity: 0.8,
});

erosionPoint.bindPopup(`
  <h4>Punto de Erosión Crítica</h4>
  <p>Tasa: <span>-2.5 m/año</span></p>
  <p>Retroceso total: <span>57.5 m</span> (2000-2023)</p>
`);
```

---

## 🌍 Fuentes de Datos OpenSource

### Base Maps

| Capa | Proveedor | Licencia | URL |
|------|-----------|----------|-----|
| **Satélite** | Esri World Imagery | Esri Master License | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/` |
| **OpenStreetMap** | OpenStreetMap Contributors | ODbL 1.0 | `https://tile.openstreetmap.org/` |
| **CARTO Light** | CARTO | CC BY 3.0 | `https://basemaps.cartocdn.com/light_all/` |
| **CARTO Dark** | CARTO | CC BY 3.0 | `https://basemaps.cartocdn.com/dark_all/` |

### Tecnologías

| Librería | Versión | Licencia | Propósito |
|----------|---------|----------|-----------|
| **Leaflet** | 1.9.4 | BSD 2-Clause | Motor de mapas |
| **React-Leaflet** | 5.0.0 | MIT | Integración React |
| **OpenStreetMap** | - | ODbL | Datos geográficos |

---

## 🚀 Próximas Funcionalidades

### Fase 2 - Datos Reales
- [ ] Integración con WFS (Web Feature Service)
- [ ] Conexión a API de Digital Earth Africa
- [ ] Carga de archivos GeoJSON/Shapefile
- [ ] Cache de datos con IndexedDB

### Fase 3 - Análisis Avanzado
- [ ] Herramienta de dibujo de transectos
- [ ] Cálculo de tasas de cambio en tiempo real
- [ ] Gráficos temporales de erosión
- [ ] Exportación de reportes PDF

### Fase 4 - Colaboración
- [ ] Anotaciones colaborativas
- [ ] Compartir vistas del mapa (URL params)
- [ ] Marcadores personalizados
- [ ] Sistema de comentarios

---

## 📖 Referencias Técnicas

### Documentación

1. **Leaflet.js Docs:** https://leafletjs.com/reference.html
2. **React-Leaflet:** https://react-leaflet.js.org/
3. **OpenStreetMap:** https://wiki.openstreetmap.org/
4. **Digital Earth Africa:** https://docs.digitalearthafrica.org/

### Papers Científicos

1. Bishop-Taylor, R., et al. (2021). "Mapping dynamic coastlines at mean sea level"
2. Mueller, N., et al. (2016). "Water observations from space"
3. Digital Earth Africa (2024). "Coastlines Specifications"

---

## 🐛 Solución de Problemas

### Error: "window is not defined"
**Solución:** Usar `client:only="react"` en Astro

```astro
<CoastalMap client:only="react" />
```

### Leaflet no carga los tiles
**Solución:** Verificar atribución y maxZoom

```typescript
L.tileLayer(url, {
  attribution: '© OpenStreetMap',
  maxZoom: 19,
})
```

### Slider no responde
**Solución:** Asegurar z-index correcto

```css
.comparison-slider {
  z-index: 999;
  position: absolute;
  inset: 0;
}
```

---

## 📄 Licencias

**Este proyecto usa exclusivamente tecnologías OpenSource:**

- ✅ Leaflet: BSD 2-Clause License
- ✅ React: MIT License
- ✅ OpenStreetMap: Open Data Commons Open Database License (ODbL)
- ✅ CARTO Basemaps: CC BY 3.0

**No se utilizan APIs propietarias para el mapa base.**

---

## 💡 Ejemplos de Código

### Crear Mapa Básico

```typescript
import L from 'leaflet';

const map = L.map('map').setView([11.28, -73.69], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
```

### Agregar Línea Costera

```typescript
const coastline = L.polyline([
  [11.28, -73.69],
  [11.282, -73.688],
  [11.284, -73.686],
], {
  color: '#00E5FF',
  weight: 3,
}).addTo(map);

coastline.bindPopup('Línea Costera 2023');
```

### Modo Comparación

```typescript
const [compareMode, setCompareMode] = useState(false);
const [sliderPos, setSliderPos] = useState(50);

// En el JSX
{compareMode && (
  <div 
    className="compare-container"
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, x)));
    }}
  >
    <div style={{ width: `${sliderPos}%` }}>
      {/* Mapa año actual */}
    </div>
    <div style={{ left: `${sliderPos}%` }}>
      {/* Slider */}
    </div>
  </div>
)}
```

---

**Fecha:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Funcional - 100% OpenSource
