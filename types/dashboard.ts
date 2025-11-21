import type { LucideIcon } from "lucide-react";

export type DashboardCardVariant = "default" | "success" | "warning" | "danger";

export interface DashboardCardData {
  id: string;
  title: string;
  value: string | number | null;
  description?: string;
  trend?: number | null;
  trendLabel?: string;
  icon?: LucideIcon;
  variant?: DashboardCardVariant;
  href?: string;
}

export interface DashboardCardProps extends DashboardCardData {
  "aria-live"?: "off" | "polite" | "assertive";
  headingLevel?: "h2" | "h3" | "p";
  "data-testid"?: string;
}

