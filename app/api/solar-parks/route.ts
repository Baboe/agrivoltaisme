import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs';
import path from 'path';

// Filter to only include Netherlands and Belgium for MVP
const MVP_COUNTRIES = ['Netherlands', 'Belgium'];

function loadSolarParksData(): SolarPark[] {
  const filePath = path.join(process.cwd(), 'processed_solar_parks_combined.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const search = searchParams.get('search');
    const grazingStatus = searchParams.get('grazingStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Load and filter data for MVP countries only
    const solarParksData = loadSolarParksData();
    let filteredData = solarParksData.filter((park: any) =>
      MVP_COUNTRIES.includes(park.country)
    ) as SolarPark[];

    // Apply country filter
    if (country && country !== 'all') {
      filteredData = filteredData.filter(park => 
        park.country.toLowerCase() === country.toLowerCase()
      );
    }

    // Apply region filter
    if (region && region !== 'all') {
      filteredData = filteredData.filter(park => 
        (park.region && park.region.toLowerCase().includes(region.toLowerCase())) ||
        (park.location && park.location.toLowerCase().includes(region.toLowerCase()))
      );
    }

    // Apply grazing status filter
    if (grazingStatus && grazingStatus !== 'all') {
      filteredData = filteredData.filter(park =>
        park.grazing_status === grazingStatus
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(park =>
        park.name.toLowerCase().includes(searchLower) ||
        (park.location && park.location.toLowerCase().includes(searchLower)) ||
        park.vegetation_type.toLowerCase().includes(searchLower) ||
        (park.region && park.region.toLowerCase().includes(searchLower))
      );
    }

    // Sort data
    filteredData.sort((a, b) => {
      let aValue = a[sortBy as keyof SolarPark] || '';
      let bValue = b[sortBy as keyof SolarPark] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Calculate pagination
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        countries: [...new Set(filteredData.map(park => park.country))],
        regions: [...new Set(filteredData.map(park => park.region).filter(Boolean))],
        vegetationTypes: [...new Set(filteredData.map(park => park.vegetation_type))],
        grazingStatuses: [...new Set(filteredData.map(park => park.grazing_status))]
      }
    });
  } catch (error) {
    console.error('Error fetching solar parks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solar parks' },
      { status: 500 }
    );
  }
}

// Data is loaded dynamically