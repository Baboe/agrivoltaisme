import { Badge } from "@/components/ui/badge";

interface ClaimedBadgeProps {
  className?: string;
}

export default function ClaimedBadge({ className }: ClaimedBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={`bg-green-50 text-green-700 border-green-200 font-normal ${className || ''}`}
    >
      Claimed
    </Badge>
  );
}
