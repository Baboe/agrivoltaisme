import type { Metadata } from "next"
import DirectoryClient from "./DirectoryClient"

export const metadata: Metadata = {
  title: "Directory Coverage | Ombaa",
  description:
    "Review public solar park and grazing partner coverage across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  alternates: { canonical: "https://ombaa.com/directory" },
  openGraph: {
    title: "Directory Coverage | Ombaa",
    description:
      "Review public solar park and grazing partner coverage across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
    url: "https://ombaa.com/directory",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Directory Coverage | Ombaa",
    description:
      "Review public solar park and grazing partner coverage across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  },
}

export default function DirectoryPage() {
  return <DirectoryClient />
}
