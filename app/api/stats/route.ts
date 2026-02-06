import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs';
import path from 'path';

// MVP countries - only show these in stats
const MVP_COUNTRIES = ['Netherlands', 'Belgium'];

interface StatsResponse {
  solarParks: number;
  sheepFarms: number;
  total: number;
  byCountry?: Record<string, { solarParks: number; sheepFarms: number }>;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const includeBreakdown = searchParams.get('breakdown') === 'true';

    const solarParks = loadSolarParksData();
    const sheepFarms = loadSheepFarmsData();

    // Filter to MVP countries only
    const mvpSolarParks = solarParks.filter(park => MVP_COUNTRIES.includes(park.country));
    const mvpSheepFarms = sheepFarms.filter(farm => MVP_COUNTRIES.includes(farm.country));

    // If specific country requested
    if (country && country !== 'all') {
      const normalizedCountry = country.toLowerCase();
      const countrySolarParks = mvpSolarParks.filter(
        park => park.country.toLowerCase() === normalizedCountry
      );
      const countrySheepFarms = mvpSheepFarms.filter(
        farm => farm.country.toLowerCase() === normalizedCountry
      );

      const response: StatsResponse = {
        solarParks: countrySolarParks.length,
        sheepFarms: countrySheepFarms.length,
        total: countrySolarParks.length + countrySheepFarms.length,
      };

      return NextResponse.json(response);
    }

    // Overall stats (MVP countries only)
    const response: StatsResponse = {
      solarParks: mvpSolarParks.length,
      sheepFarms: mvpSheepFarms.length,
      total: mvpSolarParks.length + mvpSheepFarms.length,
    };

    // Include breakdown by country if requested
    if (includeBreakdown) {
      const byCountry: Record<string, { solarParks: number; sheepFarms: number }> = {};
      
      for (const country of MVP_COUNTRIES) {
        byCountry[country] = {
          solarParks: mvpSolarParks.filter(p => p.country === country).length,
          sheepFarms: mvpSheepFarms.filter(f => f.country === country).length,
        };
      }
      
      response.byCountry = byCountry;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
