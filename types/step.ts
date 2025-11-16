/**
 * @file step.ts
 * @description Step 관련 타입 정의
 *
 * 시퀀스 내 개별 Step(메일) 관련 타입 정의
 */

/**
 * Step 상태 타입
 */
export type StepStatus = "pending" | "sent" | "read" | "replied";

/**
 * Step 관여도 레벨 타입
 */
export type EngagementLevel = "cold" | "warm" | "hot";

/**
 * Step 타입
 */
export interface Step {
  id: string;
  user_id: string;
  sequence_id: string;
  step_number: number;
  step_label?: string;
  email_subject: string;
  email_body: string;
  status: StepStatus;
  sent_at?: string;
  recommended_send_at?: string;
  read_at?: string;
  replied_at?: string;
  report_engagement_level?: EngagementLevel;
  created_at: string;
  updated_at: string;
}

/**
 * Step 생성 요청 타입
 */
export interface CreateStepInput {
  sequence_id: string;
  step_number: number;
  step_label?: string;
  email_subject: string;
  email_body: string;
  recommended_send_at?: string;
}

/**
 * Step 업데이트 요청 타입
 */
export interface UpdateStepInput {
  status?: StepStatus;
  sent_at?: string;
  read_at?: string;
  replied_at?: string;
  report_engagement_level?: EngagementLevel;
}



