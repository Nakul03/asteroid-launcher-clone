"use client";

import { useEffect, useRef, useState } from "react";
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
  const [asteroidFalling, setAsteroidFalling] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [craterExpanding, setCraterExpanding] = useState(false);
  const [asteroidPosition, setAsteroidPosition] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    if (showImpact && targetPosition) {
      // Start asteroid falling animation
      setAsteroidFalling(true);
      setCraterExpanding(false);
      
      // Calculate asteroid start position (above target)
      if (mapRef.current) {
        const map = mapRef.current;
        const point = map.latLngToContainerPoint([targetPosition.lat, targetPosition.lng]);
        setAsteroidPosition({ x: point.x, y: point.y });
      }
      
      // After asteroid falls (2.5s), show explosion at impact point
      setTimeout(() => {
        setAsteroidFalling(false);
        setShowExplosion(true);
        
        // Recalculate explosion position to ensure it's at exact impact point
        if (mapRef.current) {
          const map = mapRef.current;
          const point = map.latLngToContainerPoint([targetPosition.lat, targetPosition.lng]);
          setAsteroidPosition({ x: point.x, y: point.y });
        }
      }, 2500);
      
      // After explosion flash (300ms), start crater expansion
      setTimeout(() => {
        setShowExplosion(false);
        setCraterExpanding(true);
      }, 2800);
      
      // Keep crater expanded
      setTimeout(() => {
        setCraterExpanding(false);
      }, 4800);
    } else {
      setAsteroidFalling(false);
      setShowExplosion(false);
      setCraterExpanding(false);
      setAsteroidPosition(null);
    }
  }, [showImpact, targetPosition]);
  
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
        
        {/* Only show craters during expanding animation */}
        {targetPosition && showImpact && craterExpanding && impactZones.map((zone, index) => (
          <Circle
            key={`${zone.label}-expanding-${index}`}
            center={[targetPosition.lat, targetPosition.lng]}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.3,
              weight: 2,
            }}
            className="crater-expanding"
          />
        ))}
        
        {/* Show static craters after expansion completes */}
        {targetPosition && showImpact && !craterExpanding && !asteroidFalling && !showExplosion && impactZones.map((zone, index) => (
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
      
      {/* Asteroid falling animation */}
      {asteroidFalling && asteroidPosition && (
        <div
          className="asteroid-falling"
          style={{
            left: `${asteroidPosition.x}px`,
            top: `${asteroidPosition.y}px`,
          }}
        >
          <div className="asteroid-body">
            <div className="asteroid-core"></div>
            <div className="asteroid-trail"></div>
          </div>
        </div>
      )}
      
      {/* Explosion flash at impact point */}
      {showExplosion && asteroidPosition && (
        <div
          className="explosion-flash"
          style={{
            left: `${asteroidPosition.x}px`,
            top: `${asteroidPosition.y}px`,
          }}
        >
          <div className="explosion-ring explosion-ring-1"></div>
          <div className="explosion-ring explosion-ring-2"></div>
          <div className="explosion-ring explosion-ring-3"></div>
          <div className="explosion-core"></div>
        </div>
      )}
    </div>
  );
}