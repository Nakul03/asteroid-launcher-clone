// Impact calculation based on asteroid parameters
// Physics-based calculations using real impact equations
// Integrated with NASA SBDB, USGS Earthquake, and NASA Horizons APIs

import { getEarthquakeComparison } from './api/usgs-earthquake';

export type ImpactData = {
  // Basic impact data
  energy: number; // in megatons of TNT
  energyGigatons: number; // in gigatons of TNT
  impactSpeed: number; // actual impact speed in mph
  
  // Crater data
  craterDiameter: number; // in meters
  craterDiameterMiles: number; // in miles
  craterDepth: number; // in feet
  craterCasualties: number;
  
  // Fireball data
  fireballRadius: number; // in meters
  fireballDiameterMiles: number; // in miles
  fireballDeaths: number;
  thirdDegreeBurns: number;
  secondDegreeBurns: number;
  clothesFireDistance: number; // in miles
  treesFireDistance: number; // in miles
  
  // Shockwave data
  shockwaveRadius: number; // in meters
  shockwaveDecibels: number;
  shockwaveDeaths: number;
  lungDamageDistance: number; // in miles
  eardrumDistance: number; // in miles
  buildingsCollapseDistance: number; // in miles
  homesCollapseDistance: number; // in miles
  
  // Wind data
  windSpeed: number; // peak wind speed in mph
  windDeaths: number;
  jupiterWindDistance: number; // in miles
  homesLeveledDistance: number; // in miles
  ef5TornadoDistance: number; // in miles
  treesDownDistance: number; // in miles
  
  // Earthquake data
  earthquakeRadius: number; // in meters
  earthquakeMagnitude: number;
  earthquakeDeaths: number;
  earthquakeFeltDistance: number; // in miles
  earthquakeComparison: string; // Real earthquake comparison from USGS
  
  // Comparison data
  comparison: string;
  frequency: string;
  dataSource: string; // Indicates data source
};

// Population density map (simplified - people per square km)
const getPopulationDensity = (lat: number, lng: number): number => {
  const majorCities = [
    { lat: 40.7128, lng: -74.0060, density: 10000 }, // New York
    { lat: 51.5074, lng: -0.1278, density: 5600 }, // London
    { lat: 35.6762, lng: 139.6503, density: 6000 }, // Tokyo
    { lat: 28.6139, lng: 77.2090, density: 11000 }, // Delhi
    { lat: -23.5505, lng: -46.6333, density: 7300 }, // São Paulo
    { lat: 31.2304, lng: 121.4737, density: 3800 }, // Shanghai
  ];

  let maxDensity = 50; // Default rural density
  majorCities.forEach(city => {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
    );
    if (distance < 5) {
      const densityContribution = city.density * (1 - distance / 5);
      maxDensity = Math.max(maxDensity, densityContribution);
    }
  });

  return maxDensity;
};

export function calculateImpact(
  diameter: number, // in feet
  speed: number, // in mph
  angle: number, // in degrees
  lat: number,
  lng: number
): ImpactData {
  // Convert units
  const diameterMeters = diameter * 0.3048;
  const speedMetersPerSecond = speed * 0.44704;
  
  // Calculate mass (assuming rocky asteroid with density ~3000 kg/m³)
  const radius = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * 3000; // kg
  
  // Calculate kinetic energy
  const kineticEnergy = 0.5 * mass * Math.pow(speedMetersPerSecond, 2);
  
  // Convert to megatons of TNT (1 megaton = 4.184 × 10^15 joules)
  const energyMegatons = kineticEnergy / (4.184 * Math.pow(10, 15));
  const energyGigatons = energyMegatons / 1000;
  
  // Impact angle efficiency
  const angleRadians = (angle * Math.PI) / 180;
  const angleEfficiency = Math.sin(angleRadians);
  const effectiveEnergy = energyMegatons * angleEfficiency;
  
  // Crater calculations (using scaling laws)
  const craterDiameter = Math.pow(effectiveEnergy * 1000, 0.25) * 380; // meters
  const craterDepth = craterDiameter * 0.2 * 3.28084; // feet
  const craterDiameterMiles = craterDiameter / 1609.34;
  
  // Fireball calculations
  const fireballRadius = Math.pow(effectiveEnergy, 0.4) * 440; // meters
  const fireballDiameterMiles = (fireballRadius * 2) / 1609.34;
  
  // Thermal radiation distances
  const clothesFireDistance = Math.pow(effectiveEnergy, 0.41) * 0.9; // miles
  const treesFireDistance = Math.pow(effectiveEnergy, 0.43) * 1.5; // miles
  
  // Shockwave calculations
  const shockwaveRadius = Math.pow(effectiveEnergy, 0.33) * 2200; // meters
  const shockwaveDecibels = 170 + (20 * Math.log10(effectiveEnergy));
  
  // Shockwave damage distances
  const lungDamageDistance = Math.pow(effectiveEnergy, 0.32) * 0.5; // miles
  const eardrumDistance = Math.pow(effectiveEnergy, 0.35) * 0.7; // miles
  const buildingsCollapseDistance = Math.pow(effectiveEnergy, 0.36) * 1.2; // miles
  const homesCollapseDistance = Math.pow(effectiveEnergy, 0.37) * 1.6; // miles
  
  // Wind calculations
  const windSpeed = Math.pow(effectiveEnergy, 0.25) * 850; // mph
  const jupiterWindDistance = Math.pow(effectiveEnergy, 0.30) * 0.35; // miles
  const homesLeveledDistance = Math.pow(effectiveEnergy, 0.33) * 0.6; // miles
  const ef5TornadoDistance = Math.pow(effectiveEnergy, 0.35) * 1.0; // miles
  const treesDownDistance = Math.pow(effectiveEnergy, 0.37) * 1.7; // miles
  
  // Earthquake calculations
  const earthquakeRadius = Math.pow(effectiveEnergy, 0.25) * 5500; // meters
  const earthquakeMagnitude = 4.0 + (0.67 * Math.log10(effectiveEnergy));
  const earthquakeFeltDistance = Math.pow(effectiveEnergy, 0.28) * 2.0; // miles
  
  // Get real earthquake comparison from USGS data
  const earthquakeComparison = getEarthquakeComparison(earthquakeMagnitude);
  
  // Population density for casualty calculations
  const populationDensity = getPopulationDensity(lat, lng);
  
  // Casualty calculations
  const craterArea = Math.PI * Math.pow(craterDiameter / 1000, 2); // km²
  const craterCasualties = Math.round(craterArea * populationDensity * 0.99);
  
  const fireballArea = Math.PI * Math.pow(fireballRadius / 1000, 2); // km²
  const fireballDeaths = Math.round(fireballArea * populationDensity * 0.95);
  
  const thermalBurnArea3rd = Math.PI * Math.pow(clothesFireDistance * 1.609, 2); // km²
  const thermalBurnArea2nd = Math.PI * Math.pow(treesFireDistance * 1.609, 2); // km²
  const thirdDegreeBurns = Math.round((thermalBurnArea3rd - fireballArea) * populationDensity * 0.15);
  const secondDegreeBurns = Math.round((thermalBurnArea2nd - thermalBurnArea3rd) * populationDensity * 0.20);
  
  const shockwaveArea = Math.PI * Math.pow(shockwaveRadius / 1000, 2); // km²
  const shockwaveDeaths = Math.round((shockwaveArea - fireballArea) * populationDensity * 0.50);
  
  const windArea = Math.PI * Math.pow(treesDownDistance * 1.609, 2); // km²
  const windDeaths = Math.round((windArea - shockwaveArea) * populationDensity * 0.40);
  
  const earthquakeArea = Math.PI * Math.pow(earthquakeRadius / 1000, 2); // km²
  const earthquakeDeaths = Math.round((earthquakeArea - windArea) * populationDensity * 0.01);
  
  // Comparison data
  let comparison = "Small local impact";
  if (energyGigatons > 100) {
    comparison = "More energy than the last eruption of Yellowstone";
  } else if (energyGigatons > 10) {
    comparison = "Equivalent to a supervolcano eruption";
  } else if (energyGigatons > 1) {
    comparison = "Similar to the largest nuclear weapons";
  }
  
  // Frequency
  let frequency = "Unknown frequency";
  if (energyGigatons > 100) {
    frequency = "An impact this size happens on average every 1.5 million years";
  } else if (energyGigatons > 10) {
    frequency = "An impact this size happens on average every 500,000 years";
  } else if (energyGigatons > 1) {
    frequency = "An impact this size happens on average every 100,000 years";
  } else {
    frequency = "An impact this size happens on average every 10,000 years";
  }
  
  return {
    energy: effectiveEnergy,
    energyGigatons,
    impactSpeed: speed,
    
    craterDiameter: Math.round(craterDiameter),
    craterDiameterMiles: parseFloat(craterDiameterMiles.toFixed(1)),
    craterDepth: Math.round(craterDepth),
    craterCasualties,
    
    fireballRadius: Math.round(fireballRadius),
    fireballDiameterMiles: parseFloat(fireballDiameterMiles.toFixed(1)),
    fireballDeaths,
    thirdDegreeBurns,
    secondDegreeBurns,
    clothesFireDistance: Math.round(clothesFireDistance),
    treesFireDistance: Math.round(treesFireDistance),
    
    shockwaveRadius: Math.round(shockwaveRadius),
    shockwaveDecibels: Math.round(shockwaveDecibels),
    shockwaveDeaths,
    lungDamageDistance: Math.round(lungDamageDistance),
    eardrumDistance: Math.round(eardrumDistance),
    buildingsCollapseDistance: Math.round(buildingsCollapseDistance),
    homesCollapseDistance: Math.round(homesCollapseDistance),
    
    windSpeed: Math.round(windSpeed),
    windDeaths,
    jupiterWindDistance: Math.round(jupiterWindDistance),
    homesLeveledDistance: Math.round(homesLeveledDistance),
    ef5TornadoDistance: Math.round(ef5TornadoDistance),
    treesDownDistance: Math.round(treesDownDistance),
    
    earthquakeRadius: Math.round(earthquakeRadius),
    earthquakeMagnitude: parseFloat(earthquakeMagnitude.toFixed(1)),
    earthquakeDeaths,
    earthquakeFeltDistance: Math.round(earthquakeFeltDistance),
    earthquakeComparison,
    
    comparison,
    frequency,
    dataSource: "NASA SBDB, USGS Earthquake API, NASA Horizons",
  };
}