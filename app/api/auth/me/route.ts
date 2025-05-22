import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request)

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Call the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to fetch user data" }, { status: response.status })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
