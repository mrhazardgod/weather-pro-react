import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Translations } from "../types";

interface Props { lat: number; lon: number; cityName: string; t: Translations }

export default function WeatherMap({ lat, lon, cityName, t }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 10);
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) mapInstanceRef.current!.removeLayer(layer);
      });
      L.marker([lat, lon]).addTo(mapInstanceRef.current).bindPopup(cityName).openPopup();
      return;
    }
    const map = L.map(mapRef.current).setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(cityName).openPopup();
    mapInstanceRef.current = map;
  }, [lat, lon, cityName]);

  useEffect(() => {
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  return (
    <div className="map-section" data-edit-id="map-section">
      <h3 className="section-subtitle" data-edit-id="map-title">{t.mapTitle}</h3>
      <div ref={mapRef} className="leaflet-map" data-edit-id="leaflet-map" />
    </div>
  );
}