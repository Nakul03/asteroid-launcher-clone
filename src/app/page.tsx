"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/sections/header";
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
  const [asteroidParams, setAsteroidParams] = useState<{ diameter: number; speed: number } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setTargetPosition({ lat, lng });
    setShowImpact(false);
    setImpactData(null);
  };

  const handleLaunch = (diameter: number, speed: number, angle: number) => {
    if (!targetPosition) return;

    const impact = calculateImpact(
      diameter,
      speed,
      angle,
      targetPosition.lat,
      targetPosition.lng
    );

    setImpactData(impact);
    setShowImpact(true);
  };

  const handleSelectAsteroid = (diameter: number, speed: number) => {
    setAsteroidParams({ diameter, speed });
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
      <Header />
      
      <div className="fixed inset-0 top-[60px] z-0">
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

        <button
          className="fixed right-6 top-[100px] z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-white transition-all duration-200 hover:bg-neutral-100 hover:scale-105"
          aria-label="Information"
        >
          <span className="font-serif text-sm font-medium">i</span>
        </button>
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