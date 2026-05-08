import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { Itinerary, Activity } from '../../types/travel';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '';

export function MapView({ itinerary, highlightedLocation }: { itinerary?: Itinerary, highlightedLocation?: { lat: number, lng: number } | null }) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const map = useMap();

  useEffect(() => {
    if (map && highlightedLocation) {
      map.panTo(highlightedLocation);
      map.setZoom(15);
    }
  }, [map, highlightedLocation]);

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/50 p-6 text-center rounded-xl border-2 border-dashed">
        <h3 className="text-lg font-semibold mb-2">Maps API Key Required</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          To see the interactive map, add your <code>GOOGLE_MAPS_PLATFORM_KEY</code> to the app secrets.
        </p>
      </div>
    );
  }

  const allActivities = itinerary?.days.flatMap(d => d.activities) || [];
  const center = allActivities.length > 0 
    ? allActivities[0].location 
    : { lat: 0, lng: 0 };

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 relative">
      <div className="absolute inset-0 grayscale invert opacity-60 pointer-events-none z-0">
        {/* This overlay is for visual effect, the actual map will be below it but we want the map itself to look editorial */}
      </div>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        mapId="TRAVEL_ENGINE_MAP"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full grayscale invert opacity-80"
        disableDefaultUI={true}
      >
        {allActivities.map((activity) => (
          <AdvancedMarker
            key={activity.id}
            position={activity.location}
            onClick={() => setSelectedActivity(activity)}
          >
            <Pin background="#ef4444" glyphColor="#fff" />
          </AdvancedMarker>
        ))}
        <RouteLayer itinerary={itinerary} />
      </Map>
    </div>
  );
}

function RouteLayer({ itinerary }: { itinerary?: Itinerary }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !itinerary) return;

    // Clear previous
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    const drawDailyRoutes = async () => {
      for (const day of itinerary.days) {
        if (day.activities.length < 2) continue;

        for (let i = 0; i < day.activities.length - 1; i++) {
          const origin = day.activities[i].location;
          const destination = day.activities[i+1].location;

          try {
            const { routes } = await routesLib.Route.computeRoutes({
              origin,
              destination,
              travelMode: 'DRIVING',
              fields: ['path'],
            });

            if (routes?.[0]) {
              const pLines = routes[0].createPolylines();
              pLines.forEach(p => {
                p.setOptions({
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0.8,
                    strokeWeight: 4
                });
                p.setMap(map);
              });
              polylinesRef.current.push(...pLines);
            }
          } catch (error) {
            console.error("Route computing failed", error);
          }
        }
      }
    };

    drawDailyRoutes();

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, itinerary]);

  return null;
}
