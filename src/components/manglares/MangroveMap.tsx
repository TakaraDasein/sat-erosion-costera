import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

declare const google: typeof globalThis.google;

interface Project {
  id: string;
  title: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  area: {
    restored: number;
    unit: string;
  };
  impact: {
    carbonSequestration?: {
      value: number;
      unit: string;
    };
  };
}

interface MangroveMapProps {
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

export default function MangroveMap({ projects, onSelectProject }: MangroveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      'carbono-azul': '#06B6D4',
      'restauracion-comunitaria': '#10B981',
      'proteccion-biodiversidad': '#14B8A6',
      'restauracion-masiva': '#22C55E',
      'restauracion-integral': '#3B82F6'
    };
    return colors[category as keyof typeof colors] || '#10B981';
  };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      try {
        await loader.importLibrary('maps');

        if (mapRef.current) {
          const googleMap = new google.maps.Map(mapRef.current, {
            center: { lat: 10, lng: 0 },
            zoom: 2,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#1a1a2e' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#0f172a' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#64748b' }]
              },
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#334155' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#0f172a' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          setMap(googleMap);

          // Add markers for each project
          projects.forEach((project) => {
            const marker = new google.maps.Marker({
              position: project.coordinates,
              map: googleMap,
              title: project.title,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: getCategoryColor(project.category),
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
            });

            const infoWindowContent = `
              <div style="padding: 12px; max-width: 280px; font-family: system-ui;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
                  ${project.title}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                  📍 ${project.location}
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                  <div style="background: #ecfdf5; padding: 8px; border-radius: 6px;">
                    <div style="font-size: 18px; font-weight: bold; color: #10b981;">
                      ${project.area.restored.toLocaleString()}
                    </div>
                    <div style="font-size: 11px; color: #6b7280;">ha restauradas</div>
                  </div>
                  ${project.impact.carbonSequestration ? `
                    <div style="background: #ecfdf5; padding: 8px; border-radius: 6px;">
                      <div style="font-size: 18px; font-weight: bold; color: #14b8a6;">
                        ${project.impact.carbonSequestration.value > 1000 
                          ? (project.impact.carbonSequestration.value / 1000).toFixed(1) + 'K'
                          : project.impact.carbonSequestration.value}
                      </div>
                      <div style="font-size: 11px; color: #6b7280;">ton CO₂/año</div>
                    </div>
                  ` : ''}
                </div>
                <button 
                  onclick="window.parent.postMessage({type: 'selectProject', projectId: '${project.id}'}, '*')"
                  style="
                    width: 100%;
                    background: linear-gradient(to right, #10b981, #14b8a6);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                  "
                >
                  Ver Detalles →
                </button>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });

            marker.addListener('click', () => {
              infoWindow.open(googleMap, marker);
              setSelectedProject(project.id);
            });
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [projects]);

  // Listen for messages from info window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selectProject') {
        onSelectProject?.(event.data.projectId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectProject]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Mapa Interactivo de Proyectos</h2>
        <p className="text-gray-400">Explora {projects.length} proyectos de restauración alrededor del mundo</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div 
          ref={mapRef} 
          className="w-full h-[600px]"
        />

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h4 className="text-sm font-bold text-white mb-3">Categorías</h4>
          <div className="space-y-2">
            {[
              { id: 'carbono-azul', name: 'Carbono Azul', color: '#06B6D4' },
              { id: 'restauracion-comunitaria', name: 'Rest. Comunitaria', color: '#10B981' },
              { id: 'proteccion-biodiversidad', name: 'Biodiversidad', color: '#14B8A6' },
              { id: 'restauracion-masiva', name: 'Rest. Masiva', color: '#22C55E' },
              { id: 'restauracion-integral', name: 'Rest. Integral', color: '#3B82F6' }
            ].map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: cat.color }}
                ></div>
                <span className="text-xs text-gray-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project count badge */}
        <div className="absolute top-6 right-6 bg-emerald-500/90 backdrop-blur-sm rounded-xl px-4 py-2">
          <div className="text-2xl font-bold text-white">{projects.length}</div>
          <div className="text-xs text-emerald-100">Proyectos</div>
        </div>
      </div>
    </div>
  );
}
