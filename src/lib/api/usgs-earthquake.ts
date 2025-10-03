/**
 * USGS Earthquake API Integration
 * Documentation: https://earthquake.usgs.gov/fdsnws/event/1/
 */

export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  latitude: number;
  longitude: number;
  type: string;
}

/**
 * Fetch recent significant earthquakes from USGS
 */
export async function fetchRecentEarthquakes(
  minMagnitude: number = 6.0,
  limit: number = 10
): Promise<EarthquakeData[]> {
  try {
    const endTime = new Date().toISOString().split('T')[0];
    const startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}&orderby=magnitude&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data');
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return getDefaultEarthquakes();
    }

    return data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      depth: feature.geometry.coordinates[2],
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      type: feature.properties.type,
    }));
  } catch (error) {
    console.error('Error fetching USGS earthquake data:', error);
    return getDefaultEarthquakes();
  }
}

/**
 * Fetch earthquakes by location
 */
export async function fetchEarthquakesByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 500,
  minMagnitude: number = 4.0
): Promise<EarthquakeData[]> {
  try {
    const endTime = new Date().toISOString().split('T')[0];
    const startTime = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radiusKm}&minmagnitude=${minMagnitude}&orderby=magnitude&limit=20`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data');
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }

    return data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      depth: feature.geometry.coordinates[2],
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      type: feature.properties.type,
    }));
  } catch (error) {
    console.error('Error fetching earthquakes by location:', error);
    return [];
  }
}

/**
 * Get earthquake comparison for given magnitude
 */
export function getEarthquakeComparison(magnitude: number): string {
  if (magnitude >= 9.5) {
    return 'Comparable to the 1960 Valdivia earthquake (9.5) - the strongest ever recorded';
  } else if (magnitude >= 9.0) {
    return 'Similar to the 2011 Tōhoku earthquake (9.1) that caused the Fukushima disaster';
  } else if (magnitude >= 8.5) {
    return 'Comparable to the 2004 Indian Ocean earthquake (9.1) that caused devastating tsunamis';
  } else if (magnitude >= 8.0) {
    return 'Similar to the 1906 San Francisco earthquake (7.9) that destroyed the city';
  } else if (magnitude >= 7.5) {
    return 'Comparable to major destructive earthquakes that occur roughly once per year globally';
  } else if (magnitude >= 7.0) {
    return 'Similar to the 2010 Haiti earthquake (7.0) that killed over 200,000 people';
  } else if (magnitude >= 6.5) {
    return 'Strong earthquake capable of causing significant damage in populated areas';
  } else if (magnitude >= 6.0) {
    return 'Moderate earthquake that can cause damage to poorly constructed buildings';
  } else {
    return 'Minor to light earthquake with limited damage potential';
  }
}

/**
 * Default earthquake data if API fails
 */
function getDefaultEarthquakes(): EarthquakeData[] {
  return [
    {
      id: 'default1',
      magnitude: 9.1,
      place: '2011 Tōhoku, Japan',
      time: Date.now(),
      depth: 29,
      latitude: 38.297,
      longitude: 142.373,
      type: 'earthquake',
    },
    {
      id: 'default2',
      magnitude: 9.0,
      place: '2004 Indian Ocean',
      time: Date.now(),
      depth: 30,
      latitude: 3.295,
      longitude: 95.982,
      type: 'earthquake',
    },
  ];
}