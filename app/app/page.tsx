/**
 * @file app/app/page.tsx
 * @description 대시보드 페이지
 *
 * 메인 대시보드 - 오늘 보낼 메일, 최근 생성 이력 등 표시
 */

import { Flame, Send, Target, Timer } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import type { DashboardCardData } from "@/types/dashboard";

const dashboardCards: DashboardCardData[] = [
  {
    id: "prospects",
    title: "관리 중인 타겟",
    value: 12,
    description: "현재 공략하고 있는 잠재 고객사",
    trend: 8.4,
    trendLabel: "지난 7일",
    icon: Target,
    variant: "default",
    href: "/prospects",
  },
  {
    id: "hot-leads",
    title: "당장 연락할 곳🔥",
    value: 3,
    description: "제안서를 꼼꼼히 정독한 고객",
    trend: 2.1,
    trendLabel: "지난 24시간",
    icon: Flame,
    variant: "danger",
    href: "/dashboard",
  },
  {
    id: "steps-sent",
    title: "이번 주 활동량",
    value: 18,
    description: "최근 7일간 보낸 콜드메일",
    trend: 5.6,
    trendLabel: "지난 7일",
    icon: Send,
    variant: "success",
    href: "/sent",
  },
  {
    id: "avg-response",
    title: "평균 열람 시간",
    value: "2.1h",
    description: "고객이 리포트에 머무른 시간",
    trend: -4.3,
    trendLabel: "vs 이전",
    icon: Timer,
    variant: "warning",
    href: "/logs",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-zinc-50">대시보드</h1>
        <p className="mt-2 text-sm text-zinc-400">
          오늘 보낼 메일과 KPI를 한 눈에 확인하세요.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} {...card} />
        ))}
      </section>

      <section className="rounded-sm border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">최근 생성 이력</h2>
        <p className="mt-2 text-sm text-zinc-500">아직 생성된 이력이 없습니다.</p>
      </section>
    </div>
  );
}
















