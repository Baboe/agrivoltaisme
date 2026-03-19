import { Suspense } from "react"
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
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50">
          <div className="container mx-auto px-4 py-20">
            <div className="surface-card mx-auto max-w-lg p-10 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700"></div>
              <p className="mt-5 text-base text-slate-600">Loading directory...</p>
            </div>
          </div>
        </div>
      }
    >
      <DirectoryClient />
    </Suspense>
  )
}
