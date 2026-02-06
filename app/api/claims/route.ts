/**
 * POST /api/claims - Submit a new listing claim
 * GET /api/claims - Get claims statistics (for future admin use)
 */

import { NextRequest, NextResponse } from 'next/server';
import { submitClaim, getClaimsStats, getVerificationUrl, type ClaimSubmission } from '@/lib/claims-service';

// Rate limiting: simple in-memory store (resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }
  
  if (limit.count >= 5) { // Max 5 claims per hour per IP
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const required = ['listing_type', 'listing_slug', 'listing_country', 'listing_name', 'email', 'phone', 'role'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const submission: ClaimSubmission = {
      listing_type: body.listing_type,
      listing_slug: body.listing_slug,
      listing_country: body.listing_country,
      listing_name: body.listing_name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      role_other: body.role_other,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || undefined,
    };
    
    const result = await submitClaim(submission);
    
    if (result.success) {
      // In production, this would send an actual email
      // For now, log the verification URL for testing
      console.log('=== CLAIM SUBMITTED ===');
      console.log('Claim ID:', result.claim_id);
      console.log('Email:', submission.email);
      console.log('Listing:', submission.listing_name);
      // Note: verification_token is internal, not exposed in response
      
      return NextResponse.json({
        success: true,
        claim_id: result.claim_id,
        message: result.message,
      });
    }
    
    return NextResponse.json(
      { success: false, error: result.error, message: result.message },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error submitting claim:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin auth (simple secret for now)
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.CLAIMS_ADMIN_SECRET;
    
    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const stats = getClaimsStats();
    return NextResponse.json({ success: true, stats });
    
  } catch (error) {
    console.error('Error getting claims stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
