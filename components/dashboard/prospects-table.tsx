"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Prospect, CRMStatus, CampaignStats } from "@/types/prospect";

interface ProspectsTableProps {
  prospects: Prospect[];
  filterStatus?: "hot" | "warm" | "all";
  limit?: number;
  showViewAll?: boolean;
  campaignStats?: Record<string, CampaignStats>;
}

const statusConfig: Record<CRMStatus, { label: string; className: string }> = {
  hot: {
    label: "Hot",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  warm: {
    label: "Warm",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  cold: {
    label: "Cold",
    className: "bg-zinc-700 text-zinc-400 border-zinc-700",
  },
};

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function formatLastActive(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  } catch {
    return "-";
  }
}

export function ProspectsTable({
  prospects,
  filterStatus,
  limit,
  showViewAll = true,
  campaignStats = {},
}: ProspectsTableProps) {
  const router = useRouter();

  // 필터링 적용
  let filteredProspects = [...prospects];
  if (filterStatus === "hot") {
    filteredProspects = filteredProspects.filter((p) => p.crm_status === "hot");
  } else if (filterStatus === "warm") {
    filteredProspects = filteredProspects.filter(
      (p) => p.crm_status === "warm" || p.crm_status === "hot",
    );
  }

  // HOT 고객을 최상단에 정렬
  const sortedProspects = filteredProspects.sort((a, b) => {
    const statusOrder: Record<CRMStatus, number> = { hot: 0, warm: 1, cold: 2 };
    return statusOrder[a.crm_status] - statusOrder[b.crm_status];
  });

  // 제한 적용
  const displayedProspects = limit
    ? sortedProspects.slice(0, limit)
    : sortedProspects;

  if (displayedProspects.length === 0) {
    return (
      <section className="glass-panel gradient-border rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
            <div className="relative space-y-3 text-center">
              <p className="text-sm text-zinc-400">분석할 고객사가 없습니다</p>
              <Button asChild className="premium-button shadow-lg shadow-amber-500/20">
                <Link href="/app/create">분석 시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 다음 일정 포맷팅 헬퍼
  function formatNextSchedule(daysUntilNext: number | null): string {
    if (daysUntilNext === null) return "일정 없음";
    if (daysUntilNext === 0) return "오늘";
    if (daysUntilNext === 1) return "내일";
    return `${daysUntilNext}일 후`;
  }

  // 날짜 포맷팅 헬퍼 (예: "12월 7일")
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}월 ${day}일`;
    } catch {
      return "";
    }
  }

  // 마지막 활동 포맷팅
  function formatLastSent(lastSentAt: string | null | undefined): string {
    if (!lastSentAt) return "-";
    try {
      return formatDistanceToNow(new Date(lastSentAt), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return "-";
    }
  }

  return (
    <section className="rounded-lg border border-white/[0.03] bg-zinc-900/30 backdrop-blur-md overflow-hidden">
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">
            {filterStatus === "hot"
              ? "당장 연락할 곳"
              : filterStatus === "warm"
                ? "우선순위 고객"
                : "우선순위 고객"}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {displayedProspects.length}개의 고객사
            {filterStatus && ` (${filterStatus === "hot" ? "Hot" : "Hot/Warm"}만 표시)`}
          </p>
        </div>
        {showViewAll && (
          <Button asChild variant="outline" size="sm">
            <Link href="/prospects">모두 보기</Link>
          </Button>
        )}
      </div>

      {/* Grid 헤더 */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#333] bg-[#161618] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
        <div className="col-span-3">회사 정보</div>
        <div className="col-span-2">담당자</div>
        <div className="col-span-2">연락처</div>
        <div className="col-span-3">캠페인 활동</div>
        <div className="col-span-1 text-center">상태</div>
        <div className="col-span-1 text-right">관리</div>
      </div>

      {/* Grid 데이터 행 */}
      <div className="divide-y divide-[#2C2C2E]">
        {displayedProspects.map((prospect) => {
          const statusStyle = statusConfig[prospect.crm_status];
          const displayUrl = prospect.url || "";
          const displayName = prospect.store_name || prospect.name;
          const stats = campaignStats[prospect.id] || {
            sentCount: 0,
            nextScheduleDate: null,
            daysUntilNext: null,
            progress: 0,
          };

          // 마지막으로 보낸 메일 날짜 계산 (임시로 stats에서 가져오거나 prospect의 last_activity_at 사용)
          const lastSent = stats.nextScheduleDate
            ? new Date(stats.nextScheduleDate).getTime() - stats.daysUntilNext! * 24 * 60 * 60 * 1000
            : null;

          return (
            <div
              key={prospect.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-[#2C2C2E] hover:bg-[#1C1C1E] transition-all group cursor-pointer"
              onClick={() => {
                router.push(`/prospects/${prospect.id}/mix`);
              }}
            >
              {/* 1. 회사 정보 (3칸) */}
              <div className="col-span-3 flex flex-col justify-center overflow-hidden">
                <div className="text-base font-bold text-white mb-1 truncate">{displayName}</div>
                {displayUrl ? (
                  <a
                    href={displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-blue-400 truncate transition-colors block w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {displayUrl.replace(/^https?:\/\//, "").substring(0, 40)}
                    {displayUrl.length > 40 ? "..." : ""}
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">-</span>
                )}
              </div>

              {/* 2. 담당자 (2칸) */}
              <div className="col-span-2 flex items-center gap-3 overflow-hidden">
                {/* 아바타: 이니셜로 깔끔하게 */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-xs font-bold text-gray-400 border border-[#333]">
                  {prospect.contact_name
                    ? getInitial(prospect.contact_name)
                    : getInitial(displayName)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {prospect.contact_name || "-"}
                  </span>
                  {prospect.category && (
                    <span className="text-[11px] text-gray-500 truncate">{prospect.category}</span>
                  )}
                </div>
              </div>

              {/* 3. 연락처 (2칸) - 로고 삭제 & 폰트 정리 */}
              <div className="col-span-2 flex flex-col justify-center overflow-hidden">
                {prospect.contact_email ? (
                  <span
                    className="text-sm text-gray-400 font-mono tracking-tight truncate hover:text-white transition-colors cursor-pointer"
                    title="메일 복사하기"
                  >
                    {prospect.contact_email}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </div>

              {/* 4. 캠페인 활동 (3칸) - 정보 밀도 최적화 */}
              <div className="col-span-3 flex items-center gap-4">
                {/* SENT */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold mb-0.5">SENT</span>
                  <div className="flex items-center gap-1.5">
                    {/* 종이비행기 아이콘 작게 */}
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span className="text-sm font-bold text-white">{stats.sentCount}회</span>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="w-[1px] h-6 bg-[#333]"></div>

                {/* NEXT */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-blue-400 font-bold mb-0.5">NEXT</span>
                  <div className="flex items-center gap-2">
                    {stats.nextScheduleDate ? (
                      <>
                        <span className="text-sm font-medium text-gray-300">
                          {formatDate(stats.nextScheduleDate)}
                        </span>
                        {stats.daysUntilNext !== null && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                            D-{stats.daysUntilNext}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-500">일정 없음</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. 상태 (독립된 컬럼 - 중앙 정렬) */}
              <div className="col-span-1 flex justify-center">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-[0_0_10px_rgba(10,132,255,0.1)]",
                    statusStyle.className === "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                      : statusStyle.className === "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-1.5",
                      statusStyle.className === "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        ? "bg-rose-400 animate-pulse"
                        : statusStyle.className === "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          ? "bg-amber-400 animate-pulse"
                          : "bg-blue-400 animate-pulse"
                    )}
                  ></div>
                  {statusStyle.label}
                </span>
              </div>

              {/* 6. 관리 (1칸) - 우측 정렬 (이제 튀어나가지 않음) */}
              <div className="col-span-1 flex justify-end">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: 드롭다운 메뉴 구현
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
