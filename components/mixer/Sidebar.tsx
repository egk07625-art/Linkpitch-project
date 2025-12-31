'use client';

import { motion } from 'framer-motion';
import { FileText, Mail, BarChart3, Settings, HelpCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SidebarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  prospectName?: string;
  stepsWithData?: number[];
}

const STEPS = [
  { number: 1, icon: FileText, label: '진단', color: 'cyan' },
  { number: 2, icon: BarChart3, label: '설계', color: 'violet' },
  { number: 3, icon: Mail, label: '확정', color: 'emerald' },
];

export function Sidebar({ currentStep, onStepChange, prospectName, stepsWithData = [] }: SidebarProps) {
  return (
    <aside className="w-[70px] bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">

      {/* 로고/홈 버튼 */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <Link
          href="/prospects"
          className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/10
                    flex items-center justify-center text-white font-bold text-lg
                    hover:scale-105 transition-transform"
        >
          LP
        </Link>
      </div>

      {/* Step 네비게이션 */}
      <nav className="flex-1 py-6">
        <div className="space-y-2 px-3">
          {STEPS.map((step) => {
            const isActive = currentStep === step.number;
            const hasData = stepsWithData.includes(step.number);
            const Icon = step.icon;

            return (
              <motion.button
                key={step.number}
                onClick={() => hasData && onStepChange(step.number)}
                disabled={!hasData}
                whileHover={hasData ? { scale: 1.05 } : undefined}
                whileTap={hasData ? { scale: 0.95 } : undefined}
                className={cn(
                  'relative w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white border border-white/20'
                    : hasData
                      ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                      : 'text-gray-700 cursor-not-allowed opacity-50'
                )}
              >
                {/* 활성 인디케이터 */}
                {isActive && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* 왼쪽 바 인디케이터 */}
                <div className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all',
                  isActive ? 'bg-white' : 'bg-transparent'
                )} />

                <span className={cn(
                  'relative z-10 text-lg font-bold',
                  isActive ? 'text-white' : ''
                )}>
                  {step.number}
                </span>
                <span className={cn(
                  'relative z-10 text-[10px] font-medium',
                  isActive ? 'text-white/85' : ''
                )}>
                  {step.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 진행률 표시 */}
        <div className="mt-6 px-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            {currentStep}/3 완료
          </p>
        </div>
      </nav>

      {/* 하단 메뉴 */}
      <div className="border-t border-gray-800 py-4 px-3 space-y-2">
        <button className="w-full aspect-square rounded-xl flex items-center justify-center
                          text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="w-full aspect-square rounded-xl flex items-center justify-center
                          text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors">
          <Settings size={20} />
        </button>
      </div>

    </aside>
  );
}
