"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type AsteroidControlsProps = {
  onLaunch: (diameter: number, speed: number, angle: number, density: number) => void;
  hasTarget: boolean;
  initialParams?: { diameter: number; speed: number; density?: number } | null;
};

export default function AsteroidControls({ onLaunch, hasTarget, initialParams }: AsteroidControlsProps) {
  const [speed, setSpeed] = useState(60000); // km/h (converted from ~38000 mph)
  const [diameter, setDiameter] = useState(450); // meters (converted from ~1500 ft)
  const [density, setDensity] = useState(3000); // kg/m³
  const [angle, setAngle] = useState(45);
  const [isLaunching, setIsLaunching] = useState(false);

  // Update parameters when a real asteroid is selected
  useEffect(() => {
    if (initialParams) {
      setDiameter(Math.round(initialParams.diameter));
      setSpeed(Math.round(initialParams.speed));
      if (initialParams.density) {
        setDensity(Math.round(initialParams.density));
      }
    }
  }, [initialParams]);

  const handleLaunch = async () => {
    if (!hasTarget) return;
    
    setIsLaunching(true);
    
    // Delay for animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onLaunch(diameter, speed, angle, density);
    setIsLaunching(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:right-auto md:left-6 md:top-1/2 md:-translate-y-1/2 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] p-5 md:p-6 w-auto md:w-[350px] z-20">
      <div className="flex flex-col gap-5">
        {/* Diameter Slider */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3dc5151d-6568-4952-9a02-24f504a73197-neal-fun/assets/svgs/diameter-5.svg" 
              alt="Diameter icon" 
              width={28} 
              height={28} 
              className="w-7 h-7" 
            />
            <div>
              <p className="text-neutral-500 text-[13px] leading-tight">Diameter</p>
              <p className="text-black font-semibold text-[19px] leading-tight">
                {diameter >= 1000 
                  ? `${(diameter / 1000).toFixed(2)}` 
                  : diameter.toLocaleString()}
                <span className="font-normal"> {diameter >= 1000 ? 'km' : 'm'}</span>
              </p>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="150000"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${(diameter / 150000) * 100}%, #e5e5e5 ${(diameter / 150000) * 100}%, #e5e5e5 100%)`
            }}
          />
        </div>

        <div className="border-t border-neutral-100"></div>

        {/* Speed Slider */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3dc5151d-6568-4952-9a02-24f504a73197-neal-fun/assets/svgs/speed-6.svg" 
              alt="Speed icon" 
              width={28} 
              height={28} 
              className="w-7 h-7" 
            />
            <div>
              <p className="text-neutral-500 text-[13px] leading-tight">Speed</p>
              <p className="text-black font-semibold text-[19px] leading-tight">
                {speed.toLocaleString()}<span className="font-normal"> km/h</span>
              </p>
            </div>
          </div>
          <input
            type="range"
            min="1600"
            max="160000"
            step="1600"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${((speed - 1600) / 158400) * 100}%, #e5e5e5 ${((speed - 1600) / 158400) * 100}%, #e5e5e5 100%)`
            }}
          />
        </div>

        <div className="border-t border-neutral-100"></div>

        {/* Density Slider */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3dc5151d-6568-4952-9a02-24f504a73197-neal-fun/assets/svgs/diameter-5.svg" 
              alt="Density icon" 
              width={28} 
              height={28} 
              className="w-7 h-7" 
            />
            <div>
              <p className="text-neutral-500 text-[13px] leading-tight">Density</p>
              <p className="text-black font-semibold text-[19px] leading-tight">
                {density.toLocaleString()}<span className="font-normal"> kg/m³</span>
              </p>
            </div>
          </div>
          <input
            type="range"
            min="500"
            max="8000"
            step="100"
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${((density - 500) / 7500) * 100}%, #e5e5e5 ${((density - 500) / 7500) * 100}%, #e5e5e5 100%)`
            }}
          />
        </div>

        <div className="border-t border-neutral-100"></div>

        {/* Angle Slider */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3dc5151d-6568-4952-9a02-24f504a73197-neal-fun/assets/svgs/angle-7.svg" 
              alt="Angle icon" 
              width={28} 
              height={28} 
              className="w-7 h-7" 
            />
            <div>
              <p className="text-neutral-500 text-[13px] leading-tight">Angle</p>
              <p className="text-black font-semibold text-[19px] leading-tight">
                {angle}<span className="font-normal">°</span>
              </p>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="90"
            step="5"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${((angle - 5) / 85) * 100}%, #e5e5e5 ${((angle - 5) / 85) * 100}%, #e5e5e5 100%)`
            }}
          />
        </div>

        <div className="pt-1">
          <button 
            onClick={handleLaunch}
            disabled={!hasTarget || isLaunching}
            className="w-full bg-black text-white h-[52px] rounded-lg text-base font-medium flex items-center justify-center gap-2.5 hover:bg-neutral-800 transition-all active:bg-black disabled:bg-neutral-300 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLaunching && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_0.8s_ease-in-out]" />
            )}
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3dc5151d-6568-4952-9a02-24f504a73197-neal-fun/assets/icons/asteroid-launcher-1.png"
              alt="Asteroid Icon"
              width={20}
              height={20}
              className={isLaunching ? "animate-[spin_0.8s_ease-in-out]" : ""}
            />
            {isLaunching ? "Launching..." : hasTarget ? "Launch Asteroid" : "Select Target First"}
          </button>
        </div>
      </div>
    </div>
  );
}