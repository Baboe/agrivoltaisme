'use client'

import { useEffect, useState } from 'react'
import { Filter, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ShepherdCard from "@/components/shepherd-card"
import SolarFarmCard from "@/components/solar-farm-card"
import { fetchSheepFarms, fetchSolarParks, formatLocation, type ApiResponse, type SheepFarm, type SolarPark } from '@/lib/data-service'

interface DirectoryState {
  solarParks: SolarPark[]
  sheepFarms: SheepFarm[]
  loading: boolean
  error: string | null
  filters: {
    country: string
    region: string
    search: string
    listingType: string
    grazingStatus: string
  }
}

export default function DirectoryClient() {
  const [state, setState] = useState<DirectoryState>({
    solarParks: [],
    sheepFarms: [],
    loading: true,
    error: null,
    filters: {
      country: 'netherlands',
      region: 'all',
      search: '',
      listingType: 'all',
      grazingStatus: 'all',
    },
  })

  const fetchData = async () => {
    setState((previous) => ({ ...previous, loading: true, error: null }))

    try {
      const requests = []

      if (state.filters.listingType === 'all' || state.filters.listingType === 'solar-farm') {
        requests.push(
          fetchSolarParks({
            country: state.filters.country !== 'all' ? state.filters.country : undefined,
            region: state.filters.region !== 'all' ? state.filters.region : undefined,
            search: state.filters.search || undefined,
            grazingStatus: state.filters.grazingStatus !== 'all' ? state.filters.grazingStatus : undefined,
            limit: 50,
          }),
        )
      }

      if (state.filters.listingType === 'all' || state.filters.listingType === 'shepherd') {
        requests.push(
          fetchSheepFarms({
            country: state.filters.country !== 'all' ? state.filters.country : undefined,
            region: state.filters.region !== 'all' ? state.filters.region : undefined,
            search: state.filters.search || undefined,
            limit: 50,
          }),
        )
      }

      const results = await Promise.all(requests)

      let solarParksData: SolarPark[] = []
      let sheepFarmsData: SheepFarm[] = []
      let resultIndex = 0

      if (state.filters.listingType === 'all' || state.filters.listingType === 'solar-farm') {
        const solarParksResponse = results[resultIndex] as ApiResponse<SolarPark>
        solarParksData = solarParksResponse?.data || []
        resultIndex += 1
      }

      if (state.filters.listingType === 'all' || state.filters.listingType === 'shepherd') {
        const sheepFarmsResponse = results[resultIndex] as ApiResponse<SheepFarm>
        sheepFarmsData = sheepFarmsResponse?.data || []
      }

      setState((previous) => ({
        ...previous,
        solarParks: solarParksData,
        sheepFarms: sheepFarmsData,
        loading: false,
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
      setState((previous) => ({
        ...previous,
        loading: false,
        error: 'Failed to load directory data. Please try again.',
      }))
    }
  }

  useEffect(() => {
    fetchData()
  }, [state.filters])

  const handleFilterChange = (key: keyof DirectoryState['filters'], value: string) => {
    setState((previous) => ({
      ...previous,
      filters: {
        ...previous.filters,
        [key]: value,
      },
    }))
  }

  const handleSearchChange = (value: string) => {
    setState((previous) => ({
      ...previous,
      filters: {
        ...previous.filters,
        search: value,
      },
    }))
  }

  if (state.loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <section className="bg-gradient-to-br from-green-600 to-green-700 py-12 text-white">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Solar Grazing Directory</h1>
            <p className="mb-8 text-xl">Loading Netherlands listings, our most complete public coverage area</p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading directory data...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex min-h-screen flex-col">
        <section className="bg-gradient-to-br from-green-600 to-green-700 py-12 text-white">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Solar Grazing Directory</h1>
            <p className="mb-8 text-xl">Review coverage for solar parks and grazing partners</p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="mb-4 text-red-600">{state.error}</p>
              <Button onClick={fetchData} className="bg-green-600 hover:bg-green-700">
                Try Again
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Solar Grazing Directory</h1>
          <p className="mb-8 text-xl">
            {state.filters.country === 'netherlands'
              ? 'Explore the Netherlands, our most complete public coverage area with 119 listings'
              : 'Review coverage for solar parks and grazing partners'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <a href="#shepherds">Find Grazing Partners ({state.sheepFarms.length})</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <a href="#solar-farms">Find Solar Parks ({state.solarParks.length})</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-10 bg-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, location, or type..."
                  value={state.filters.search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={state.filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Netherlands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="netherlands">Netherlands</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="belgium">Belgium</SelectItem>
                  <SelectItem value="all">All Countries</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={state.filters.listingType} onValueChange={(value) => handleFilterChange('listingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Listings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="shepherd">Grazing Partners Only</SelectItem>
                  <SelectItem value="solar-farm">Solar Parks Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={state.filters.grazingStatus} onValueChange={(value) => handleFilterChange('grazingStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grazing Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grazing Status</SelectItem>
                  <SelectItem value="grazing_ready">Grazing ready</SelectItem>
                  <SelectItem value="actively_grazed">Actively grazed</SelectItem>
                  <SelectItem value="potentially_compatible">Potentially compatible</SelectItem>
                  <SelectItem value="not_compatible">Not compatible</SelectItem>
                  <SelectItem value="proven_case_study">Proven case</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={fetchData}>
                <Filter className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">
            Showing {state.solarParks.length + state.sheepFarms.length} results
            {state.filters.search && ` for "${state.filters.search}"`}
            {state.filters.country !== 'all' && ` in ${state.filters.country}`}
          </p>
        </div>
      </section>

      {state.sheepFarms.length > 0 && (
        <section id="shepherds" className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold">Grazing Partners Directory ({state.sheepFarms.length})</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.sheepFarms.map((farm) => (
                <ShepherdCard
                  key={`${farm.country}-${farm.name}`}
                  name={farm.name}
                  location={formatLocation(farm.location, farm.region, farm.country)}
                  flockSize={farm.flock_size}
                  breed={farm.breed}
                  experience={5}
                  description={`${farm.grazing_type} specialist. Available for solar grazing partnerships.`}
                  country={farm.country}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {state.solarParks.length > 0 && (
        <section id="solar-farms" className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold">Solar Parks Directory ({state.solarParks.length})</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.solarParks.map((park) => (
                <SolarFarmCard
                  key={`${park.country}-${park.name}`}
                  name={park.name}
                  location={formatLocation(park.location, park.region, park.country)}
                  size={park.total_hectares}
                  vegetationType={park.vegetation_type}
                  description={`Solar park record with ${park.total_hectares} hectares of panels and vegetation management needs.`}
                  country={park.country}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {state.solarParks.length === 0 && state.sheepFarms.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No results found</h3>
              <p className="mb-4 text-gray-500">Try adjusting your search criteria or browse all listings.</p>
              <Button
                variant="outline"
                onClick={() =>
                  setState((previous) => ({
                    ...previous,
                    filters: {
                      country: 'netherlands',
                      region: 'all',
                      search: '',
                      listingType: 'all',
                      grazingStatus: 'all',
                    },
                  }))
                }
              >
                Reset to Netherlands
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
