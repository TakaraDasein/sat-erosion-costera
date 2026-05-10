import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://achikiapala.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
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
    ssr: {
      noExternal: ['react-leaflet', 'leaflet'],
    },
  },
  server: {
    port: 4321,
    host: true,
  },
});
