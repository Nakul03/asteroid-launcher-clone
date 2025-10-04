"use client";

import { useEffect, useState } from "react";
import { fetchNearEarthAsteroids, type AsteroidData } from "@/lib/api/nasa-sbdb";
import { X } from "lucide-react";

interface AsteroidDataPanelProps {
  onSelectAsteroid?: (diameter: number, speed: number, density?: number) => void;
}

export default function AsteroidDataPanel({ onSelectAsteroid }: AsteroidDataPanelProps) {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadAsteroids = async () => {
      setLoading(true);
      const data = await fetchNearEarthAsteroids();
      setAsteroids(data);
      setLoading(false);
    };

    if (isOpen) {
      loadAsteroids();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-6 top-[100px] z-30 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
      >
        Real NASA Data
      </button>
    );
  }

  return (
    <div className="fixed left-6 top-[100px] z-30 h-[calc(100vh-140px)] w-80 overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          NASA Near-Earth Asteroids
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 transition-colors hover:bg-gray-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-full overflow-y-auto p-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Source: NASA Small-Body Database (SBDB)
            </p>
            {asteroids.map((asteroid, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-black hover:shadow-md"
                onClick={() => {
                  if (onSelectAsteroid) {
                    // Convert to metric: meters and km/h
                    const diameterMeters = asteroid.diameter;
                    const typicalSpeedKmh = 72000; // km/h (typical NEO speed ~45000 mph)
                    const densityKgM3 = asteroid.density * 1000; // Convert g/cm³ to kg/m³
                    onSelectAsteroid(diameterMeters, typicalSpeedKmh, densityKgM3);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-medium text-gray-900">{asteroid.name}</h4>
                  <span className="text-xs text-gray-500">
                    H: {asteroid.absoluteMagnitude.toFixed(1)}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Diameter:</span>
                    <span className="font-medium">
                      {asteroid.diameter < 1000
                        ? `${asteroid.diameter.toFixed(0)} m`
                        : `${(asteroid.diameter / 1000).toFixed(2)} km`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Density:</span>
                    <span className="font-medium">{(asteroid.density * 1000).toFixed(0)} kg/m³</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Albedo:</span>
                    <span className="font-medium">{asteroid.albedo.toFixed(3)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Est. Mass:</span>
                    <span className="font-medium">
                      {asteroid.mass < 1e9
                        ? `${(asteroid.mass / 1e6).toFixed(2)} million kg`
                        : `${(asteroid.mass / 1e9).toFixed(2)} billion kg`}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-blue-600">
                  Click to simulate impact →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}