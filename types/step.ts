/**
 * @file step.ts
 * @description Step 관련 타입 정의
 *
 * 시퀀스 내 개별 Step(메일) 관련 타입 정의
 * PRD.md의 데이터베이스 스키마를 기반으로 작성됨
 */

/**
 * Step 타입
 * PRD.md의 steps 테이블 스키마를 기반으로 작성
 */
export interface Step {
  /** 고유 ID (UUID) */
  id: string;
  /** Prospect ID (prospects 테이블 참조) */
  prospect_id: string;
  /** 시퀀스 순서 (1, 2, 3...) */
  step_number: number;
  /** 생성된 이메일 본문 */
  email_content: string;
  /** 사용자가 수동으로 '발송 완료' 처리했는지 여부 */
  is_sent: boolean;
  /** 발송 완료 버튼 누른 시간 */
  sent_at?: string;
}

/**
 * Step 생성 요청 타입
 */
export interface CreateStepInput {
  prospect_id: string;
  step_number: number;
  email_content: string;
}

/**
 * Step 업데이트 요청 타입
 */
export interface UpdateStepInput {
  email_content?: string;
  is_sent?: boolean;
  sent_at?: string;
}
