import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSolarParkByName, formatLocation, formatContactInfo } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Globe, Sun, ArrowLeft, Droplets, Ruler, Zap } from "lucide-react";
import Link from "next/link";
import ClaimCorrectionForm from "@/components/claim-correction-form";
import { 
  VerificationBadge, 
  isUnknownValue, 
  isPlaceholderHectares, 
  isDefaultVegetation 
} from "@/components/verification-badge";

// Function to convert grazing status enum to display text
function getGrazingStatusDisplay(status: string): string {
  switch (status) {
    case 'not_compatible':
      return 'Not grazing compatible';
    case 'potentially_compatible':
      return 'Potentially grazing compatible';
    case 'grazing_ready':
      return 'Grazing ready';
    case 'actively_grazed':
      return 'Actively grazed';
    case 'proven_case_study':
      return 'Proven grazing case';
    default:
      return status;
  }
}

// Function to get credibility microcopy for grazing status
function getGrazingStatusMicrocopy(status: string): string {
  switch (status) {
    case 'not_compatible':
      return 'System-assigned (high confidence)';
    case 'potentially_compatible':
      return 'Based on available infrastructure data';
    case 'grazing_ready':
      return 'Infrastructure supports grazing (verification recommended)';
    case 'actively_grazed':
      return 'Sheep currently grazing on-site';
    case 'proven_case_study':
      return 'Documented grazing project';
    default:
      return '';
  }
}

// Format technical specifications with human-readable values
function formatLeadingEdgeHeight(value: string): string {
  switch (value) {
    case '<20_in': return 'Under 20 inches';
    case '20_30_in': return '20-30 inches';
    case '>30_in': return 'Over 30 inches';
    case 'unknown': return 'Unknown';
    default: return value;
  }
}

function formatWireSafetyStatus(value: string): string {
  switch (value) {
    case 'safe_bundled': return 'Safe (bundled)';
    case 'exposed_looping': return 'Exposed/looping';
    case 'unknown': return 'Unknown';
    default: return value;
  }
}

function formatWaterAccess(value: string): string {
  switch (value) {
    case 'on_site_water': return 'On-site water';
    case 'no_water': return 'No water';
    case 'unknown': return 'Unknown';
    default: return value;
  }
}

interface PageProps {
  params: {
    country: string;
    name: string;
  };
}

// Generate static metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.name);
  const solarPark = await fetchSolarParkByName(decodedName, params.country);
  
  if (!solarPark) {
    return {
      title: "Solar Park Not Found - Ombaa",
      description: "The requested solar park could not be found in our directory.",
    };
  }

  const location = formatLocation(solarPark.location, solarPark.region, solarPark.country);
  const title = `${solarPark.name} - Solar Park in ${location} | Ombaa Directory`;
  const description = `Discover ${solarPark.name}, a ${solarPark.total_hectares} hectare solar park in ${location}. Seeking shepherds for vegetation management. Contact details and more information.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ombaa.com/solarparks/${params.country}/${params.name}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ombaa.com/solarparks/${params.country}/${params.name}`,
      siteName: "Ombaa",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Generate structured data for SEO
export async function generateStructuredData(solarPark: any) {
  const location = formatLocation(solarPark.location, solarPark.region, solarPark.country);
  
  return {
    "@context": "https://schema.org",
    "@type": "SolarPark",
    "name": solarPark.name,
    "description": `Solar park seeking shepherds for vegetation management. ${solarPark.total_hectares} hectares of solar panels.`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": solarPark.country,
      "addressRegion": solarPark.region,
      "streetAddress": solarPark.location,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": solarPark.coordinates.latitude,
      "longitude": solarPark.coordinates.longitude,
    },
    "area": {
      "@type": "QuantitativeValue",
      "value": solarPark.total_hectares,
      "unitCode": "HECT",
    },
    "url": `https://ombaa.com/solarparks/${solarPark.country.toLowerCase()}/${encodeURIComponent(solarPark.name)}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": solarPark.contact_phone,
      "email": solarPark.contact_email,
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Vegetation Type",
        "value": solarPark.vegetation_type,
      },
    ],
  };
}

export default async function SolarParkDetailPage({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.name);
  const solarPark = await fetchSolarParkByName(decodedName, params.country);

  if (!solarPark) {
    notFound();
  }

  const location = formatLocation(solarPark.location, solarPark.region, solarPark.country);
  const contact = formatContactInfo(solarPark.contact_phone, solarPark.contact_email, solarPark.website);
  
  // Determine which fields need verification badges
  const hectaresNeedsVerification = isPlaceholderHectares(solarPark.total_hectares);
  const vegetationNeedsVerification = isDefaultVegetation(solarPark.vegetation_type);
  const leadingEdgeUnknown = isUnknownValue(solarPark.leading_edge_height);
  const wireSafetyUnknown = isUnknownValue(solarPark.wire_safety_status);
  const waterAccessUnknown = isUnknownValue(solarPark.water_access);
  const hasNoContact = !contact.phone && !contact.email && !contact.website;

  // Generate breadcrumbs for navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Solar Parks", href: "/directory#solar-farms" },
    { name: solarPark.country, href: `/directory?country=${solarPark.country.toLowerCase()}&listingType=solar-farm` },
    { name: solarPark.name, href: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-green-600 hover:text-green-800">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/directory#solar-farms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                      {solarPark.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{location}</span>
                    </div>
                    <div className="mb-4">
                      <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 text-blue-800 border-blue-200">
                        {getGrazingStatusDisplay(solarPark.grazing_status)}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {getGrazingStatusMicrocopy(solarPark.grazing_status)}
                      </p>
                      <ClaimCorrectionForm
                        solarParkName={solarPark.name}
                        solarParkLocation={location}
                        currentStatus={solarPark.grazing_status}
                      />
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Sun className="h-4 w-4 mr-1" />
                    Solar Park
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  This {solarPark.total_hectares} hectare solar park is actively seeking experienced shepherds 
                  for vegetation management and grazing services. The park features {solarPark.vegetation_type.toLowerCase()} 
                  and offers excellent opportunities for sustainable agriculture partnerships.
                </p>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="mr-2 h-5 w-5" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Park Size</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{solarPark.total_hectares} hectares</p>
                      {hectaresNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vegetation Type</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{solarPark.vegetation_type}</p>
                      {vegetationNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Country</h4>
                    <p className="text-gray-600">{solarPark.country}</p>
                  </div>
                  {solarPark.region && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Region</h4>
                      <p className="text-gray-600">{solarPark.region}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Grazing Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Grazing Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">Leading Edge Height</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{formatLeadingEdgeHeight(solarPark.leading_edge_height)}</p>
                      {leadingEdgeUnknown && <VerificationBadge variant="unknown" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum clearance for sheep access</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">Wire Safety</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{formatWireSafetyStatus(solarPark.wire_safety_status)}</p>
                      {wireSafetyUnknown && <VerificationBadge variant="unknown" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Cable management status</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">Water Access</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{formatWaterAccess(solarPark.water_access)}</p>
                      {waterAccessUnknown && <VerificationBadge variant="unknown" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">On-site water availability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">GPS Coordinates</h4>
                    <p className="text-gray-600">
                      {solarPark.coordinates.latitude.toFixed(6)}, {solarPark.coordinates.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Full Address</h4>
                    <p className="text-gray-600">{location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.phone ? (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-green-600 hover:text-green-800">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-300 mr-3" />
                    <div>
                      <p className="font-medium text-gray-400">Phone</p>
                      <p className="text-gray-400 text-sm">Not available</p>
                    </div>
                  </div>
                )}
                
                {contact.email ? (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-green-600 hover:text-green-800">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-300 mr-3" />
                    <div>
                      <p className="font-medium text-gray-400">Email</p>
                      <p className="text-gray-400 text-sm">Not available</p>
                    </div>
                  </div>
                )}

                {contact.website ? (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a 
                        href={contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-300 mr-3" />
                    <div>
                      <p className="font-medium text-gray-400">Website</p>
                      <p className="text-gray-400 text-sm">Not available</p>
                    </div>
                  </div>
                )}

                <Separator />
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Contact for Grazing Partnership
                </Button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Area</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{solarPark.total_hectares} ha</span>
                      {hectaresNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vegetation</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{solarPark.vegetation_type}</span>
                      {vegetationNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seeking</span>
                    <span className="font-medium text-green-600">Shepherds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">Solar Grazing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(await generateStructuredData(solarPark)),
        }}
      />
    </div>
  );
}
