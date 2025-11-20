/**
 * @file report.ts
 * @description Report 관련 타입 정의
 *
 * 리포트 페이지 및 리포트 이벤트 추적 관련 타입 정의
 * PRD.md의 데이터베이스 스키마를 기반으로 작성됨
 */

/**
 * 리포트 이벤트 타입
 * PRD.md의 report_events 테이블 스키마를 기반으로 작성
 */
export type ReportEventType = 'view' | 'dwell_10s' | 'scroll_60';

/**
 * ReportEvent 타입
 * PRD.md의 report_events 테이블 스키마를 기반으로 작성
 */
export interface ReportEvent {
  /** 고유 ID (UUID) */
  id: string;
  /** Prospect ID (prospects 테이블 참조) */
  prospect_id: string;
  /** 이벤트 타입: 'view'(접속), 'dwell_10s'(10초 체류), 'scroll_60'(스크롤 60%) */
  event_type: ReportEventType;
  /** 이벤트 발생 시간 */
  created_at: string;
}

/**
 * 리포트 이벤트 생성 요청 타입
 */
export interface CreateReportEventInput {
  prospect_id: string;
  event_type: ReportEventType;
}
