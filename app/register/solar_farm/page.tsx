import SolarFarmRegisterClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register Solar Farm – Ombaa",
  description: "Sign up your solar farm to find grazing partners on Ombaa.",
  alternates: { canonical: "https://ombaa.eu/register/solar_farm" },
  openGraph: {
    title: "Register Solar Farm – Ombaa",
    description: "Sign up your solar farm to find grazing partners on Ombaa.",
    url: "https://ombaa.eu/register/solar_farm",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Register Solar Farm – Ombaa",
    description: "Sign up your solar farm to find grazing partners on Ombaa.",
  },
}

export default function SolarFarmRegisterPage() {
  return <SolarFarmRegisterClient />
}
