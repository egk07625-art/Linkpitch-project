/**
 * @file app/app/page.tsx
 * @description 대시보드 페이지
 *
 * 메인 대시보드 - 오늘 보낼 메일, 최근 생성 이력 등 표시
 */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-2">
          오늘 보낼 메일과 최근 활동을 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">오늘 보낼 메일</h2>
          <p className="text-2xl font-bold mt-2">0건</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">이번 달 생성</h2>
          <p className="text-2xl font-bold mt-2">0건</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">진행 중인 시퀀스</h2>
          <p className="text-2xl font-bold mt-2">0건</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">최근 생성 이력</h2>
        <p className="text-muted-foreground">아직 생성된 이력이 없습니다.</p>
      </div>
    </div>
  );
}
















