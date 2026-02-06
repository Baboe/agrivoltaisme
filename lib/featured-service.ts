import fs from 'fs';
import path from 'path';

export interface FeaturedSolarPark {
  name: string;
  slug: string;
  size: string;
  region: string;
  country: string;
}

export interface FeaturedSheepFarm {
  name: string;
  slug: string;
  flockSize: string;
  breed: string;
  region: string;
  country: string;
}

interface RawSolarPark {
  name: string;
  country: string;
  region?: string;
  location?: string;
  total_hectares?: number;
}

interface RawSheepFarm {
  name: string;
  country: string;
  region?: string;
  location?: string;
  flock_size?: number;
  breed?: string;
}

// Generate URL-safe slug from name
function generateSlug(name: string): string {
  return encodeURIComponent(name);
}

// Extract region from location string if region field is empty
function extractRegion(location: string | undefined, fallback: string = 'Various'): string {
  if (!location) return fallback;
  // Try to extract city/region from location like "City, Region, Country"
  const parts = location.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    return parts[parts.length - 2]; // Second to last is usually city/region
  }
  return fallback;
}

// Map country names to URL-friendly format
function normalizeCountry(country: string): string {
  const map: Record<string, string> = {
    'Netherlands': 'netherlands',
    'Belgium': 'belgium',
    'Germany': 'germany',
    'France': 'france',
    'UK': 'uk',
    'United Kingdom': 'uk',
  };
  return map[country] || country.toLowerCase();
}

// Load and parse JSON files
function loadSolarParks(): RawSolarPark[] {
  const filePath = path.join(process.cwd(), 'processed_solar_parks_combined.json');
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function loadSheepFarms(): RawSheepFarm[] {
  const filePath = path.join(process.cwd(), 'processed_sheep_farms_combined.json');
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Get featured solar parks for a country
 * Returns real entries from the data, limited to `count`
 */
export function getFeaturedSolarParks(country: string, count: number = 3): FeaturedSolarPark[] {
  const allParks = loadSolarParks();
  const countryParks = allParks.filter(
    p => normalizeCountry(p.country) === country.toLowerCase()
  );
  
  // Take first N entries (could shuffle for variety, but deterministic is safer for SSR)
  return countryParks.slice(0, count).map(park => ({
    name: park.name,
    slug: generateSlug(park.name),
    size: park.total_hectares ? `${park.total_hectares} hectares` : 'Size not specified',
    region: park.region || extractRegion(park.location),
    country: normalizeCountry(park.country),
  }));
}

/**
 * Get featured sheep farms for a country
 * Returns real entries from the data, limited to `count`
 */
export function getFeaturedSheepFarms(country: string, count: number = 3): FeaturedSheepFarm[] {
  const allFarms = loadSheepFarms();
  const countryFarms = allFarms.filter(
    f => normalizeCountry(f.country) === country.toLowerCase()
  );
  
  // Take first N entries
  return countryFarms.slice(0, count).map(farm => ({
    name: farm.name,
    slug: generateSlug(farm.name),
    flockSize: farm.flock_size ? `${farm.flock_size} sheep` : 'Flock size not specified',
    breed: farm.breed || 'Breed not specified',
    region: farm.region || extractRegion(farm.location),
    country: normalizeCountry(farm.country),
  }));
}

/**
 * Check if a country has enough listings for featured section
 * Threshold is 5 listings minimum
 */
export function hasEnoughForFeatured(country: string, type: 'solar' | 'sheep'): boolean {
  const threshold = 5;
  
  if (type === 'solar') {
    const parks = loadSolarParks();
    const count = parks.filter(p => normalizeCountry(p.country) === country.toLowerCase()).length;
    return count >= threshold;
  } else {
    const farms = loadSheepFarms();
    const count = farms.filter(f => normalizeCountry(f.country) === country.toLowerCase()).length;
    return count >= threshold;
  }
}

/**
 * Get listing counts for a country
 */
export function getListingCounts(country: string): { solarParks: number; sheepFarms: number } {
  const parks = loadSolarParks();
  const farms = loadSheepFarms();
  
  return {
    solarParks: parks.filter(p => normalizeCountry(p.country) === country.toLowerCase()).length,
    sheepFarms: farms.filter(f => normalizeCountry(f.country) === country.toLowerCase()).length,
  };
}
