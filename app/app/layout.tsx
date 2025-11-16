/**
 * @file app/app/layout.tsx
 * @description App 내부 페이지 공통 레이아웃
 *
 * App Shell (Header + Sidebar + MainContent)를 제공하는 레이아웃
 */

import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}



