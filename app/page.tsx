import HomeClient from "./home-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ombaa – Solar Grazing Marketplace",
  description: "Connect solar farms with shepherds for eco-friendly grazing across Europe.",
  alternates: { canonical: "https://ombaa.com/" },
  openGraph: {
    title: "Ombaa – Solar Grazing Marketplace",
    description: "Connect solar farms with shepherds for eco-friendly grazing across Europe.",
    url: "https://ombaa.com/",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Ombaa – Solar Grazing Marketplace",
    description: "Connect solar farms with shepherds for eco-friendly grazing across Europe.",
  },
}

export default function Home() {
  return <HomeClient />
}
