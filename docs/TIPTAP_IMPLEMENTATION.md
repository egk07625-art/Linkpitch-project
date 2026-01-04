# Tiptap Editor 구현 완료 문서

## 개요

Monaco Editor를 Tiptap 기반의 고도화된 리치 텍스트 에디터로 교체하여 이미지, 테이블, 색상, 정렬 등 다양한 편집 기능을 추가했습니다.

## 구현 내용

### 1. 설치된 패키지

```bash
@tiptap/extension-image
@tiptap/extension-table
@tiptap/extension-table-row
@tiptap/extension-table-cell
@tiptap/extension-table-header
@tiptap/extension-text-align
@tiptap/extension-color
@tiptap/extension-text-style
@tiptap/extension-highlight
@tiptap/extension-code-block-lowlight
@tiptap/extension-horizontal-rule
lowlight
```

### 2. 생성된 컴포넌트

#### EmailEditor (`components/EmailEditor.tsx`)
- **기능**: 이메일 본문 편집
- **Props**:
  - `content`: n8n/Supabase 데이터
  - `onChange`: HTML 문자열 변경 핸들러
  - `onImageUpload`: 이미지 업로드 핸들러 (Supabase Storage)
  - `placeholder`: 플레이스홀더 텍스트
  - `editable`: 편집 가능 여부

#### ReportEditor (`components/ReportEditor.tsx`)
- **기능**: 리포트 본문 편집
- **Props**: EmailEditor와 동일
- **차이점**: 플레이스홀더 텍스트만 다름

### 3. 편집 기능

#### 기본 텍스트 편집
- ✅ Bold, Italic, Underline
- ✅ Heading 1, 2, 3
- ✅ Bullet List, Ordered List
- ✅ Undo, Redo

#### 텍스트 정렬
- ✅ 좌측 정렬
- ✅ 중앙 정렬
- ✅ 우측 정렬

#### 색상 및 하이라이트
- ✅ 텍스트 색상 (8가지 색상 팔레트)
- ✅ 하이라이트 (6가지 배경색 팔레트)

#### 이미지
- ✅ 이미지 업로드 버튼
- ✅ Supabase Storage 통합 (`app-assets` 버킷)
- ✅ 파일 타입 검증 (image/* 만 허용)
- ✅ 파일 크기 검증 (5MB 제한)
- ✅ 업로드 중 로딩 인디케이터
- ✅ 에러 처리 (toast 알림)

#### 테이블
- ✅ 3x3 테이블 삽입 (헤더 포함)
- ✅ 열 추가/삭제 (앞/뒤)
- ✅ 행 추가/삭제 (위/아래)
- ✅ 셀 병합/분리
- ✅ 테이블 삭제
- ✅ 테이블 활성화 시 컨트롤 툴바 표시

#### 코드 블록
- ✅ Syntax highlighting
- ✅ JavaScript, TypeScript, Python, CSS 지원
- ✅ 스타일링 (다크 배경, 스크롤 가능)

#### 기타
- ✅ 수평선 (Horizontal Rule)
- ✅ 링크 삽입

### 4. 데이터 흐름 검증

#### n8n → Tiptap
1. **n8n 데이터 수신**: `generated_emails.email_body` (TEXT)
2. **데이터 전처리**: `getCleanHtml()` 함수
   - `\n`, `<br>` 태그 처리
   - 역슬래시 제거
   - 마크다운 → HTML 변환
3. **Tiptap 로드**: `editor.commands.setContent(cleanHtml)`

#### Tiptap → Supabase
1. **편집 이벤트**: `onUpdate` 핸들러
2. **HTML 추출**: `editor.getHTML()`
3. **onChange 콜백**: `handleEmailBodyChange(html)` 또는 `handleReportMarkdownChange(html)`
4. **Ref 업데이트**: `emailBodyRef.current = html`
5. **자동 저장**: `debouncedAutoSave()` (3초 디바운스)
6. **DB 저장**: `handleSaveDraft()`
   ```typescript
   supabase
     .from('generated_emails')
     .update({
       email_body: currentEmailBody,
       report_markdown: currentReportMarkdown,
       ...
     })
   ```

#### 이미지 업로드 흐름
1. **파일 선택**: 툴바 이미지 버튼 또는 파일 입력
2. **검증**: 타입 및 크기 확인
3. **Storage 업로드**: `uploadImageToStorageClient(file)`
   - 버킷: `app-assets`
   - 경로: `{clerk_id}/{timestamp}-{filename}`
4. **공개 URL 생성**: `supabase.storage.getPublicUrl()`
5. **에디터 삽입**: `editor.chain().focus().setImage({ src: url }).run()`

### 5. InsightMixerClient 통합

#### 변경 사항
- **Email 탭**: Monaco Editor → EmailEditor
- **Report 탭**: Monaco Editor → ReportEditor
- **이미지 업로드**: `uploadImageToStorageClient` prop 전달
- **onChange 핸들러**: 기존 핸들러 재사용 (`handleEmailBodyChange`, `handleReportMarkdownChange`)

#### 코드 변경 위치
- 파일: `app/prospects/[id]/mix/insight-mixer-client.tsx`
- Import 추가 (라인 15-17):
  ```typescript
  import EmailEditor from '@/components/EmailEditor';
  import ReportEditor from '@/components/ReportEditor';
  ```
- Email 탭 (라인 2063-2074):
  ```typescript
  <EmailEditor
    content={emailBody || getCleanBody()}
    onChange={handleEmailBodyChange}
    onImageUpload={uploadImageToStorageClient}
    placeholder="이메일 내용을 작성하세요..."
    editable={true}
  />
  ```
- Report 탭 (라인 2076-2085):
  ```typescript
  <ReportEditor
    content={reportMarkdown || currentStepData?.report_markdown || '...'}
    onChange={handleReportMarkdownChange}
    onImageUpload={uploadImageToStorageClient}
    placeholder="리포트 내용을 작성하세요..."
    editable={true}
  />
  ```

## 테스트 체크리스트

### 기능 테스트 (사용자가 실행 필요)

#### 기본 편집
- [ ] Bold, Italic, Underline 적용
- [ ] Heading 1, 2 삽입
- [ ] Bullet List, Ordered List 생성
- [ ] Undo/Redo 동작

#### 텍스트 정렬
- [ ] 좌측/중앙/우측 정렬
- [ ] Heading과 Paragraph에 정렬 적용

#### 색상
- [ ] 텍스트 색상 변경 (8가지 색상)
- [ ] 하이라이트 적용 (6가지 색상)

#### 이미지
- [ ] 이미지 업로드 버튼 클릭
- [ ] 이미지 파일 선택 및 업로드
- [ ] Supabase Storage에 저장 확인
- [ ] 에디터에 이미지 표시 확인
- [ ] 5MB 초과 파일 업로드 시 에러 메시지
- [ ] 이미지 아닌 파일 업로드 시 에러 메시지

#### 테이블
- [ ] 3x3 테이블 삽입
- [ ] 열 추가 (앞/뒤)
- [ ] 행 추가 (위/아래)
- [ ] 셀 병합
- [ ] 셀 분리
- [ ] 열/행 삭제
- [ ] 테이블 삭제

#### 코드 블록
- [ ] 코드 블록 삽입
- [ ] JavaScript 코드 입력 및 하이라이팅
- [ ] TypeScript 코드 입력 및 하이라이팅

#### 기타
- [ ] 수평선 삽입
- [ ] 링크 삽입 및 편집

### 데이터 흐름 테스트

#### n8n → Tiptap
- [ ] n8n에서 생성된 이메일 본문 로드
- [ ] `<br>`, `\n` 등 특수 문자 정상 처리
- [ ] 마크다운 문법 HTML 변환

#### Tiptap → Supabase
- [ ] 편집 후 자동 저장 (3초 후)
- [ ] Supabase에 HTML 저장 확인
- [ ] 새로고침 후 데이터 정상 로드

#### 이미지 업로드
- [ ] Storage에 이미지 업로드
- [ ] 공개 URL 생성
- [ ] DB에 이미지 URL 포함된 HTML 저장
- [ ] 재로드 시 이미지 정상 표시

### 에지 케이스

#### 에러 처리
- [ ] Storage RLS 정책 오류 처리
- [ ] 네트워크 오류 시 에러 메시지
- [ ] 대용량 파일 업로드 차단

#### 성능
- [ ] 큰 HTML 콘텐츠 렌더링
- [ ] 여러 이미지 포함 시 성능
- [ ] 자동 저장 디바운스 동작

#### 커서 위치
- [ ] 편집 중 커서 위치 유지
- [ ] 외부 데이터 업데이트 시 커서 리셋 안됨
- [ ] 포커스 상태에서 외부 업데이트 무시

## 잠재적 문제 및 해결 방법

### 1. RLS 정책 오류
**증상**: "new row violates row-level security policy" 에러

**해결**:
```bash
# Supabase Dashboard에서 실행
cd /home/bc009/projects/LinkPitch-MVP-project/LinkPitch-MVP-project-main
supabase db push

# 또는 수동으로 정책 적용
# supabase/migrations/20250101000000_setup_storage_rls.sql 참조
```

### 2. 이미지 URL 불일치
**증상**: Storage 공개 URL 생성 실패

**해결**:
- Supabase Dashboard → Storage → Buckets
- `app-assets` 버킷 Public 설정 확인
- RLS 정책 확인

### 3. 에디터 커서 리셋
**증상**: 편집 중 커서가 처음으로 이동

**원인**: React 재렌더링

**해결**: 이미 적용됨
- `emailBodyRef` 사용 (상태 업데이트 최소화)
- `immediatelyRender: false` 옵션
- `useEffect` 의존성 최적화

### 4. HTML/Markdown 변환 손실
**증상**: 특정 HTML 태그나 마크다운 손실

**해결**:
- `getCleanHtml()` 함수 개선
- `marked.parse()` 옵션 조정
- Tiptap 확장 추가

## 다음 단계

### 1. 테스트 실행
사용자가 위 테스트 체크리스트를 실행하고 결과를 확인합니다.

### 2. 추가 기능 (선택사항)
- 이미지 리사이징 UI
- 테이블 스타일링 옵션
- 더 많은 코드 언어 지원
- 드래그앤드롭 이미지 업로드

### 3. 최적화
- Lazy loading 적용
- 이미지 압축
- 에디터 초기화 최적화

## 참고 문서

- [Tiptap 공식 문서](https://tiptap.dev/)
- [Supabase Storage 문서](https://supabase.com/docs/guides/storage)
- [프로젝트 AGENTS.md](../AGENTS.md)
- [Storage Setup 가이드](./STORAGE_SETUP.md)

