/**
 * @file app/r/[id]/page.tsx
 * @description 리포트 뷰 페이지
 *
 * Step별 마이크로 리포트 뷰 및 이벤트 로깅
 */

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">리포트</h1>
        <p className="text-muted-foreground mt-2">
          Report ID: {id}
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          리포트 페이지는 Week 8에서 구현 예정입니다.
        </p>
      </div>
    </div>
  );
}



