/**
 * @file report-tracking-log.ts
 * @description Report Tracking Log 관련 타입 정의
 *
 * 리포트 추적 로그 정보를 나타내는 타입 정의
 * Supabase report_tracking_logs 테이블 스키마를 기반으로 작성됨
 */

/**
 * Report Tracking Log 타입
 * Supabase report_tracking_logs 테이블 스키마를 기반으로 작성
 */
export interface ReportTrackingLog {
  /** 고유 ID (UUID) */
  id: string;
  /** Prospect ID (prospects 테이블 참조) */
  prospect_id: string;
  /** 세션 ID */
  session_id: string;
  /** User Agent */
  user_agent?: string;
  /** IP 주소 */
  ip_address?: string;
  /** 스크롤 깊이 (0-100) */
  scroll_depth: number;
  /** 체류 시간 (초) */
  duration_seconds: number;
  /** 생성 일시 */
  created_at: string;
}

/**
 * Report Tracking Log 생성 요청 타입
 */
export interface CreateReportTrackingLogInput {
  prospect_id: string;
  session_id: string;
  user_agent?: string;
  ip_address?: string;
  scroll_depth?: number;
  duration_seconds?: number;
}

/**
 * Report Tracking Log 업데이트 요청 타입
 */
export interface UpdateReportTrackingLogInput {
  scroll_depth?: number;
  duration_seconds?: number;
}

