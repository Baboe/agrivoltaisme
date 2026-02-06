import fs from 'fs';
import path from 'path';

// MVP countries - only show these in the public API
const MVP_COUNTRIES = ['Netherlands', 'Belgium'];

// Country name normalization map
const COUNTRY_ALIASES: Record<string, string> = {
  'netherlands': 'Netherlands',
  'belgium': 'Belgium',
  'germany': 'Germany',
  'france': 'France',
  'uk': 'United Kingdom',
  'united kingdom': 'United Kingdom',
};

export interface CountryStats {
  solarParks: number;
  sheepFarms: number;
  total: number;
  isMvp: boolean;
}

export interface AllStats {
  solarParks: number;
  sheepFarms: number;
  total: number;
  byCountry: Record<string, CountryStats>;
}

function loadSolarParksData(): any[] {
  const filePath = path.join(process.cwd(), 'processed_solar_parks_combined.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function loadSheepFarmsData(): any[] {
  const filePath = path.join(process.cwd(), 'processed_sheep_farms_combined.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function normalizeCountry(country: string): string {
  const normalized = country.toLowerCase().trim();
  return COUNTRY_ALIASES[normalized] || country;
}

/**
 * Get stats for a specific country (server-side only)
 * Returns real counts from data files regardless of MVP status
 */
export function getCountryStats(country: string): CountryStats {
  const solarParks = loadSolarParksData();
  const sheepFarms = loadSheepFarmsData();
  
  const normalizedCountry = normalizeCountry(country);
  const isMvp = MVP_COUNTRIES.includes(normalizedCountry);
  
  // Get actual counts for the country (not filtered by MVP)
  const countrySolarParks = solarParks.filter(
    park => normalizeCountry(park.country) === normalizedCountry
  );
  const countrySheepFarms = sheepFarms.filter(
    farm => normalizeCountry(farm.country) === normalizedCountry
  );

  return {
    solarParks: countrySolarParks.length,
    sheepFarms: countrySheepFarms.length,
    total: countrySolarParks.length + countrySheepFarms.length,
    isMvp,
  };
}

/**
 * Get overall stats for MVP countries (server-side only)
 * Use mvpOnly=false to get stats for all countries
 */
export function getAllStats(mvpOnly: boolean = true): AllStats {
  const solarParks = loadSolarParksData();
  const sheepFarms = loadSheepFarmsData();
  
  // Get unique countries
  const allCountries = [...new Set([
    ...solarParks.map(p => normalizeCountry(p.country)),
    ...sheepFarms.map(f => normalizeCountry(f.country)),
  ])];
  
  const countries = mvpOnly 
    ? allCountries.filter(c => MVP_COUNTRIES.includes(c))
    : allCountries;
  
  const byCountry: Record<string, CountryStats> = {};
  let totalParks = 0;
  let totalFarms = 0;
  
  for (const country of countries) {
    const countryParks = solarParks.filter(p => normalizeCountry(p.country) === country).length;
    const countryFarms = sheepFarms.filter(f => normalizeCountry(f.country) === country).length;
    const isMvp = MVP_COUNTRIES.includes(country);
    
    byCountry[country] = {
      solarParks: countryParks,
      sheepFarms: countryFarms,
      total: countryParks + countryFarms,
      isMvp,
    };
    
    if (mvpOnly && isMvp) {
      totalParks += countryParks;
      totalFarms += countryFarms;
    } else if (!mvpOnly) {
      totalParks += countryParks;
      totalFarms += countryFarms;
    }
  }

  // If mvpOnly, only sum MVP countries
  if (mvpOnly) {
    totalParks = 0;
    totalFarms = 0;
    for (const country of MVP_COUNTRIES) {
      if (byCountry[country]) {
        totalParks += byCountry[country].solarParks;
        totalFarms += byCountry[country].sheepFarms;
      }
    }
  }

  return {
    solarParks: totalParks,
    sheepFarms: totalFarms,
    total: totalParks + totalFarms,
    byCountry,
  };
}

/**
 * Check if a country is in the MVP list
 */
export function isMvpCountry(country: string): boolean {
  return MVP_COUNTRIES.includes(normalizeCountry(country));
}
