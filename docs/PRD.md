제품 요구사항 정의서 (PRD): LinkPitch MVP v5.1
1. 프로젝트 개요 (Project Context)
LinkPitch는 퍼포먼스 마케터가 Vision AI로 상세페이지를 분석하고, **자신만의 성과(Context)**와 **전략 칩(Chip)**을 결합하여 가장 설득력 있는 9단계 콜드메일 시퀀스를 생성하는 멀티유저 SaaS입니다.
1.1 핵심 가치 (Core Value)

Vision AI: 텍스트가 아닌 '이미지'를 분석하여 경쟁사가 보지 못하는 시각적 강점을 찾아냅니다.
Teaser & Movie Strategy: 이메일은 '예고편(Teaser)'으로 클릭을 유도하고, 실제 정보는 '리포트(Movie/Main)'에서 보여줍니다.
Custom Context: 마케터의 강점(포트폴리오, 성과)을 입력하면 AI가 메일에 녹여냅니다.
No-Pixel Tracking: 리포트 링크 클릭 및 열람 행동으로 진성 리드(Hot Lead)를 필터링합니다.
멀티유저 & 요금제: Clerk 인증 기반으로 여러 사용자가 독립적으로 작업하며, 월 생성 쿼터를 관리합니다.

1.2 기술 스택

Frontend: Next.js 14, Tailwind CSS (Linear Dark), Shadcn/UI, Framer Motion
Backend: Supabase (PostgreSQL)
Auth: Clerk
AI Logic: n8n Webhook (ScreenshotOne + Gemini 3.0 Pro)


2. 데이터베이스 스키마 (Supabase)
2.1 핵심 테이블 구조
users (사용자)

Clerk 인증 기반 멀티유저 관리
clerk_id, email, name

plans & user_plans (요금제)

Free/Starter/Pro 플랜별 월 생성 쿼터
과금 및 사용량 추적 기반

prospects (고객사 - CRM 통합)
typescript{
  id: UUID
  user_id: UUID (FK → users)
  name: string // 회사명
  url: string
  vision_data: JSONB // AI 분석 결과
  
  // CRM 상태 (통합 관리)
  crm_status: 'cold' | 'warm' | 'hot'
  visit_count: number // 재방문 횟수
  last_viewed_at: timestamp
}
vision_data 구조:
json{
  "mood": "luxury",
  "visual_usp": ["고급스러운 제품 사진", "직관적 레이아웃"],
  "price_offer": "30% 할인",
  "report_title": "글로우업 매출 20% 상승 제안",
  "visual_analysis_text": "귀사의 상세페이지는...",
  "opportunity_text": "다음 3가지를 개선하면..."
}
sequences (9개 Step 묶음)
typescript{
  id: UUID
  prospect_id: UUID (FK → prospects)
  custom_context: string // "나만의 무기" (마케터 강점)
  status: 'draft' | 'active' | 'completed'
  total_steps: 9
}
step (각 단계 이메일)
typescript{
  id: UUID
  sequence_id: UUID (FK → sequences)
  step_number: 1~9
  step_type: 'Hook' | 'Problem' | 'Value' | ...
  
  email_subject: string
  email_body: string
  
  status: 'pending' | 'sent' // 발송 상태만 관리
  is_core_step: boolean // 1, 3, 6, 9번 강조
}
report_events (리포트 추적)
typescript{
  id: UUID
  prospect_id: UUID (FK → prospects) // ⚠️ report 테이블 없이 직접 참조
  event_type: 'view' | 'scroll_50' | 'scroll_80' | 'dwell_10s' | 'dwell_30s'
  metadata: JSONB // {"scroll_depth": 0.8, "dwell_seconds": 35}
}
generation_logs (AI 사용량)

요금제별 쿼터 추적
model_name, input_tokens, output_tokens


3. 상세 기능 명세 (Functional Specifications)
3.1 Vision 분석 및 등록 (/prospects/new)
목표: 긴 분석 시간(30~60초)을 '기대감'으로 전환하는 로딩 경험 제공.

Input: 중앙 URL 입력창
Loading UI (Terminal View):

검은 터미널 배경에 모노스페이스 폰트로 로그 출력 (framer-motion)
Log Scenario: Connecting... → Capturing screenshot... → Uploading to Gemini... → Extracting USP... → Building report...


Process:

n8n /webhook/analyze-url 호출
DB prospects 테이블에 vision_data 저장
자동으로 /prospects/[id]/mix 페이지로 리다이렉트



3.2 미니 CRM 대시보드 (/dashboard)

UI: 고밀도 테이블 (Table View)
컬럼: 회사명 | URL | CRM 상태 | 재방문 | 마지막 조회 | 등록일
정렬 로직:

1순위: 🔥 Hot + 🔄 Re-visit (재접속자)
2순위: 🔥 Hot (정독한 사람)
3순위: Recent (최근 등록)


필터: Cold/Warm/Hot 토글

3.3 인사이트 믹서 (/prospects/[id]/mix) [핵심 UI]
레이아웃: Collapsible Sidebar (Left) + Wide Main Workspace (Right)
A. 좌측 사이드바: Strategy Console (전략 통제실)
고객에게 보여질 '본편(리포트)'의 내용을 최종 조율하는 곳

Vision Fact (AI 분석 결과):

vision_data에서 추출한 USP, Mood 등을 카드 형태로 표시
수정 불가 (읽기 전용)


Custom Context Input (나만의 무기):

UI: Textarea (Minimal border-bottom style)
Placeholder: "당신의 강점을 입력하세요. 예: 지난 3개월간 뷰티 브랜드 5곳의 ROAS를 평균 280% 개선..."
저장: sequences.custom_context에 저장
활용:

이메일(예고편)의 근거 자료
리포트(본편)의 Solution 섹션에 노출




Strategy Chips (통합된 전략 토핑):

UI: 단일 리스트의 Badge 형태
구성:

일반 텍스트 칩: "🎯 경쟁사 분석", "📈 데이터 근거"
이미지 칩: "📷 성과 그래프", "📂 포트폴리오"


Interaction: 드래그 가능 (dnd-kit)



B. 우측 메인: Sequence Playlist (작업대)
9개의 Step 카드가 Accordion 형태로 나열

카드 기본 구조:

Collapsed: Step Number + Title만 표시 (예: 1. Hook - 첫 번째 인상)
Expanded: 아래 2개 탭 표시


카드 탭 구조 (Dual-View):

Tab 1: ✉️ 예고편 (Email Editor)

제목: email_subject
본문: email_body (Textarea)
하단 버튼: [Copy & Log] (Optimistic UI)


Tab 2: 🖥️ 본편 (Web Report Preview)

PC 화면에 최적화된 웹 리포트 미리보기
데이터 소스: prospects.vision_data + sequences.custom_context
실제 /r/[prospect_id]와 동일한 렌더링




재생성 로직 (The Magic Flow):

Trigger: 좌측 **[Chip]**을 우측 **[예고편 탭]**에 드롭
Action:



typescript     await regenerateStepAction({
       step_id,
       chip_text: "📷 성과 그래프",
       custom_context: sequences.custom_context
     })

API: n8n /webhook/regenerate-step 호출
Output:

AI가 기존 문맥에 칩 내용을 녹여 다시 작성
이미지 칩인 경우: [ 📷 여기에 (성과 그래프) 이미지를 붙여넣으세요 ] 마커 삽입


UI: Loading skeleton → Smooth transition


최종 발송 (Action):

[Copy & Log] 버튼 클릭 시
Optimistic UI:

즉시 체크 표시 + Dimmed 처리
navigator.clipboard.writeText() 실행
Sonner toast: "클립보드에 복사됨"


Server Action:



typescript     await updateStepStatus(step_id, 'sent')
3.4 리포트 페이지 (/r/[prospect_id])
디자인: PC 업무 환경에 최적화된 전문 제안서(Web Proposal) 스타일
콘텐츠 구성:
┌─────────────────────────────┐
│ Hero Section                │
│ - report_title (H1)         │
│ - 대표 이미지 (optional)     │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Deep Dive (Analysis)        │
│ - visual_analysis_text      │
│ - visual_usp (리스트)        │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Opportunity Section         │
│ - opportunity_text          │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Solution (Your Strength)    │
│ - custom_context (마케터)   │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Floating CTA                │
│ - "미팅 신청하기" 버튼       │
└─────────────────────────────┘
행동 추적 로직 (Server Action: logReportEvent)
이벤트 종류:

View: 페이지 접속 즉시 기록
Scroll Tracking:

scroll_50: 스크롤 50% 도달
scroll_80: 스크롤 80% 도달


Dwell Tracking:

dwell_10s: 10초 체류
dwell_30s: 30초 체류



CRM 상태 승격 규칙:
typescript// Warm: (50% 스크롤) AND (10초 체류)
if (hasEvent('scroll_50') && hasEvent('dwell_10s')) {
  crm_status = 'warm'
}

// Hot: (80% 스크롤) AND (30초 체류)
if (hasEvent('scroll_80') && hasEvent('dwell_30s')) {
  crm_status = 'hot'
}
재방문 감지:
typescriptconst lastView = prospect.last_viewed_at
const now = new Date()

if (now - lastView > 1시간) {
  visit_count++
  // 재접속 시 즉시 등급 상향 (Hot 우선 노출)
}

4. API / Webhook 명세 (n8n 연동 가이드)
4.1 본편 제작: Vision 분석 (/webhook/analyze-url)
Input:
json{
  "url": "https://example.com/product",
  "user_id": "uuid"
}
Process:

ScreenshotOne으로 전체 페이지 캡처
Gemini 3.0 Pro Vision API 호출
시각적 요소 분석 (색상, 레이아웃, USP)

Output:
json{
  "vision_data": {
    "mood": "luxury",
    "visual_usp": ["고급스러운 제품 사진", "직관적 레이아웃"],
    "colors": ["#1a1a1a", "#f5f5f5", "#6366f1"],
    "price_offer": "30% 할인",
    "report_title": "글로우업 매출 20% 상승 제안",
    "visual_analysis_text": "귀사의 상세페이지는...",
    "opportunity_text": "다음 3가지를 개선하면..."
  }
}
4.2 초기 생성: 시퀀스 배치 (/webhook/generate-sequence)
Input:
json{
  "prospect_id": "uuid",
  "brand_name": "글로우업",
  "vision_data": { ... },
  "custom_context": "지난 3개월간 뷰티 브랜드 5곳..."
}
System Prompt Rule:
당신은 B2B 콜드메일 전문가입니다.

[엄격한 규칙]
1. 절대 설명하지 마라. 리포트 링크를 클릭하게 만드는 Teaser를 작성하라.
2. 각 이메일은 300~400자 내외로 간결하게.
3. custom_context를 자연스럽게 녹여라 (예: "저희는 지난 3개월간...")
4. vision_data의 visual_usp를 후킹 포인트로 사용하라.

[톤앤매너]
- 겸손하지만 자신감 있게
- 강요하지 말고 호기심 유발
- 전문성 + 친근함
Output:
json{
  "steps": [
    {
      "step_number": 1,
      "step_type": "Hook",
      "email_subject": "글로우업 상세페이지 본 마케터의 관찰",
      "email_body": "안녕하세요...\n{{custom_context_integrated}}\n\n리포트: https://linkpitch.com/r/xxx"
    },
    // ... 총 9개
  ]
}
4.3 예고편 제작: 스텝 재생성 (/webhook/regenerate-step)
Input:
json{
  "step_id": "uuid",
  "step_number": 3,
  "brand_name": "글로우업",
  "current_body": "기존 이메일 내용...",
  "source_material": {
    "vision_data": { ... },
    "custom_context": "지난 3개월간..."
  },
  "strategy_chip": "📷 성과 그래프"
}
System Prompt Rule:
[재작성 규칙]
1. current_body의 핵심 메시지는 유지하되, strategy_chip을 자연스럽게 통합하라.
2. custom_context를 근거로 신뢰도를 높여라.
3. strategy_chip이 이미지 관련이면:
   - "아래 자료를 보시면..." 같은 문장 추가
   - [ 📷 여기에 (성과 그래프) 이미지를 붙여넣으세요 ] 마커 삽입

[이미지 칩 처리 예시]
입력: "📷 성과 그래프"
출력:
"...저희 클라이언트는 3개월 만에 ROAS 280% 달성했습니다.

[ 📷 여기에 (성과 그래프) 이미지를 붙여넣으세요 ]

같은 전략을 적용하면..."
Output:
json{
  "email_body": "새로 작성된 텍스트...\n\n[ 📷 여기에 (성과 그래프) 이미지를 붙여넣으세요 ]\n\n..."
}

5. 시스템 역할 분담 (System Architecture)
구분기능담당방식이유AI (Brain)1. URL 분석 (Vision)n8nanalyze-url이미지 분석 및 구조화AI (Brain)2. 초기 9개 생성n8ngenerate-sequence자연스러운 데이터 주입AI (Brain)3. 칩 드래그 수정n8nregenerate-step맥락 이해 및 재작성DB (Speed)4. 발송 완료 체크Next.jsServer Action단순 상태 변경DB (Speed)5. 리포트 추적Next.jsServer Action빠른 이벤트 로깅DB (Speed)6. Hot Lead 변경Next.jsServer Action조건 충족 시 즉시 반영

6. 개발 가이드 (Cursor Instructions)
6.1 기본 원칙

DB 마이그레이션 금지: supabase/migrations 생성하지 말 것 (사용자가 직접 SQL 실행)
타입 정의: types/ 폴더에 JSONB 구조와 Enum 값 정확히 반영
상태 관리: Custom Context와 Drag State는 Zustand로 전역 관리
최적화: 리포트 페이지 스크롤 이벤트는 Debounce 처리

6.2 폴더 구조
app/
├─ (auth)/
│  └─ sign-in/
├─ dashboard/
│  └─ page.tsx (CRM Table)
├─ prospects/
│  ├─ new/
│  │  └─ page.tsx (Vision Analysis)
│  └─ [id]/
│     └─ mix/
│        └─ page.tsx (Insight Mixer)
├─ r/
│  └─ [id]/
│     └─ page.tsx (Report Page)
└─ actions/
   ├─ analyze-url.ts
   ├─ generate-sequence.ts
   ├─ regenerate-step.ts
   ├─ update-step-status.ts
   └─ log-report-event.ts

components/
├─ dashboard/
│  └─ ProspectsTable.tsx
├─ mixer/
│  ├─ StrategyConsole.tsx (Sidebar)
│  ├─ SequencePlaylist.tsx (Main)
│  ├─ StepCard.tsx
│  └─ StrategyChip.tsx
└─ report/
   └─ ReportViewer.tsx

store/
└─ mixer-store.ts (Zustand)

types/
├─ prospect.ts
├─ sequence.ts
└─ step.ts

hooks/
└─ use-report-tracking.ts
6.3 핵심 Server Actions
log-report-event.ts
typescript'use server'

export async function logReportEvent(
  prospectId: string,
  eventType: 'view' | 'scroll_50' | 'scroll_80' | 'dwell_10s' | 'dwell_30s',
  metadata?: any
) {
  // 1. report_events 테이블에 INSERT
  await supabase.from('report_events').insert({
    prospect_id: prospectId,
    event_type: eventType,
    metadata
  })

  // 2. CRM 상태 승격 체크
  const events = await getEventsByProspect(prospectId)
  
  let newStatus = 'cold'
  
  if (hasEvent(events, 'scroll_80') && hasEvent(events, 'dwell_30s')) {
    newStatus = 'hot'
  } else if (hasEvent(events, 'scroll_50') && hasEvent(events, 'dwell_10s')) {
    newStatus = 'warm'
  }

  // 3. prospects 테이블 업데이트
  await supabase
    .from('prospects')
    .update({ 
      crm_status: newStatus,
      last_viewed_at: new Date()
    })
    .eq('id', prospectId)

  // 4. 재방문 체크 (1시간 경과)
  const prospect = await getProspect(prospectId)
  const lastView = new Date(prospect.last_viewed_at)
  const now = new Date()
  
  if ((now - lastView) > 3600000) { // 1시간
    await supabase
      .from('prospects')
      .update({ 
        visit_count: prospect.visit_count + 1 
      })
      .eq('id', prospectId)
  }
}

7. 마일스톤 (개발 순서)
Phase 1: 기반 구축 (Week 1)

 Clerk 인증 설정
 Supabase SQL 실행 및 타입 정의
 Dashboard UI (Table) 구현

Phase 2: 핵심 기능 (Week 2-3)

 Vision 분석 로딩 애니메이션
 Insight Mixer 레이아웃 (Sidebar + Main)
 dnd-kit 연동 (드래그 앤 드롭)
 n8n Webhook 연결 및 테스트

Phase 3: 추적 및 최적화 (Week 4)

 리포트 페이지 (/r/[id]) 구현
 행동 추적 로직 (use-report-tracking)
 CRM 상태 자동 업데이트
 Optimistic UI (Copy & Log)

Phase 4: 폴리싱 (Week 5)

 요금제별 쿼터 제한 로직
 에러 핸들링 및 Toast 알림
 성능 최적화 (Debounce, Lazy Load)
 모바일 반응형 (선택)


8. 성공 지표 (Success Metrics)
MVP 검증

 1명의 마케터가 3개 Prospect 등록 완료
 9개 Step 생성 및 5개 이상 Copy & Log
 1개 이상의 Hot Lead 전환 (80% 스크롤 + 30초 체류)

제품 완성도

 Vision 분석 완료율 95% 이상 (에러율 5% 이하)
 드래그 앤 드롭 성공률 100%
 리포트 페이지 로딩 속도 2초 이하