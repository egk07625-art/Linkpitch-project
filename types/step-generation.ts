/**
 * @file step-generation.ts
 * @description Step Generation 관련 타입 정의
 *
 * Step의 생성 버전을 나타내는 타입 정의
 * Supabase step_generations 테이블 스키마를 기반으로 작성됨
 */

/**
 * Step Generation 상태 타입
 * DB CHECK 제약조건: 'processing', 'completed', 'failed'만 허용
 */
export type StepGenerationStatus = 'processing' | 'completed' | 'failed';

/**
 * Report Data JSONB 구조
 */
export interface ReportData {
  /** 리포트 제목 */
  title?: string;
  /** 리포트 본문 */
  content?: string;
  /** 리포트 섹션들 */
  sections?: Array<{
    title: string;
    content: string;
  }>;
  /** 기타 리포트 데이터 */
  [key: string]: unknown;
}

/**
 * Report Materials JSONB 구조
 * 기본값: []
 */
export type ReportMaterials = Array<{
  /** 소재 타입 */
  type: string;
  /** 소재 URL 또는 내용 */
  url?: string;
  content?: string;
  /** 기타 메타데이터 */
  [key: string]: unknown;
}>;

/**
 * Step Generation 타입
 * Supabase step_generations 테이블 스키마를 기반으로 작성
 */
export interface StepGeneration {
  /** 고유 ID (UUID) */
  id: string;
  /** Step ID (step 테이블 참조) */
  step_id: string;
  /** 사용자 ID (users 테이블 참조) */
  user_id: string;
  /** 버전 번호 (1 이상) */
  version_number: number;
  /** 이메일 제목 */
  email_subject?: string;
  /** 이메일 본문 */
  email_body?: string;
  /** 리포트 데이터 (JSONB) */
  report_data?: ReportData;
  /** 리포트 소재 (JSONB, 기본값: []) */
  report_materials: ReportMaterials;
  /** 상태 */
  status: StepGenerationStatus;
  /** 비용 (KRW) */
  cost_krw: number;
  /** 생성 일시 */
  created_at: string;
}

/**
 * Step Generation 생성 요청 타입
 */
export interface CreateStepGenerationInput {
  step_id: string;
  version_number?: number;
  email_subject?: string;
  email_body?: string;
  report_data?: ReportData;
  report_materials?: ReportMaterials;
  status?: StepGenerationStatus;
  cost_krw?: number;
}

/**
 * Step Generation 업데이트 요청 타입
 */
export interface UpdateStepGenerationInput {
  email_subject?: string;
  email_body?: string;
  report_data?: ReportData;
  report_materials?: ReportMaterials;
  status?: StepGenerationStatus;
  cost_krw?: number;
}

