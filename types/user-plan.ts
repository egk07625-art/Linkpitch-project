/**
 * @file user-plan.ts
 * @description User Plan 관련 타입 정의
 *
 * 사용자 요금제 정보를 나타내는 타입 정의
 * Supabase user_plans 테이블 스키마를 기반으로 작성됨
 */

/**
 * User Plan 타입
 * Supabase user_plans 테이블 스키마를 기반으로 작성
 */
export interface UserPlan {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 플랜 ID (plans 테이블 참조) */
  plan_id: string;
  /** 현재 플랜 여부 */
  is_current: boolean;
  /** 시작 일시 */
  started_at?: string;
  /** 종료 일시 */
  ended_at?: string;
}

/**
 * User Plan 생성 요청 타입
 */
export interface CreateUserPlanInput {
  user_id: string;
  plan_id: string;
  is_current?: boolean;
  started_at?: string;
  ended_at?: string;
}

/**
 * User Plan 업데이트 요청 타입
 */
export interface UpdateUserPlanInput {
  is_current?: boolean;
  started_at?: string;
  ended_at?: string;
}

