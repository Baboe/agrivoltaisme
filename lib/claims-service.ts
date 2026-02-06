/**
 * Claims Service - Backend for "Claim Your Listing" feature
 * 
 * Stores and manages listing claims with email verification.
 * Future-proof for paid features (verification tiers, premium badges, etc.)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Types
export interface Claim {
  id: string;
  listing_type: 'solar_park' | 'sheep_farm';
  listing_slug: string;
  listing_country: string;
  listing_name: string;
  
  // Claimant info
  email: string;
  phone: string;
  role: 'owner' | 'manager' | 'representative' | 'other';
  role_other?: string;  // If role is 'other'
  
  // Verification
  verification_token: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'expired';
  verification_sent_at: string;
  verified_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  ip_address?: string;
  user_agent?: string;
  
  // Future-proofing for paid features
  tier?: 'free' | 'verified' | 'premium';
  notes?: string;
}

export interface ClaimSubmission {
  listing_type: 'solar_park' | 'sheep_farm';
  listing_slug: string;
  listing_country: string;
  listing_name: string;
  email: string;
  phone: string;
  role: 'owner' | 'manager' | 'representative' | 'other';
  role_other?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface ClaimResult {
  success: boolean;
  claim_id?: string;
  error?: string;
  message?: string;
}

// File-based storage (simple, works with serverless)
// ⚠️ TEMPORARY DEV STORAGE: Ephemeral on Vercel - data won't persist between 
// deployments or cold starts. Replace with PostgreSQL/Supabase for production.
// See README.md for migration notes.
const CLAIMS_FILE = path.join(process.cwd(), 'data', 'claims.json');

function ensureDataDir() {
  const dir = path.dirname(CLAIMS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readClaims(): Claim[] {
  ensureDataDir();
  if (!fs.existsSync(CLAIMS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(CLAIMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeClaims(claims: Claim[]): void {
  ensureDataDir();
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateId(): string {
  return `claim_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

// Validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Allow various formats: +31 6 12345678, 06-12345678, etc.
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{8,15}$/.test(cleaned);
}

/**
 * Submit a new claim for a listing
 */
export async function submitClaim(submission: ClaimSubmission): Promise<ClaimResult> {
  // Validate required fields
  if (!submission.email || !isValidEmail(submission.email)) {
    return { success: false, error: 'Invalid email address' };
  }
  
  if (!submission.phone || !isValidPhone(submission.phone)) {
    return { success: false, error: 'Invalid phone number' };
  }
  
  if (!submission.listing_slug || !submission.listing_type || !submission.listing_country) {
    return { success: false, error: 'Missing listing information' };
  }
  
  if (!['owner', 'manager', 'representative', 'other'].includes(submission.role)) {
    return { success: false, error: 'Invalid role' };
  }
  
  const claims = readClaims();
  
  // Check for existing verified claim on this listing
  const existingVerified = claims.find(
    c => c.listing_slug === submission.listing_slug 
      && c.listing_type === submission.listing_type
      && c.listing_country === submission.listing_country
      && c.verification_status === 'verified'
  );
  
  if (existingVerified) {
    return { 
      success: false, 
      error: 'This listing has already been claimed',
      message: 'If you believe this is an error, please contact support.'
    };
  }
  
  // Check for existing pending claim from same email (prevent spam)
  const existingPending = claims.find(
    c => c.listing_slug === submission.listing_slug 
      && c.listing_type === submission.listing_type
      && c.listing_country === submission.listing_country
      && c.email.toLowerCase() === submission.email.toLowerCase()
      && c.verification_status === 'pending'
  );
  
  if (existingPending) {
    // Check if token is still valid (24 hours)
    const sentAt = new Date(existingPending.verification_sent_at).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (now - sentAt < twentyFourHours) {
      return {
        success: false,
        error: 'A verification email was already sent',
        message: 'Please check your email or try again in 24 hours.'
      };
    }
    
    // Expire old claim and allow new one
    existingPending.verification_status = 'expired';
    existingPending.updated_at = new Date().toISOString();
  }
  
  // Create new claim
  const now = new Date().toISOString();
  const claim: Claim = {
    id: generateId(),
    listing_type: submission.listing_type,
    listing_slug: submission.listing_slug,
    listing_country: submission.listing_country,
    listing_name: submission.listing_name,
    email: submission.email.toLowerCase(),
    phone: submission.phone,
    role: submission.role,
    role_other: submission.role_other,
    verification_token: generateToken(),
    verification_status: 'pending',
    verification_sent_at: now,
    created_at: now,
    updated_at: now,
    ip_address: submission.ip_address,
    user_agent: submission.user_agent,
    tier: 'free',
  };
  
  claims.push(claim);
  writeClaims(claims);
  
  return {
    success: true,
    claim_id: claim.id,
    message: 'Claim submitted. Please check your email to verify.'
  };
}

/**
 * Verify a claim using the email token
 */
export async function verifyClaim(token: string): Promise<ClaimResult> {
  if (!token) {
    return { success: false, error: 'Missing verification token' };
  }
  
  const claims = readClaims();
  const claim = claims.find(c => c.verification_token === token);
  
  if (!claim) {
    return { success: false, error: 'Invalid or expired verification link' };
  }
  
  if (claim.verification_status === 'verified') {
    return { success: true, message: 'This listing has already been verified' };
  }
  
  if (claim.verification_status === 'expired' || claim.verification_status === 'rejected') {
    return { success: false, error: 'This verification link has expired' };
  }
  
  // Check token expiry (7 days for verification)
  const sentAt = new Date(claim.verification_sent_at).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  
  if (now - sentAt > sevenDays) {
    claim.verification_status = 'expired';
    claim.updated_at = new Date().toISOString();
    writeClaims(claims);
    return { success: false, error: 'This verification link has expired. Please submit a new claim.' };
  }
  
  // Verify the claim
  claim.verification_status = 'verified';
  claim.verified_at = new Date().toISOString();
  claim.updated_at = new Date().toISOString();
  
  writeClaims(claims);
  
  return {
    success: true,
    claim_id: claim.id,
    message: 'Email verified! Your listing claim is now active.'
  };
}

/**
 * Get claim status for a listing
 */
export function getClaimStatus(
  listingType: 'solar_park' | 'sheep_farm',
  listingSlug: string,
  listingCountry: string
): { claimed: boolean; claim?: Partial<Claim> } {
  const claims = readClaims();
  
  const verifiedClaim = claims.find(
    c => c.listing_slug === listingSlug
      && c.listing_type === listingType
      && c.listing_country === listingCountry
      && c.verification_status === 'verified'
  );
  
  if (verifiedClaim) {
    return {
      claimed: true,
      claim: {
        id: verifiedClaim.id,
        role: verifiedClaim.role,
        verified_at: verifiedClaim.verified_at,
        tier: verifiedClaim.tier,
      }
    };
  }
  
  return { claimed: false };
}

/**
 * Get claim by ID (for internal use / admin)
 */
export function getClaimById(claimId: string): Claim | null {
  const claims = readClaims();
  return claims.find(c => c.id === claimId) || null;
}

/**
 * Get all claims (for admin/analytics)
 */
export function getAllClaims(): Claim[] {
  return readClaims();
}

/**
 * Get claims statistics (for analytics)
 */
export function getClaimsStats(): {
  total: number;
  verified: number;
  pending: number;
  by_country: Record<string, number>;
  by_type: Record<string, number>;
} {
  const claims = readClaims();
  
  const verified = claims.filter(c => c.verification_status === 'verified');
  const pending = claims.filter(c => c.verification_status === 'pending');
  
  const byCountry: Record<string, number> = {};
  const byType: Record<string, number> = {};
  
  verified.forEach(c => {
    byCountry[c.listing_country] = (byCountry[c.listing_country] || 0) + 1;
    byType[c.listing_type] = (byType[c.listing_type] || 0) + 1;
  });
  
  return {
    total: claims.length,
    verified: verified.length,
    pending: pending.length,
    by_country: byCountry,
    by_type: byType,
  };
}

/**
 * Generate verification URL
 */
export function getVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ombaa.com';
  return `${baseUrl}/api/claims/verify?token=${token}`;
}
