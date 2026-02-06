/**
 * GET /api/claims/verify?token=xxx - Verify email and activate claim
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyClaim, getClaimById } from '@/lib/claims-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      // Redirect to error page
      return NextResponse.redirect(
        new URL('/claim/error?reason=missing_token', request.url)
      );
    }
    
    const result = await verifyClaim(token);
    
    if (result.success) {
      // Get the claim to redirect to the listing
      const claim = result.claim_id ? getClaimById(result.claim_id) : null;
      
      if (claim) {
        // Redirect to listing with success message
        const listingPath = claim.listing_type === 'solar_park' 
          ? `/solarparks/${claim.listing_country.toLowerCase()}/${claim.listing_slug}`
          : `/sheepfarms/${claim.listing_country.toLowerCase()}/${claim.listing_slug}`;
        
        return NextResponse.redirect(
          new URL(`${listingPath}?claimed=success`, request.url)
        );
      }
      
      // Fallback redirect
      return NextResponse.redirect(
        new URL('/claim/success', request.url)
      );
    }
    
    // Verification failed
    const reason = encodeURIComponent(result.error || 'unknown');
    return NextResponse.redirect(
      new URL(`/claim/error?reason=${reason}`, request.url)
    );
    
  } catch (error) {
    console.error('Error verifying claim:', error);
    return NextResponse.redirect(
      new URL('/claim/error?reason=server_error', request.url)
    );
  }
}
