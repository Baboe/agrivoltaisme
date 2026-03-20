import type { Metadata } from "next"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "Solar grazing and agrivoltaics in Europe | Ombaa",
  description:
    "Ombaa helps solar park owners, farmers, and landowners find agrivoltaic and solar grazing opportunities across Europe.",
  alternates: { canonical: "https://ombaa.com/" },
}

export default function Home() {
  return <HomeClient />
}
