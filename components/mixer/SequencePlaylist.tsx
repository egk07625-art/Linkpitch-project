'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bot, Sparkles } from 'lucide-react';
import { VisionItem } from '@/types/vision';
import { SCENARIO_STEPS } from '@/lib/constants/scenario-steps';
import { cn } from '@/lib/utils';

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

// Main Component
export default function SequencePlaylist({ 
  droppedInsights, 
  onRemove,
  currentStep = 1 
}: SequencePlaylistProps) {
  const [viewMode, setViewMode] = useState<'email' | 'report'>('report');
  const [emailBody, setEmailBody] = useState('');
  const [reportContent, setReportContent] = useState('');

  const currentScenario = SCENARIO_STEPS.find(s => s.step === currentStep) || SCENARIO_STEPS[0];

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
            
            {/* Container Box */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 min-h-[700px] flex flex-col">
              
              {/* Toolbar */}
              <div className="mb-6 pb-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="size-5 text-indigo-400" />
                  AI 생성 리포트
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Step {currentStep}. {currentScenario.subtitle} - {currentScenario.title}
                </p>
              </div>

              {/* Textarea Container */}
              <div className="flex-1">
                <textarea 
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full h-full bg-transparent resize-none outline-none text-zinc-300 leading-relaxed placeholder:text-zinc-700"
                  placeholder="좌측에서 인사이트 칩을 드래그하여 놓으면, AI가 이곳에 리포트 초안을 작성합니다..."
                />
              </div>
            </div>
          </div>
        ) : (
          // EMAIL MODE - 리포트와 동일한 디자인
          <div className="w-full max-w-5xl mx-auto p-8">
            
            {/* Container Box */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 min-h-[700px] flex flex-col">
              
              {/* Toolbar */}
              <div className="mb-6 pb-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <Mail className="size-5 text-indigo-400" />
                  메일 초안
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Step {currentStep}. {currentScenario.subtitle} - {currentScenario.title}
                </p>
              </div>

              {/* Email Content */}
              <div className="flex-1">
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="AI가 분석한 내용을 바탕으로 메일 초안이 자동 생성됩니다..."
                  className="w-full h-full bg-transparent resize-none outline-none text-zinc-300 leading-relaxed placeholder:text-zinc-700"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
