import Link from "next/link";
import { CircleAlert } from "lucide-react";

import { getDashboardCardVariant } from "@/lib/dashboard-card-variants";
import { cn } from "@/lib/utils";
import type { DashboardCardProps } from "@/types/dashboard";

export function DashboardCard({
  id,
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: IconOverride,
  variant = "default",
  href,
  headingLevel = "h3",
  "aria-live": ariaLive = "off",
  "data-testid": dataTestId,
}: DashboardCardProps) {
  console.info("[DashboardCard] render", { title, variant });

  const variantStyle = getDashboardCardVariant(variant);
  const Icon = IconOverride ?? CircleAlert;
  const HeadingTag = headingLevel;
  const formattedValue = value ?? "—";
  const normalizedTrend = typeof trend === "number" ? trend : null;

  const cardContent = (
    <div
      className={cn(
        "bg-zinc-900 border rounded-sm p-4 transition-colors duration-150 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:ring-offset-0",
        "flex flex-col gap-4",
        variantStyle.container,
      )}
      data-card-variant={variant}
      data-testid={dataTestId ?? `dashboard-card-${id}`}
      aria-live={ariaLive}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <HeadingTag className="text-sm font-medium text-zinc-300 leading-none">
            {title}
          </HeadingTag>
          {description ? (
            <p className="text-xs text-zinc-500 leading-tight">{description}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950">
          <Icon className="h-5 w-5 text-zinc-400" aria-hidden />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p
          className={cn(
            "text-2xl font-semibold tracking-tight leading-none",
            variantStyle.value,
          )}
        >
          {formattedValue}
        </p>

        {normalizedTrend !== null ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-xs font-medium",
              variantStyle.badge,
            )}
          >
            {normalizedTrend > 0 ? "▲" : normalizedTrend < 0 ? "▼" : "—"}
            {Math.abs(normalizedTrend).toFixed(1)}%
            {trendLabel ? <span className="text-zinc-500">/ {trendLabel}</span> : null}
          </span>
        ) : null}
      </div>

      {href ? (
        <p className="text-xs text-indigo-400 underline-offset-4 hover:underline">
          자세히 보기 →
        </p>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-0"
        prefetch={false}
        aria-label={`${title} 카드 상세 보기`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

