import { AppShell } from "@/components/layout/app-shell";

export default function ProspectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
