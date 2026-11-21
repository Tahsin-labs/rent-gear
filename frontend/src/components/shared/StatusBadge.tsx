import React from "react";
import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/types";

interface StatusBadgeProps {
  status: RentalStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "PENDING":
    case "PLACED":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-300">
          {status}
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-300">
          {status}
        </Badge>
      );
    case "PAID":
      return (
        <Badge className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 border-purple-300">
          {status}
        </Badge>
      );
    case "ACTIVE":
    case "PICKED_UP":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-300">
          {status}
        </Badge>
      );
    case "COMPLETED":
    case "RETURNED":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {status}
        </Badge>
      );
    case "CANCELLED":
    case "FAILED":
      return (
        <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/30">
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
