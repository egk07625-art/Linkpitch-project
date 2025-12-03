/**
 * @file step.ts
 * @description Step 관련 타입 정의
 *
 * 시퀀스 내 개별 Step(메일) 관련 타입 정의
 * Supabase step 테이블 스키마를 기반으로 작성됨
 *
 * 참고: 이메일 제목/본문은 step_generations 테이블에 저장됩니다.
 * step 테이블은 step_generations를 참조하는 구조입니다.
 */

/**
 * Step 상태 타입
 * DB CHECK 제약조건: 'pending', 'sent'만 허용
 */
export type StepStatus = 'pending' | 'sent';

/**
 * Step 타입
 * Supabase step 테이블 스키마를 기반으로 작성
 */
export interface Step {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 시퀀스 ID (sequences 테이블 참조) */
  sequence_id: string;
  /** 시퀀스 순서 (1 이상) */
  step_number: number;
  /** 선택된 생성 버전 ID (step_generations 테이블 참조) */
  selected_generation_id?: string;
  /** 상태 (pending/sent) */
  status: StepStatus;
  /** 실제 발송 시간 */
  sent_at?: string;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * Step 생성 요청 타입
 */
export interface CreateStepInput {
  sequence_id: string;
  step_number: number;
  selected_generation_id?: string;
  status?: StepStatus;
}

/**
 * Step 업데이트 요청 타입
 */
export interface UpdateStepInput {
  selected_generation_id?: string;
  status?: StepStatus;
  sent_at?: string;
}
