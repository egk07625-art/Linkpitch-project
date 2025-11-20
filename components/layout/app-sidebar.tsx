/**
 * @file app-sidebar.tsx
 * @description App 내부 페이지용 Side Navigation 컴포넌트
 *
 * 대시보드, 시퀀스, 보낸 메일, 설정 등의 네비게이션 메뉴
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  List,
  Mail,
  FileText,
  Settings,
} from "lucide-react";

const navigationItems = [
  {
    name: "대시보드",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    name: "시퀀스",
    href: "/app/sequences",
    icon: List,
  },
  {
    name: "보낸 메일",
    href: "/app/sent",
    icon: Mail,
  },
  {
    name: "로그",
    href: "/app/logs",
    icon: FileText,
  },
  {
    name: "설정",
    href: "/app/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
















