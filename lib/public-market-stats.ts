import { getCountryStats } from "@/lib/stats-service"

const PUBLIC_MARKETS = ["Netherlands", "Belgium", "France", "Germany"] as const

export interface PublicMarketStat {
  country: (typeof PUBLIC_MARKETS)[number]
  solarParks: number
  sheepFarms: number
  total: number
}

export function getPublicMarketStats() {
  const markets: PublicMarketStat[] = PUBLIC_MARKETS.map((country) => {
    const stats = getCountryStats(country)

    return {
      country,
      solarParks: stats.solarParks,
      sheepFarms: stats.sheepFarms,
      total: stats.total,
    }
  })

  const totals = markets.reduce(
    (acc, market) => {
      acc.solarParks += market.solarParks
      acc.sheepFarms += market.sheepFarms
      acc.total += market.total
      return acc
    },
    { solarParks: 0, sheepFarms: 0, total: 0 },
  )

  return {
    markets,
    ...totals,
    countryCount: PUBLIC_MARKETS.length,
  }
}
