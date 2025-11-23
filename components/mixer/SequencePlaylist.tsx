'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bot, Sparkles, Copy, Download } from 'lucide-react';
import { VisionItem } from '@/types/vision';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SequencePlaylistProps {
  droppedInsights: VisionItem[];
  onRemove: (id: string) => void;
  currentStep?: number;
}

// ViewToggle Component
function ViewToggle({ 
  activeMode, 
  onToggle 
}: { 
  activeMode: 'email' | 'report'; 
  onToggle: (mode: 'email' | 'report') => void;
}) {
  return (
    <div className="bg-zinc-900/80 p-1 rounded-lg inline-flex gap-1">
      <button
        onClick={() => onToggle('email')}
        className={cn(
          "relative px-4 py-2 rounded-md text-xs font-medium transition-all duration-200",
          activeMode === 'email'
            ? "text-zinc-900"
            : "text-zinc-400 hover:text-zinc-200"
        )}
      >
        {activeMode === 'email' && (
          <motion.div
            layoutId="activeViewTab"
            className="absolute inset-0 bg-white rounded-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Mail className="w-3 h-3" />
          메일 본문
        </span>
      </button>

      <button
        onClick={() => onToggle('report')}
        className={cn(
          "relative px-4 py-2 rounded-md text-xs font-medium transition-all duration-200",
          activeMode === 'report'
            ? "text-zinc-900"
            : "text-zinc-400 hover:text-zinc-200"
        )}
      >
        {activeMode === 'report' && (
          <motion.div
            layoutId="activeViewTab"
            className="absolute inset-0 bg-white rounded-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Bot className="w-3 h-3" />
          AI 리포트 구성
        </span>
      </button>
    </div>
  );
}

// EmailEditorCard Component
function EmailEditorCard() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      {/* Subject */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">
          제목
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="이메일 제목을 입력하세요..."
          className="w-full bg-transparent border-b border-zinc-800 text-2xl font-semibold text-white placeholder:text-zinc-700 outline-none pb-4 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Body */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">
          본문
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="이메일 내용을 작성하세요...&#10;&#10;안녕하세요,&#10;&#10;최근 귀사의 성과를 보고..."
          className="w-full h-[600px] bg-transparent text-base text-zinc-200 placeholder:text-zinc-700 outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

// Main Component
export default function SequencePlaylist({ 
  droppedInsights, 
  onRemove,
  currentStep = 1 
}: SequencePlaylistProps) {
  const [viewMode, setViewMode] = useState<'email' | 'report'>('report');
  const [reportContent, setReportContent] = useState('');

  return (
    // Root: Full height container
    <div className="flex flex-col h-full w-full">
      
      {/* A. Fixed Header (Toggle) */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-zinc-800/50 bg-zinc-950 flex justify-center">
        <ViewToggle activeMode={viewMode} onToggle={setViewMode} />
      </div>

      {/* B. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        
        {viewMode === 'report' ? (
          // REPORT MODE - 넓게 펼쳐진 레이아웃
          <div className="w-full max-w-5xl mx-auto p-8">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                <Sparkles className="size-5 text-indigo-400" />
                AI 생성 리포트
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  <Copy className="size-3 mr-2" />
                  복사
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  <Download className="size-3 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>

            {/* Textarea Container */}
            <div className="w-full">
              <textarea 
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="w-full h-[700px] bg-transparent border border-zinc-800/50 rounded-xl p-6 resize-none outline-none text-zinc-300 leading-relaxed placeholder:text-zinc-700 focus:border-indigo-500/50 transition-colors"
                placeholder="좌측에서 인사이트 칩을 드래그하여 놓으면, AI가 이곳에 리포트 초안을 작성합니다..."
              />
            </div>
          </div>
        ) : (
          // EMAIL MODE
          <EmailEditorCard />
        )}

      </div>
    </div>
  );
}
