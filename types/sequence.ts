/**
 * @file sequence.ts
 * @description Sequence 관련 타입 정의
 *
 * 시퀀스(메일 발송 시퀀스) 관련 타입 정의
 */

/**
 * 시퀀스 타입
 * DB 기본값: '5_steps'
 */
export type SequenceType = "5_steps" | "9_steps" | string;

/**
 * Persona 타입
 */
export type PersonaType = "researcher" | string;

/**
 * 시퀀스 상태 타입
 * DB CHECK 제약조건: 'draft', 'active', 'completed'만 허용
 */
export type SequenceStatus = "draft" | "active" | "completed";

/**
 * Sequence 타입
 * Supabase sequences 테이블 스키마를 기반으로 작성
 */
export interface Sequence {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** Prospect ID (prospects 테이블 참조) */
  prospect_id: string;
  /** 시퀀스명 */
  name: string;
  /** Persona 타입 (기본값: 'researcher') */
  persona_type: PersonaType;
  /** 시퀀스 타입 (기본값: '5_steps') */
  sequence_type: SequenceType;
  /** 총 스텝 수 (1-10) */
  total_steps: number;
  /** 상태 */
  status: SequenceStatus;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * Sequence 생성 요청 타입
 */
export interface CreateSequenceInput {
  prospect_id: string;
  name?: string;
  persona_type?: PersonaType;
  sequence_type?: SequenceType;
  total_steps?: number;
}

/**
 * Sequence 업데이트 요청 타입
 */
export interface UpdateSequenceInput {
  name?: string;
  persona_type?: PersonaType;
  sequence_type?: SequenceType;
  total_steps?: number;
  status?: SequenceStatus;
}
















