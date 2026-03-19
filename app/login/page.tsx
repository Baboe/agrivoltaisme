import type { Metadata } from "next"
import LoginClient from "./client-page"

export const metadata: Metadata = {
  title: "Login | Ombaa",
  description: "Sign in to your Ombaa account.",
  alternates: { canonical: "https://ombaa.com/login" },
  openGraph: {
    title: "Login | Ombaa",
    description: "Sign in to your Ombaa account.",
    url: "https://ombaa.com/login",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Login | Ombaa",
    description: "Sign in to your Ombaa account.",
  },
}

export default function LoginPage() {
  return <LoginClient />
}
