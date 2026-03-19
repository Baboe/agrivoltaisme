import type { Metadata } from "next"

import ShepherdRegisterClient from "./client-page"

export const metadata: Metadata = {
  title: "Register as a grazing partner | Ombaa",
  description: "Create an Ombaa account to register your grazing service for solar park opportunities.",
  alternates: { canonical: "https://ombaa.com/register/shepherd" },
  openGraph: {
    title: "Register as a grazing partner | Ombaa",
    description: "Create an Ombaa account to register your grazing service for solar park opportunities.",
    url: "https://ombaa.com/register/shepherd",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Register as a grazing partner | Ombaa",
    description: "Create an Ombaa account to register your grazing service for solar park opportunities.",
  },
}

export default function ShepherdRegisterPage() {
  return <ShepherdRegisterClient />
}
