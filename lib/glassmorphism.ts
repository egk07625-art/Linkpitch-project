/**
 * @file glassmorphism.ts
 * @description Glassmorphism 스타일 유틸리티
 *
 * AI Analysis 카드(Insight Mixer 좌측 패널)에 사용할 Glassmorphism 효과
 * DESIGN_PLAN.md의 요구사항에 따라 구현
 */

import { cn } from '@/lib/utils';

/**
 * Glassmorphism 스타일 클래스
 * 
 * 배경: 반투명 Zinc-900
 * 블러 효과: backdrop-blur
 * 테두리: 얇은 테두리
 */
export const glassmorphismBase = cn(
  'bg-zinc-900/50',
  'backdrop-blur-md',
  'border border-zinc-800/50',
  'rounded-lg',
  'shadow-lg'
);

/**
 * Glassmorphism 카드 스타일 (VisionFactCard용)
 */
export const glassmorphismCard = cn(
  glassmorphismBase,
  'p-6',
  'transition-all',
  'hover:bg-zinc-900/60',
  'hover:border-zinc-700/50'
);

/**
 * Glassmorphism 패널 스타일 (Insight Mixer 좌측 패널용)
 */
export const glassmorphismPanel = cn(
  glassmorphismBase,
  'p-4',
  'h-full',
  'overflow-y-auto'
);
