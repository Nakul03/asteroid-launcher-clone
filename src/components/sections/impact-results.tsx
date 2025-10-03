"use client";

import { ImpactData } from "@/lib/impact-calculator";
import { X } from "lucide-react";

type ImpactResultsProps = {
  impactData: ImpactData;
  onClose: () => void;
};

export default function ImpactResults({ impactData, onClose }: ImpactResultsProps) {
  return (
    <div className="fixed right-6 top-[160px] z-20 h-[calc(100vh-200px)] w-96 overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">Results</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Close results"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Crater */}
          <section>
            <h3 className="text-lg font-bold text-black mb-3">{impactData.craterDiameterMiles} mile wide crater</h3>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.craterCasualties.toLocaleString()}</span> people would be vaporized in the crater
              </p>
              <p className="text-neutral-700">
                The crater is <span className="font-semibold text-black">{impactData.craterDepth.toLocaleString()} ft</span> deep
              </p>
              <p className="text-neutral-700">
                Your asteroid impacted the ground at <span className="font-semibold text-black">{impactData.impactSpeed.toLocaleString()} mph</span>
              </p>
              <p className="text-neutral-700">
                The impact is equivalent to <span className="font-semibold text-black">{impactData.energyGigatons.toFixed(0)} Gigatons of TNT</span>
              </p>
              <p className="text-neutral-700">{impactData.comparison}</p>
              <p className="text-neutral-700">{impactData.frequency}</p>
            </div>
          </section>

          <div className="border-t border-neutral-200"></div>

          {/* Fireball */}
          <section>
            <h3 className="text-lg font-bold text-black mb-3">{impactData.fireballDiameterMiles} mile wide fireball</h3>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.fireballDeaths.toLocaleString()}</span> people would die from the fireball
              </p>
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.thirdDegreeBurns.toLocaleString()}</span> people would receive 3rd degree burns
              </p>
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.secondDegreeBurns.toLocaleString()}</span> people would receive 2nd degree burns
              </p>
              <p className="text-neutral-700">
                Clothes would catch on fire within <span className="font-semibold text-black">{impactData.clothesFireDistance} miles</span> of the impact
              </p>
              <p className="text-neutral-700">
                Trees would catch on fire within <span className="font-semibold text-black">{impactData.treesFireDistance} miles</span> of the impact
              </p>
            </div>
          </section>

          <div className="border-t border-neutral-200"></div>

          {/* Shockwave */}
          <section>
            <h3 className="text-lg font-bold text-black mb-3">{impactData.shockwaveDecibels} decibel shock wave</h3>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.shockwaveDeaths.toLocaleString()}</span> people would die from the shock wave
              </p>
              <p className="text-neutral-700">
                Anyone within <span className="font-semibold text-black">{impactData.lungDamageDistance} miles</span> would likely receive lung damage
              </p>
              <p className="text-neutral-700">
                Anyone within <span className="font-semibold text-black">{impactData.eardrumDistance} miles</span> would likely have ruptured eardrums
              </p>
              <p className="text-neutral-700">
                Buildings within <span className="font-semibold text-black">{impactData.buildingsCollapseDistance} miles</span> would collapse
              </p>
              <p className="text-neutral-700">
                Homes within <span className="font-semibold text-black">{impactData.homesCollapseDistance} miles</span> would collapse
              </p>
            </div>
          </section>

          <div className="border-t border-neutral-200"></div>

          {/* Wind */}
          <section>
            <h3 className="text-lg font-bold text-black mb-3">{impactData.windSpeed.toLocaleString()} mph peak wind speed</h3>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-700">
                An estimated <span className="font-semibold text-black">{impactData.windDeaths.toLocaleString()}</span> people would die from the wind blast
              </p>
              <p className="text-neutral-700">
                Wind within <span className="font-semibold text-black">{impactData.jupiterWindDistance} miles</span> would be faster than storms on Jupiter
              </p>
              <p className="text-neutral-700">
                Homes within <span className="font-semibold text-black">{impactData.homesLeveledDistance} miles</span> would be completely leveled
              </p>
              <p className="text-neutral-700">
                Within <span className="font-semibold text-black">{impactData.ef5TornadoDistance} miles</span> it would feel like being inside an EF5 tornado
              </p>
              <p className="text-neutral-700">
                Nearly all trees within <span className="font-semibold text-black">{impactData.treesDownDistance} miles</span> would be knocked down
              </p>
            </div>
          </section>

          <div className="border-t border-neutral-200"></div>

          {/* Earthquake Section */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold">
              {impactData.earthquakeMagnitude.toFixed(1)} magnitude earthquake
            </h3>
            
            <div className="space-y-2 text-sm">
              <p>
                An estimated{" "}
                <span className="font-semibold text-red-600">
                  {impactData.earthquakeDeaths.toLocaleString()} people
                </span>{" "}
                would die from the earthquake.
              </p>
              
              <p>
                The earthquake would be felt{" "}
                <span className="font-semibold">
                  {impactData.earthquakeFeltDistance} miles
                </span>{" "}
                away
              </p>
              
              <p className="italic text-gray-600 mt-3">
                {impactData.earthquakeComparison}
              </p>
            </div>
          </div>

          {/* Data Source */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              Data sources: {impactData.dataSource}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}