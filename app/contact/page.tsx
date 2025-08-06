import ContactPageClient from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Ombaa",
  description: "Get in touch with the Ombaa team for questions about solar grazing.",
  alternates: { canonical: "https://ombaa.eu/contact" },
  openGraph: {
    title: "Contact Ombaa",
    description: "Get in touch with the Ombaa team for questions about solar grazing.",
    url: "https://ombaa.eu/contact",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "Contact Ombaa",
    description: "Get in touch with the Ombaa team for questions about solar grazing.",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
