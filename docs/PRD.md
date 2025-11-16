# Linkpitch – Dev PRD v1 (Next.js 보일러플레이트용)

> 퍼포먼스 마케터를 위한 콜드메일·시퀀스 비서  
> 이 문서는 **Next.js 프로젝트 안에서 개발자가 항상 참고하는 요약 사양서**입니다.  
> (Auth = Clerk, DB = Supabase(+RLS), 오케스트레이션 = n8n, LLM = OpenAI)

---

## 0. 목적

- 이 파일 하나로, 개발자는:
  - **무엇을** 만들지 (기능/화면)
  - **어떤 스택으로** 만들지 (Next.js, Clerk, Supabase, n8n)
  - **어디가 어디랑 연결되는지** (페이지 ↔ DB ↔ n8n/LLM)
  를 빠르게 이해하고, 구현 중 헷갈릴 때 기준점으로 삼는다.

---

## 1. 제품 요약

### 1.1 미션

> 퍼포먼스 마케터가 콜드메일을 쓰고 관리하는 시간을  
> **6시간 → 10분**으로 줄이는 “AI 수주 비서”.

### 1.2 핵심 사용자 플로우

1. 마케터가 **Prospect(타겟 브랜드) 정보 + Step 타입**을 입력한다.
2. Linkpitch가 **인사이트 + 콜드메일 초안**을 생성한다.
3. 마케터는 회사 이메일로 실제 발송한다.
4. Linkpitch에서:
   - 누구에게 몇 통 보냈는지
   - 읽음/회신 여부
   - 리포트(행동 데이터 기반 관여도)  
   를 시퀀스/보낸 메일 화면에서 관리한다.

---

## 2. 기술 스택

### 2.1 Frontend

- **Next.js (App Router, TypeScript)**
- **React**
- **Tailwind CSS** + **shadcn/ui**
- 상태 관리: 기본은 React state + 서버 컴포넌트, 필요 시 `@tanstack/react-query` 선택

### 2.2 Auth (Clerk)

- **Clerk** 단일 Auth Provider
  - 로그인/회원가입/세션 관리는 Clerk가 담당
  - 프론트/서버에서 `userId`를 가져와 Supabase 쿼리의 기준으로 사용

### 2.3 Database (Supabase with RLS)

- Supabase PostgreSQL
- 주요 테이블:
  - `prospects`
  - `sequences`
  - `steps`
  - `generation_logs`
  - `reports`
  - `report_events`
- **RLS 기본 전략**:
  - 모든 테이블에 `user_id text` (Clerk의 `userId` 저장)
  - 정책: `user_id = jwt.user_id` 인 row만 접근 가능
  - Clerk JWT를 Supabase에 **External JWT**로 전달하는 구조

### 2.4 오케스트레이션 & LLM

- **n8n (Docker, Self-hosted)**
  - Webhook → Function(프롬프트 생성) → OpenAI → Response 정리
- **OpenAI API (GPT 계열)**

---

## 3. 페이지 & 레이아웃 구조

+---------------------------------------------------+
|                    Top Header                     |
|  - Logo / Linkpitch                               |
|  - User 메뉴 (Clerk User Dropdown)                |
+----------------------+----------------------------+
|      Side Nav        |        Main Content        |
|  - 대시보드          |  - 각 페이지의 실제 내용   |
|  - 시퀀스            |  - 카드/테이블/폼 등       |
|  - 보낸 메일         |                            |
|  - (설정)            |                            |
+----------------------+----------------------------+

### 3.1 라우트 개요

#### 퍼블릭

- `/`
  - 랜딩 페이지
  - Linkpitch 소개 + “시작하기” CTA

#### 앱 내부 (Clerk 로그인 필요)

- `/app`
  - 메인 대시보드
- `/app/create` (또는 `/app` 내 섹션)
  - Prospect + Step 생성 폼
- `/app/sequences`
  - 타겟(Prospect) 리스트 + 시퀀스 진행 요약
- `/app/sequences/[id]`
  - 특정 타겟의 Step 히스토리
- `/app/sent`
  - 보낸 메일 전체 목록
- `/app/logs` (옵션)
  - `generation_logs` 관리용

#### 리포트 뷰

- `/r/[reportId]`
  - Step별 마이크로 리포트 뷰
  - view/dwell_time/scroll_depth/interaction 이벤트 로깅

### 3.2 Next.js 폴더 구조 초안

```text
app/
 ├─ page.tsx                 # / (랜딩)
 ├─ app/
 │   ├─ layout.tsx           # /app 공통 레이아웃 (헤더/사이드바)
 │   ├─ page.tsx             # /app (대시보드)
 │   ├─ create/
 │   │   └─ page.tsx         # /app/create (생성 폼)
 │   ├─ sequences/
 │   │   ├─ page.tsx         # /app/sequences (리스트)
 │   │   └─ [id]/
 │   │       └─ page.tsx     # /app/sequences/[id] (타겟 상세)
 │   ├─ sent/
 │   │   └─ page.tsx         # /app/sent (보낸 메일)
 │   └─ logs/
 │       └─ page.tsx         # /app/logs (옵션)
 ├─ r/
 │   └─ [id]/
 │       └─ page.tsx         # /r/[id] (리포트 뷰)
 └─ api/
     └─ generate-step/
         └─ route.ts         # n8n Webhook 호출용 API


