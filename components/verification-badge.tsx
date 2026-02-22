import { Badge } from "@/components/ui/badge";
import { AlertCircle, HelpCircle } from "lucide-react";

interface VerificationBadgeProps {
  variant?: "not-verified" | "unknown" | "estimated";
  className?: string;
}

export function VerificationBadge({ variant = "not-verified", className = "" }: VerificationBadgeProps) {
  const variants = {
    "not-verified": {
      text: "Not verified",
      icon: AlertCircle,
      style: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    "unknown": {
      text: "Unknown",
      icon: HelpCircle,
      style: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
    },
    "estimated": {
      text: "Estimated",
      icon: AlertCircle,
      style: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
  };

  const { text, icon: Icon, style } = variants[variant];

  return (
    <Badge variant="outline" className={`text-xs font-normal ${style} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {text}
    </Badge>
  );
}

// Helper functions to detect placeholder/unknown values
export function isUnknownValue(value: string | null | undefined): boolean {
  if (!value) return true;
  return value === "unknown" || value === "Unknown";
}

export function isPlaceholderHectares(hectares: number): boolean {
  // Common placeholder values that appear in the data
  return [15, 7, 10, 20].includes(hectares);
}

export function isPlaceholderFlockSize(size: number): boolean {
  // 250 is the most common placeholder value in sheep farm data
  return size === 250;
}

export function isDefaultVegetation(type: string): boolean {
  return type === "Mixed grass";
}

export function isDefaultBreed(breed: string): boolean {
  return breed === "Texel";
}

export function isDefaultGrazingType(type: string): boolean {
  return type === "Mixed grazing";
}

// Format display value with verification badge inline
interface VerifiedValueProps {
  value: string | number | null | undefined;
  isPlaceholder?: boolean;
  isUnknown?: boolean;
  unit?: string;
  fallback?: string;
}

export function formatVerifiedValue({
  value,
  isPlaceholder = false,
  isUnknown = false,
  unit = "",
  fallback = "Unknown",
}: VerifiedValueProps): { display: string; needsBadge: boolean; badgeVariant: "not-verified" | "unknown" | "estimated" } {
  if (value === null || value === undefined || value === "" || value === "unknown") {
    return { display: fallback, needsBadge: true, badgeVariant: "unknown" };
  }
  
  if (isUnknown) {
    return { display: String(value), needsBadge: true, badgeVariant: "unknown" };
  }
  
  if (isPlaceholder) {
    return { display: `${value}${unit}`, needsBadge: true, badgeVariant: "not-verified" };
  }
  
  return { display: `${value}${unit}`, needsBadge: false, badgeVariant: "not-verified" };
}
