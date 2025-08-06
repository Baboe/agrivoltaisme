import ShepherdRegisterClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register Shepherd – Ombaa",
  description: "Sign up as a shepherd to offer grazing services on Ombaa.",
  alternates: { canonical: "https://ombaa.eu/register/shepherd" },
  openGraph: {
    title: "Register Shepherd – Ombaa",
    description: "Sign up as a shepherd to offer grazing services on Ombaa.",
    url: "https://ombaa.eu/register/shepherd",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Register Shepherd – Ombaa",
    description: "Sign up as a shepherd to offer grazing services on Ombaa.",
  },
}

export default function ShepherdRegisterPage() {
  return <ShepherdRegisterClient />
}
