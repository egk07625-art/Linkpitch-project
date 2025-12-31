'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Pencil, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CategoryInfo {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SubjectOptionsCompactProps {
  categories: Record<string, CategoryInfo>;
  subjectsByCategory: Record<string, string[]>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSubject: string;
  onSubjectSelect: (subject: string) => void;
  getDisplaySubject: (idx: number, original: string) => string;
  onSubjectEdit: (idx: number, newText: string) => void;
  currentStep: number;
  isCopied: boolean;
  onCopy: () => void;
}

export function SubjectOptionsCompact({
  categories,
  subjectsByCategory,
  activeCategory,
  onCategoryChange,
  selectedSubject,
  onSubjectSelect,
  getDisplaySubject,
  onSubjectEdit,
  currentStep,
  isCopied,
  onCopy,
}: SubjectOptionsCompactProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 현재 카테고리의 제목들
  const currentSubjects = subjectsByCategory[activeCategory] || [];
  const categoryKeys = Object.keys(categories);

  // 편집 모드 시작
  const startEditing = useCallback((idx: number, currentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIdx(idx);
    setEditValue(currentText);
  }, []);

  // 편집 완료
  const finishEditing = useCallback(() => {
    if (editingIdx !== null && editValue.trim()) {
      onSubjectEdit(editingIdx, editValue.trim());
      onSubjectSelect(editValue.trim());
    }
    setEditingIdx(null);
    setEditValue('');
  }, [editingIdx, editValue, onSubjectEdit, onSubjectSelect]);

  // 편집 취소
  const cancelEditing = useCallback(() => {
    setEditingIdx(null);
    setEditValue('');
  }, []);

  // 키보드 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  }, [finishEditing, cancelEditing]);

  // 편집 모드 진입 시 포커스
  useEffect(() => {
    if (editingIdx !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIdx]);

  // 키보드 접근성 핸들러 (펼치기/접기)
  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  }, [isExpanded]);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      {/* 헤더 - 선택된 제목 표시 */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleHeaderKeyDown}
        role="button"
        tabIndex={0}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="flex-shrink-0 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded">
            Step {currentStep}
          </span>
          <span className="text-sm text-gray-300 truncate">
            {selectedSubject || '제목을 선택하세요'}
          </span>
          {selectedSubject && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              ({selectedSubject.length}자)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 복사 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            disabled={!selectedSubject}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
              isCopied
                ? 'bg-emerald-500 text-white'
                : selectedSubject
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            )}
          >
            {isCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {isCopied ? '복사됨' : '복사'}
          </button>

          <ChevronDown
            size={18}
            className={cn(
              'text-gray-500 transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* 확장 영역 - 카테고리 탭 + 제목 리스트 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* 카테고리 탭 */}
            <div className="border-t border-gray-800 px-3 py-2 flex gap-1 overflow-x-auto no-scrollbar bg-gray-900/30">
              {categoryKeys.map((key) => {
                const category = categories[key];
                const Icon = category.icon;
                const isActive = activeCategory === key;
                const hasSubjects = (subjectsByCategory[key]?.length || 0) > 0;

                return (
                  <button
                    key={key}
                    onClick={() => onCategoryChange(key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{category.label}</span>
                    {hasSubjects && !isActive && (
                      <span className="px-1 py-0.5 rounded text-[10px] bg-gray-800 text-gray-500">
                        {subjectsByCategory[key]?.length || 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 제목 리스트 */}
            <div className="border-t border-gray-800 p-2 space-y-1 max-h-[280px] overflow-y-auto">
              {currentSubjects.length > 0 ? (
                currentSubjects.map((originalSubject, idx) => {
                  const displayText = getDisplaySubject(idx, originalSubject);
                  const isSelected = selectedSubject === displayText;
                  const isEditing = editingIdx === idx;
                  const isEdited = displayText !== originalSubject;

                  return (
                    <div
                      key={idx}
                      onClick={() => !isEditing && onSubjectSelect(displayText)}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                        isSelected
                          ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                          : 'hover:bg-gray-800/50 border-l-2 border-transparent'
                      )}
                    >
                      {/* 번호 */}
                      <span className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold',
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-gray-800 text-gray-500'
                      )}>
                        {idx + 1}
                      </span>

                      {/* 제목 텍스트/입력 */}
                      <div className="flex-1 min-w-0 max-w-[65%]">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              ref={inputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={finishEditing}
                              onKeyDown={handleKeyDown}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-gray-800 text-white text-sm px-2 py-1.5 rounded
                                         border border-cyan-500/50 focus:border-cyan-500
                                         focus:shadow-[0_0_0_2px_rgba(34,211,238,0.1)]
                                         outline-none transition-all"
                            />
                            <p className="text-[9px] text-gray-600 pl-1">
                              팁: 40자 이내 제목 권장
                            </p>
                          </div>
                        ) : (
                          <p
                            onClick={(e) => startEditing(idx, displayText, e)}
                            className={cn(
                              'text-sm truncate cursor-text hover:text-white transition-colors',
                              isSelected ? 'text-gray-200' : 'text-gray-400'
                            )}
                          >
                            {displayText}
                            {isEdited && (
                              <span className="ml-1.5 text-[9px] text-amber-500/70">
                                (수정됨)
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* 글자 수 + 편집 + 체크 */}
                      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        {isEditing ? (
                          <span className={cn(
                            'text-xs font-mono tabular-nums',
                            editValue.length > 60
                              ? 'text-red-400'
                              : editValue.length > 40
                                ? 'text-amber-400'
                                : 'text-gray-500'
                          )}>
                            {editValue.length}/60
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              {displayText.length}자
                            </span>
                            <button
                              onClick={(e) => startEditing(idx, displayText, e)}
                              className="p-1 rounded bg-gray-800/80 border border-gray-700/50
                                         opacity-0 group-hover:opacity-100 transition-opacity
                                         hover:bg-gray-700"
                            >
                              <Pencil size={10} className="text-gray-400" />
                            </button>
                          </>
                        )}

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-gray-600 text-sm">
                  이 카테고리에 제목이 없습니다
                </div>
              )}
            </div>

            {/* 하단 팁 */}
            <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/30">
              <p className="text-[11px] text-cyan-400/70">
                제목을 클릭하면 직접 수정할 수 있어요
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
