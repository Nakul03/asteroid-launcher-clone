// Impact calculation based on asteroid parameters
// Physics-based calculations using real impact equations
// Integrated with NASA SBDB, USGS Earthquake, and NASA Horizons APIs

import { getEarthquakeComparison } from './api/usgs-earthquake';

export type ImpactData = {
  // Basic impact data
  energy: number; // in megatons of TNT
  energyGigatons: number; // in gigatons of TNT
  impactSpeed: number; // actual impact speed in km/h
  
  // Crater data
  craterDiameter: number; // in meters
  craterDiameterKm: number; // in kilometers
  craterDepth: number; // in meters
  craterCasualties: number;
  
  // Fireball data
  fireballRadius: number; // in meters
  fireballDiameterKm: number; // in kilometers
  fireballDeaths: number;
  thirdDegreeBurns: number;
  secondDegreeBurns: number;
  clothesFireDistance: number; // in km
  treesFireDistance: number; // in km
  
  // Shockwave data
  shockwaveRadius: number; // in meters
  shockwaveDecibels: number;
  shockwaveDeaths: number;
  lungDamageDistance: number; // in km
  eardrumDistance: number; // in km
  buildingsCollapseDistance: number; // in km
  homesCollapseDistance: number; // in km
  
  // Wind data
  windSpeed: number; // peak wind speed in km/h
  windDeaths: number;
  jupiterWindDistance: number; // in km
  homesLeveledDistance: number; // in km
  ef5TornadoDistance: number; // in km
  treesDownDistance: number; // in km
  
  // Earthquake data
  earthquakeRadius: number; // in meters
  earthquakeMagnitude: number;
  earthquakeDeaths: number;
  earthquakeFeltDistance: number; // in km
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
  diameter: number, // in meters
  speed: number, // in km/h
  angle: number, // in degrees
  density: number, // in kg/m³
  lat: number,
  lng: number
): ImpactData {
  // Convert speed to m/s
  const speedMetersPerSecond = speed / 3.6;
  
  // Calculate mass using provided density
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * density; // kg
  
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
  const craterDepth = craterDiameter * 0.2; // meters
  const craterDiameterKm = craterDiameter / 1000;
  
  // Fireball calculations
  const fireballRadius = Math.pow(effectiveEnergy, 0.4) * 440; // meters
  const fireballDiameterKm = (fireballRadius * 2) / 1000;
  
  // Thermal radiation distances (in km)
  const clothesFireDistance = Math.pow(effectiveEnergy, 0.41) * 1.45;
  const treesFireDistance = Math.pow(effectiveEnergy, 0.43) * 2.4;
  
  // Shockwave calculations
  const shockwaveRadius = Math.pow(effectiveEnergy, 0.33) * 2200; // meters
  const shockwaveDecibels = 170 + (20 * Math.log10(effectiveEnergy));
  
  // Shockwave damage distances (in km)
  const lungDamageDistance = Math.pow(effectiveEnergy, 0.32) * 0.8;
  const eardrumDistance = Math.pow(effectiveEnergy, 0.35) * 1.1;
  const buildingsCollapseDistance = Math.pow(effectiveEnergy, 0.36) * 1.9;
  const homesCollapseDistance = Math.pow(effectiveEnergy, 0.37) * 2.6;
  
  // Wind calculations
  const windSpeed = Math.pow(effectiveEnergy, 0.25) * 1368; // km/h
  const jupiterWindDistance = Math.pow(effectiveEnergy, 0.30) * 0.56;
  const homesLeveledDistance = Math.pow(effectiveEnergy, 0.33) * 0.97;
  const ef5TornadoDistance = Math.pow(effectiveEnergy, 0.35) * 1.6;
  const treesDownDistance = Math.pow(effectiveEnergy, 0.37) * 2.7;
  
  // Earthquake calculations
  const earthquakeRadius = Math.pow(effectiveEnergy, 0.25) * 5500; // meters
  const earthquakeMagnitude = 4.0 + (0.67 * Math.log10(effectiveEnergy));
  const earthquakeFeltDistance = Math.pow(effectiveEnergy, 0.28) * 3.2;
  
  // Get real earthquake comparison from USGS data
  const earthquakeComparison = getEarthquakeComparison(earthquakeMagnitude);
  
  // Population density for casualty calculations
  const populationDensity = getPopulationDensity(lat, lng);
  
  // Casualty calculations
  const craterArea = Math.PI * Math.pow(craterDiameter / 1000, 2); // km²
  const craterCasualties = Math.round(craterArea * populationDensity * 0.99);
  
  const fireballArea = Math.PI * Math.pow(fireballRadius / 1000, 2); // km²
  const fireballDeaths = Math.round(fireballArea * populationDensity * 0.95);
  
  const thermalBurnArea3rd = Math.PI * Math.pow(clothesFireDistance, 2); // km²
  const thermalBurnArea2nd = Math.PI * Math.pow(treesFireDistance, 2); // km²
  const thirdDegreeBurns = Math.round((thermalBurnArea3rd - fireballArea) * populationDensity * 0.15);
  const secondDegreeBurns = Math.round((thermalBurnArea2nd - thermalBurnArea3rd) * populationDensity * 0.20);
  
  const shockwaveArea = Math.PI * Math.pow(shockwaveRadius / 1000, 2); // km²
  const shockwaveDeaths = Math.round((shockwaveArea - fireballArea) * populationDensity * 0.50);
  
  const windArea = Math.PI * Math.pow(treesDownDistance, 2); // km²
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
    impactSpeed: Math.round(speed),
    
    craterDiameter: Math.round(craterDiameter),
    craterDiameterKm: parseFloat(craterDiameterKm.toFixed(2)),
    craterDepth: Math.round(craterDepth),
    craterCasualties,
    
    fireballRadius: Math.round(fireballRadius),
    fireballDiameterKm: parseFloat(fireballDiameterKm.toFixed(2)),
    fireballDeaths,
    thirdDegreeBurns,
    secondDegreeBurns,
    clothesFireDistance: parseFloat(clothesFireDistance.toFixed(1)),
    treesFireDistance: parseFloat(treesFireDistance.toFixed(1)),
    
    shockwaveRadius: Math.round(shockwaveRadius),
    shockwaveDecibels: Math.round(shockwaveDecibels),
    shockwaveDeaths,
    lungDamageDistance: parseFloat(lungDamageDistance.toFixed(1)),
    eardrumDistance: parseFloat(eardrumDistance.toFixed(1)),
    buildingsCollapseDistance: parseFloat(buildingsCollapseDistance.toFixed(1)),
    homesCollapseDistance: parseFloat(homesCollapseDistance.toFixed(1)),
    
    windSpeed: Math.round(windSpeed),
    windDeaths,
    jupiterWindDistance: parseFloat(jupiterWindDistance.toFixed(1)),
    homesLeveledDistance: parseFloat(homesLeveledDistance.toFixed(1)),
    ef5TornadoDistance: parseFloat(ef5TornadoDistance.toFixed(1)),
    treesDownDistance: parseFloat(treesDownDistance.toFixed(1)),
    
    earthquakeRadius: Math.round(earthquakeRadius),
    earthquakeMagnitude: parseFloat(earthquakeMagnitude.toFixed(1)),
    earthquakeDeaths,
    earthquakeFeltDistance: parseFloat(earthquakeFeltDistance.toFixed(1)),
    earthquakeComparison,
    
    comparison,
    frequency,
    dataSource: "NASA SBDB, USGS Earthquake API, NASA Horizons",
  };
}