/**
 * @file app/prospects/page.tsx
 * @description 고객사 목록 페이지
 *
 * 등록된 모든 고객사를 표시하고, 클릭 시 이메일 편집 페이지로 이동
 */

import { getProspects } from "@/app/actions/prospects";
import { ProspectsList } from "@/components/prospects/prospects-list";

export default async function ProspectsPage() {
  let prospects = [];
  
  try {
    prospects = await getProspects();
  } catch (error) {
    console.error("Failed to fetch prospects:", error);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-zinc-50">고객사 관리</h1>
        <p className="mt-2 text-sm text-zinc-400">
          등록된 고객사를 관리하고 이메일을 편집하세요.
        </p>
      </header>
      <ProspectsList prospects={prospects} />
    </div>
  );
}

