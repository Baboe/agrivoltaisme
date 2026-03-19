import type { Metadata } from "next"
import ContactPageClient from "./client-page"

export const metadata: Metadata = {
  title: "Talk to Ombaa",
  description:
    "Contact Ombaa to request a grazing assessment, discuss vegetation management needs, or register grazing partner interest.",
  alternates: { canonical: "https://ombaa.com/contact" },
  openGraph: {
    title: "Talk to Ombaa",
    description:
      "Contact Ombaa to request a grazing assessment, discuss vegetation management needs, or register grazing partner interest.",
    url: "https://ombaa.com/contact",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Talk to Ombaa",
    description:
      "Contact Ombaa to request a grazing assessment, discuss vegetation management needs, or register grazing partner interest.",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
