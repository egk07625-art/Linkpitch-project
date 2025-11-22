"use client";

import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Prospect {
  id: string;
  company: string;
  status: "hot" | "warm" | "cold";
  url: string;
  lastActive: string;
}

const DUMMY_PROSPECTS: Prospect[] = [
  {
    id: "1",
    company: "GrowUp",
    status: "hot",
    url: "https://growup.kr",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    company: "BrandX",
    status: "warm",
    url: "https://brandx.com",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    company: "StartA",
    status: "cold",
    url: "https://starta.io",
    lastActive: "3 days ago",
  },
];

const statusConfig = {
  hot: {
    label: "Hot",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  warm: {
    label: "Warm",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  cold: {
    label: "Cold",
    className: "bg-zinc-700 text-zinc-400 border-zinc-700",
  },
};

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function ProspectsTable() {
  if (DUMMY_PROSPECTS.length === 0) {
    return (
      <section className="rounded-lg border border-white/[0.03] bg-zinc-900/30 backdrop-blur-md overflow-hidden">
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl" />
            <div className="relative space-y-3 text-center">
              <p className="text-sm text-zinc-400">분석할 고객사가 없습니다</p>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
                <Link href="/prospects/new">분석 시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/[0.03] bg-zinc-900/30 backdrop-blur-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800/50 hover:bg-transparent">
            <TableHead className="text-xs text-zinc-500 font-medium">Company</TableHead>
            <TableHead className="text-xs text-zinc-500 font-medium">Status</TableHead>
            <TableHead className="text-xs text-zinc-500 font-medium">URL</TableHead>
            <TableHead className="text-xs text-zinc-500 font-medium">Last Active</TableHead>
            <TableHead className="text-xs text-zinc-500 font-medium w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DUMMY_PROSPECTS.map((prospect) => {
            const statusStyle = statusConfig[prospect.status];
            return (
              <TableRow
                key={prospect.id}
                className="border-zinc-800/50 hover:bg-zinc-800/30"
              >
                <TableCell className="font-medium text-zinc-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-zinc-800/80 text-zinc-300 text-sm font-semibold">
                      {getInitial(prospect.company)}
                    </div>
                    <span>{prospect.company}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full", statusStyle.className)}
                  >
                    {statusStyle.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={prospect.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="max-w-[200px] truncate">
                      {prospect.url}
                    </span>
                  </a>
                </TableCell>
                <TableCell className="text-zinc-400 text-sm">
                  {prospect.lastActive}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
