/**
 * 마크다운 전처리 함수
 * 리포트 마크다운을 렌더링 전에 처리합니다.
 * 
 * @param markdown - 원본 마크다운 문자열
 * @returns 전처리된 마크다운 문자열
 */
export function preprocessMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // 기본 전처리: 빈 줄 정리, 특수 문자 처리 등
  let processed = markdown;
  
  // 필요시 추가 전처리 로직을 여기에 작성
  // 예: 이미지 URL 변환, 링크 처리 등
  
  return processed;
}

