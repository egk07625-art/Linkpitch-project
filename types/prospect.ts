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
export interface VisionData {
  /** 브랜드 분위기/무드 */
  mood: string;
  /** 시각적 강점 (Visual USP) 배열 */
  visual_usp: string[];
  /** 색상 팔레트 배열 */
  colors?: string[];
  /** 가격 제안/이벤트 정보 */
  price_offer: string;
  /** 리포트용 헤드라인 */
  report_title: string;
  /** 리포트용 분석글 */
  visual_analysis_text: string;
  /** 리포트용 기회포착글 */
  opportunity_text: string;
  /** 스크린샷 이미지 URL (선택) */
  screenshot_url?: string;
}

/**
 * @deprecated VisionData를 사용하세요
 * VisionAnalysis는 하위 호환성을 위해 유지됩니다
 */
export interface VisionAnalysis extends VisionData {
  /** 리뷰 요약 정보 (레거시) */
  review_summary?: string;
}

/**
 * CRM 상태 타입
 */
export type CRMStatus = 'cold' | 'warm' | 'hot';

/**
 * Tier 타입
 */
export type Tier = 'High' | 'Middle' | 'Low';

/**
 * Prospect 타입
 * Supabase prospects 테이블 스키마를 기반으로 작성
 */
export interface Prospect {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 캐시 ID (site_analysis_cache 테이블 참조) */
  cache_id?: string;
  /** 회사명/스토어명 */
  name: string;
  /** 담당자 이름 (선택) */
  contact_name?: string;
  /** 담당자 이메일 */
  contact_email?: string;
  /** 타겟 URL (스마트스토어, 랜딩페이지 등) */
  url?: string;
  /** 메모 (선택) */
  memo?: string;
  /** Vision AI 분석 데이터 (JSONB) - cache_id를 통해 site_analysis_cache에서 조회 가능 */
  vision_data?: VisionData;
  /** CRM 상태: 'cold' | 'warm' | 'hot' (기본값: 'cold') */
  crm_status: CRMStatus;
  /** 최대 스크롤 깊이 (0-100) */
  max_scroll_depth: number;
  /** 최대 체류 시간 (초) */
  max_duration_seconds: number;
  /** 재방문 횟수 */
  visit_count: number;
  /** 스토어명 */
  store_name?: string;
  /** 카테고리 */
  category?: string;
  /** 티어: 'High' | 'Middle' | 'Low' */
  tier?: Tier;
  /** 원본 OCR 텍스트 */
  raw_ocr_text?: string;
  /** 마지막 활동 일시 */
  last_activity_at?: string;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * Prospect 생성 요청 타입
 */
export interface CreateProspectInput {
  name: string;
  contact_name?: string;
  contact_email: string;
  url: string;
  memo?: string;
}

/**
 * Prospect 업데이트 요청 타입
 */
export interface UpdateProspectInput {
  name?: string;
  contact_name?: string;
  contact_email?: string;
  url?: string;
  memo?: string;
  vision_data?: VisionData;
  crm_status?: CRMStatus;
  cache_id?: string;
  max_scroll_depth?: number;
  max_duration_seconds?: number;
  visit_count?: number;
  store_name?: string;
  category?: string;
  tier?: Tier;
  raw_ocr_text?: string;
  last_activity_at?: string;
}
