-- 1. generated_emails 테이블에 store_name 컬럼이 로컬 환경에 없을 수 있으므로 추가 (안전 장치)
ALTER TABLE public.generated_emails 
ADD COLUMN IF NOT EXISTS store_name VARCHAR;

-- 2. 트리거 함수 수정 (store_name 기반)
CREATE OR REPLACE FUNCTION public.auto_link_prospect_on_email_insert()
RETURNS TRIGGER AS $$
DECLARE
    found_prospect_id UUID;
    target_name TEXT;
BEGIN
    -- 사용자의 강력한 요구사항: store_name 기반으로 동작
    target_name := NEW.store_name;

    -- store_name이 비어있으면 issuing_company를 대체제로 사용 (데이터 유실 방지)
    IF target_name IS NULL OR target_name = '' THEN
        target_name := NEW.issuing_company;
    END IF;

    -- 그래도 없으면 종료
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
            crm_status,
            url,
            contact_email
        ) VALUES (
            NEW.user_id,
            target_name,
            'cold',
            'https://' || target_name || '.com', -- 임시 URL
            'info@' || target_name || '.com'     -- 임시 이메일
        )
        RETURNING id INTO found_prospect_id;
    END IF;

    -- 4. 찾거나 생성한 Prospect ID를 할당
    NEW.prospect_id := found_prospect_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 트리거 재생성 (기존 트리거가 있다면 대체됨)
DROP TRIGGER IF EXISTS trigger_auto_link_prospect ON public.generated_emails;

CREATE TRIGGER trigger_auto_link_prospect
    BEFORE INSERT ON public.generated_emails
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_link_prospect_on_email_insert();
