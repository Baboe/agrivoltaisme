import { type NextRequest, NextResponse } from "next/server"
import sheepFarmsData from '@/processed_sheep_farms_combined.json';

// Filter to only include Netherlands and Belgium for MVP
const MVP_COUNTRIES = ['Netherlands', 'Belgium'];

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter data for MVP countries only
    let filteredData = sheepFarmsData.filter((farm: any) => 
      MVP_COUNTRIES.includes(farm.country)
    ) as SheepFarm[];

    // Apply country filter
    if (country && country !== 'all') {
      filteredData = filteredData.filter(farm => 
        farm.country.toLowerCase() === country.toLowerCase()
      );
    }

    // Apply region filter
    if (region && region !== 'all') {
      filteredData = filteredData.filter(farm => 
        (farm.region && farm.region.toLowerCase().includes(region.toLowerCase())) ||
        (farm.location && farm.location.toLowerCase().includes(region.toLowerCase()))
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(farm => 
        farm.name.toLowerCase().includes(searchLower) ||
        (farm.location && farm.location.toLowerCase().includes(searchLower)) ||
        farm.breed.toLowerCase().includes(searchLower) ||
        farm.grazing_type.toLowerCase().includes(searchLower) ||
        (farm.region && farm.region.toLowerCase().includes(searchLower))
      );
    }

    // Sort data
    filteredData.sort((a, b) => {
      let aValue = a[sortBy as keyof SheepFarm] || '';
      let bValue = b[sortBy as keyof SheepFarm] || '';
      
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
        countries: [...new Set(filteredData.map(farm => farm.country))],
        regions: [...new Set(filteredData.map(farm => farm.region).filter(Boolean))],
        breeds: [...new Set(filteredData.map(farm => farm.breed))],
        grazingTypes: [...new Set(filteredData.map(farm => farm.grazing_type))]
      }
    });
  } catch (error) {
    console.error('Error fetching sheep farms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheep farms' },
      { status: 500 }
    );
  }
}

// Export data for other components
export { sheepFarmsData };