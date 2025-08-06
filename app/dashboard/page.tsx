import DashboardClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard – Ombaa",
  description: "Manage your Ombaa account and view solar grazing matches.",
  alternates: { canonical: "https://ombaa.eu/dashboard" },
  openGraph: {
    title: "Dashboard – Ombaa",
    description: "Manage your Ombaa account and view solar grazing matches.",
    url: "https://ombaa.eu/dashboard",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Dashboard – Ombaa",
    description: "Manage your Ombaa account and view solar grazing matches.",
  },
}

export default function DashboardPage() {
  return <DashboardClient />
}
