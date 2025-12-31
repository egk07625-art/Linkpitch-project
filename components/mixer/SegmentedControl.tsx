'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Segment {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  className = '',
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        'inline-flex p-1',
        'bg-white',
        'rounded-xl',
        'border border-zinc-200',
        'shadow-sm',
        className
      )}
    >
      {segments.map((segment) => {
        const isActive = value === segment.id;

        return (
          <button
            key={segment.id}
            onClick={() => onChange(segment.id)}
            className={cn(
              'relative px-5 py-1.5',
              'rounded-lg',
              'text-sm font-medium tracking-tight',
              'transition-all duration-200',
              'active:scale-[0.98]',
              isActive
                ? 'text-blue-700'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmentIndicator"
                className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {segment.icon && <span className="flex-shrink-0">{segment.icon}</span>}
              {segment.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
