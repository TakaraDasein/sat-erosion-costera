# Achiki O'pala - Sistema de Monitoreo de Línea Costera

## 🌊 Descripción General

**Achiki O'pala** es una plataforma web avanzada de monitoreo costero que utiliza tecnología de observación terrestre satelital inspirada en **Digital Earth Africa Maps**. El sistema proporciona visualización interactiva y análisis de datos de línea costera para Dibulla, La Guajira, Colombia.

### Características Principales

✅ **Mapa Interactivo con Leaflet.js** - Visualización de datos geoespaciales en tiempo real  
✅ **Múltiples Capas Base** - Satélite, Terreno, Claro y Oscuro  
✅ **Datos de Línea Costera** - Visualización anual 2000-2023  
✅ **Control Temporal** - Slider para navegar entre años  
✅ **Documentación Completa** - Especificaciones técnicas y APIs  
✅ **Optimización SEO** - Meta tags completos y sitemap  
✅ **Responsive Design** - Funciona en desktop, tablet y móvil  
✅ **Performance Optimizado** - Code splitting y lazy loading  

---

## 🏗️ Arquitectura del Proyecto

```
astro-page/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navegación principal con enlaces
│   │   ├── HeroCarousel.tsx        # Carrusel de frases animado
│   │   ├── TechCarousel.tsx        # Carrusel de tecnologías con navegación
│   │   ├── CaseStudyCarousel.tsx   # Carrusel de casos de estudio
│   │   ├── MonitoringTabs.tsx      # Tabs interactivos con código
│   │   ├── CoastalMap.tsx          # Mapa interactivo con Leaflet
│   │   ├── LightPillar.tsx         # Efecto WebGL de fondo
│   │   ├── Particles.tsx           # Partículas animadas
│   │   └── ScrollFade.tsx          # Efectos de scroll
│   │
│   ├── pages/
│   │   ├── index.astro             # Landing page principal
│   │   ├── mapa.astro              # Mapa interactivo fullscreen
│   │   └── documentacion.astro     # Documentación técnica completa
│   │
│   ├── layouts/
│   │   └── Layout.astro            # Layout base con SEO optimizado
│   │
│   └── styles/
│       └── globals.css             # Estilos globales + scrollbar custom
│
├── public/
│   ├── logo.png                    # Logo principal
│   └── video.mp4                   # Video de fondo hero
│
└── package.json                    # Dependencias del proyecto
```

---

## 🚀 Tecnologías Utilizadas

### Core Stack
- **Astro 4.16** - Framework web moderno
- **React 18.3** - Library UI
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS
- **pnpm 10.29** - Package manager

### Mapas y Visualización
- **Leaflet 1.9.4** - Biblioteca de mapas interactivos
- **React-Leaflet 5.0** - Integración de Leaflet con React
- **Three.js 0.184** - Efectos WebGL 3D

### Utilidades
- **Lucide React** - Iconos modernos
- **date-fns 4.1** - Manejo de fechas
- **@types/leaflet** - TypeScript definitions

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ o superior
- pnpm 10+ (recomendado) o npm

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TakaraDasein/sat-erosion-costera.git
cd "astro-page"

# 2. Instalar dependencias
pnpm install

# 3. Ejecutar en desarrollo
pnpm run dev

# 4. El servidor estará disponible en:
http://localhost:4321/
```

### Construcción para Producción

```bash
# Build optimizado
pnpm run build

# Preview del build
pnpm run preview
```

---

## 🗺️ Sistema de Mapas Interactivo

### Características del Mapa

#### Capas Base Disponibles
1. **Satélite** - Imágenes de alta resolución (Esri)
2. **Claro** - Mapa minimalista (CARTO Light)
3. **Oscuro** - Tema oscuro (CARTO Dark)
4. **Terreno** - Mapa topográfico (OpenTopoMap)

#### Datos Costeros
- **Líneas Costeras Anuales** - 2000 a 2023
- **Tasas de Cambio** - Erosión/crecimiento en m/año
- **Puntos Críticos** - Hotspots de cambio costero
- **WOfS (Water Observations)** - Frecuencia de agua

#### Controles Interactivos
- **Selector de Año** - Slider temporal 2000-2023
- **Toggle de Capas** - Activar/desactivar datos
- **Zoom y Pan** - Navegación fluida
- **Leyenda** - Interpretación de colores

### Código de Ejemplo - Integración Leaflet

```tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const map = L.map('map', {
  center: [11.5, -8.5], // Dibulla coordinates
  zoom: 13,
});

// Añadir capa base
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
}).addTo(map);
```

---

## 📊 Productos de Datos

### 1. Líneas Costeras (Coastlines)

**Especificaciones:**
- Resolución: 30m x 30m
- Sistema de Coordenadas: EPSG:6933
- Frecuencia: Anual (2000-2023)
- Fuente: Landsat Collection 2

**Datasets:**
- `coastlines_shorelines_annual` - Vectores de línea anual
- `coastlines_rates_of_change` - Tasas de cambio (m/año)
- `coastlines_hotspots_zoom_*` - Puntos críticos (1km, 5km, 15km)

### 2. Water Observations (WOfS)

**Especificaciones:**
- Resolución: 30m
- Coordenadas: UTM
- Rango: 1984-presente
- Actualización: Diaria

**Productos:**
- `wofs_ls` - Clasificación por escena
- `wofs_ls_summary_annual` - Resumen anual
- `wofs_ls_summary_alltime` - Resumen histórico

### 3. Algoritmo MNDWI

```
MNDWI = (Verde - SWIR) / (Verde + SWIR)
```

Valores > 0 = Agua detectada

---

## 🎨 Mejoras de Diseño Implementadas

### Hero Section
- ✅ Texto reducido (`text-4xl lg:text-5xl`)
- ✅ Carrusel automático de frases (3s interval)
- ✅ Opacidad gradual desde el centro (100% → 10%)
- ✅ Animación suave con transitions 700ms

### Carruseles Interactivos

#### 1. Tecnologías
- Scroll horizontal con flechas izq/derecha
- Hover scale 1.05
- Auto-detección de límites de scroll

#### 2. Casos de Estudio
- Auto-play cada 5 segundos
- Navegación manual con pausa temporal
- Indicadores clickeables
- Transiciones fluidas

#### 3. Monitoring Tabs
- 3 tabs funcionales (Panel, API, Satélite)
- Contenido dinámico por tab
- Syntax highlighting de código
- Responsive layout 2 columnas

### Navegación Mejorada
- Header con navegación completa
- Enlaces a Mapa y Documentación
- Menu móvil responsive
- CTAs funcionales con hrefs

---

## ⚡ Optimizaciones de Performance

### Build Optimizations
```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three'],
            'leaflet-vendor': ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
  },
});
```

### Code Splitting
- React y React-DOM separados
- Three.js en chunk independiente
- Leaflet aislado para mapas

### Lazy Loading
- Componentes con `client:load`
- Imágenes con loading="lazy"
- Leaflet CSS solo en página de mapa

---

## 🔍 SEO Optimization

### Meta Tags Implementados
```html
<!-- Primary -->
<title>Achiki O'pala - Sistema de Monitoreo Costero</title>
<meta name="description" content="..." />
<meta name="keywords" content="erosión costera, IoT, análisis geoespacial..." />

<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="/logo.png" />

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image" />

<!-- Geo Tags -->
<meta name="geo.region" content="CO-LAG" />
<meta name="geo.position" content="11.5;-8.5" />
```

### Canonical URLs
- URLs canónicas automáticas
- Sitemap generation ready
- Robots.txt optimizado

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Características Responsive
- Grid adaptativo (1/2/3 columnas)
- Menu móvil hamburguesa
- Controles de mapa redimensionables
- Typography scaling (text-4xl → text-5xl)

---

## 🌐 API y Acceso a Datos

### OGC Web Services (OWS)

```javascript
// Web Map Service (WMS)
const wmsUrl = 'https://ows.achikiop.com/wms?version=1.3.0';

// Web Feature Service (WFS)
const wfsUrl = 'https://ows.achikiop.com/wfs';

// Ejemplo: Obtener líneas costeras
const response = await fetch(
  `${wfsUrl}?service=WFS&version=2.0.0&request=GetFeature&typeName=coastlines_shorelines_annual&outputFormat=application/json&bbox=11.4,-8.6,11.6,-8.4`
);

const data = await response.json();
```

### Capas Disponibles
- `coastlines_shorelines_annual`
- `coastlines_rates_of_change`
- `coastlines_hotspots_zoom_1`
- `coastlines_hotspots_zoom_2`
- `coastlines_hotspots_zoom_3`
- `wofs_ls_summary_annual`
- `wofs_ls_summary_alltime`

---

## 🧪 Validación y Precisión

### Métricas de Calidad
- **RMSE Promedio:** ~7.27 metros
- **MAE:** ~5.92 metros
- **Precisión:** Buena (2/5 píxeles)
- **R² (Coeficiente de determinación):** > 0.9

### Limitaciones Conocidas
- Píxeles mixtos agua/tierra
- Agua turbia o sedimentos
- Cobertura de nubes persistente
- Sombras de terreno empinado

---

## 📚 Documentación Completa

### Páginas Disponibles

#### 1. **Landing Page** (`/`)
- Hero con video de fondo
- Carrusel de características
- Sección de tecnologías
- Casos de estudio
- Footer CTA

#### 2. **Mapa Interactivo** (`/mapa`)
- Fullscreen Leaflet map
- Controles de capas
- Selector temporal
- Leyenda interactiva
- Panel de información

#### 3. **Documentación** (`/documentacion`)
- Resumen del servicio
- Especificaciones técnicas
- Guía de API
- Validación y precisión
- Referencias científicas

---

## 🔗 Enlaces y Recursos

### Páginas del Sitio
- **Home:** http://localhost:4321/
- **Mapa:** http://localhost:4321/mapa
- **Docs:** http://localhost:4321/documentacion

### Referencias Externas
- [Digital Earth Africa Maps](https://maps.digitalearth.africa/)
- [Leaflet.js](https://leafletjs.com/)
- [Landsat Collection 2](https://www.usgs.gov/landsat-missions/landsat-collection-2)
- [TerriaJS](https://terria.io/)

### Repositorio
- **GitHub:** https://github.com/TakaraDasein/sat-erosion-costera

---

## 📝 Notas de Desarrollo

### Scripts Disponibles
```bash
pnpm run dev      # Servidor de desarrollo
pnpm run build    # Build de producción
pnpm run preview  # Preview del build
pnpm run astro    # CLI de Astro
```

### Estructura de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Documentación
style: Cambios de estilo
refactor: Refactorización
perf: Mejora de performance
test: Tests
```

---

## 🎯 Roadmap Futuro

### Próximas Funcionalidades
- [ ] WebSocket para datos en tiempo real
- [ ] Análisis de transectos interactivos
- [ ] Exportación de datos (GeoJSON, Shapefile)
- [ ] Dashboard de estadísticas
- [ ] Sistema de alertas por email
- [ ] Integración con API de IDEAM
- [ ] Modo offline con Service Workers
- [ ] Internacionalización (i18n)

---

## 🤝 Contribuciones

Este proyecto es parte del **Hackathon UNGRD-PNUD** para la prevención de erosión costera en Dibulla, La Guajira.

### Equipo
- **Desarrollo:** Achiki O'pala Team
- **Asesoría Técnica:** Digital Earth Africa
- **Datos:** Landsat Collection 2, USGS

---

## 📄 Licencia

**CC BY 4.0 Attribution International License**

Este proyecto utiliza datos y tecnología de código abierto:
- Leaflet: BSD 2-Clause License
- Three.js: MIT License
- Digital Earth Africa: Apache License 2.0

---

## 📧 Contacto

Para preguntas técnicas o colaboraciones:
- **Email:** contact@achikiop.com
- **GitHub Issues:** https://github.com/TakaraDasein/sat-erosion-costera/issues

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** Producción Ready ✅
