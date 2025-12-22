import type { Metadata } from "next";
import DirectoryClient from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Solar Grazing Directory – Ombaa",
  description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  alternates: { canonical: "https://ombaa.com/directory" },
  openGraph: {
    title: "Solar Grazing Directory – Ombaa",
    description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
    url: "https://ombaa.com/directory",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar Grazing Directory – Ombaa",
    description: "Browse shepherds and solar farms across Netherlands, Belgium, France, and Germany in the Ombaa directory.",
  },
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
