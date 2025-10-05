"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import AsteroidControls from "@/components/sections/asteroid-controls";
import ImpactResults from "@/components/sections/impact-results";
import ImpactLegend from "@/components/sections/impact-legend";
import AsteroidDataPanel from "@/components/sections/asteroid-data-panel";
import { calculateImpact, ImpactData } from "@/lib/impact-calculator";

// Dynamically import map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/sections/interactive-map"),
  { ssr: false }
);

export default function Page() {
  const [targetPosition, setTargetPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const [asteroidParams, setAsteroidParams] = useState<{ diameter: number; speed: number; density?: number } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setTargetPosition({ lat, lng });
    setShowImpact(false);
    setImpactData(null);
  };

  const handleLaunch = (diameter: number, speed: number, angle: number, density: number) => {
    if (!targetPosition) return;

    const impact = calculateImpact(
      diameter,
      speed,
      angle,
      density,
      targetPosition.lat,
      targetPosition.lng
    );

    setImpactData(impact);
    setShowImpact(true);
  };

  const handleSelectAsteroid = (diameter: number, speed: number, density?: number) => {
    setAsteroidParams({ diameter, speed, density });
  };

  const impactZones = impactData
    ? [
        { radius: impactData.earthquakeRadius, color: "#9333ea", label: "Earthquake" },
        { radius: impactData.shockwaveRadius, color: "#eab308", label: "Shockwave" },
        { radius: impactData.fireballRadius, color: "#f97316", label: "Fireball" },
        { radius: impactData.craterDiameter / 2, color: "#ef4444", label: "Crater" },
      ]
    : [];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium uppercase tracking-wider text-black shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      
      <div className="fixed inset-0 z-0">
        <InteractiveMap
          targetPosition={targetPosition}
          impactZones={impactZones}
          onMapClick={handleMapClick}
          showImpact={showImpact}
        />
        
        <div className="fixed right-[100px] top-[100px] z-10 pointer-events-none">
          <h1 
            className="font-sans text-[48px] font-normal uppercase tracking-[8px] text-primary drop-shadow-lg"
            style={{
              lineHeight: '1.2',
            }}
          >
            ASTEROID LAUNCHER
          </h1>
        </div>
      </div>

      <AsteroidDataPanel onSelectAsteroid={handleSelectAsteroid} />
      
      <AsteroidControls 
        onLaunch={handleLaunch}
        hasTarget={!!targetPosition}
        initialParams={asteroidParams}
      />
      
      <ImpactLegend show={showImpact} />
      
      {impactData && showImpact && (
        <ImpactResults 
          impactData={impactData}
          onClose={() => {
            setShowImpact(false);
            setImpactData(null);
          }}
        />
      )}
    </div>
  );
}