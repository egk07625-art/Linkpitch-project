/**
 * @file app-header.tsx
 * @description App 내부 페이지용 Top Header 컴포넌트
 *
 * Logo와 User 메뉴를 포함하는 헤더 컴포넌트
 */

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b">
      <Link href="/app" className="text-2xl font-bold">
        Linkpitch
      </Link>
      <div className="flex items-center">
        <UserButton />
      </div>
    </header>
  );
}



