-- Function: generated_emails에 insert될 때 실행
CREATE OR REPLACE FUNCTION public.auto_link_prospect_on_email_insert()
RETURNS TRIGGER AS $$
DECLARE
    found_prospect_id UUID;
    target_name TEXT;
BEGIN
    -- 1. 매핑할 회사 이름 결정 (store_name 컬럼이 없으므로 issuing_company 사용)
    -- 사용자가 'store_name'이라고 언급했지만 실제 스키마는 'issuing_company'임.
    target_name := NEW.issuing_company;

    -- 이름이 없으면 아무 작업도 하지 않음
    IF target_name IS NULL OR target_name = '' THEN
        RETURN NEW;
    END IF;

    -- 2. 해당 이름과 user_id를 가진 Prospect가 있는지 조회
    SELECT id INTO found_prospect_id
    FROM public.prospects
    WHERE name = target_name
      AND user_id = NEW.user_id
    LIMIT 1;

    -- 3. 없으면 새로 생성
    IF found_prospect_id IS NULL THEN
        INSERT INTO public.prospects (
            user_id,
            name,
            crm_status,   -- 중요: status가 아니라 crm_status임
            url,          -- NOT NULL 제약조건 대비
            contact_email -- NOT NULL 제약조건 대비
        ) VALUES (
            NEW.user_id,
            target_name,
            'cold',
            'https://' || target_name || '.com', -- 임시 URL 생성
            'info@' || target_name || '.com'     -- 임시 이메일 생성
        )
        RETURNING id INTO found_prospect_id;
    END IF;

    -- 4. 찾거나 생성한 Prospect ID를 할당
    NEW.prospect_id := found_prospect_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Insert 이전에 실행되어야 prospect_id를 바꿔치기 할 수 있음
DROP TRIGGER IF EXISTS trigger_auto_link_prospect ON public.generated_emails;

CREATE TRIGGER trigger_auto_link_prospect
    BEFORE INSERT ON public.generated_emails
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_link_prospect_on_email_insert();
