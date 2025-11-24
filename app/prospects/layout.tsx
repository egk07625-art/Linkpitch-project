import { AppHeader } from "@/components/layout/app-header";

export default function ProspectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AppHeader />
      {children}
    </div>
  );
}
