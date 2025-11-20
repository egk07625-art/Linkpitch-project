/**
 * @file step.ts
 * @description Step 관련 타입 정의
 *
 * 시퀀스 내 개별 Step(메일) 관련 타입 정의
 * PRD.md의 데이터베이스 스키마를 기반으로 작성됨
 */

/**
 * Step 타입
 */
export type StepType = 'Hook' | 'Problem' | 'Value' | 'Social Proof' | 'Urgency' | 'CTA' | string;

/**
 * Step 상태 타입
 */
export type StepStatus = 'pending' | 'scheduled' | 'sent' | 'failed' | 'cancelled';

/**
 * Step 타입
 * PRD.md의 step 테이블 스키마를 기반으로 작성
 */
export interface Step {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 시퀀스 ID (sequences 테이블 참조) */
  sequence_id: string;
  /** 시퀀스 순서 (1~9) */
  step_number: number;
  /** 스텝 타입 (Hook, Problem, Value 등) */
  step_type: StepType;
  /** 이메일 제목 */
  email_subject: string;
  /** 이메일 본문 */
  email_body: string;
  /** 상태 (pending, scheduled, sent, failed, cancelled) */
  status: StepStatus;
  /** 권장 발송 시간 */
  recommended_send_at?: string;
  /** 실제 발송 시간 */
  sent_at?: string;
  /** 답장 여부 */
  is_replied: boolean;
  /** 답장 시간 */
  replied_at?: string;
  /** 리포트 클릭 여부 */
  has_clicked_report: boolean;
  /** 리포트 참여도 레벨 */
  report_engagement_level: 'none' | 'low' | 'medium' | 'high';
  /** 마지막 리포트 조회 시간(초) */
  last_report_view_seconds?: number;
  /** 마지막 리포트 스크롤 깊이(%) */
  last_report_scroll_depth?: number;
  /** 핵심 스텝 여부 (1, 3, 6, 9번 강조용) */
  is_core_step: boolean;
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
  step_type: StepType;
  email_subject: string;
  email_body: string;
  is_core_step?: boolean;
  recommended_send_at?: string;
}

/**
 * Step 업데이트 요청 타입
 */
export interface UpdateStepInput {
  step_type?: StepType;
  email_subject?: string;
  email_body?: string;
  status?: StepStatus;
  recommended_send_at?: string;
  sent_at?: string;
  is_replied?: boolean;
  replied_at?: string;
  has_clicked_report?: boolean;
  report_engagement_level?: 'none' | 'low' | 'medium' | 'high';
  last_report_view_seconds?: number;
  last_report_scroll_depth?: number;
}
