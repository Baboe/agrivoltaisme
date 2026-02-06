import { NextRequest, NextResponse } from "next/server";
import { submitClaim, generateListingId, hasPendingClaim, isListingClaimed } from "@/lib/claims-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      listingId,
      listingName,
      listingType,
      name,
      email,
      role,
      relationship,
      additionalInfo
    } = body;

    // Validate required fields
    if (!listingName || !listingType || !name || !email) {
      return NextResponse.json(
        { error: 'Name, email, listing name, and listing type are required' },
        { status: 400 }
      );
    }

    // Generate listing ID if not provided
    const resolvedListingId = listingId || generateListingId(listingName, listingType);

    // Check if already claimed
    if (isListingClaimed(resolvedListingId)) {
      return NextResponse.json(
        { error: 'This listing has already been claimed and verified' },
        { status: 409 }
      );
    }

    // Check if there's a pending claim
    if (hasPendingClaim(resolvedListingId)) {
      return NextResponse.json(
        { error: 'This listing already has a pending claim under review' },
        { status: 409 }
      );
    }

    // Submit the claim
    const claim = submitClaim({
      listingId: resolvedListingId,
      listingType,
      listingName,
      claimedBy: {
        name,
        email,
        role: role || '',
        relationship: relationship || '',
      },
    });

    // Log the claim for manual review
    console.log('=== New Business Claim Submitted ===');
    console.log(`Listing: ${listingName} (${listingType})`);
    console.log(`Listing ID: ${resolvedListingId}`);
    console.log(`Claimant: ${name} <${email}>`);
    console.log(`Role: ${role || 'Not specified'}`);
    console.log(`Relationship: ${relationship || 'Not specified'}`);
    console.log(`Additional Info: ${additionalInfo || 'None'}`);
    console.log(`Timestamp: ${claim.claimedAt}`);
    console.log('=====================================');

    return NextResponse.json(
      { 
        message: 'Claim submitted successfully',
        claimId: resolvedListingId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing business claim:', error);
    
    if (error instanceof Error && error.message === 'This listing already has a claim') {
      return NextResponse.json(
        { error: 'This listing already has a pending claim' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listingId');

  if (!listingId) {
    return NextResponse.json(
      { error: 'listingId is required' },
      { status: 400 }
    );
  }

  const claimed = isListingClaimed(listingId);
  const pending = hasPendingClaim(listingId);

  return NextResponse.json({
    listingId,
    claimed,
    pending,
  });
}
