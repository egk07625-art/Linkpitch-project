/**
 * @file sequence.ts
 * @description Sequence 관련 타입 정의
 *
 * 시퀀스(메일 발송 시퀀스) 관련 타입 정의
 */

/**
 * 시퀀스 타입
 */
export type SequenceType = "4통" | "9통";

/**
 * Sequence 타입
 */
export interface Sequence {
  id: string;
  user_id: string;
  prospect_id: string;
  sequence_type: SequenceType;
  total_steps: number;
  current_step: number;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}

/**
 * Sequence 생성 요청 타입
 */
export interface CreateSequenceInput {
  prospect_id: string;
  sequence_type: SequenceType;
  total_steps: number;
}

/**
 * Sequence 업데이트 요청 타입
 */
export interface UpdateSequenceInput {
  current_step?: number;
  status?: "active" | "completed" | "paused";
}
















