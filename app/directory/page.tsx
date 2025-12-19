'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Filter, Search, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ShepherdCard from "@/components/shepherd-card";
import SolarFarmCard from "@/components/solar-farm-card";
import { fetchSolarParks, fetchSheepFarms, formatLocation, formatContactInfo, type SolarPark, type SheepFarm, type ApiResponse } from '@/lib/data-service';

export const metadata: Metadata = {
  title: "Solar Grazing Directory – Ombaa",
  description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  alternates: { canonical: "https://ombaa.com/directory" },
  openGraph: {
    title: "Solar Grazing Directory – Ombaa",
    description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
    url: "https://ombaa.com/directory",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar Grazing Directory – Ombaa",
    description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  },
};

interface DirectoryState {
  solarParks: SolarPark[];
  sheepFarms: SheepFarm[];
  loading: boolean;
  error: string | null;
  filters: {
    country: string;
    region: string;
    search: string;
    listingType: string;
  };
}

export default function Directory() {
  const [state, setState] = useState<DirectoryState>({
    solarParks: [],
    sheepFarms: [],
    loading: true,
    error: null,
    filters: {
      country: 'all',
      region: 'all',
      search: '',
      listingType: 'all',
    },
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const promises = [];
      
      // Fetch solar parks
      if (state.filters.listingType === 'all' || state.filters.listingType === 'solar-farm') {
        promises.push(
          fetchSolarParks({
            country: state.filters.country !== 'all' ? state.filters.country : undefined,
            region: state.filters.region !== 'all' ? state.filters.region : undefined,
            search: state.filters.search || undefined,
            limit: 50,
          })
        );
      }
      
      // Fetch sheep farms
      if (state.filters.listingType === 'all' || state.filters.listingType === 'shepherd') {
        promises.push(
          fetchSheepFarms({
            country: state.filters.country !== 'all' ? state.filters.country : undefined,
            region: state.filters.region !== 'all' ? state.filters.region : undefined,
            search: state.filters.search || undefined,
            limit: 50,
          })
        );
      }

      const results = await Promise.all(promises);
      
      let solarParksData: SolarPark[] = [];
      let sheepFarmsData: SheepFarm[] = [];
      
      let resultIndex = 0;
      
      if (state.filters.listingType === 'all' || state.filters.listingType === 'solar-farm') {
        const solarParksResponse = results[resultIndex] as ApiResponse<SolarPark>;
        solarParksData = solarParksResponse?.data || [];
        resultIndex++;
      }
      
      if (state.filters.listingType === 'all' || state.filters.listingType === 'shepherd') {
        const sheepFarmsResponse = results[resultIndex] as ApiResponse<SheepFarm>;
        sheepFarmsData = sheepFarmsResponse?.data || [];
      }
      
      setState(prev => ({
        ...prev,
        solarParks: solarParksData,
        sheepFarms: sheepFarmsData,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load directory data. Please try again.',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [state.filters]);

  const handleFilterChange = (key: keyof DirectoryState['filters'], value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const handleSearchChange = (value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        search: value,
      },
    }));
  };

  if (state.loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Grazing Directory</h1>
            <p className="text-xl mb-8">Connect with shepherds and solar farms across Netherlands, Belgium, France, and Germany</p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading directory data...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Grazing Directory</h1>
            <p className="text-xl mb-8">Connect with shepherds and solar farms across Netherlands, Belgium, France, and Germany</p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-red-600 mb-4">{state.error}</p>
              <Button onClick={fetchData} className="bg-green-600 hover:bg-green-700">
                Try Again
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Directory Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Grazing Directory</h1>
          <p className="text-xl mb-8">
            Connect with shepherds and solar farms across Netherlands, Belgium, France, and Germany
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <a href="#shepherds">Find Shepherds ({state.sheepFarms.length})</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <a href="#solar-farms">Find Solar Farms ({state.solarParks.length})</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="py-6 bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, location, or type..."
                  value={state.filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Country Filter */}
            <div>
              <Select value={state.filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="netherlands">Netherlands</SelectItem>
                  <SelectItem value="belgium">Belgium</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Listing Type Filter */}
            <div>
              <Select value={state.filters.listingType} onValueChange={(value) => handleFilterChange('listingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Listings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="shepherd">Shepherds Only</SelectItem>
                  <SelectItem value="solar-farm">Solar Farms Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Apply Filters Button */}
            <div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={fetchData}
              >
                <Filter className="mr-2 h-4 w-4" /> 
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">
            Showing {state.solarParks.length + state.sheepFarms.length} results
            {state.filters.search && ` for "${state.filters.search}"`}
            {state.filters.country !== 'all' && ` in ${state.filters.country}`}
          </p>
        </div>
      </section>

      {/* Shepherds Directory */}
      {state.sheepFarms.length > 0 && (
        <section id="shepherds" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Shepherds Directory ({state.sheepFarms.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.sheepFarms.map((farm, index) => {
                const contact = formatContactInfo(farm.contact_phone, farm.contact_email, farm.website);
                return (
                  <ShepherdCard
                    name={farm.name}
                    location={formatLocation(farm.location, farm.region, farm.country)}
                    flockSize={farm.flock_size}
                    breed={farm.breed}
                    experience={5} // Default experience, could be enhanced later
                    description={`${farm.grazing_type} specialist. Available for solar grazing partnerships.`}
                    verified={true}
                    country={farm.country}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Solar Farms Directory */}
      {state.solarParks.length > 0 && (
        <section id="solar-farms" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Solar Farms Directory ({state.solarParks.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.solarParks.map((park, index) => {
                const contact = formatContactInfo(park.contact_phone, park.contact_email, park.website);
                return (
                  <SolarFarmCard
                    name={park.name}
                    location={formatLocation(park.location, park.region, park.country)}
                    size={park.total_hectares}
                    vegetationType={park.vegetation_type}
                    description={`Seeking shepherds for vegetation management. ${park.total_hectares} hectares of solar panels.`}
                    country={park.country}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {state.solarParks.length === 0 && state.sheepFarms.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or browse all listings.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setState(prev => ({
                  ...prev,
                  filters: {
                    country: 'all',
                    region: 'all',
                    search: '',
                    listingType: 'all',
                  },
                }))}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
