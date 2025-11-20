/**
 * @file report-event.ts
 * @description Report Event 관련 타입 정의
 *
 * 리포트 추적 이벤트 관련 타입 정의
 * PRD.md의 report_events 테이블 스키마를 기반으로 작성됨
 */

/**
 * 리포트 이벤트 타입
 * PRD 기준: 리포트 페이지에서 발생하는 사용자 행동 추적
 */
export type ReportEventType = 
  | 'view'           // 페이지 접속 즉시
  | 'scroll_50'      // 스크롤 50% 도달
  | 'scroll_80'      // 스크롤 80% 도달
  | 'dwell_10s'      // 10초 체류
  | 'dwell_30s';     // 30초 체류

/**
 * 리포트 이벤트 메타데이터
 */
export interface ReportEventMetadata {
  /** 스크롤 깊이 (0.0 ~ 1.0) */
  scroll_depth?: number;
  /** 체류 시간(초) */
  dwell_seconds?: number;
  /** 기타 추가 정보 */
  [key: string]: unknown;
}

/**
 * Report Event 타입
 * PRD.md의 report_events 테이블 스키마를 기반으로 작성
 * 
 * 주의: PRD에서는 prospect_id를 직접 참조하지만,
 * 실제 DB 스키마는 step_id와 report_id를 참조합니다.
 * 두 가지 구조를 모두 지원합니다.
 */
export interface ReportEvent {
  /** 고유 ID (UUID) */
  id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** Prospect ID (prospects 테이블 참조) - PRD 기준 */
  prospect_id?: string;
  /** Step ID (step 테이블 참조) - 실제 DB 기준 */
  step_id?: string;
  /** Report ID (reports 테이블 참조) - 실제 DB 기준 */
  report_id?: string;
  /** 이벤트 타입 */
  event_type: ReportEventType;
  /** 메타데이터 (JSONB) */
  metadata?: ReportEventMetadata;
  /** 머문 시간(초) - 실제 DB 필드 */
  dwell_seconds?: number;
  /** 스크롤 깊이(%) - 실제 DB 필드 */
  scroll_depth?: number;
  /** 상호작용 여부 - 실제 DB 필드 */
  interacted?: boolean;
  /** 이벤트 발생 시간 */
  created_at: string;
}

/**
 * 리포트 이벤트 생성 요청 타입
 */
export interface CreateReportEventInput {
  prospect_id?: string;
  step_id?: string;
  report_id?: string;
  event_type: ReportEventType;
  metadata?: ReportEventMetadata;
  dwell_seconds?: number;
  scroll_depth?: number;
  interacted?: boolean;
}

