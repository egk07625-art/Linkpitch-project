'use client';

import Link from 'next/link';
import { Save, Send, Clock, Check, ChevronRight, Home } from 'lucide-react';

interface WorkspaceHeaderProps {
  prospectName?: string;
  currentStep: number;
  isSaving?: boolean;
  onSave?: () => void;
  onSend?: () => void;
  onHistoryToggle?: () => void;
  isHistoryOpen?: boolean;
}

const STEP_LABELS: Record<number, string> = {
  1: '진단',
  2: '설계',
  3: '확정',
};

export function WorkspaceHeader({
  prospectName,
  currentStep,
  isSaving = false,
  onSave,
  onSend,
  onHistoryToggle,
  isHistoryOpen = false,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex-shrink-0 h-14 px-6 flex items-center justify-between border-b border-white/[0.05] bg-black/60 backdrop-blur-xl">
      {/* 좌측: 로고 + Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* 홈 링크 (로고) - 순수 화이트 */}
        <Link
          href="/prospects"
          className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.1]
                    flex items-center justify-center text-white font-bold text-sm
                    hover:bg-white/[0.12] transition-all"
        >
          LP
        </Link>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/prospects"
            className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            <Home size={14} />
            <span className="hidden sm:inline">대시보드</span>
          </Link>
          <ChevronRight size={14} className="text-white/20" />
          <span className="text-white/70 font-medium">
            {prospectName || '고객사'}
          </span>
          <ChevronRight size={14} className="text-white/20" />
          <span className="text-white font-medium">
            Step {currentStep}: {STEP_LABELS[currentStep] || '편집'}
          </span>
        </nav>
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center gap-2">
        {/* 자동 저장 상태 */}
        <span className="text-xs text-white/40 flex items-center gap-1.5 px-2">
          {isSaving ? (
            <>
              <div className="w-2 h-2 border border-white/30 border-t-white/70 rounded-full animate-spin" />
              <span className="hidden sm:inline">저장 중...</span>
            </>
          ) : (
            <>
              <Check size={12} className="text-white/50" />
              <span className="hidden sm:inline text-white/40">자동 저장됨</span>
            </>
          )}
        </span>

        {/* 구분선 */}
        <div className="w-px h-5 bg-white/[0.08] mx-1" />

        {/* 히스토리 토글 */}
        {onHistoryToggle && (
          <button
            onClick={onHistoryToggle}
            className={`h-8 px-3 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
              isHistoryOpen
                ? 'bg-white/[0.1] text-white border-white/[0.15]'
                : 'border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
            }`}
          >
            <Clock size={14} />
            <span className="hidden sm:inline">히스토리</span>
          </button>
        )}

        {/* 임시 저장 버튼 */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="h-8 px-3 rounded-lg border border-white/[0.1] text-xs font-medium text-white/60
                       hover:bg-white/[0.05] hover:text-white transition-colors flex items-center gap-1.5
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            <span className="hidden sm:inline">저장</span>
          </button>
        )}

        {/* 발송 버튼 - 순수 화이트 */}
        {onSend && (
          <button
            onClick={onSend}
            className="h-8 px-4 rounded-lg bg-white text-black text-xs font-bold
                       hover:bg-white/90 transition-all flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>발송</span>
          </button>
        )}
      </div>
    </header>
  );
}
