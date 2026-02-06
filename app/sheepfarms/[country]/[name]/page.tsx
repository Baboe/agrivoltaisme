import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSheepFarmByName, formatLocation, formatContactInfo } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Globe, ArrowLeft, Users, Wheat } from "lucide-react";
import Link from "next/link";
import { 
  VerificationBadge, 
  isPlaceholderFlockSize, 
  isDefaultBreed, 
  isDefaultGrazingType 
} from "@/components/verification-badge";

interface PageProps {
  params: {
    country: string;
    name: string;
  };
}

// Generate static metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.name);
  const sheepFarm = await fetchSheepFarmByName(decodedName, params.country);
  
  if (!sheepFarm) {
    return {
      title: "Sheep Farm Not Found - Ombaa",
      description: "The requested sheep farm could not be found in our directory.",
    };
  }

  const location = formatLocation(sheepFarm.location, sheepFarm.region, sheepFarm.country);
  const title = `${sheepFarm.name} - Sheep Farm in ${location} | Ombaa Directory`;
  const description = `Discover ${sheepFarm.name}, a ${sheepFarm.flock_size} sheep farm in ${location}. Available for solar park grazing partnerships. Contact details and more information.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ombaa.com/sheepfarms/${params.country}/${params.name}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ombaa.com/sheepfarms/${params.country}/${params.name}`,
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
export async function generateStructuredData(sheepFarm: any) {
  const location = formatLocation(sheepFarm.location, sheepFarm.region, sheepFarm.country);
  
  return {
    "@context": "https://schema.org",
    "@type": "Farm",
    "name": sheepFarm.name,
    "description": `Sheep farm offering grazing services for solar park vegetation management. ${sheepFarm.flock_size} sheep, specializing in ${sheepFarm.breed.toLowerCase()} breeding.`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": sheepFarm.country,
      "addressRegion": sheepFarm.region,
      "streetAddress": sheepFarm.location,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": sheepFarm.coordinates.latitude,
      "longitude": sheepFarm.coordinates.longitude,
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": sheepFarm.flock_size,
      "unitCode": "EACH",
    },
    "url": `https://ombaa.com/sheepfarms/${sheepFarm.country.toLowerCase()}/${encodeURIComponent(sheepFarm.name)}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": sheepFarm.contact_phone,
      "email": sheepFarm.contact_email,
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Sheep Breed",
        "value": sheepFarm.breed,
      },
      {
        "@type": "PropertyValue",
        "name": "Grazing Type",
        "value": sheepFarm.grazing_type,
      },
    ],
  };
}

export default async function SheepFarmDetailPage({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.name);
  const sheepFarm = await fetchSheepFarmByName(decodedName, params.country);

  if (!sheepFarm) {
    notFound();
  }

  const location = formatLocation(sheepFarm.location, sheepFarm.region, sheepFarm.country);
  const contact = formatContactInfo(sheepFarm.contact_phone, sheepFarm.contact_email, sheepFarm.website);

  // Determine which fields need verification badges
  const flockSizeNeedsVerification = isPlaceholderFlockSize(sheepFarm.flock_size);
  const breedNeedsVerification = isDefaultBreed(sheepFarm.breed);
  const grazingTypeNeedsVerification = isDefaultGrazingType(sheepFarm.grazing_type);

  // Generate breadcrumbs for navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Sheep Farms", href: "/directory#shepherds" },
    { name: sheepFarm.country, href: `/directory?country=${sheepFarm.country.toLowerCase()}&listingType=shepherd` },
    { name: sheepFarm.name, href: "" },
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
          <Link href="/directory#shepherds">
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
                      {sheepFarm.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Users className="h-4 w-4 mr-1" />
                    Sheep Farm
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  This established {sheepFarm.flock_size} sheep farm specializes in {sheepFarm.breed.toLowerCase()} breeding 
                  and offers professional grazing services for solar park vegetation management. With expertise in 
                  {sheepFarm.grazing_type.toLowerCase()}, we provide sustainable and effective solutions for maintaining 
                  solar park landscapes.
                </p>
              </CardContent>
            </Card>

            {/* Farm Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Farm Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Flock Size</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{sheepFarm.flock_size} sheep</p>
                      {flockSizeNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sheep Breed</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{sheepFarm.breed}</p>
                      {breedNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Grazing Type</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{sheepFarm.grazing_type}</p>
                      {grazingTypeNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Country</h4>
                    <p className="text-gray-600">{sheepFarm.country}</p>
                  </div>
                  {sheepFarm.region && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Region</h4>
                      <p className="text-gray-600">{sheepFarm.region}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wheat className="mr-2 h-5 w-5" />
                  Grazing Services & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                    <p className="text-gray-600">
                      Professional {sheepFarm.grazing_type.toLowerCase()} services with {sheepFarm.breed.toLowerCase()} sheep 
                      for optimal vegetation management and sustainable land use.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                    <p className="text-gray-600">
                      Established farm with proven expertise in managing grazing partnerships and maintaining 
                      solar park infrastructure while preserving agricultural productivity.
                    </p>
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
                      {sheepFarm.coordinates.latitude.toFixed(6)}, {sheepFarm.coordinates.longitude.toFixed(6)}
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
                    <span className="text-gray-600">Flock Size</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{sheepFarm.flock_size} sheep</span>
                      {flockSizeNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Breed</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{sheepFarm.breed}</span>
                      {breedNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Specialty</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-green-600">{sheepFarm.grazing_type}</span>
                      {grazingTypeNeedsVerification && <VerificationBadge variant="not-verified" />}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">Solar Grazing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Services */}
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2 mb-2">Vegetation Management</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">Solar Park Grazing</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">Sustainable Farming</Badge>
                  <Badge variant="outline" className="mr-2 mb-2">Land Maintenance</Badge>
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
          __html: JSON.stringify(await generateStructuredData(sheepFarm)),
        }}
      />
    </div>
  );
}
