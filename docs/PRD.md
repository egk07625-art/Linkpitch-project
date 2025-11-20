# Linkpitch – Dev PRD v1 (Next.js 보일러플레이트용)# 제품 요구사항 정의서 (PRD): LinkPitch MVP v3

## 1. 프로젝트 개요 (Context)
**LinkPitch**는 퍼포먼스 마케터들이 Vision AI를 활용해 '전략형 콜드메일'을 생성하고, 개인화 리포트 링크를 통해 잠재 고객의 관심도를 추적하는 SaaS 도구입니다.

**핵심 기술 스택:**
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend/DB:** Supabase (PostgreSQL, Auth, Realtime)
- **AI/Logic:** n8n Webhooks (ScreenshotOne & Gemini 3.0 Pro 연동)
- **UI Library:** Shadcn/UI

---

## 2. 데이터베이스 스키마 (Supabase)

AI는 `supabase/migrations` 경로에 아래 테이블들을 생성해야 함.

### 2.1 `prospects` (잠재 고객) 테이블
타겟 고객 정보와 Vision AI 분석 결과를 저장.

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (기본키) |
| `user_id` | UUID | `auth.users` 참조 (사용자 구분) |
| `url` | Text | 타겟 URL (스마트스토어, 랜딩페이지 등) |
| `brand_name` | Text | AI가 추출하거나 사용자가 입력한 브랜드명 |
| `vision_data` | JSONB | **[핵심]** Vision AI 분석 데이터 (visual_usp, mood, price 등) |
| `crm_status` | Text | 'cold', 'warm', 'hot' (기본값: 'cold') |
| `created_at` | Timestamptz | 생성 일시 |

### 2.2 `steps` (이메일 시퀀스) 테이블
각 고객별 생성된 이메일 단계(Step) 저장.

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `prospect_id` | UUID | `prospects.id` 참조 |
| `step_number` | Integer | 시퀀스 순서 (1, 2, 3...) |
| `email_content` | Text | 생성된 이메일 본문 |
| `is_sent` | Boolean | 사용자가 수동으로 '발송 완료' 처리했는지 여부 |
| `sent_at` | Timestamptz | 발송 완료 버튼 누른 시간 |

### 2.3 `report_events` (추적 로그) 테이블
고객이 리포트 링크를 방문했을 때 발생하는 행동 데이터 저장.

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `prospect_id` | UUID | `prospects.id` 참조 |
| `event_type` | Text | 'view'(접속), 'dwell_10s'(10초 체류), 'scroll_60'(스크롤 60%) |
| `created_at` | Timestamptz | 이벤트 발생 시간 |

---

## 3. 페이지별 기능 요구사항 (Functional Requirements)

### 3.1 대시보드 (`/dashboard`)
- **로직:**
    - `prospects`와 `steps`를 조인(Join)하여 데이터 호출.
    - 필터/정렬: 'Hot' 리드(관심도 높음)를 최상단에 표시.
    - '오늘의 할 일': 아직 발송하지 않은 Step 목록 표시.
- **UI 상호작용:**
    - 고객 클릭 시 -> 해당 고객의 상세 페이지(Mixer)로 이동.
    - "빠른 추가(Quick Add)" 인풋 -> URL 입력 시 `/prospects/new`로 파라미터와 함께 이동.

### 3.2 Vision 분석 플로우 (`/prospects/new`)
- **로직:**
    1.  사용자가 URL 제출.
    2.  **Frontend:** `AnalysisTerminal` 컴포넌트 표시 (대기 시간 동안 가짜 로그 애니메이션 재생).
    3.  **Backend:** n8n Webhook 호출 (`POST /analyze-url`).
        - *참고: MVP 개발 단계에서는 n8n이 준비 안 됐으면 Mock 데이터 사용.*
    4.  **응답(Response):** JSON 데이터 수신 `{ brand_name, vision_data: {...} }`.
    5.  **DB 액션:** `prospects` 테이블에 데이터 저장.
    6.  **리다이렉트:** `/prospects/[id]/mix` 페이지로 이동.

### 3.3 인사이트 믹서 (`/prospects/[id]/mix`)
**"인간과 AI의 협업"이 일어나는 핵심 작업 공간.**

- **좌측 패널 (Vision Fact - AI의 눈):**
    - DB의 `prospects.vision_data` (JSONB)를 시각화.
    - 표시 항목: 분위기(mood), 가격 제안(price_offer), 시각적 강점(visual_usp), 스크린샷 이미지.
    - *요구사항:* AI가 틀렸을 경우 사용자가 필드를 수정할 수 있어야 함 (DB 업데이트).

- **우측 패널 (Strategy Editor - 마케터의 뇌):**
    - **드래그 앤 드롭:** `StrategyChip` 컴포넌트 구현.
    - **로직:**
        - 칩을 클릭하거나 드래그하면 에디터에 텍스트가 추가됨.
        - 칩 예시: "가격 경쟁력 언급", "숏폼 제안", "UX 문제 지적".
    - **생성 (Generation):**
        - "매직 메일 생성" 버튼 클릭 -> n8n Webhook 호출 (`POST /generate-email`).
        - 전송 데이터: `vision_data` + `user_strategy_text`(사용자 입력값).
        - 결과: 생성된 이메일 텍스트를 에디터에 표시 (스트리밍 권장).
    - **액션 (Logging):**
        - "복사 및 발송 기록(Copy & Log Sent)" 버튼:
        - 클립보드에 본문 복사 AND `steps` 테이블 업데이트 (`is_sent=true`).

### 3.4 리포트 페이지 (`/r/[id]`)
**최종 고객(Prospect)이 모바일에서 보게 될 페이지.**

- **접근 제어:** 로그인 없이 누구나 접속 가능 (Public).
- **콘텐츠:** `vision_data`를 요약해서 보여줌 (예: "OOO 브랜드가 성장할 수 있는 3가지 이유").
- **추적 로직 (매우 중요):**
    - **접속 시:** 즉시 `view` 이벤트 전송 (Server Action).
    - **타이머:** 10초 경과 시 `dwell_10s` 이벤트 전송 -> 해당 고객 `crm_status`를 'warm'으로 업데이트.
    - **스크롤:** 페이지의 60% 이상 스크롤 시 `scroll_60` 이벤트 전송 -> 해당 고객 `crm_status`를 'hot'으로 업데이트.

---

## 4. API / Webhook 명세 (n8n 연동)

### 4.1 URL 분석 Webhook
- **Endpoint:** (설정된 n8n URL) `/webhook/analyze-url`
- **Method:** POST
- **Input:** `{ "url": "https://smartstore..." }`
- **Output (예상 JSON):**
```json
{
  "brand_name": "글로우업",
  "vision_data": {
    "mood": "고급스럽고 깔끔함",
    "price_offer": "1+1 이벤트 중",
    "visual_usp": ["HACCP 인증 마크", "슬로우 모션 움짤"],
    "review_summary": "평점 4.9점"
  },
  "screenshot_url": "https://screenshotone.com/..."
}

### 4.2 이메일 생성 Webhook
- **Endpoint:** (설정된 n8n URL) `/webhook/generate-email`
- **Input:**
```json
{
  "brand_name": "글로우업",
  "vision_data": { "mood": "...", "visual_usp": [...] },
  "strategy_keywords": ["숏폼 제안", "가격 언급"]
}
- **Output:** `{ "email_body": "대표님 안녕하세요..." }`

---

## 5. 개발 우선순위 (Cursor 지시 가이드)

1.  **스키마 설정:** Supabase 마이그레이션 파일을 생성하여 테이블 구조 잡기.
2.  **타입 정의:** `types/*.ts` 파일을 생성하여 DB 스키마와 일치시키기.
3.  **핵심 기능 - 믹서(Mixer):** 좌우 분할 UI와 드래그 앤 드롭 로직 구현.
4.  **핵심 기능 - 추적(Tracking):** 리포트 페이지 및 이벤트 로깅 구현.
5.  **연동(Integration):** UI와 n8n Webhook 연결 (초기엔 Mock 함수로 테스트).


