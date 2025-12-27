-- ================================================================
-- LinkPitch MVP v8.6 - Test Data (Realistic E-commerce Agency Workflow)
-- 마케터 김철수가 3개 고객사를 관리하는 시나리오
-- 현재 스키마 구조에 맞게 업데이트됨
-- ================================================================

-- [1] 테스트 유저 생성
INSERT INTO users (id, clerk_id, email, name) VALUES
('11111111-1111-1111-1111-111111111111', 'clerk_test_user_001', 'kimcs@linkpitch.com', '김철수')
ON CONFLICT (clerk_id) DO NOTHING;

-- [2] 사이트 분석 캐시 (1개 URL, 재사용 시나리오 테스트)
INSERT INTO site_analysis_cache (id, url_hash, url, full_screenshot_url, vision_data) VALUES
('22222222-2222-2222-2222-222222222222', 
 md5('https://oliveyoung-store.com'),
 'https://oliveyoung-store.com',
 'https://storage.example.com/screenshots/oliveyoung_full.png',
 '{
   "summary": "뷰티 이커머스 상세페이지. 모바일 최적화 우수하나 CTA 버튼 위치 개선 필요",
   "leaks": [
     {
       "id": "leak_1",
       "issue": "구매 버튼이 첫 화면에 없음 (스크롤 필요)",
       "impact": "모바일 이탈률 25% 증가 예상",
       "box": [120, 1200, 800, 80],
       "crop_url": "https://storage.example.com/crops/leak_1.png"
     },
     {
       "id": "leak_2",
       "issue": "리뷰 섹션 부재 (사회적 증거 없음)",
       "impact": "전환율 15% 하락 가능성",
       "box": [120, 800, 800, 400],
       "crop_url": "https://storage.example.com/crops/leak_2.png"
     },
     {
       "id": "leak_3",
       "issue": "제품 이미지 해상도 낮음",
       "impact": "신뢰도 저하",
       "box": [120, 200, 800, 600],
       "crop_url": "https://storage.example.com/crops/leak_3.png"
     }
   ],
   "mood": "clean",
   "colors": ["#00C73C", "#FFFFFF", "#F5F5F5"]
 }'::jsonb)
ON CONFLICT (url_hash) DO NOTHING;

-- [3] 고객사 3개 (Hot / Warm / Cold 시나리오)

-- 🔥 HOT: 올리브영스토어 (리포트 80% 스크롤, 35초 체류)
INSERT INTO prospects (id, user_id, cache_id, name, contact_name, contact_email, url, crm_status, max_scroll_depth, max_duration_seconds, visit_count, last_activity_at) VALUES
('33333333-3333-3333-3333-333333333333',
 '11111111-1111-1111-1111-111111111111',
 '22222222-2222-2222-2222-222222222222',
 '올리브영스토어',
 '박지영 대표',
 'jiyoung@oliveyoung-store.com',
 'https://oliveyoung-store.com',
 'hot',
 85,
 35,
 3,
 NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- 🟡 WARM: 무신사스토어 (리포트 60% 스크롤, 20초 체류)
INSERT INTO prospects (id, user_id, cache_id, name, contact_name, contact_email, url, crm_status, max_scroll_depth, max_duration_seconds, visit_count, last_activity_at) VALUES
('44444444-4444-4444-4444-444444444444',
 '11111111-1111-1111-1111-111111111111',
 '22222222-2222-2222-2222-222222222222',
 '무신사스토어',
 '최민수 팀장',
 'minsu@musinsa-store.com',
 'https://musinsa-store.com',
 'warm',
 60,
 20,
 2,
 NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ❄️ COLD: 쿠팡스토어 (리포트 미열람)
INSERT INTO prospects (id, user_id, cache_id, name, contact_name, contact_email, url, crm_status, max_scroll_depth, max_duration_seconds, visit_count, last_activity_at) VALUES
('55555555-5555-5555-5555-555555555555',
 '11111111-1111-1111-1111-111111111111',
 '22222222-2222-2222-2222-222222222222',
 '쿠팡스토어',
 '이준호 대표',
 'junho@coupang-store.com',
 'https://coupang-store.com',
 'cold',
 0,
 0,
 0,
 NULL)
ON CONFLICT (id) DO NOTHING;

-- [4] 시퀀스 3개 (각 고객사당 1개씩)

INSERT INTO sequences (id, user_id, prospect_id, name, persona_type, status) VALUES
('66666666-6666-6666-6666-666666666666',
 '11111111-1111-1111-1111-111111111111',
 '33333333-3333-3333-3333-333333333333',
 '올리브영스토어 1차 제안',
 'researcher',
 'active'),

('77777777-7777-7777-7777-777777777777',
 '11111111-1111-1111-1111-111111111111',
 '44444444-4444-4444-4444-444444444444',
 '무신사스토어 1차 제안',
 'customer',
 'active'),

('88888888-8888-8888-8888-888888888888',
 '11111111-1111-1111-1111-111111111111',
 '55555555-5555-5555-5555-555555555555',
 '쿠팡스토어 1차 제안',
 'doctor',
 'draft')
ON CONFLICT (id) DO NOTHING;

-- [5] 스텝 15개 (5단계 × 3개 시퀀스)
-- v8.6 스키마: step 테이블은 sequence_id만 참조, 이메일 내용은 step_generations에 저장

-- 올리브영스토어 시퀀스 (Step 1-3 발송 완료, 4-5 대기)
INSERT INTO step (id, user_id, sequence_id, step_number, status, sent_at) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 1, 'sent', NOW() - INTERVAL '14 days'),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 2, 'sent', NOW() - INTERVAL '11 days'),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 3, 'sent', NOW() - INTERVAL '8 days'),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 4, 'pending', NULL),
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 5, 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- 무신사스토어 시퀀스 (Step 1-2 발송 완료)
INSERT INTO step (id, user_id, sequence_id, step_number, status, sent_at) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 1, 'sent', NOW() - INTERVAL '6 days'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 2, 'sent', NOW() - INTERVAL '3 days'),
('b3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 3, 'pending', NULL),
('b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 4, 'pending', NULL),
('b5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 5, 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- 쿠팡스토어 시퀀스 (Draft 상태, 발송 전)
INSERT INTO step (id, user_id, sequence_id, step_number, status, sent_at) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 1, 'pending', NULL),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 2, 'pending', NULL),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 3, 'pending', NULL),
('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 4, 'pending', NULL),
('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 5, 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- [6] Step Generations (발송된 스텝의 이메일 내용)
-- 올리브영스토어 Step 1-3
INSERT INTO step_generations (id, step_id, user_id, version_number, email_subject, email_body, status) VALUES
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 1,
 '올리브영스토어 상세페이지 본 마케터의 관찰',
 '안녕하세요 박지영 대표님. 올리브영스토어의 상세페이지를 자세히 봤습니다...',
 'completed'),

('f2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 1,
 '요즘 뷰티 이커머스의 공통적인 고민',
 '안녕하세요 박지영 대표님. 지난 1년간 뷰티 브랜드 50곳을 분석했는데...',
 'completed'),

('f3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 1,
 '올리브영스토어 상세페이지 개선 분석 리포트',
 '안녕하세요 박지영 대표님. 3가지 개선 기회를 발견했습니다...',
 'completed')
ON CONFLICT (id) DO NOTHING;

-- 무신사스토어 Step 1-2
INSERT INTO step_generations (id, step_id, user_id, version_number, email_subject, email_body, status) VALUES
('f4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 1,
 '무신사스토어 상세페이지 본 마케터의 관찰',
 '안녕하세요 최민수 팀장님. 무신사스토어의 상세페이지를 자세히 봤습니다...',
 'completed'),

('f5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 1,
 '요즘 패션 이커머스의 공통적인 고민',
 '안녕하세요 최민수 팀장님. 패션 브랜드들의 공통 고민을 발견했습니다...',
 'completed')
ON CONFLICT (id) DO NOTHING;

-- Step 테이블의 selected_generation_id 업데이트
UPDATE step SET selected_generation_id = 'f1111111-1111-1111-1111-111111111111' WHERE id = 'a1111111-1111-1111-1111-111111111111';
UPDATE step SET selected_generation_id = 'f2222222-2222-2222-2222-222222222222' WHERE id = 'a2222222-2222-2222-2222-222222222222';
UPDATE step SET selected_generation_id = 'f3333333-3333-3333-3333-333333333333' WHERE id = 'a3333333-3333-3333-3333-333333333333';
UPDATE step SET selected_generation_id = 'f4444444-4444-4444-4444-444444444444' WHERE id = 'b1111111-1111-1111-1111-111111111111';
UPDATE step SET selected_generation_id = 'f5555555-5555-5555-5555-555555555555' WHERE id = 'b2222222-2222-2222-2222-222222222222';

-- [7] 사용자 자산 2개 (PDF, 이미지)
INSERT INTO user_assets (id, user_id, file_type, file_url, file_name, summary) VALUES
('99999999-9999-9999-9999-999999999999',
 '11111111-1111-1111-1111-111111111111',
 'pdf',
 'https://storage.example.com/assets/proposal_template.pdf',
 '제안서_템플릿_v2.pdf',
 'LinkPitch 표준 제안서 템플릿 (ROAS 200% 달성 사례 포함)'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 '11111111-1111-1111-1111-111111111111',
 'image',
 'https://storage.example.com/assets/success_case.png',
 '성공사례_인포그래픽.png',
 'A사 3개월 만에 신규 고객 2배 증가 인포그래픽')
ON CONFLICT (id) DO NOTHING;

-- [8] 리포트 추적 로그 (올리브영스토어 HOT 전환 시나리오)

-- Session 1: 첫 방문 (스크롤 30%, 10초)
INSERT INTO report_tracking_logs (prospect_id, session_id, scroll_depth, duration_seconds, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 30, 10, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Session 2: 재방문 (스크롤 60%, 20초) → WARM 전환
INSERT INTO report_tracking_logs (prospect_id, session_id, scroll_depth, duration_seconds, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 60, 20, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Session 3: 정독 (스크롤 85%, 35초) → HOT 전환
INSERT INTO report_tracking_logs (prospect_id, session_id, scroll_depth, duration_seconds, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 85, 35, NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- 무신사스토어 WARM 시나리오
INSERT INTO report_tracking_logs (prospect_id, session_id, scroll_depth, duration_seconds, created_at) VALUES
('44444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 60, 20, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 테스트 데이터 삽입 완료!';
    RAISE NOTICE '👤 유저: 1명 (김철수)';
    RAISE NOTICE '🏢 고객사: 3개 (HOT 1, WARM 1, COLD 1)';
    RAISE NOTICE '🔄 시퀀스: 3개 (Active 2, Draft 1)';
    RAISE NOTICE '📧 스텝: 15개 (발송 완료 5, 대기 10)';
    RAISE NOTICE '📝 Step Generations: 5개 (발송된 스텝의 이메일 내용)';
    RAISE NOTICE '📁 자산: 2개 (PDF 1, 이미지 1)';
    RAISE NOTICE '📊 추적 로그: 4개 (CRM 자동 상태 변경 테스트용)';
    RAISE NOTICE '📌 스키마 버전: v8.6 (issuing_company 컬럼 포함)';
END $$;
