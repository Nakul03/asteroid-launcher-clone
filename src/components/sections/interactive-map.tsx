"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type MapClickHandlerProps = {
  onMapClick: (lat: number, lng: number) => void;
};

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

type ImpactZone = {
  radius: number;
  color: string;
  label: string;
};

type InteractiveMapProps = {
  targetPosition: { lat: number; lng: number } | null;
  impactZones: ImpactZone[];
  onMapClick: (lat: number, lng: number) => void;
  showImpact: boolean;
};

export default function InteractiveMap({ targetPosition, impactZones, onMapClick, showImpact }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
        ref={mapRef}
        key="main-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {targetPosition && showImpact && impactZones.map((zone, index) => (
          <Circle
            key={`${zone.label}-${index}`}
            center={[targetPosition.lat, targetPosition.lng]}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        ))}
        
        {targetPosition && (
          <Marker position={[targetPosition.lat, targetPosition.lng]} />
        )}
      </MapContainer>
    </div>
  );
}