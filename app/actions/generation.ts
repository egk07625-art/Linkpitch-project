/**
 * @file generation.ts
 * @description Generation 관련 Server Actions
 *
 * n8n Webhook을 통한 Vision AI 분석 및 이메일 생성
 * PRD.md의 API/Webhook 명세를 기반으로 작성
 */

'use server';

import type { VisionAnalysis } from '@/types/prospect';

/**
 * URL 분석 Webhook 호출
 * PRD.md의 /webhook/analyze-url 엔드포인트 호출
 * 
 * @param url 분석할 URL
 * @returns Vision AI 분석 결과 (brand_name, vision_data, screenshot_url)
 */
export async function analyzeUrl(url: string): Promise<{
  brand_name: string;
  vision_data: VisionAnalysis;
  screenshot_url: string;
}> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl) {
    throw new Error('N8N_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.');
  }

  // TODO: n8n Webhook 호출 구현
  // const response = await fetch(`${n8nWebhookUrl}/analyze-url`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ url }),
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('URL 분석 실패');
  // }
  // 
  // return await response.json();
  
  throw new Error('Not implemented');
}

/**
 * 이메일 생성 Webhook 호출
 * PRD.md의 /webhook/generate-email 엔드포인트 호출
 * 
 * @param brandName 브랜드명
 * @param visionData Vision AI 분석 데이터
 * @param strategyKeywords 전략 키워드 배열
 * @returns 생성된 이메일 본문
 */
export async function generateEmail(
  brandName: string,
  visionData: VisionAnalysis,
  strategyKeywords: string[]
): Promise<{ email_body: string }> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl) {
    throw new Error('N8N_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.');
  }

  // TODO: n8n Webhook 호출 구현
  // const response = await fetch(`${n8nWebhookUrl}/generate-email`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     brand_name: brandName,
  //     vision_data: visionData,
  //     strategy_keywords: strategyKeywords,
  //   }),
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('이메일 생성 실패');
  // }
  // 
  // return await response.json();
  
  throw new Error('Not implemented');
}
