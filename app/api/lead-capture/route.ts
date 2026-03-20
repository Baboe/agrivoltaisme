import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

const leadsFile = path.join(process.cwd(), "data", "lead-capture.json")

type LeadType = "solarPark" | "farmer" | "landowner"

interface LeadRequest {
  type?: LeadType
  location?: string
  sizeHectares?: string
  vegetationType?: string
  email?: string
  flockSize?: string
  mobility?: string
  interest?: string
}

function normalize(value: unknown) {
  return String(value ?? "").trim()
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

function saveLead(entry: Record<string, string>) {
  const dir = path.dirname(leadsFile)
  fs.mkdirSync(dir, { recursive: true })

  const entries = fs.existsSync(leadsFile) ? JSON.parse(fs.readFileSync(leadsFile, "utf8")) : []
  entries.push(entry)
  fs.writeFileSync(leadsFile, JSON.stringify(entries, null, 2))
}

function validateByType(type: LeadType, entry: Record<string, string>) {
  if (!entry.location || !entry.email) {
    return "Location and contact email are required."
  }

  if (type === "solarPark" && (!entry.sizeHectares || !entry.vegetationType)) {
    return "Solar park leads require size and vegetation type."
  }

  if (type === "farmer" && (!entry.flockSize || !entry.mobility)) {
    return "Farmer leads require flock size and mobility details."
  }

  if (type === "landowner" && (!entry.sizeHectares || !entry.interest)) {
    return "Landowner leads require land size and interest details."
  }

  return ""
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadRequest
    const type = body.type

    if (!type || !["solarPark", "farmer", "landowner"].includes(type)) {
      return NextResponse.json({ error: "Lead type is required." }, { status: 400 })
    }

    const entry = {
      submittedAt: new Date().toISOString(),
      type,
      location: normalize(body.location),
      sizeHectares: normalize(body.sizeHectares),
      vegetationType: normalize(body.vegetationType),
      email: normalize(body.email),
      flockSize: normalize(body.flockSize),
      mobility: normalize(body.mobility),
      interest: normalize(body.interest),
    }

    const validationMessage = validateByType(type, entry)
    if (validationMessage) {
      return NextResponse.json({ error: validationMessage }, { status: 400 })
    }

    if (!isValidEmail(entry.email)) {
      return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 })
    }

    saveLead(entry)

    console.log("Lead captured", entry)

    return NextResponse.json({ message: "Lead captured" }, { status: 200 })
  } catch (error) {
    console.error("Lead capture error:", error)
    return NextResponse.json({ error: "Could not process the request." }, { status: 500 })
  }
}
