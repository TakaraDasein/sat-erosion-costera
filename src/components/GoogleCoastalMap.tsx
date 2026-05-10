import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

declare const google: typeof globalThis.google;
import {
  DIBULLA_COASTLINE_POINTS,
  DIBULLA_COASTAL_POLYGON,
  EROSION_HOTSPOTS,
  AVAILABLE_YEARS,
  getCoastlineColor,
  EROSION_COLORS,
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
} from '../utils/coastlineData';
import {
  loadCoastlineYear,
  preloadAllCoastlines,
  getCoastlineCacheStats,
  clearCoastlineCache,
} from '../utils/coastlineCache';
import LoadingOverlay from './LoadingOverlay';

interface GoogleCoastalMapProps {
  apiKey: string;
  className?: string;
}

export default function GoogleCoastalMap({ 
  apiKey = 'AIzaSyANyOOq7IA2r5ku07DSWujhAXxOFlaVP-c',
  className = ''
}: GoogleCoastalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string>('satellite');
  const [showCoastlines, setShowCoastlines] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [compareMode, setCompareMode] = useState(false);
  const [compareYear, setCompareYear] = useState(2000);
  const [showErosionPoints, setShowErosionPoints] = useState(true);
  const [showAllYears, setShowAllYears] = useState(true); // Mostrar todas las líneas
  const [coastlineData, setCoastlineData] = useState<any>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [cacheStats, setCacheStats] = useState<any>(null);
  
  const coastlinesRef = useRef<google.maps.Polyline[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const erosionMarkersRef = useRef<google.maps.Marker[]>([]);
  const dataLayersRef = useRef<google.maps.Data[]>([]);

  // Cargar resumen de datos disponibles y pre-cargar en caché
  useEffect(() => {
    const loadAvailableYears = async () => {
      try {
        const response = await fetch('/api/coastlines');
        if (response.ok) {
          const data = await response.json();
          if (data.years && Array.isArray(data.years)) {
            setAvailableYears(data.years);
            // Usar el año más reciente como selección inicial
            if (data.years.length > 0) {
              const maxYear = Math.max(...data.years);
              setSelectedYear(maxYear);
              const minYear = Math.min(...data.years);
              setCompareYear(minYear);
              
              // Pre-cargar todos los años en el caché
              console.log('🚀 Iniciando pre-carga de datos...');
              await preloadAllCoastlines(data.years);
              setCacheStats(getCoastlineCacheStats());
              console.log('✅ Pre-carga completada');
            }
          }
        }
      } catch (error) {
        console.error('Error loading available years:', error);
        // Fallback a años predefinidos
        setAvailableYears(AVAILABLE_YEARS);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAvailableYears();
  }, []);

  // Cargar datos de línea costera cuando cambia el año (usando caché optimizado)
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;

    const updateCoastlines = async () => {
      // Limpiar capas anteriores
      dataLayersRef.current.forEach(layer => {
        layer.setMap(null);
      });
      dataLayersRef.current = [];

      // Limpiar marcadores anteriores de líneas costeras
      coastlinesRef.current.forEach(line => line.setMap(null));
      coastlinesRef.current = [];

      if (!showCoastlines) return;

      const map = mapInstance.current;
      if (!map) return;

      // MODO DIGITAL EARTH AFRICA: Mostrar todas las líneas anuales
      if (showAllYears) {
        console.log('🗺️ Cargando todas las líneas costeras desde caché...');
        
        const yearsToLoad = availableYears.length > 0 ? availableYears : AVAILABLE_YEARS;
        let loaded = 0;
        
        for (const year of yearsToLoad) {
          try {
            // Usar caché optimizado
            const yearData = await loadCoastlineYear(year);
            
            if (yearData && yearData.features) {
              const dataLayer = new google.maps.Data();
              dataLayer.addGeoJson(yearData);
              
              // Color basado en año (gradiente Digital Earth Africa)
              const color = getCoastlineColor(year);
              const isRecent = year >= 2020;
              
              dataLayer.setStyle({
                strokeColor: color,
                strokeWeight: isRecent ? 2.5 : 1.5,
                strokeOpacity: isRecent ? 0.9 : 0.6,
                zIndex: year, // Años más recientes encima
              });
              
              dataLayer.setMap(map);
              dataLayersRef.current.push(dataLayer);
              
              // Actualizar progreso
              loaded++;
              setLoadingProgress(Math.round((loaded / yearsToLoad.length) * 100));
              
              // Agregar etiqueta solo cada 5 años
              if (year % 5 === 0 || year === yearsToLoad[yearsToLoad.length - 1]) {
                const firstFeature = yearData.features[0];
                if (firstFeature && firstFeature.geometry.coordinates) {
                  const coords = firstFeature.geometry.coordinates;
                  const firstCoord = Array.isArray(coords[0][0]) ? coords[0][0] : coords[0];
                  
                  const labelMarker = new google.maps.Marker({
                    position: { lat: firstCoord[1], lng: firstCoord[0] },
                    map: map,
                    label: {
                      text: year.toString(),
                      color: color,
                      fontSize: '10px',
                      fontWeight: 'bold',
                    },
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 0,
                    },
                    zIndex: 9999,
                  });
                  markersRef.current.push(labelMarker);
                }
              }
              
              // Info window al hacer click
              dataLayer.addListener('click', (event: any) => {
                const props = yearData.metadata || {};
                
                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div style="padding: 12px; max-width: 280px;">
                      <h3 style="font-weight: bold; margin-bottom: 8px; color: ${color}; font-size: 14px;">
                        Línea Costera ${year}
                      </h3>
                      <div style="font-size: 12px; color: #555; line-height: 1.6;">
                        <p style="margin: 4px 0;">
                          <strong>Fecha:</strong> ${props.date || 'N/A'}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>Satélite:</strong> Landsat ${props.satellite || 'N/A'}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>Nubes:</strong> ${props.cloud_cover || 'N/A'}%
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>Longitud:</strong> ${props.length_km || 'N/A'} km
                        </p>
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                          <div style="width: 100%; height: 8px; background: linear-gradient(to right, #1a0033, #6600cc, #ffff00, #ff9900, #ff0000); border-radius: 4px;"></div>
                          <p style="font-size: 10px; color: #666; margin-top: 4px; text-align: center;">
                            2000 → ${year} → 2024
                          </p>
                        </div>
                      </div>
                    </div>
                  `,
                  position: event.latLng,
                });
                infoWindow.open(map);
              });
            }
          } catch (error) {
            console.error(`Error cargando año ${year}:`, error);
          }
        }
        
        setLoadingProgress(0); // Reset
        console.log(`✅ ${loaded}/${yearsToLoad.length} líneas costeras cargadas`);
        
        // Actualizar estadísticas del caché
        setCacheStats(getCoastlineCacheStats());
      }
      // MODO COMPARACIÓN: Mostrar solo 2 años
      else if (compareMode) {
        // Cargar año seleccionado (desde caché)
        const yearData = await loadCoastlineYear(selectedYear);
        if (yearData && yearData.features) {
          const dataLayer = new google.maps.Data();
          dataLayer.addGeoJson(yearData);
          dataLayer.setStyle({
            strokeColor: getCoastlineColor(selectedYear),
            strokeWeight: 3,
            strokeOpacity: 0.9,
          });
          dataLayer.setMap(map);
          dataLayersRef.current.push(dataLayer);
        }

        // Cargar año de comparación (desde caché)
        if (compareYear !== selectedYear) {
          const compareData = await loadCoastlineYear(compareYear);
          if (compareData && compareData.features) {
            const dataLayer = new google.maps.Data();
            dataLayer.addGeoJson(compareData);
            dataLayer.setStyle({
              strokeColor: getCoastlineColor(compareYear),
              strokeWeight: 2,
              strokeOpacity: 0.6,
            });
            dataLayer.setMap(map);
            dataLayersRef.current.push(dataLayer);
          }
        }
      }
      // MODO SIMPLE: Mostrar solo año seleccionado
      else {
        const yearData = await loadCoastlineYear(selectedYear);
        if (yearData && yearData.features) {
          const dataLayer = new google.maps.Data();
          dataLayer.addGeoJson(yearData);
          dataLayer.setStyle({
            strokeColor: getCoastlineColor(selectedYear),
            strokeWeight: 3,
            strokeOpacity: 0.9,
          });
          dataLayer.setMap(map);
          dataLayersRef.current.push(dataLayer);
        }
      }
    };

    updateCoastlines();
  }, [selectedYear, compareYear, compareMode, showCoastlines, showAllYears, isMapReady, availableYears]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapRef.current || mapInstance.current) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'drawing', 'geometry'],
    });

    loader.importLibrary('maps').then(() => {
      if (!mapRef.current) return;

      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center: MAP_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstance.current = map;

      // Agregar polígono del área de estudio
      const studyAreaPolygon = new google.maps.Polygon({
        paths: DIBULLA_COASTAL_POLYGON,
        strokeColor: '#00E5FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00E5FF',
        fillOpacity: 0.1,
        map: map,
      });

      // Agregar info window para el polígono
      const infoWindow = new google.maps.InfoWindow();
      studyAreaPolygon.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; color: #1a1a1a;">Área de Estudio</h3>
            <p style="font-size: 12px; color: #555; line-height: 1.4;">
              Zona costera de Dibulla, La Guajira<br>
              <strong>Extensión:</strong> ~30 km<br>
              <strong>Desde:</strong> Palomino (Norte)<br>
              <strong>Hasta:</strong> Zona sur de Dibulla
            </p>
          </div>
        `);
        infoWindow.setPosition(MAP_CENTER);
        infoWindow.open(map);
      });

      // Las líneas costeras se cargarán dinámicamente desde la API
      // Ver useEffect de loadCoastlineData más abajo

      // Dibujar puntos de erosión (siempre, visibilidad controlada por toggle)
      drawErosionHotspots(map);

      // Agregar marcadores de puntos clave
      DIBULLA_COASTLINE_POINTS.forEach((point) => {
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: map,
          title: point.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: '#FFC107',
            fillOpacity: 0.6,
            strokeWeight: 1,
            strokeColor: '#fff',
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="font-weight: bold; margin-bottom: 4px; color: #1a1a1a;">${point.name}</h4>
              <p style="font-size: 11px; color: #666;">
                Lat: ${point.lat.toFixed(4)}<br>
                Lng: ${point.lng.toFixed(4)}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });

      setIsMapReady(true);
    });

    return () => {
      coastlinesRef.current.forEach(line => line.setMap(null));
      markersRef.current.forEach(marker => marker.setMap(null));
      erosionMarkersRef.current.forEach(marker => marker.setMap(null));
      dataLayersRef.current.forEach(layer => layer.setMap(null));
      coastlinesRef.current = [];
      markersRef.current = [];
      erosionMarkersRef.current = [];
      dataLayersRef.current = [];
    };
  }, [apiKey]);

  const drawErosionHotspots = (map: google.maps.Map) => {
    EROSION_HOTSPOTS.forEach((hotspot) => {
      const color = EROSION_COLORS[hotspot.severity as keyof typeof EROSION_COLORS];
      
      const marker = new google.maps.Marker({
        position: { lat: hotspot.lat, lng: hotspot.lng },
        map: map,
        title: hotspot.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: color,
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: '#fff',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; color: #1a1a1a; font-size: 14px;">
              ${hotspot.name}
            </h3>
            <div style="font-size: 12px; color: #555; line-height: 1.6;">
              <p style="margin: 4px 0;">
                <strong>Severidad:</strong> 
                <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">
                  ${hotspot.severity}
                </span>
              </p>
              <p style="margin: 4px 0;">
                <strong>Tasa de cambio:</strong> 
                <span style="color: ${hotspot.rateOfChange < 0 ? '#D32F2F' : '#4CAF50'}; font-weight: bold;">
                  ${hotspot.rateOfChange > 0 ? '+' : ''}${hotspot.rateOfChange} m/año
                </span>
              </p>
              <p style="margin: 4px 0;">
                <strong>Cambio total (2000-2023):</strong> 
                <span style="font-weight: bold;">
                  ${hotspot.totalChange > 0 ? '+' : ''}${hotspot.totalChange} m
                </span>
              </p>
              <p style="margin: 8px 0 4px 0; font-size: 11px; color: #666; font-style: italic;">
                ${hotspot.description}
              </p>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      erosionMarkersRef.current.push(marker);
    });
  };

  // Toggle visibilidad de puntos de erosión
  useEffect(() => {
    erosionMarkersRef.current.forEach(marker => {
      marker.setVisible(showErosionPoints);
    });
  }, [showErosionPoints]);

  // Cambiar tipo de mapa
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;

    const mapTypes: { [key: string]: google.maps.MapTypeId } = {
      satellite: google.maps.MapTypeId.SATELLITE,
      hybrid: google.maps.MapTypeId.HYBRID,
      terrain: google.maps.MapTypeId.TERRAIN,
      roadmap: google.maps.MapTypeId.ROADMAP,
    };

    mapInstance.current.setMapTypeId(mapTypes[activeLayer]);
  }, [activeLayer, isMapReady]);

  return (
    <div className="relative w-full h-full">
      {/* Overlay de carga profesional */}
      <LoadingOverlay 
        isLoading={isLoadingData || !isMapReady} 
        progress={loadingProgress}
        message={loadingProgress > 0 ? "Cargando líneas costeras" : "Inicializando sistema"}
      />

      {/* Map Container */}
      <div ref={mapRef} className={`w-full h-full ${className}`} />

      {/* Custom Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-4 max-w-xs">
        {/* Layer Switcher */}
        <div className="bg-white rounded-lg shadow-xl p-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
            Tipo de Mapa
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'satellite', label: 'Satélite', icon: '🛰️' },
              { key: 'hybrid', label: 'Híbrido', icon: '🗺️' },
              { key: 'terrain', label: 'Terreno', icon: '⛰️' },
              { key: 'roadmap', label: 'Calles', icon: '🚗' },
            ].map((layer) => (
              <button
                key={layer.key}
                onClick={() => setActiveLayer(layer.key)}
                className={`text-left px-3 py-2 rounded text-xs transition-all ${
                  activeLayer === layer.key
                    ? 'bg-cyan-500 text-white font-medium shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{layer.icon}</span>
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Controls */}
        <div className="bg-white rounded-lg shadow-xl p-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            Capas de Datos
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showCoastlines}
                onChange={(e) => setShowCoastlines(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Líneas Costeras Históricas</span>
            </label>

            {showCoastlines && (
              <label className="flex items-center gap-2 cursor-pointer group ml-6">
                <input
                  type="checkbox"
                  checked={showAllYears}
                  onChange={(e) => {
                    setShowAllYears(e.target.checked);
                    if (e.target.checked) {
                      setCompareMode(false); // Desactivar modo comparación
                    }
                  }}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700 group-hover:text-gray-900 font-medium">
                  📊 Mostrar Todas las Líneas Anuales
                </span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showErosionPoints}
                onChange={(e) => setShowErosionPoints(e.target.checked)}
                className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Puntos de Erosión</span>
            </label>

            {showCoastlines && !showAllYears && (
              <div className="ml-6 space-y-3 pt-2 border-t border-gray-200">
                <label className="block text-xs text-gray-600 font-medium">
                  Año Seleccionado: <span className="text-cyan-600">{selectedYear}</span>
                </label>
                <input
                  type="range"
                  min={availableYears.length > 0 ? Math.min(...availableYears) : 2000}
                  max={availableYears.length > 0 ? Math.max(...availableYears) : 2024}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{availableYears.length > 0 ? Math.min(...availableYears) : 2000}</span>
                  <span>
                    {availableYears.length > 0 
                      ? Math.round((Math.min(...availableYears) + Math.max(...availableYears)) / 2)
                      : 2012}
                  </span>
                  <span>{availableYears.length > 0 ? Math.max(...availableYears) : 2024}</span>
                </div>

                {/* Modo de comparación */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer group mb-2">
                    <input
                      type="checkbox"
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 font-medium">
                      Modo Comparación
                    </span>
                  </label>

                  {compareMode && (
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-600">
                        Comparar con: <span className="text-orange-600 font-medium">{compareYear}</span>
                      </label>
                      <input
                        type="range"
                        min={availableYears.length > 0 ? Math.min(...availableYears) : 2000}
                        max={availableYears.length > 0 ? Math.max(...availableYears) : 2024}
                        value={compareYear}
                        onChange={(e) => setCompareYear(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{availableYears.length > 0 ? Math.min(...availableYears) : 2000}</span>
                        <span>{availableYears.length > 0 ? Math.max(...availableYears) : 2024}</span>
                      </div>

                      {/* Información de cambio */}
                      <div className="mt-2 p-2 bg-gradient-to-r from-orange-50 to-cyan-50 rounded text-xs">
                        <p className="text-gray-700">
                          <strong>Periodo:</strong> {Math.abs(selectedYear - compareYear)} años
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          {selectedYear > compareYear ? 'Más reciente' : 'Más antiguo'} vs {compareYear}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-xl p-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-800">Leyenda</h3>
          <div className="space-y-2 text-xs">
            <p className="font-medium text-gray-700 mb-2">Líneas Costeras Anuales:</p>
            
            {/* Gradiente Digital Earth Africa */}
            <div className="mb-3">
              <div className="w-full h-6 rounded" style={{
                background: 'linear-gradient(to right, #1a0033 0%, #6600cc 33%, #ffff00 66%, #ff9900 83%, #ff0000 100%)'
              }}></div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>2000</span>
                <span>2008</span>
                <span>2016</span>
                <span>2024</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1" style={{backgroundColor: '#ff0000'}}></div>
                <span className="text-gray-600">2020-2024 (Más reciente)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1" style={{backgroundColor: '#ffff00'}}></div>
                <span className="text-gray-600">2012-2019</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1" style={{backgroundColor: '#6600cc'}}></div>
                <span className="text-gray-600">2004-2011</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1" style={{backgroundColor: '#1a0033'}}></div>
                <span className="text-gray-600">2000-2003 (Más antiguo)</span>
              </div>
            </div>
            
            <p className="font-medium text-gray-700 mt-3 mb-2">Severidad de Erosión:</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
              <span className="text-gray-600">Crítico ({'>'} -2 m/año)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
              <span className="text-gray-600">Moderado (-1 a -2 m/año)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              <span className="text-gray-600">Estable/Crecimiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-xl p-4 max-w-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-800 mb-1">Costa Dibulla - Palomino</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              Monitoreo de ~30 km de línea costera usando imágenes satelitales de Google Earth Engine
            </p>
            <div className="flex gap-1.5 text-xs">
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-medium">Erosión Activa</span>
              <span className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded font-medium">23 años de datos</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a 
            href="/documentacion" 
            className="flex-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2 rounded hover:from-cyan-600 hover:to-blue-700 transition-all text-center font-medium shadow-md"
          >
            📚 Ver Docs
          </a>
          <button className="flex-1 text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors font-medium">
            📊 Análisis
          </button>
        </div>
      </div>
    </div>
  );
}
