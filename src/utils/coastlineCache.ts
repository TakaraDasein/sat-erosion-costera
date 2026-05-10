/**
 * Sistema de caché inteligente para datos de líneas costeras
 * Optimiza el rendimiento al cargar múltiples años
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  size: number;
}

class CoastlineCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number = 50 * 1024 * 1024; // 50MB
  private currentSize: number = 0;
  private ttl: number = 1000 * 60 * 30; // 30 minutos

  /**
   * Obtener datos del caché
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si expiró
    if (Date.now() - entry.timestamp > this.ttl) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Guardar datos en el caché
   */
  set(key: string, data: any): void {
    const dataSize = this.estimateSize(data);

    // Si el dato es muy grande, no cachear
    if (dataSize > this.maxSize * 0.5) {
      console.warn(`Dato muy grande para cachear: ${key} (${dataSize} bytes)`);
      return;
    }

    // Limpiar espacio si es necesario
    while (this.currentSize + dataSize > this.maxSize && this.cache.size > 0) {
      this.evictOldest();
    }

    // Guardar en caché
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size: dataSize,
    });

    this.currentSize += dataSize;
  }

  /**
   * Eliminar entrada del caché
   */
  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
    }
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  /**
   * Eliminar la entrada más antigua
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * Estimar tamaño de un objeto en bytes
   */
  private estimateSize(obj: any): number {
    const json = JSON.stringify(obj);
    return new Blob([json]).size;
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    return {
      entries: this.cache.size,
      sizeBytes: this.currentSize,
      sizeMB: (this.currentSize / 1024 / 1024).toFixed(2),
      maxSizeMB: (this.maxSize / 1024 / 1024).toFixed(2),
      usage: ((this.currentSize / this.maxSize) * 100).toFixed(1) + '%',
    };
  }

  /**
   * Pre-cargar múltiples años en lotes
   */
  async preloadYears(years: number[], batchSize: number = 5): Promise<void> {
    console.log(`📦 Pre-cargando ${years.length} años en lotes de ${batchSize}...`);

    for (let i = 0; i < years.length; i += batchSize) {
      const batch = years.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (year) => {
          const key = `coastline_${year}`;
          
          // Si ya está en caché, saltar
          if (this.get(key)) {
            return;
          }

          try {
            const response = await fetch(`/api/coastlines?year=${year}`);
            if (response.ok) {
              const data = await response.json();
              this.set(key, data);
            }
          } catch (error) {
            console.error(`Error pre-cargando año ${year}:`, error);
          }
        })
      );

      console.log(`✓ Lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(years.length / batchSize)} completado`);
    }

    console.log('✓ Pre-carga completada:', this.getStats());
  }

  /**
   * Obtener datos con caché (fetch si no existe)
   */
  async fetchWithCache(url: string, key?: string): Promise<any> {
    const cacheKey = key || url;
    
    // Intentar obtener del caché
    const cached = this.get(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit: ${cacheKey}`);
      return cached;
    }

    // Fetch y cachear
    console.log(`🌐 Cache miss: ${cacheKey}`);
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        this.set(cacheKey, data);
        return data;
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }

    return null;
  }
}

// Instancia singleton
export const coastlineCache = new CoastlineCache();

// Funciones de utilidad
export async function loadCoastlineYear(year: number): Promise<any> {
  return coastlineCache.fetchWithCache(
    `/api/coastlines?year=${year}`,
    `coastline_${year}`
  );
}

export async function preloadAllCoastlines(years: number[]): Promise<void> {
  return coastlineCache.preloadYears(years, 5);
}

export function clearCoastlineCache(): void {
  coastlineCache.clear();
}

export function getCoastlineCacheStats() {
  return coastlineCache.getStats();
}
