/**
 * @file prospect.ts
 * @description Prospect 관련 타입 정의
 *
 * 타겟 브랜드/회사 정보를 나타내는 Prospect 타입 정의
 */

/**
 * Prospect 타입
 */
export interface Prospect {
  id: string;
  user_id: string;
  brand_name: string;
  contact_name?: string;
  contact_email?: string;
  url: string;
  memo?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Prospect 생성 요청 타입
 */
export interface CreateProspectInput {
  brand_name: string;
  contact_name?: string;
  contact_email?: string;
  url: string;
  memo?: string;
}

/**
 * Prospect 업데이트 요청 타입
 */
export interface UpdateProspectInput {
  brand_name?: string;
  contact_name?: string;
  contact_email?: string;
  url?: string;
  memo?: string;
}



