import LoginClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login – Ombaa",
  description: "Sign in to your Ombaa account.",
  alternates: { canonical: "https://ombaa.eu/login" },
  openGraph: {
    title: "Login – Ombaa",
    description: "Sign in to your Ombaa account.",
    url: "https://ombaa.eu/login",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Login – Ombaa",
    description: "Sign in to your Ombaa account.",
  },
}

export default function LoginPage() {
  return <LoginClient />
}
