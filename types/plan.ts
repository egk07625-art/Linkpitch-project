/**
 * @file plan.ts
 * @description Plan 관련 타입 정의
 *
 * 요금제 정보를 나타내는 타입 정의
 * Supabase plans 테이블 스키마를 기반으로 작성됨
 */

/**
 * Plan 타입
 * Supabase plans 테이블 스키마를 기반으로 작성
 */
export interface Plan {
  /** 고유 ID (UUID) */
  id: string;
  /** 플랜 코드 (예: 'free', 'starter', 'pro') */
  code: string;
  /** 플랜 이름 */
  name: string;
  /** 월간 쿼터 */
  monthly_quota: number;
  /** 가격 (KRW) */
  price_krw: number;
  /** 활성화 여부 */
  is_active: boolean;
}

/**
 * Plan 생성 요청 타입
 */
export interface CreatePlanInput {
  code: string;
  name: string;
  monthly_quota: number;
  price_krw: number;
  is_active?: boolean;
}

/**
 * Plan 업데이트 요청 타입
 */
export interface UpdatePlanInput {
  name?: string;
  monthly_quota?: number;
  price_krw?: number;
  is_active?: boolean;
}

