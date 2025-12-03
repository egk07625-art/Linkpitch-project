/**
 * @file user.ts
 * @description User 관련 타입 정의
 *
 * 사용자 정보를 나타내는 타입 정의
 * Supabase users 테이블 스키마를 기반으로 작성됨
 */

/**
 * User 타입
 * Supabase users 테이블 스키마를 기반으로 작성
 */
export interface User {
  /** 고유 ID (UUID) */
  id: string;
  /** Clerk 사용자 ID */
  clerk_id: string;
  /** 이메일 */
  email: string;
  /** 이름 */
  name?: string;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * User 생성 요청 타입
 */
export interface CreateUserInput {
  clerk_id: string;
  email: string;
  name?: string;
}

/**
 * User 업데이트 요청 타입
 */
export interface UpdateUserInput {
  email?: string;
  name?: string;
}

