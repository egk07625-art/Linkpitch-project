/**
 * @file app/app/page.tsx
 * @description 대시보드 페이지 - 6-KPI Premium Layout with Real Data
 */

import { getDashboardKPIs } from "@/actions/dashboard";
import { getProspectsCampaignStats } from "@/actions/prospects";
import { getProspects } from "@/app/actions/prospects";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  // 병렬로 데이터 조회
  const [kpiResult, prospects] = await Promise.all([
    getDashboardKPIs(),
    getProspects({ limit: 10 }),
  ]);

  const kpis = kpiResult.data;

  // 캠페인 통계 데이터 조회 (N+1 문제 방지를 위해 일괄 조회)
  const prospectIds = prospects.map((p) => p.id);
  const campaignStatsResult = await getProspectsCampaignStats(prospectIds);
  const campaignStats = campaignStatsResult.data || {};

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-zinc-50">대시보드</h1>
        <p className="mt-2 text-sm text-zinc-400">
          오늘 보낼 메일과 KPI를 한 눈에 확인하세요.
        </p>
      </header>

      <DashboardClient
        kpis={kpis}
        initialProspects={prospects}
        campaignStats={campaignStats}
      />
    </div>
  );
}
