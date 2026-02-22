import fs from 'fs';
import path from 'path';

// NOTE: This file-based storage is ephemeral on Vercel (won't survive deployments).
// For production, migrate to PostgreSQL, Supabase, or Vercel KV.
const claimsFile = path.join(process.cwd(), 'data', 'claims.json');

export interface BusinessClaim {
  listingId: string;
  listingType: 'solar-park' | 'sheep-farm';
  listingName: string;
  claimedAt: string;
  claimedBy: {
    name: string;
    email: string;
    role: string;
    relationship: string;
  };
  verified: boolean;
  verifiedAt?: string;
}

interface ClaimsData {
  claims: BusinessClaim[];
}

function ensureDataDir(): void {
  const dataDir = path.dirname(claimsFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readClaims(): ClaimsData {
  ensureDataDir();
  if (!fs.existsSync(claimsFile)) {
    return { claims: [] };
  }
  const data = fs.readFileSync(claimsFile, 'utf8');
  return JSON.parse(data);
}

function writeClaims(data: ClaimsData): void {
  ensureDataDir();
  fs.writeFileSync(claimsFile, JSON.stringify(data, null, 2));
}

/**
 * Check if a listing is claimed (and verified)
 */
export function isListingClaimed(listingId: string): boolean {
  const { claims } = readClaims();
  return claims.some(c => c.listingId === listingId && c.verified);
}

/**
 * Check if a listing has a pending (unverified) claim
 */
export function hasPendingClaim(listingId: string): boolean {
  const { claims } = readClaims();
  return claims.some(c => c.listingId === listingId && !c.verified);
}

/**
 * Get claim details for a listing
 */
export function getClaimForListing(listingId: string): BusinessClaim | null {
  const { claims } = readClaims();
  return claims.find(c => c.listingId === listingId) || null;
}

/**
 * Submit a new business claim
 */
export function submitClaim(claim: Omit<BusinessClaim, 'claimedAt' | 'verified'>): BusinessClaim {
  const { claims } = readClaims();
  
  // Check if already claimed
  const existingClaim = claims.find(c => c.listingId === claim.listingId);
  if (existingClaim) {
    throw new Error('This listing already has a claim');
  }
  
  const newClaim: BusinessClaim = {
    ...claim,
    claimedAt: new Date().toISOString(),
    verified: false,
  };
  
  claims.push(newClaim);
  writeClaims({ claims });
  
  return newClaim;
}

/**
 * Verify a pending claim (admin action)
 */
export function verifyClaim(listingId: string): BusinessClaim | null {
  const { claims } = readClaims();
  const claim = claims.find(c => c.listingId === listingId);
  
  if (!claim) return null;
  
  claim.verified = true;
  claim.verifiedAt = new Date().toISOString();
  writeClaims({ claims });
  
  return claim;
}

/**
 * Generate a unique listing ID from name and type
 */
export function generateListingId(name: string, type: 'solar-park' | 'sheep-farm'): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${type}:${slug}`;
}
