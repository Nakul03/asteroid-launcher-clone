/**
 * NASA Small-Body Database (SBDB) API Integration
 * Documentation: https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html
 */

export interface AsteroidData {
  name: string;
  diameter: number; // in meters
  albedo: number;
  density: number; // g/cm³
  mass: number; // kg
  absoluteMagnitude: number;
  orbitalElements?: {
    eccentricity: number;
    semiMajorAxis: number;
    inclination: number;
  };
}

export interface NearEarthObject {
  des: string; // designation
  name: string;
  diameter: number; // meters
  h: number; // absolute magnitude
  closestApproach: {
    date: string;
    distance: number; // AU
    velocity: number; // km/s
  };
}

/**
 * Fetch near-Earth asteroids from NASA SBDB Query API
 */
export async function fetchNearEarthAsteroids(): Promise<AsteroidData[]> {
  try {
    const url = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=full_name,diameter,H,albedo,density&sb-class=NEA&limit=50';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch asteroid data');
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return getDefaultAsteroids();
    }

    return data.data.map((item: any[]) => {
      const [name, diameter, h, albedo, density] = item;
      return {
        name: name || 'Unknown',
        diameter: diameter ? parseFloat(diameter) * 1000 : estimateDiameterFromH(h), // convert km to m
        albedo: albedo ? parseFloat(albedo) : 0.14,
        density: density ? parseFloat(density) : 2.6, // typical asteroid density
        mass: calculateMass(diameter ? parseFloat(diameter) * 1000 : estimateDiameterFromH(h), density ? parseFloat(density) : 2.6),
        absoluteMagnitude: h ? parseFloat(h) : 20,
      };
    });
  } catch (error) {
    console.error('Error fetching NASA SBDB data:', error);
    return getDefaultAsteroids();
  }
}

/**
 * Fetch close approach data for near-Earth objects
 */
export async function fetchCloseApproachData(): Promise<NearEarthObject[]> {
  try {
    const url = 'https://ssd-api.jpl.nasa.gov/cad.api?dist-max=0.05&date-min=2020-01-01&date-max=2030-01-01&sort=dist&limit=20';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch close approach data');
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((item: any[]) => {
      const [des, orbit, date, dist, distMin, distMax, vRel, vInf, tSigma, h] = item;
      const diameter = estimateDiameterFromH(parseFloat(h));
      
      return {
        des,
        name: des,
        diameter,
        h: parseFloat(h),
        closestApproach: {
          date,
          distance: parseFloat(dist),
          velocity: parseFloat(vRel),
        },
      };
    });
  } catch (error) {
    console.error('Error fetching close approach data:', error);
    return [];
  }
}

/**
 * Fetch specific asteroid data by designation
 */
export async function fetchAsteroidByName(designation: string): Promise<AsteroidData | null> {
  try {
    const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(designation)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.object) {
      return null;
    }

    const diameter = data.object.diameter ? parseFloat(data.object.diameter) * 1000 : 
                     estimateDiameterFromH(data.object.H || 20);
    const density = data.object.density ? parseFloat(data.object.density) : 2.6;

    return {
      name: data.object.fullname || data.object.des || designation,
      diameter,
      albedo: data.object.albedo ? parseFloat(data.object.albedo) : 0.14,
      density,
      mass: calculateMass(diameter, density),
      absoluteMagnitude: data.object.H ? parseFloat(data.object.H) : 20,
      orbitalElements: data.orbit ? {
        eccentricity: parseFloat(data.orbit.e),
        semiMajorAxis: parseFloat(data.orbit.a),
        inclination: parseFloat(data.orbit.i),
      } : undefined,
    };
  } catch (error) {
    console.error('Error fetching asteroid by name:', error);
    return null;
  }
}

/**
 * Estimate diameter from absolute magnitude H
 * Formula: D = (1329 / sqrt(albedo)) * 10^(-H/5)
 */
function estimateDiameterFromH(h: number, albedo: number = 0.14): number {
  const diameter = (1329 / Math.sqrt(albedo)) * Math.pow(10, -h / 5);
  return diameter * 1000; // convert km to meters
}

/**
 * Calculate mass from diameter and density
 */
function calculateMass(diameter: number, density: number): number {
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  return volume * density * 1000; // kg (density in g/cm³, volume in m³)
}

/**
 * Default asteroid data if API fails
 */
function getDefaultAsteroids(): AsteroidData[] {
  return [
    {
      name: 'Apophis',
      diameter: 370,
      albedo: 0.23,
      density: 3.2,
      mass: calculateMass(370, 3.2),
      absoluteMagnitude: 19.7,
    },
    {
      name: 'Bennu',
      diameter: 490,
      albedo: 0.046,
      density: 1.26,
      mass: calculateMass(490, 1.26),
      absoluteMagnitude: 20.9,
    },
    {
      name: 'Eros',
      diameter: 16840,
      albedo: 0.25,
      density: 2.67,
      mass: calculateMass(16840, 2.67),
      absoluteMagnitude: 10.4,
    },
  ];
}