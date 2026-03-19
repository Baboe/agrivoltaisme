import type { Metadata } from "next"

import RegisterClient from "./client-page"

export const metadata: Metadata = {
  title: "Work with Ombaa | Choose your role",
  description: "Choose whether you want to submit a solar park or register as a grazing partner.",
  alternates: { canonical: "https://ombaa.com/register" },
  openGraph: {
    title: "Work with Ombaa | Choose your role",
    description: "Choose whether you want to submit a solar park or register as a grazing partner.",
    url: "https://ombaa.com/register",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Work with Ombaa | Choose your role",
    description: "Choose whether you want to submit a solar park or register as a grazing partner.",
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
