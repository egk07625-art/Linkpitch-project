-- ================================================================
-- LinkPitch MVP v8.9 (Full Version - Tier Column Removed)
-- ================================================================

-- [0] 시스템 타임존 설정
SET timezone = 'Asia/Seoul';

-- [1] 초기화
DROP TABLE IF EXISTS generated_emails CASCADE;
DROP TABLE IF EXISTS generated_proposals CASCADE;
DROP TABLE IF EXISTS report_tracking_logs CASCADE;
DROP TABLE IF EXISTS step_generations CASCADE;
DROP TABLE IF EXISTS step CASCADE;
DROP TABLE IF EXISTS step_templates CASCADE;
DROP TABLE IF EXISTS sequences CASCADE;
DROP TABLE IF EXISTS user_assets CASCADE;
DROP TABLE IF EXISTS prospects CASCADE;
DROP TABLE IF EXISTS site_analysis_cache CASCADE;
DROP TABLE IF EXISTS user_plans CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- [2] 유틸리티 함수: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- [3] 기본 인프라 테이블
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    clerk_id TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    credits INT NOT NULL DEFAULT 3,
    consultation_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_clerk_id UNIQUE (clerk_id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_credits CHECK (credits >= 0)
);

CREATE TABLE plans (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    monthly_quota INT NOT NULL,
    price_krw INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT pk_plans PRIMARY KEY (id),
    CONSTRAINT uq_plans_code UNIQUE (code),
    CONSTRAINT chk_plans_quota CHECK (monthly_quota >= 0),
    CONSTRAINT chk_plans_price CHECK (price_krw >= 0)
);

CREATE TABLE user_plans (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    is_current BOOLEAN DEFAULT true,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    CONSTRAINT pk_user_plans PRIMARY KEY (id),
    CONSTRAINT fk_user_plans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_plans_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT
);

CREATE TABLE site_analysis_cache (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    url_hash TEXT NOT NULL,
    url TEXT NOT NULL,
    full_screenshot_url TEXT NOT NULL,
    vision_data JSONB NOT NULL,
    analyzed_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    access_count INT DEFAULT 1,
    CONSTRAINT pk_site_analysis_cache PRIMARY KEY (id),
    CONSTRAINT uq_site_analysis_url_hash UNIQUE (url_hash)
);

CREATE TABLE user_assets (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT pk_user_assets PRIMARY KEY (id),
    CONSTRAINT fk_user_assets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- [4] 핵심 비즈니스 테이블 (prospects에서 tier 삭제)
CREATE TABLE prospects (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    cache_id UUID, 
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255), 
    contact_phone VARCHAR(50), 
    url VARCHAR(500),
    memo TEXT,
    crm_status VARCHAR(50) DEFAULT 'cold' NOT NULL, 
    max_scroll_depth INT DEFAULT 0, 
    max_duration_seconds INT DEFAULT 0,
    visit_count INT DEFAULT 0,
    store_name VARCHAR(255),
    category VARCHAR(100),
    raw_ocr_text TEXT,
    last_activity_at TIMESTAMPTZ, 
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_prospects PRIMARY KEY (id),
    CONSTRAINT fk_prospects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_prospects_crm_status CHECK (crm_status IN ('cold', 'warm', 'hot')),
    CONSTRAINT chk_prospects_scroll_depth CHECK (max_scroll_depth BETWEEN 0 AND 100),
    CONSTRAINT chk_prospects_duration CHECK (max_duration_seconds >= 0),
    CONSTRAINT chk_prospects_visits CHECK (visit_count >= 0)
);

CREATE TABLE sequences (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    prospect_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    persona_type VARCHAR(50) DEFAULT 'researcher' NOT NULL,
    sequence_type VARCHAR(100) DEFAULT '5_steps' NOT NULL,
    total_steps INT DEFAULT 5 NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_sequences PRIMARY KEY (id),
    CONSTRAINT fk_sequences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sequences_prospect FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE,
    CONSTRAINT chk_sequences_status CHECK (status IN ('draft', 'active', 'completed')),
    CONSTRAINT chk_sequences_total_steps CHECK (total_steps > 0 AND total_steps <= 10)
);

CREATE TABLE step (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    sequence_id UUID NOT NULL,
    step_number INT NOT NULL,
    selected_generation_id UUID, 
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_step PRIMARY KEY (id),
    CONSTRAINT fk_step_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_step_sequence FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE,
    CONSTRAINT uq_step_sequence_number UNIQUE (sequence_id, step_number),
    CONSTRAINT chk_step_status CHECK (status IN ('pending', 'sent')),
    CONSTRAINT chk_step_number CHECK (step_number > 0)
);

CREATE TABLE step_generations (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    step_id UUID NOT NULL,
    user_id UUID NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    email_subject VARCHAR(255), 
    email_body TEXT, 
    report_data JSONB, 
    report_materials JSONB DEFAULT '[]'::jsonb, 
    status VARCHAR(50) DEFAULT 'processing' NOT NULL,
    cost_krw INT DEFAULT 400, 
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_step_generations PRIMARY KEY (id),
    CONSTRAINT fk_generations_step FOREIGN KEY (step_id) REFERENCES step(id) ON DELETE CASCADE,
    CONSTRAINT fk_generations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_generations_status CHECK (status IN ('processing', 'completed', 'failed')),
    CONSTRAINT chk_generations_version CHECK (version_number > 0),
    CONSTRAINT chk_generations_cost CHECK (cost_krw >= 0)
);

-- 외래키 연결
ALTER TABLE prospects ADD CONSTRAINT fk_prospects_cache FOREIGN KEY (cache_id) REFERENCES site_analysis_cache(id) ON DELETE SET NULL;
ALTER TABLE step ADD CONSTRAINT fk_step_selected_generation FOREIGN KEY (selected_generation_id) REFERENCES step_generations(id) ON DELETE SET NULL;

-- [5] generated_emails 테이블 (tier 관련 컬럼 및 제약조건 삭제)
CREATE TABLE generated_emails (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    prospect_id UUID,
    user_id UUID,
    step_number INT NOT NULL,
    theme VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    issuing_company VARCHAR(255) NOT NULL,
    report_title TEXT NOT NULL DEFAULT '',
    report_markdown TEXT NOT NULL DEFAULT '',
    report_file_name TEXT NOT NULL DEFAULT '',
    store_name VARCHAR(255) NOT NULL DEFAULT '',
    category VARCHAR(100) NOT NULL DEFAULT '',
    diagnosis_type VARCHAR(50) DEFAULT 'Rescue',
    consultation_url TEXT,
    email_body TEXT,
    email_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_generated_emails PRIMARY KEY (id),
    CONSTRAINT fk_generated_emails_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_generated_emails_prospect_step UNIQUE (prospect_id, step_number),
    CONSTRAINT chk_generated_emails_status CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'failed')),
    CONSTRAINT chk_generated_emails_step_number CHECK (step_number > 0 AND step_number <= 10)
);

-- [6] 템플릿 & 로그
CREATE TABLE step_templates (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    step_number INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    description TEXT,
    timeline_day INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_step_templates PRIMARY KEY (id),
    CONSTRAINT uq_step_templates_number UNIQUE (step_number)
);

CREATE TABLE report_tracking_logs (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    prospect_id UUID NOT NULL,
    session_id UUID NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    scroll_depth INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT pk_report_tracking_logs PRIMARY KEY (id),
    CONSTRAINT fk_report_logs_prospect FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE,
    CONSTRAINT chk_tracking_scroll CHECK (scroll_depth BETWEEN 0 AND 100),
    CONSTRAINT chk_tracking_duration CHECK (duration_seconds >= 0)
);

-- [7] 인덱스 최적화
CREATE INDEX idx_cache_vision_data_gin ON site_analysis_cache USING GIN (vision_data);
CREATE INDEX idx_generations_report_data_gin ON step_generations USING GIN (report_data);
CREATE INDEX idx_generations_report_materials_gin ON step_generations USING GIN (report_materials);
CREATE INDEX idx_emails_subjects_gin ON generated_emails USING GIN (email_subjects);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_credits ON users(credits);
CREATE INDEX idx_users_consultation_url ON users(consultation_url) WHERE consultation_url IS NOT NULL;
CREATE INDEX idx_emails_consultation_url ON generated_emails(consultation_url) WHERE consultation_url IS NOT NULL;
CREATE INDEX idx_emails_prospect_id ON generated_emails(prospect_id) WHERE prospect_id IS NOT NULL;
CREATE INDEX idx_emails_issuing_company ON generated_emails(issuing_company);
CREATE INDEX idx_emails_report_title ON generated_emails(report_title);
CREATE INDEX idx_plans_active ON plans(is_active) WHERE is_active = true;
CREATE INDEX idx_user_plans_user_current ON user_plans(user_id, is_current) WHERE is_current = true;
CREATE INDEX idx_user_plans_dates ON user_plans(started_at, ended_at);
CREATE INDEX idx_user_plans_plan ON user_plans(plan_id);
CREATE INDEX idx_cache_url_hash ON site_analysis_cache(url_hash);
CREATE INDEX idx_cache_last_accessed ON site_analysis_cache(last_accessed_at DESC);
CREATE INDEX idx_cache_access_count ON site_analysis_cache(access_count DESC);
CREATE INDEX idx_cache_analyzed ON site_analysis_cache(analyzed_at DESC);
CREATE INDEX idx_assets_user_created ON user_assets(user_id, created_at DESC);
CREATE INDEX idx_assets_user_type ON user_assets(user_id, file_type);
CREATE INDEX idx_prospects_user_created ON prospects(user_id, created_at DESC);
CREATE INDEX idx_prospects_crm_status ON prospects(user_id, crm_status);
CREATE INDEX idx_prospects_crm_dashboard ON prospects(user_id, crm_status, last_activity_at DESC NULLS LAST);
CREATE INDEX idx_prospects_store_name ON prospects(store_name) WHERE store_name IS NOT NULL;
CREATE INDEX idx_prospects_email ON prospects(contact_email) WHERE contact_email IS NOT NULL;
CREATE INDEX idx_prospects_phone ON prospects(contact_phone) WHERE contact_phone IS NOT NULL;
CREATE INDEX idx_prospects_category ON prospects(category) WHERE category IS NOT NULL;
CREATE INDEX idx_sequences_user_created ON sequences(user_id, created_at DESC);
CREATE INDEX idx_sequences_prospect ON sequences(prospect_id);
CREATE INDEX idx_sequences_user_status ON sequences(user_id, status);
CREATE INDEX idx_sequences_active ON sequences(user_id, prospect_id) WHERE status = 'active';
CREATE INDEX idx_step_sequence ON step(sequence_id, step_number);
CREATE INDEX idx_step_status ON step(status, sent_at);
CREATE INDEX idx_generations_step_version ON step_generations(step_id, version_number DESC);
CREATE INDEX idx_generations_user_created ON step_generations(user_id, created_at DESC);
CREATE INDEX idx_generations_step_status ON step_generations(step_id, status);
CREATE INDEX idx_generations_cost ON step_generations(user_id, cost_krw) WHERE cost_krw > 0;
CREATE INDEX idx_emails_prospect ON generated_emails(prospect_id);
CREATE INDEX idx_emails_user_created ON generated_emails(user_id, created_at DESC);
CREATE INDEX idx_emails_user_status ON generated_emails(user_id, status);
CREATE INDEX idx_emails_type ON generated_emails(target_type);
CREATE INDEX idx_tracking_prospect ON report_tracking_logs(prospect_id, created_at DESC);
CREATE INDEX idx_tracking_session ON report_tracking_logs(session_id);
CREATE INDEX idx_tracking_engagement ON report_tracking_logs(prospect_id, scroll_depth, duration_seconds);
CREATE INDEX idx_tracking_ip ON report_tracking_logs(ip_address) WHERE ip_address IS NOT NULL;

-- [8] 트리거 설정
CREATE TRIGGER trg_users_update BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_prospects_update BEFORE UPDATE ON prospects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_sequences_update BEFORE UPDATE ON sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_step_update BEFORE UPDATE ON step FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emails_update BEFORE UPDATE ON generated_emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prospect 상태 자동 업데이트 로직
CREATE OR REPLACE FUNCTION update_prospect_status()
RETURNS TRIGGER AS $$
DECLARE
    current_scroll INT;
    current_duration INT;
    current_visits INT;
    new_status VARCHAR(50);
BEGIN
    SELECT COALESCE(GREATEST(max_scroll_depth, COALESCE(NEW.scroll_depth, 0)), 0), 
           COALESCE(GREATEST(max_duration_seconds, COALESCE(NEW.duration_seconds, 0)), 0)
    INTO current_scroll, current_duration
    FROM prospects
    WHERE id = NEW.prospect_id;

    SELECT COUNT(DISTINCT session_id) INTO current_visits
    FROM report_tracking_logs WHERE prospect_id = NEW.prospect_id;

    IF (COALESCE(current_scroll, 0) >= 80 AND COALESCE(current_duration, 0) >= 30) OR (COALESCE(current_visits, 0) >= 3) THEN
        new_status := 'hot';
    ELSIF (COALESCE(current_scroll, 0) >= 50 OR COALESCE(current_duration, 0) >= 15) OR (COALESCE(current_visits, 0) >= 2) THEN
        new_status := 'warm';
    ELSE
        new_status := 'cold';
    END IF;

    UPDATE prospects
    SET 
        max_scroll_depth = COALESCE(current_scroll, max_scroll_depth),
        max_duration_seconds = COALESCE(current_duration, max_duration_seconds),
        visit_count = COALESCE(current_visits, visit_count),
        last_activity_at = NOW(),
        crm_status = CASE 
            WHEN crm_status = 'hot' THEN 'hot'
            WHEN new_status = 'hot' THEN 'hot' 
            WHEN crm_status = 'warm' AND new_status = 'cold' THEN 'warm'
            ELSE new_status
        END
    WHERE id = NEW.prospect_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_update_status AFTER INSERT ON report_tracking_logs FOR EACH ROW EXECUTE FUNCTION update_prospect_status();

-- Cache 접근 기록 로직
CREATE OR REPLACE FUNCTION update_cache_access()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cache_id IS NOT NULL THEN
        UPDATE site_analysis_cache 
        SET last_accessed_at = NOW(), access_count = access_count + 1 
        WHERE id = NEW.cache_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prospects_cache_access 
AFTER INSERT OR UPDATE OF cache_id ON prospects 
FOR EACH ROW 
WHEN (NEW.cache_id IS NOT NULL)
EXECUTE FUNCTION update_cache_access();

-- 유틸리티 함수: 캐시 정리
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS TABLE(deleted_count INT) AS $$
DECLARE
    row_count INT;
BEGIN
    DELETE FROM site_analysis_cache
    WHERE last_accessed_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS row_count = ROW_COUNT;
    RETURN QUERY SELECT row_count;
END;
$$ LANGUAGE plpgsql;

-- [12] RLS 비활성화 (운영용)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE sequences DISABLE ROW LEVEL SECURITY;
ALTER TABLE step DISABLE ROW LEVEL SECURITY;
ALTER TABLE step_generations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_analysis_cache DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE report_tracking_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE step_templates DISABLE ROW LEVEL SECURITY;

-- [9] 초기 데이터 삽입
INSERT INTO step_templates (step_number, step_name, description, timeline_day) VALUES
(1, 'Diagnosis', '현상 진단 - 전략적 소견서 발행', 1),
(2, 'Blueprint', '가치 설계 - 전환 블루프린트 제시', 3),
(3, 'Masterplan', '실전 운영 - 통합 실행 로드맵 확정', 6);

INSERT INTO plans (code, name, monthly_quota, price_krw) VALUES
('free', 'Free', 3, 0), 
('starter', 'Starter', 30, 49000), 
('pro', 'Pro', 100, 149000);

-- 마스터 관리자 생성
INSERT INTO public.users (id, email, clerk_id, name)
VALUES (
  '17303ec6-7da7-4268-a3ed-da2826f9d589', 
  'admin@linkpitch.io',                   
  'admin_master_id',                      
  'Master Admin'
)
ON CONFLICT (id) DO NOTHING;

-- [10] 분석
ANALYZE users;
ANALYZE prospects;
ANALYZE generated_emails;

DO $$ 
BEGIN 
    RAISE NOTICE '✅ LinkPitch MVP v8.9 설치 완료! (tier 삭제 및 전체 로직 보존)';
END $$;