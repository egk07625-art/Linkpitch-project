"use client";

import { useState } from "react";
import { ProspectsTable } from "@/components/dashboard/prospects-table";
import { DashboardKPISection } from "@/components/dashboard/dashboard-kpi-section";
import type { DashboardKPIs } from "@/actions/dashboard";
import type { Prospect, CampaignStats } from "@/types/prospect";

interface DashboardClientProps {
  kpis: DashboardKPIs | null;
  initialProspects: Prospect[];
  campaignStats?: Record<string, CampaignStats>;
}

export function DashboardClient({
  kpis,
  initialProspects,
  campaignStats = {},
}: DashboardClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    "hot" | "warm" | "all" | null
  >(null);

  // 필터링된 고객사 목록
  const filteredProspects =
    selectedFilter === "hot"
      ? initialProspects.filter((p) => p.crm_status === "hot")
      : selectedFilter === "warm"
        ? initialProspects.filter(
            (p) => p.crm_status === "warm" || p.crm_status === "hot",
          )
        : initialProspects;

  // 필터링된 prospect에 대한 캠페인 통계만 필터링
  const filteredCampaignStats: Record<string, CampaignStats> = {};
  filteredProspects.forEach((prospect) => {
    if (campaignStats[prospect.id]) {
      filteredCampaignStats[prospect.id] = campaignStats[prospect.id];
    }
  });

  return (
    <>
      <DashboardKPISection
        kpis={kpis}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <ProspectsTable
        prospects={filteredProspects}
        filterStatus={selectedFilter || undefined}
        limit={selectedFilter ? undefined : 5}
        showViewAll={true}
        campaignStats={filteredCampaignStats}
      />
    </>
  );
}

