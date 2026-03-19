'use client'

import { useEffect, useRef, useState } from 'react'
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Check, Copy, MapPin, Search, X } from "lucide-react"

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
  filters: DirectoryFilters
}

type DirectoryFilters = {
  country: string
  region: string
  search: string
  listingType: string
  grazingStatus: string
}

type DirectoryFilterKey = keyof DirectoryFilters

const countryLabels: Record<string, string> = {
  netherlands: "Netherlands",
  germany: "Germany",
  france: "France",
  belgium: "Belgium",
  all: "All countries",
}

const listingTypeLabels: Record<string, string> = {
  all: "All listings",
  shepherd: "Grazing partners only",
  "solar-farm": "Solar parks only",
}

const grazingStatusLabels: Record<string, string> = {
  all: "All grazing status",
  grazing_ready: "Grazing ready",
  actively_grazed: "Actively grazed",
  potentially_compatible: "Potentially compatible",
  not_compatible: "Not compatible",
  proven_case_study: "Proven case",
}

const DEFAULT_FILTERS = {
  country: 'netherlands',
  region: 'all',
  search: '',
  listingType: 'all',
  grazingStatus: 'all',
} satisfies DirectoryFilters

const VALID_COUNTRIES = new Set(['netherlands', 'germany', 'france', 'belgium', 'all'])
const VALID_LISTING_TYPES = new Set(['all', 'shepherd', 'solar-farm'])
const VALID_GRAZING_STATUSES = new Set([
  'all',
  'grazing_ready',
  'actively_grazed',
  'potentially_compatible',
  'not_compatible',
  'proven_case_study',
])

function readFiltersFromSearchParams(searchParams: { get(key: string): string | null }): DirectoryState["filters"] {
  const country = searchParams.get('country') || DEFAULT_FILTERS.country
  const listingType = searchParams.get('listingType') || DEFAULT_FILTERS.listingType
  const grazingStatus = searchParams.get('grazingStatus') || DEFAULT_FILTERS.grazingStatus

  return {
    country: VALID_COUNTRIES.has(country) ? country : DEFAULT_FILTERS.country,
    region: searchParams.get('region') || DEFAULT_FILTERS.region,
    search: searchParams.get('search') || DEFAULT_FILTERS.search,
    listingType: VALID_LISTING_TYPES.has(listingType) ? listingType : DEFAULT_FILTERS.listingType,
    grazingStatus: VALID_GRAZING_STATUSES.has(grazingStatus) ? grazingStatus : DEFAULT_FILTERS.grazingStatus,
  }
}

function buildDirectoryQuery(filters: DirectoryState["filters"]) {
  const params = new URLSearchParams()

  if (filters.country !== DEFAULT_FILTERS.country) params.set('country', filters.country)
  if (filters.region !== DEFAULT_FILTERS.region) params.set('region', filters.region)
  if (filters.search) params.set('search', filters.search)
  if (filters.listingType !== DEFAULT_FILTERS.listingType) params.set('listingType', filters.listingType)
  if (filters.grazingStatus !== DEFAULT_FILTERS.grazingStatus) params.set('grazingStatus', filters.grazingStatus)

  return params.toString()
}

function getDefaultFilterValue(key: DirectoryFilterKey) {
  return DEFAULT_FILTERS[key]
}

export default function DirectoryClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const syncedQueryRef = useRef(searchParams.toString())

  const [state, setState] = useState<DirectoryState>({
    solarParks: [],
    sheepFarms: [],
    loading: true,
    error: null,
    filters: readFiltersFromSearchParams(searchParams),
  })
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

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

  useEffect(() => {
    const nextFilters = readFiltersFromSearchParams(searchParams)
    const nextQuery = buildDirectoryQuery(nextFilters)

    syncedQueryRef.current = nextQuery

    setState((previous) => {
      const currentQuery = buildDirectoryQuery(previous.filters)

      if (currentQuery === nextQuery) {
        return previous
      }

      return {
        ...previous,
        filters: nextFilters,
      }
    })
  }, [searchParams])

  useEffect(() => {
    const query = buildDirectoryQuery(state.filters)

    if (query === syncedQueryRef.current) {
      return
    }

    syncedQueryRef.current = query
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router, state.filters])

  useEffect(() => {
    if (copyState === 'idle') {
      return
    }

    const timeoutId = window.setTimeout(() => setCopyState('idle'), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  const handleFilterChange = (key: keyof DirectoryState['filters'], value: string) => {
    setState((previous) => ({
      ...previous,
      filters: {
        ...previous.filters,
        region: key === 'country' ? DEFAULT_FILTERS.region : previous.filters.region,
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

  const resetFilters = () => {
    setState((previous) => ({
      ...previous,
      filters: { ...DEFAULT_FILTERS },
    }))
  }

  const handleFilterRemoval = (key: DirectoryFilterKey) => {
    setState((previous) => ({
      ...previous,
      filters: {
        ...previous.filters,
        region: key === 'country' ? DEFAULT_FILTERS.region : previous.filters.region,
        [key]: getDefaultFilterValue(key),
      },
    }))
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
    } catch (error) {
      console.error('Failed to copy directory link:', error)
      setCopyState('error')
    }
  }

  const visibleResultCount = state.solarParks.length + state.sheepFarms.length
  const selectedCountryLabel = countryLabels[state.filters.country] || state.filters.country
  const activeFilters = [
    state.filters.country !== DEFAULT_FILTERS.country
      ? { key: 'country', label: countryLabels[state.filters.country] || state.filters.country }
      : null,
    state.filters.region !== DEFAULT_FILTERS.region
      ? { key: 'region', label: `Region: ${state.filters.region}` }
      : null,
    state.filters.search
      ? { key: 'search', label: `Search: ${state.filters.search}` }
      : null,
    state.filters.listingType !== DEFAULT_FILTERS.listingType
      ? { key: 'listingType', label: listingTypeLabels[state.filters.listingType] || state.filters.listingType }
      : null,
    state.filters.grazingStatus !== DEFAULT_FILTERS.grazingStatus
      ? {
          key: 'grazingStatus',
          label: grazingStatusLabels[state.filters.grazingStatus] || state.filters.grazingStatus,
        }
      : null,
  ].filter((item): item is { key: DirectoryFilterKey; label: string } => Boolean(item))
  const hasCustomFilters = activeFilters.length > 0

  if (state.loading) {
    return (
      <div className="flex min-h-screen flex-col bg-stone-50">
        <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#163128] py-16 text-stone-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(166,230,187,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(254,240,138,0.08),_transparent_26%)]" />
          <div className="absolute inset-0 opacity-25 soft-grid" />
          <div className="container relative mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100/85">Directory coverage</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Directory coverage for solar parks and grazing partners
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
              Loading the latest public coverage for solar parks and grazing partners.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="surface-card mx-auto max-w-lg p-10 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700"></div>
              <p className="mt-5 text-base text-slate-600">Loading directory data...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex min-h-screen flex-col bg-stone-50">
        <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#163128] py-16 text-stone-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(166,230,187,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(254,240,138,0.08),_transparent_26%)]" />
          <div className="absolute inset-0 opacity-25 soft-grid" />
          <div className="container relative mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100/85">Directory coverage</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Directory coverage for solar parks and grazing partners
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
              Review where Ombaa currently has public coverage data and use it to support the next conversation.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="surface-card mx-auto max-w-lg p-10 text-center">
              <p className="text-base text-rose-700">{state.error}</p>
              <Button onClick={fetchData} className="mt-6 rounded-full bg-emerald-800 px-6 text-white hover:bg-emerald-700">
                Try Again
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#163128] py-16 text-stone-50 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(166,230,187,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(254,240,138,0.08),_transparent_26%)]" />
        <div className="absolute inset-0 opacity-25 soft-grid" />
        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100/85">Directory coverage</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Directory coverage for solar parks and grazing partners
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/85">
              Use the directory to review where Ombaa currently has public solar park and grazing partner coverage. It
              supports the managed service. It does not replace it.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="metric-pill">{selectedCountryLabel}</span>
              <span className="metric-pill">{visibleResultCount} visible results</span>
              <span className="metric-pill">Public coverage data only</span>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-6 text-emerald-950 shadow-[0_20px_45px_-24px_rgba(255,255,255,0.55)] hover:bg-stone-100"
              >
                <a href="#shepherds">View Grazing Partners</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#solar-parks">View Solar Parks</a>
              </Button>
            </div>
          </div>

          <div className="surface-card overflow-hidden border-white/10 bg-white/10 p-4 text-white shadow-[0_36px_120px_-40px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold tracking-[-0.04em]">{visibleResultCount}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/80">Current visible records</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold tracking-[-0.04em]">{state.sheepFarms.length}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/80">Grazing partner records</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold tracking-[-0.04em]">{state.solarParks.length}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/80">Solar park records</p>
              </div>
            </div>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-[#143126]/75 p-5">
              <p className="text-sm font-semibold text-white">Current focus</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                {state.filters.country === 'netherlands'
                  ? 'The Netherlands remains the most complete public coverage area in the current directory.'
                  : `You are viewing ${selectedCountryLabel.toLowerCase()} coverage within the current public directory.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[74px] z-30 border-b border-stone-200/80 bg-stone-50/90 py-5 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="surface-card p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
              <div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search by name, location, or type..."
                    value={state.filters.search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="h-12 rounded-2xl border-stone-300 bg-stone-50/80 pl-11"
                  />
                </div>
              </div>

              <div>
                <Select value={state.filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                  <SelectTrigger className="h-12 rounded-2xl border-stone-300 bg-stone-50/80">
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
                  <SelectTrigger className="h-12 rounded-2xl border-stone-300 bg-stone-50/80">
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
                  <SelectTrigger className="h-12 rounded-2xl border-stone-300 bg-stone-50/80">
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
            </div>

            <div className="mt-4 border-t border-stone-200 pt-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm leading-6 text-slate-500">
                    Showing {visibleResultCount} results
                    {state.filters.search && ` for "${state.filters.search}"`}
                    {state.filters.country !== 'all' && ` in ${selectedCountryLabel}`}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Filters stay in the URL so filtered views can be shared internally.
                  </p>

                  {hasCustomFilters && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeFilters.map((filter) => (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => handleFilterRemoval(filter.key)}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
                        >
                          <span>{filter.label}</span>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {hasCustomFilters && (
                    <Button
                      variant="outline"
                      className="rounded-full border-stone-300 bg-white px-5 text-slate-700 hover:bg-stone-100"
                      onClick={resetFilters}
                    >
                      Reset filters
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-full border-stone-300 bg-white px-5 text-slate-700 hover:bg-stone-100"
                    onClick={handleCopyLink}
                  >
                    {copyState === 'copied' ? (
                      <Check className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copyState === 'copied' ? 'Link copied' : copyState === 'error' ? 'Copy failed' : 'Copy filtered link'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {state.sheepFarms.length > 0 && (
        <section id="shepherds" className="bg-stone-50 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-2xl">
              <p className="section-kicker">Grazing partner coverage</p>
              <h2 className="section-title">Grazing partners directory ({state.sheepFarms.length})</h2>
              <p className="section-copy">
                Review public grazing partner records that may support future introductions and local coverage checks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {state.sheepFarms.map((farm) => (
                <ShepherdCard
                  key={`${farm.country}-${farm.name}`}
                  name={farm.name}
                  location={formatLocation(farm.location, farm.region, farm.country)}
                  flockSize={farm.flock_size}
                  breed={farm.breed}
                  grazingType={farm.grazing_type}
                  description="Public grazing partner record within the current Ombaa coverage dataset."
                  country={farm.country}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {state.solarParks.length > 0 && (
        <section id="solar-parks" className="border-t border-stone-200 bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-2xl">
              <p className="section-kicker">Solar park coverage</p>
              <h2 className="section-title">Solar parks directory ({state.solarParks.length})</h2>
              <p className="section-copy">
                Review solar park records in the public directory and use them as supporting coverage proof for future
                outreach and assessment work.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Grazing status labels reflect the current public directory record. They are not a substitute for a site
                assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {state.solarParks.map((park) => (
                <SolarFarmCard
                  key={`${park.country}-${park.name}`}
                  name={park.name}
                  location={formatLocation(park.location, park.region, park.country)}
                  size={park.total_hectares}
                  vegetationType={park.vegetation_type}
                  description={`Solar park record with ${park.total_hectares} hectares of panels and vegetation management needs.`}
                  grazingStatus={park.grazing_status}
                  country={park.country}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {state.solarParks.length === 0 && state.sheepFarms.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="surface-card mx-auto max-w-2xl p-10 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-900">No results found</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Try adjusting your search criteria or reset the directory back to the Netherlands.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full border-stone-300 bg-stone-50 px-6 hover:bg-stone-100"
                onClick={resetFilters}
              >
                Reset to Netherlands
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#183428] py-16 text-stone-50">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-6 py-10 shadow-[0_30px_80px_-46px_rgba(0,0,0,0.55)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(167,243,208,0.12),_transparent_30%)]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Next step</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
                Need help turning coverage into a real next step?
              </h2>
              <p className="mt-4 text-base leading-8 text-emerald-50/85">
                Request a grazing assessment for a site or register grazing partner interest if you want Ombaa to follow
                up directly.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
              <Button asChild size="lg" className="rounded-full bg-white px-6 text-emerald-950 hover:bg-stone-100">
                <Link href="/#request-assessment">Request assessment</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/register/shepherd">
                  Register as grazing partner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
