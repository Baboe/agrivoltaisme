import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

const requestsFile = path.join(process.cwd(), "data", "assessment-requests.json")

interface AssessmentRequestBody {
  companyName?: string
  contactName?: string
  email?: string
  phone?: string
  siteLocation?: string
  approximateHectares?: string
  currentVegetationMethod?: string
  notes?: string
}

function normalize(value: unknown) {
  return String(value ?? "").trim()
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

function persistRequest(entry: Record<string, string>) {
  const directory = path.dirname(requestsFile)
  fs.mkdirSync(directory, { recursive: true })

  const existingEntries = fs.existsSync(requestsFile)
    ? JSON.parse(fs.readFileSync(requestsFile, "utf8"))
    : []

  existingEntries.push(entry)
  fs.writeFileSync(requestsFile, JSON.stringify(existingEntries, null, 2))
}

async function sendNotificationEmail(entry: Record<string, string>) {
  const to = process.env.ASSESSMENT_TO_EMAIL || "info@ombaa.com"
  const from = process.env.FROM_EMAIL || "info@ombaa.com"
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return false
  }

  const nodemailer = require("nodemailer")
  const transporter = nodemailer.createTransport({
    host,
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    replyTo: entry.email,
    subject: `Ombaa assessment request from ${entry.companyName}`,
    text: [
      `Company: ${entry.companyName}`,
      `Contact: ${entry.contactName}`,
      `Email: ${entry.email}`,
      `Phone: ${entry.phone || "Not provided"}`,
      `Site location: ${entry.siteLocation}`,
      `Approximate hectares: ${entry.approximateHectares || "Not provided"}`,
      `Current vegetation management: ${entry.currentVegetationMethod || "Not provided"}`,
      "",
      "Notes:",
      entry.notes || "No additional notes provided.",
    ].join("\n"),
  })

  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AssessmentRequestBody

    const entry = {
      submittedAt: new Date().toISOString(),
      companyName: normalize(body.companyName),
      contactName: normalize(body.contactName),
      email: normalize(body.email),
      phone: normalize(body.phone),
      siteLocation: normalize(body.siteLocation),
      approximateHectares: normalize(body.approximateHectares),
      currentVegetationMethod: normalize(body.currentVegetationMethod),
      notes: normalize(body.notes),
    }

    if (!entry.companyName || !entry.contactName || !entry.email || !entry.siteLocation) {
      return NextResponse.json(
        {
          error: "Company, contact name, work email, and site location are required.",
        },
        { status: 400 },
      )
    }

    if (!isValidEmail(entry.email)) {
      return NextResponse.json({ error: "Enter a valid work email address." }, { status: 400 })
    }

    persistRequest(entry)

    try {
      await sendNotificationEmail(entry)
    } catch (emailError) {
      console.error("Assessment request email notification failed:", emailError)
    }

    console.log("=== Ombaa assessment request ===")
    console.log(entry)
    console.log("================================")

    return NextResponse.json(
      {
        message: "Assessment request received successfully.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing assessment request:", error)
    return NextResponse.json(
      {
        error: "Could not process the request. Please try again.",
      },
      { status: 500 },
    )
  }
}
