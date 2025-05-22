import type { NextRequest } from "next/server"

export function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization")

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("token")
}
