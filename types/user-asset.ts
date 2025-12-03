/**
 * @file user-asset.ts
 * @description User Asset 관련 타입 정의
 *
 * 사용자 자산 정보를 나타내는 타입 정의
 * Supabase user_assets 테이블 스키마를 기반으로 작성됨
 */

/**
 * User Asset 타입
 * Supabase user_assets 테이블 스키마를 기반으로 작성
 */
export interface UserAsset {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 파일 타입 */
  file_type: string;
  /** 파일 URL */
  file_url: string;
  /** 파일명 */
  file_name: string;
  /** 요약 */
  summary?: string;
  /** 생성 일시 */
  created_at: string;
}

/**
 * User Asset 생성 요청 타입
 */
export interface CreateUserAssetInput {
  user_id: string;
  file_type: string;
  file_url: string;
  file_name: string;
  summary?: string;
}

/**
 * User Asset 업데이트 요청 타입
 */
export interface UpdateUserAssetInput {
  file_type?: string;
  file_url?: string;
  file_name?: string;
  summary?: string;
}

