/**
 * GET /api/claims/status?type=xxx&slug=xxx&country=xxx - Check if a listing is claimed
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClaimStatus } from '@/lib/claims-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'solar_park' | 'sheep_farm' | null;
    const slug = searchParams.get('slug');
    const country = searchParams.get('country');
    
    if (!type || !slug || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: type, slug, country' },
        { status: 400 }
      );
    }
    
    if (!['solar_park', 'sheep_farm'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be solar_park or sheep_farm' },
        { status: 400 }
      );
    }
    
    const status = getClaimStatus(type, slug, country.toLowerCase());
    
    return NextResponse.json({
      success: true,
      ...status,
    });
    
  } catch (error) {
    console.error('Error getting claim status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
