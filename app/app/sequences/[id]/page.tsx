/**
 * @file app/app/sequences/[id]/page.tsx
 * @description 시퀀스 상세 페이지
 *
 * 특정 타겟의 Step 히스토리를 표시
 */

interface SequenceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SequenceDetailPage({
  params,
}: SequenceDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시퀀스 상세</h1>
        <p className="text-muted-foreground mt-2">
          Sequence ID: {id}
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          시퀀스 상세 페이지는 Week 6에서 구현 예정입니다.
        </p>
      </div>
    </div>
  );
}
















