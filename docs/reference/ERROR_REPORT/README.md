# Error Report System

에러 발생 및 해결 시 JSON 형식의 상세 리포트를 작성하고 관리하는 시스템입니다.

## 목적

- 해결된 에러를 체계적으로 기록하여 재발 방지
- 유사한 에러 발생 시 기존 해결 방법 참조
- 프로젝트의 에러 해결 히스토리 유지

## 핵심 원칙

- **Git 푸시 완료가 에러 해결의 최종 확인 기준**
- Git 푸시 전에는 에러 리포트에 추가하지 않음 (수정만으로는 해결 확인 불가)
- 해결된 에러만 기록 (status는 항상 "resolved")
- **"푸쉬" 명령 시 자동으로 에러 리포트 업데이트**

## 자동 업데이트 워크플로우

### 1. 에러 발생 및 해결

1. 에러 발생
2. `docs/reference/ERROR_REPORT/errors.json` 확인 (유사한 에러 검색)
3. 코드 수정 및 테스트
4. Git 커밋 (커밋 메시지에 에러 해결 내용 포함 권장)

### 2. Git 푸시 시 자동 업데이트

**"푸쉬"** 명령 실행 시:

1. 최근 커밋 메시지 분석
   - 에러 해결 관련 키워드 감지 (`fix`, `error`, `bug`, `resolve`, `해결` 등)
2. 커밋 변경사항 분석
   - 에러 관련 파일 확인
3. 에러 정보 확인 요청
   - AI가 사용자에게 에러 정보 확인 요청
4. errors.json 자동 업데이트
   - 새로운 에러 항목 추가
   - Git 커밋 해시 및 푸시 시간 자동 기록
5. 에러 리포트도 함께 커밋 및 푸시

## JSON 스키마

### 에러 항목 구조

```json
{
  "id": "YYYY-MM-DD-category-description",
  "error_message": "원본 에러 메시지",
  "error_category": "middleware|database|api|build|runtime",
  "related_files": ["file1.ts", "file2.ts"],
  "occurred_at": "2024-11-18T11:00:00Z",
  "occurred_commit_hash": "3970b67",
  "resolution": "해결 방법 상세 설명",
  "reproduction_steps": [
    "재현 단계 1",
    "재현 단계 2"
  ],
  "references": [
    "https://example.com/docs"
  ],
  "issue_number": "선택사항",
  "status": "resolved",
  "resolved_at": "2024-11-18T13:27:10+09:00",
  "resolved_commit_hash": "33101b3",
  "pushed_at": "2024-11-18T13:27:14+09:00"
}
```

### 필드 설명

- `id`: 고유 식별자 (타임스탬프-카테고리-설명 형식)
- `error_message`: 원본 에러 메시지 (검색에 사용)
- `error_category`: 에러 카테고리 (middleware, database, api, build, runtime)
- `related_files`: 관련 파일 경로 배열
- `occurred_at`: 에러 발생 날짜/시간 (ISO 8601)
- `occurred_commit_hash`: 에러 발생 시점의 Git 커밋 해시
- `resolution`: 해결 방법 (상세 설명, 재발 방지를 위해 명확히 작성)
- `reproduction_steps`: 재현 단계 (배열, 선택사항)
- `references`: 참고 링크 (문서, 이슈 등, 선택사항)
- `issue_number`: 관련 이슈 번호 (선택사항)
- `status`: 항상 "resolved" (해결된 에러만 기록)
- `resolved_at`: 해결 날짜/시간 (ISO 8601)
- `resolved_commit_hash`: 해결 커밋 해시 (Git 푸시된 커밋)
- `pushed_at`: Git 푸시 완료 날짜/시간 (ISO 8601)

## 에러 카테고리

- `middleware`: Next.js middleware 관련 에러
- `database`: Supabase/PostgreSQL 관련 에러
- `api`: API 라우트 관련 에러
- `build`: 빌드 과정 관련 에러
- `runtime`: 런타임 에러

## 사용 방법

### 에러 발생 시

1. **먼저 errors.json 확인**
   - 유사한 에러가 이미 해결되었는지 검색
   - 기존 해결 방법 참조

2. **에러 해결 시도**
   - 코드 수정 및 테스트
   - Git 커밋 (커밋 메시지에 에러 해결 내용 포함)

3. **Git 푸시**
   - "푸쉬" 명령 실행 시 자동으로 에러 리포트 업데이트
   - AI가 에러 정보 확인 요청
   - errors.json에 자동 추가

### 수동으로 에러 리포트 추가 (권장하지 않음)

Git 푸시 후 수동으로 추가해야 하는 경우:

1. `docs/reference/ERROR_REPORT/errors.json` 파일 열기
2. `errors` 배열에 새 항목 추가
3. 모든 필수 필드 작성
4. Git 커밋 및 푸시

## 검색 방법

에러 발생 시 errors.json에서 검색:

1. **에러 메시지 키워드**: 에러 메시지의 핵심 단어로 검색
2. **카테고리**: `error_category`로 필터링
3. **관련 파일**: `related_files`에서 파일명으로 검색
4. **커밋 해시**: `occurred_commit_hash` 또는 `resolved_commit_hash`로 검색

## 주의사항

- **Git 푸시 전에는 절대 에러 리포트에 추가하지 않음**
- 해결되지 않은 에러는 기록하지 않음
- 중복 에러는 하나의 항목으로 통합 (같은 에러 메시지와 해결 방법인 경우)
- `pushed_at` 필드는 Git 푸시 완료 시간을 정확히 기록

## 예시

최근 해결된 에러 예시는 `errors.json` 파일을 참고하세요.

