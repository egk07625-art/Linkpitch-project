/**
 * @file app-shell.tsx
 * @description App Shell 래퍼 컴포넌트
 *
 * Header + Sidebar + MainContent를 포함하는 App Shell 레이아웃
 */

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}



