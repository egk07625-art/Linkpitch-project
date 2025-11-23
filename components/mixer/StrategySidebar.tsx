'use client';

import React, { useState } from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { STRATEGY_GUIDE } from '@/lib/constants/strategy-guide';
import { cn } from '@/lib/utils';

interface StrategySidebarProps {
  currentStep?: number;
}

export default function StrategySidebar({ currentStep = 1 }: StrategySidebarProps) {
  const steps = [
    { id: 1, name: 'Hook', label: '관심 끌기' },
    { id: 2, name: 'Problem', label: '문제 인식' },
    { id: 3, name: 'Value', label: '가치 제안' },
    { id: 4, name: 'Proof', label: '증거 제시' },
    { id: 5, name: 'Trust', label: '신뢰 구축' },
    { id: 6, name: 'Objection', label: '반론 처리' },
    { id: 7, name: 'Urgency', label: '긴급성' },
    { id: 8, name: 'CTA', label: '행동 유도' },
    { id: 9, name: 'Last Call', label: '마지막 기회' },
  ];

  const guide = STRATEGY_GUIDE[currentStep as keyof typeof STRATEGY_GUIDE] || STRATEGY_GUIDE[1];

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-white/5">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-zinc-800/50">
        <h2 className="text-sm font-bold text-zinc-200 tracking-tight">제안 시나리오</h2>
        <p className="text-xs text-zinc-500 mt-1">Proposal Scenario</p>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                step.id === currentStep
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  step.id === currentStep
                    ? "bg-indigo-600 text-white"
                    : step.id < currentStep
                    ? "bg-zinc-700 text-zinc-400"
                    : "bg-zinc-800/50 text-zinc-600"
                )}>
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    step.id === currentStep ? "text-white" : ""
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-zinc-600 truncate">{step.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Mentor Card (Always Visible) */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-800/50">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-zinc-100 mb-1">Strategy Mentor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {guide.question}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mt-3">
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
              <p className="text-xs font-bold text-red-400 mb-1">❌ The Trap</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{guide.mistake}</p>
            </div>
            
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
              <p className="text-xs font-bold text-indigo-400 mb-1">✅ The Strategy</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{guide.strategy}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500 italic">
              💡 {guide.why}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
