"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, AlertTriangle } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown";

  const errorMessages: Record<string, { title: string; message: string }> = {
    missing_token: {
      title: "Missing Verification Link",
      message: "The verification link appears to be incomplete. Please check your email and try clicking the link again.",
    },
    "Invalid or expired verification link": {
      title: "Invalid Link",
      message: "This verification link is invalid or has already been used. If you haven't verified your claim yet, please submit a new one.",
    },
    "This verification link has expired. Please submit a new claim.": {
      title: "Link Expired",
      message: "This verification link has expired (valid for 7 days). Please submit a new claim request.",
    },
    server_error: {
      title: "Something Went Wrong",
      message: "We encountered an error processing your verification. Please try again later or contact support.",
    },
    unknown: {
      title: "Verification Failed",
      message: "We couldn't verify your claim. Please try again or contact support if the problem persists.",
    },
  };

  const error = errorMessages[reason] || errorMessages.unknown;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            {reason === "server_error" ? (
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl text-gray-900">{error.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{error.message}</p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/directory">Browse Directory</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClaimErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
