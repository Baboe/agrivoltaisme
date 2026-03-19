import type { Metadata } from "next"

import HomeClient from "./home-client"
import { getPublicMarketStats } from "@/lib/public-market-stats"

export const metadata: Metadata = {
  title: "Ombaa | Grazing Solutions for Solar Parks",
  description:
    "Ombaa helps solar park operators reduce vegetation management costs through sheep grazing, site assessment, and managed partner matching.",
  alternates: { canonical: "https://ombaa.com/" },
  openGraph: {
    title: "Ombaa | Grazing Solutions for Solar Parks",
    description:
      "Ombaa helps solar park operators reduce vegetation management costs through sheep grazing, site assessment, and managed partner matching.",
    url: "https://ombaa.com/",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Ombaa | Grazing Solutions for Solar Parks",
    description:
      "Ombaa helps solar park operators reduce vegetation management costs through sheep grazing, site assessment, and managed partner matching.",
  },
}

export default function Home() {
  const coverage = getPublicMarketStats()

  return <HomeClient {...coverage} />
}
