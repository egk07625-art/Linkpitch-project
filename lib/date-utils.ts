/**
 * @file date-utils.ts
 * @description 날짜 관련 유틸리티 함수
 *
 * 날짜 포맷팅 및 추천 발송일 계산 함수
 */

/**
 * 날짜를 한국어 형식으로 포맷팅
 * 예: "2024년 11월 20일"
 */
export function formatDateKo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 날짜와 시간을 한국어 형식으로 포맷팅
 * 예: "2024년 11월 20일 오후 3시 30분"
 */
export function formatDateTimeKo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
}

/**
 * 상대 시간 표시 (예: "3일 전", "1시간 전")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  
  return formatDateKo(d);
}

/**
 * 추천 발송일 계산
 * PRD.md에 따르면 Step 간 간격 규칙이 있음 (예: +3일, +5일 등)
 * 
 * @param previousSentAt 이전 Step 발송일
 * @param intervalDays 간격 일수 (기본값: 3일)
 */
export function calculateRecommendedSendDate(
  previousSentAt: Date | string,
  intervalDays: number = 3
): Date {
  const previous = typeof previousSentAt === 'string' ? new Date(previousSentAt) : previousSentAt;
  const recommended = new Date(previous);
  recommended.setDate(recommended.getDate() + intervalDays);
  return recommended;
}

/**
 * 오늘 발송 가능한 Step인지 확인
 * recommended_send_at이 오늘 이전이거나 오늘인 경우 true
 */
export function isReadyToSend(recommendedSendAt: Date | string): boolean {
  const recommended = typeof recommendedSendAt === 'string' 
    ? new Date(recommendedSendAt) 
    : recommendedSendAt;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  recommended.setHours(0, 0, 0, 0);
  return recommended <= today;
}
