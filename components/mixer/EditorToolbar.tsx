'use client';

import { ReactNode } from 'react';
import { Eye, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SegmentedControl } from './SegmentedControl';

// 공통 버튼 스타일 토큰 (화이트톤)
export const toolbarButtonStyles = {
  // 기본 버튼
  base: 'h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 active:scale-[0.97]',
  // 비활성 상태
  inactive: 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700',
  // 활성 상태 (강조)
  active: 'bg-zinc-900 text-white border border-zinc-900 shadow-sm',
  // 활성 컬러 (화이트톤 기반)
  activeColor: {
    default: 'bg-zinc-900 text-white border border-zinc-900 shadow-sm',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    blue: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
  },
};

export type ViewMode = 'split' | 'preview';
export type ContentType = 'email' | 'report';

interface EditorToolbarProps {
  // 필수 props (타이틀은 SegmentedControl에 통합됨)
  title?: string;
  icon?: ReactNode;
  emailIcon?: ReactNode;
  reportIcon?: ReactNode;

  // 뷰 모드
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;

  // 콘텐츠 타입 (이메일/리포트 토글)
  contentType?: ContentType;
  onContentTypeChange?: (type: ContentType) => void;
  showContentTypeToggle?: boolean;

  // 추가 버튼들 (왼쪽 그룹에 추가)
  leftButtons?: ReactNode;

  // 추가 버튼들 (오른쪽 그룹)
  rightButtons?: ReactNode;

  // 스타일
  className?: string;
}

export function EditorToolbar({
  title,
  icon,
  emailIcon,
  reportIcon,
  viewMode,
  onViewModeChange,
  contentType = 'email',
  onContentTypeChange,
  showContentTypeToggle = true,
  leftButtons,
  rightButtons,
  className = '',
}: EditorToolbarProps) {
  return (
    <div className={cn(
      'flex items-center justify-between w-full px-4 py-2.5',
      'border-b border-zinc-200 bg-zinc-50 shrink-0',
      className
    )}>
      {/* 왼쪽 그룹: 모드 토글 + 뷰 모드 */}
      <div className="flex items-center gap-4">
        {/* Email/Report 세그먼트 토글 (타이틀 통합) */}
        {showContentTypeToggle && onContentTypeChange && (
          <SegmentedControl
            segments={[
              { 
                id: 'email', 
                label: 'Email', 
                icon: emailIcon || (contentType === 'email' ? icon : undefined)
              },
              { 
                id: 'report', 
                label: 'REPORT', 
                icon: reportIcon || (contentType === 'report' ? icon : undefined)
              },
            ]}
            value={contentType}
            onChange={(v) => onContentTypeChange(v as ContentType)}
          />
        )}

        {/* 구분선 */}
        {showContentTypeToggle && (
          <div className="w-px h-5 bg-zinc-200" />
        )}

        {/* 뷰 모드 토글 (분할/프리뷰) */}
        <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange('split')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              viewMode === 'split'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
            )}
          >
            <Columns size={12} />
            분할
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              viewMode === 'preview'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
            )}
          >
            <Eye size={12} />
            프리뷰
          </button>
        </div>

        {/* 추가 왼쪽 버튼들 */}
        {leftButtons}
      </div>

      {/* 오른쪽 그룹: 추가 버튼 */}
      <div className="flex items-center gap-2">
        {rightButtons}
      </div>
    </div>
  );
}

// 유틸리티: 툴바 버튼 컴포넌트
interface ToolbarButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  variant?: 'default' | 'primary';
  disabled?: boolean;
  className?: string;
}

export function ToolbarButton({
  onClick,
  icon,
  label,
  isActive = false,
  variant = 'default',
  disabled = false,
  className = '',
}: ToolbarButtonProps) {
  const getButtonClass = () => {
    if (disabled) {
      return cn(toolbarButtonStyles.base, 'bg-white/50 text-zinc-400 border border-zinc-200 cursor-not-allowed');
    }
    if (variant === 'primary') {
      return cn(toolbarButtonStyles.base, toolbarButtonStyles.activeColor.blue);
    }
    if (isActive) {
      return cn(toolbarButtonStyles.base, toolbarButtonStyles.activeColor.emerald);
    }
    return cn(toolbarButtonStyles.base, toolbarButtonStyles.inactive);
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(getButtonClass(), className)}
    >
      {icon}
      {label}
    </button>
  );
}
