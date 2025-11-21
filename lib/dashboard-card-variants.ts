import type { DashboardCardVariant } from "@/types/dashboard";

interface VariantStyle {
  container: string;
  value: string;
  badge: string;
}

export const dashboardCardVariantMap: Record<DashboardCardVariant, VariantStyle> = {
  default: {
    container: "border-zinc-800 hover:border-zinc-700",
    value: "text-zinc-50",
    badge: "bg-zinc-800 text-zinc-400",
  },
  success: {
    container: "border-emerald-500/40 hover:border-emerald-500/60",
    value: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
  },
  warning: {
    container: "border-amber-500/40 hover:border-amber-500/60",
    value: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
  },
  danger: {
    container: "border-rose-500/40 hover:border-rose-500/60",
    value: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-400",
  },
};

export const getDashboardCardVariant = (
  variant: DashboardCardVariant | undefined,
): VariantStyle => {
  if (!variant) {
    return dashboardCardVariantMap.default;
  }

  return dashboardCardVariantMap[variant];
};

