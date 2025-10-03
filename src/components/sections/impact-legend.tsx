"use client";

type ImpactLegendProps = {
  show: boolean;
};

export default function ImpactLegend({ show }: ImpactLegendProps) {
  if (!show) return null;

  const zones = [
    { color: "#ef4444", label: "Crater", description: "Total vaporization" },
    { color: "#f97316", label: "Fireball", description: "Extreme heat, instant death" },
    { color: "#eab308", label: "Shockwave", description: "Building collapse, severe damage" },
    { color: "#9333ea", label: "Earthquake", description: "Seismic activity" },
  ];

  return (
    <div className="fixed bottom-4 right-4 md:right-[400px] z-20 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] p-4 w-[280px]">
      <h3 className="text-sm font-semibold text-black mb-3">Impact Zones</h3>
      <div className="space-y-2.5">
        {zones.map((zone) => (
          <div key={zone.label} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: zone.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black leading-tight">
                {zone.label}
              </p>
              <p className="text-xs text-neutral-600 leading-tight">
                {zone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}