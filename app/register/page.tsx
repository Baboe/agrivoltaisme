import RegisterClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account – Ombaa",
  description: "Create an Ombaa account as a solar farm or shepherd.",
  alternates: { canonical: "https://ombaa.eu/register" },
  openGraph: {
    title: "Create Account – Ombaa",
    description: "Create an Ombaa account as a solar farm or shepherd.",
    url: "https://ombaa.eu/register",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Create Account – Ombaa",
    description: "Create an Ombaa account as a solar farm or shepherd.",
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
