/**
 * @file crm-utils.ts
 * @description CRM 관련 유틸리티 함수
 *
 * CRM status별 색상, 라벨, 스타일 매핑 함수
 */

import type { Prospect } from '@/types/prospect';

/**
 * CRM 상태 타입
 */
export type CrmStatus = Prospect['crm_status'];

/**
 * CRM 상태별 라벨 매핑
 */
export const CRM_STATUS_LABELS: Record<CrmStatus, string> = {
  cold: 'Cold',
  warm: 'Warm',
  hot: 'Hot',
};

/**
 * CRM 상태별 한글 라벨 매핑
 */
export const CRM_STATUS_LABELS_KO: Record<CrmStatus, string> = {
  cold: '콜드',
  warm: '웜',
  hot: '핫',
};

/**
 * CRM 상태별 색상 클래스 매핑 (Tailwind CSS)
 */
export const CRM_STATUS_COLORS: Record<CrmStatus, string> = {
  cold: 'bg-zinc-700 text-zinc-200',
  warm: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  hot: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

/**
 * CRM 상태별 배지 variant 매핑 (shadcn Badge용)
 */
export const CRM_STATUS_VARIANTS: Record<CrmStatus, 'default' | 'secondary' | 'destructive'> = {
  cold: 'secondary',
  warm: 'default',
  hot: 'destructive',
};

/**
 * CRM 상태에 따른 색상 클래스 반환
 */
export function getCrmStatusColor(status: CrmStatus): string {
  return CRM_STATUS_COLORS[status];
}

/**
 * CRM 상태에 따른 라벨 반환
 */
export function getCrmStatusLabel(status: CrmStatus, locale: 'ko' | 'en' = 'ko'): string {
  return locale === 'ko' ? CRM_STATUS_LABELS_KO[status] : CRM_STATUS_LABELS[status];
}

/**
 * CRM 상태에 따른 Badge variant 반환
 */
export function getCrmStatusVariant(status: CrmStatus): 'default' | 'secondary' | 'destructive' {
  return CRM_STATUS_VARIANTS[status];
}
