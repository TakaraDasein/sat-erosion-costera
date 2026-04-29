# Achiki O'pala - Sistema de Alerta Temprana

Landing page con diseño liquid glass morphism para el sistema de alerta temprana de erosión costera de Dibulla, Guajira.

## Características

- Video de fondo a pantalla completa con loop automático
- Diseño liquid glass morphism de dos niveles
- Layout responsivo de dos paneles (desktop)
- Componentes React islands para interactividad
- Tipografía con Poppins y Source Serif 4
- Paleta de colores estrictamente en escala de grises
- Animaciones suaves con hover y active states

## Tecnologías

- **Astro 4.x** - Framework principal
- **React 18** - Componentes interactivos (islands)
- **Tailwind CSS 3.x** - Estilos
- **TypeScript** - Tipado estático
- **Lucide React** - Iconos
- **pnpm** - Gestor de paquetes

## Estructura del Proyecto

```
/
├── public/
│   ├── logo.png          # Logo de Achiki O'pala
│   └── video.mp4         # Video de fondo
├── src/
│   ├── components/       # Componentes React islands
│   │   ├── MenuButton.tsx
│   │   ├── CTAButton.tsx
│   │   ├── AccountButton.tsx
│   │   └── SocialBar.tsx
│   ├── layouts/
│   │   └── Layout.astro  # Layout base
│   ├── pages/
│   │   └── index.astro   # Página principal
│   └── styles/
│       └── globals.css   # Estilos globales y liquid glass
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview
```

## Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo en http://localhost:4321
- `pnpm build` - Construye el proyecto para producción
- `pnpm preview` - Previsualiza la build de producción
- `pnpm astro` - Ejecuta comandos de Astro CLI

## Estilos Liquid Glass

El proyecto incluye dos variantes de glass morphism:

### .liquid-glass (ligero)
- Backdrop blur: 4px
- Borde degradado sutil
- Uso: Pills, botones secundarios, contenedores ligeros

### .liquid-glass-strong (fuerte)
- Backdrop blur: 50px
- Borde degradado más pronunciado
- Sombras adicionales
- Uso: CTAs principales, paneles de contenido

## Personalización

### Colores
Todos los colores usan valores HSL en escala de grises:
- `text-white` - Texto principal
- `text-white/80` - Texto secundario
- `text-white/60` - Texto terciario
- `text-white/50` - Labels y metadatos

### Tipografía
- **Poppins** (500 weight) - Headings y body
- **Source Serif 4** (italic) - Énfasis en headings

### Responsive
- Mobile-first approach
- Panel derecho oculto en móvil (lg:flex)
- Layout adapta a w-[52%] / w-[48%] en desktop

## Licencia

MIT
