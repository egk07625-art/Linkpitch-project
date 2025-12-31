'use client';

import { motion } from 'framer-motion';
import { Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentTypeToggleProps {
  activeTab: 'email' | 'report';
  onTabChange: (tab: 'email' | 'report') => void;
}

export function ContentTypeToggle({ activeTab, onTabChange }: ContentTypeToggleProps) {
  return (
    <div className="absolute top-3 right-3 z-20">
      <div className="flex items-center bg-gray-900/90 backdrop-blur-sm rounded-lg p-1 border border-gray-800 shadow-lg">
        <button
          onClick={() => onTabChange('email')}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            activeTab === 'email'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          )}
        >
          {activeTab === 'email' && (
            <motion.div
              layoutId="contentToggle"
              className="absolute inset-0 bg-cyan-500/20 border border-cyan-500/30 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Mail size={14} className="relative z-10" />
          <span className="relative z-10">E</span>
        </button>

        <button
          onClick={() => onTabChange('report')}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            activeTab === 'report'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          )}
        >
          {activeTab === 'report' && (
            <motion.div
              layoutId="contentToggle"
              className="absolute inset-0 bg-violet-500/20 border border-violet-500/30 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <FileText size={14} className="relative z-10" />
          <span className="relative z-10">R</span>
        </button>
      </div>
    </div>
  );
}
