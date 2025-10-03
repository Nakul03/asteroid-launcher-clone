/**
 * NASA Near-Earth Object (NEO) Data Integration
 * Documentation: https://data.nasa.gov/dataset/near-earth-comets-orbital-elements-api
 */

export interface NearEarthComet {
  name: string;
  perihelionDistance: number; // AU
  eccentricity: number;
  inclination: number; // degrees
  perihelionDate: string;
  period: number; // years
  absoluteMagnitude: number;
}

/**
 * Fetch near-Earth comets data
 * Note: This is a legacy API, data might be static
 */
export async function fetchNearEarthComets(): Promise<NearEarthComet[]> {
  try {
    // The API endpoint from NASA's data catalog
    const url = 'https://data.nasa.gov/resource/b67r-rgxc.json?$limit=50';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch NEO comet data');
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return getDefaultCometData();
    }

    return data.map((item: any) => ({
      name: item.object_name || item.object || 'Unknown',
      perihelionDistance: parseFloat(item.q) || 1.0,
      eccentricity: parseFloat(item.e) || 0.5,
      inclination: parseFloat(item.i) || 0,
      perihelionDate: item.tp || '',
      period: parseFloat(item.period) || 0,
      absoluteMagnitude: parseFloat(item.h) || 15,
    }));
  } catch (error) {
    console.error('Error fetching NEO comet data:', error);
    return getDefaultCometData();
  }
}

/**
 * Get typical impact velocities for different object types
 */
export function getImpactVelocityRange(objectType: 'asteroid' | 'comet'): { min: number; max: number; avg: number } {
  if (objectType === 'comet') {
    // Comets typically have higher velocities due to eccentric orbits
    return {
      min: 51 * 1609.34, // 51 km/s in m/s
      max: 72 * 1609.34, // 72 km/s in m/s
      avg: 60 * 1609.34, // 60 km/s in m/s
    };
  } else {
    // Asteroids (NEAs) have lower velocities
    return {
      min: 11 * 1609.34, // 11 km/s in m/s
      max: 33 * 1609.34, // 33 km/s in m/s
      avg: 20 * 1609.34, // 20 km/s in m/s
    };
  }
}

function getDefaultCometData(): NearEarthComet[] {
  return [
    {
      name: 'Halley',
      perihelionDistance: 0.586,
      eccentricity: 0.967,
      inclination: 162.3,
      perihelionDate: '2061-07-28',
      period: 75.3,
      absoluteMagnitude: 4.0,
    },
  ];
}