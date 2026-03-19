import type { Metadata } from "next"

import SolarFarmRegisterClient from "./client-page"

export const metadata: Metadata = {
  title: "Create operator account | Ombaa",
  description: "Create an Ombaa operator account for your solar park team.",
  alternates: { canonical: "https://ombaa.com/register/solar_farm" },
  openGraph: {
    title: "Create operator account | Ombaa",
    description: "Create an Ombaa operator account for your solar park team.",
    url: "https://ombaa.com/register/solar_farm",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Create operator account | Ombaa",
    description: "Create an Ombaa operator account for your solar park team.",
  },
}

export default function SolarFarmRegisterPage() {
  return <SolarFarmRegisterClient />
}
