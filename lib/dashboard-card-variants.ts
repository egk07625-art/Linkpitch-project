import type { DashboardCardVariant } from "@/types/dashboard";

interface VariantStyle {
  container: string;
  value: string;
  badge: string;
  icon: string;
}

export const dashboardCardVariantMap: Record<DashboardCardVariant, VariantStyle> = {
  default: {
    container: "border-indigo-500/50 hover:border-indigo-500/70 bg-indigo-500/5",
    value: "text-zinc-50",
    badge: "bg-zinc-800 text-zinc-400",
    icon: "text-indigo-500",
  },
  success: {
    container: "border-emerald-500/50 hover:border-emerald-500/70 bg-emerald-500/5",
    value: "text-zinc-50",
    badge: "bg-zinc-800 text-zinc-400",
    icon: "text-emerald-500",
  },
  warning: {
    container: "border-amber-500/50 hover:border-amber-500/70 bg-amber-500/5",
    value: "text-zinc-50",
    badge: "bg-zinc-800 text-zinc-400",
    icon: "text-amber-500",
  },
  danger: {
    container: "border-rose-500/50 hover:border-rose-500/70 bg-rose-500/5",
    value: "text-zinc-50",
    badge: "bg-zinc-800 text-zinc-400",
    icon: "text-rose-500",
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
