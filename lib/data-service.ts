// Data service for fetching solar parks and sheep farms
export interface SolarPark {
  name: string;
  location: string | null;
  country: string;
  region: string;
  total_hectares: number;
  vegetation_type: string;
  contact_email: string;
  contact_phone: string | null;
  website: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  grazing_status: 'not_compatible' | 'potentially_compatible' | 'grazing_ready' | 'actively_grazed' | 'proven_case_study';
  leading_edge_height: '<20_in' | '20_30_in' | '>30_in' | 'unknown';
  wire_safety_status: 'safe_bundled' | 'exposed_looping' | 'unknown';
  water_access: 'on_site_water' | 'no_water' | 'unknown';
}

export interface SheepFarm {
  name: string;
  location: string | null;
  country: string;
  region: string;
  flock_size: number;
  breed: string;
  grazing_type: string;
  contact_email: string;
  contact_phone: string | null;
  website: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    countries: string[];
    regions: string[];
    [key: string]: string[];
  };
}

export interface SearchParams {
  country?: string;
  region?: string;
  search?: string;
  grazingStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Solar Parks API
export async function fetchSolarParks(params: SearchParams = {}): Promise<ApiResponse<SolarPark>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/solar-parks?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch solar parks: ${response.statusText}`);
  }
  
  return response.json();
}

// Sheep Farms API
export async function fetchSheepFarms(params: SearchParams = {}): Promise<ApiResponse<SheepFarm>> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/sheep-farms?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sheep farms: ${response.statusText}`);
  }
  
  return response.json();
}

// Get single solar park by name (for detail pages)
const normalizeCountryValue = (country: string): string => country.trim().toLowerCase();

const isMatchingCountry = (recordCountry: string, requestedCountry: string): boolean => {
  return normalizeCountryValue(recordCountry) === normalizeCountryValue(requestedCountry);
};

export async function fetchSolarParkByName(name: string, country: string): Promise<SolarPark | null> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('search', name);
    searchParams.append('country', normalizeCountryValue(country));
    searchParams.append('limit', '1');
    const response = await fetch(`/api/solar-parks?${searchParams.toString()}`);
    const data = await response.json();
    const record = data.data.length > 0 ? data.data[0] : null;

    if (!record || !isMatchingCountry(record.country, country)) {
      return null;
    }

    return record;
  } catch (error) {
    console.error('Error fetching solar park:', error);
    return null;
  }
}

// Get single sheep farm by name (for detail pages)
export async function fetchSheepFarmByName(name: string, country: string): Promise<SheepFarm | null> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('search', name);
    searchParams.append('country', normalizeCountryValue(country));
    searchParams.append('limit', '1');
    const response = await fetch(`/api/sheep-farms?${searchParams.toString()}`);
    const data = await response.json();
    const record = data.data.length > 0 ? data.data[0] : null;

    if (!record || !isMatchingCountry(record.country, country)) {
      return null;
    }

    return record;
  } catch (error) {
    console.error('Error fetching sheep farm:', error);
    return null;
  }
}

// Format location for display
export function formatLocation(location: string | null, region: string, country: string): string {
  if (location && location.trim()) {
    return location;
  }
  if (region && region.trim()) {
    return `${region}, ${country}`;
  }
  return country;
}

// Format contact information
export function formatContactInfo(phone: string | null, email: string, website: string | null): {
  phone?: string;
  email?: string;
  website?: string;
} {
  const contact: { phone?: string; email?: string; website?: string } = {};
  
  if (phone) contact.phone = phone;
  if (email && email.trim()) contact.email = email;
  if (website) contact.website = website;
  
  return contact;
}
