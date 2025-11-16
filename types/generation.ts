/**
 * @file generation.ts
 * @description 생성 결과 관련 타입 정의
 *
 * n8n Webhook을 통해 생성된 인사이트, 이메일, 리포트 outline 등의 타입 정의
 */

/**
 * 생성된 인사이트 타입
 */
export interface Insight {
  id?: string;
  title: string;
  description: string;
  category?: string;
}

/**
 * 생성 결과 타입
 */
export interface GenerationResult {
  insights: Insight[];
  email_subject: string;
  email_body: string;
  report_outline?: {
    sections: string[];
    key_points: string[];
  };
}

/**
 * 생성 요청 타입
 */
export interface GenerationRequest {
  brand_name: string;
  contact_name?: string;
  contact_email?: string;
  url: string;
  memo?: string;
  sequence_type: "4통" | "9통";
  step_template?: string;
  visual_materials?: string; // VIS-01 대응
}

/**
 * 생성 로그 타입
 */
export interface GenerationLog {
  id: string;
  user_id: string;
  request_data: GenerationRequest;
  result_data: GenerationResult;
  created_at: string;
}



