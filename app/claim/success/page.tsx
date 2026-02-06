import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Verified | Ombaa",
  description: "Your listing claim has been verified successfully.",
};

export default function ClaimSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Claim Verified!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your email has been verified and your listing claim is now active.
          </p>
          <p className="text-sm text-gray-500">
            Your listing now shows a "Claimed" badge. You'll receive updates about your listing performance.
          </p>
          <div className="pt-4">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/directory">Browse Directory</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
