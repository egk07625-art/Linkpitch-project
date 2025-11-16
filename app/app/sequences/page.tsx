/**
 * @file app/app/sequences/page.tsx
 * @description 시퀀스 리스트 페이지
 *
 * 타겟(Prospect) 리스트와 시퀀스 진행 요약을 표시
 */

export default function SequencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시퀀스</h1>
        <p className="text-muted-foreground mt-2">
          타겟 리스트와 시퀀스 진행 상황을 확인하세요.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          시퀀스 리스트는 Week 6에서 구현 예정입니다.
        </p>
      </div>
    </div>
  );
}



