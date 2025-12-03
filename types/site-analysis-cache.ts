/**
 * @file site-analysis-cache.ts
 * @description Site Analysis Cache 관련 타입 정의
 *
 * 사이트 분석 캐시 정보를 나타내는 타입 정의
 * Supabase site_analysis_cache 테이블 스키마를 기반으로 작성됨
 */

import type { VisionData } from './prospect';

/**
 * Site Analysis Cache 타입
 * Supabase site_analysis_cache 테이블 스키마를 기반으로 작성
 */
export interface SiteAnalysisCache {
  /** 고유 ID (UUID) */
  id: string;
  /** URL 해시 */
  url_hash: string;
  /** URL */
  url: string;
  /** 전체 스크린샷 URL */
  full_screenshot_url: string;
  /** Vision AI 분석 데이터 (JSONB) */
  vision_data: VisionData;
  /** 분석 일시 */
  analyzed_at: string;
  /** 마지막 접근 일시 */
  last_accessed_at: string;
  /** 접근 횟수 */
  access_count: number;
}

/**
 * Site Analysis Cache 생성 요청 타입
 */
export interface CreateSiteAnalysisCacheInput {
  url_hash: string;
  url: string;
  full_screenshot_url: string;
  vision_data: VisionData;
}

/**
 * Site Analysis Cache 업데이트 요청 타입
 */
export interface UpdateSiteAnalysisCacheInput {
  last_accessed_at?: string;
  access_count?: number;
}

