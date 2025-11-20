/**
 * @file prospect.ts
 * @description Prospect 관련 타입 정의
 *
 * 타겟 브랜드/회사 정보를 나타내는 Prospect 타입 정의
 * PRD.md의 데이터베이스 스키마를 기반으로 작성됨
 */

/**
 * Vision AI 분석 결과 데이터
 * PRD.md의 vision_data JSONB 구조를 반영
 */
export interface VisionAnalysis {
  /** 시각적 강점 (Visual USP) 배열 */
  visual_usp: string[];
  /** 브랜드 분위기/무드 */
  mood: string;
  /** 가격 제안/이벤트 정보 */
  price_offer: string;
  /** 리뷰 요약 정보 */
  review_summary: string;
  /** 스크린샷 이미지 URL */
  screenshot_url: string;
}

/**
 * Prospect 타입
 * PRD.md의 prospects 테이블 스키마를 기반으로 작성
 */
export interface Prospect {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 타겟 URL (스마트스토어, 랜딩페이지 등) */
  url: string;
  /** 브랜드명 (AI가 추출하거나 사용자가 입력) */
  brand_name: string;
  /** 담당자 이름 (선택) */
  contact_name?: string;
  /** 담당자 이메일 (선택) */
  contact_email?: string;
  /** 메모 (선택) */
  memo?: string;
  /** Vision AI 분석 데이터 (JSONB) */
  vision_data?: VisionAnalysis;
  /** CRM 상태: 'cold' | 'warm' | 'hot' (기본값: 'cold') */
  crm_status: 'cold' | 'warm' | 'hot';
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
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
  vision_data?: VisionAnalysis;
  crm_status?: 'cold' | 'warm' | 'hot';
}
