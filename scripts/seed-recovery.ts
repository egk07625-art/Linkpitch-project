
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TARGET_USER_ID = '0f1976cf-68ee-4b7f-9753-644c50b5e7fb'; // Eg K
const CACHE_ID = '22222222-2222-2222-2222-222222222222'; // Reuse or create new

async function seedRecovery() {
  console.log(`🌱 Seeding recovery data for user: ${TARGET_USER_ID}`);

  // 1. Ensure Cache Exists
  const { error: cacheError } = await supabase
    .from('site_analysis_cache')
    .upsert({
      id: CACHE_ID,
      url_hash: 'recovery_hash_oliveyoung',
      url: 'https://oliveyoung-store.com',
      full_screenshot_url: 'https://placehold.co/1600x12000.png',
      vision_data: { summary: "Recovered Data", mood: "clean" }
    })
    .select();

  if (cacheError) console.error('Cache Upsert Error:', cacheError);

  // 2. Insert Prospects
  const prospects = [
    {
      user_id: TARGET_USER_ID,
      cache_id: CACHE_ID,
      name: '올리브영스토어',
      contact_name: '박지영 대표',
      contact_email: 'jiyoung@oliveyoung-store.com',
      url: 'https://oliveyoung-store.com',
      crm_status: 'hot',
      max_scroll_depth: 85,
      visit_count: 3,
      store_name: '올리브영스토어',
      category: '뷰티',
      last_activity_at: new Date().toISOString()
    },
    {
      user_id: TARGET_USER_ID,
      cache_id: CACHE_ID,
      name: '무신사스토어',
      contact_name: '최민수 팀장',
      contact_email: 'minsu@musinsa-store.com',
      url: 'https://musinsa-store.com',
      crm_status: 'warm',
      max_scroll_depth: 60,
      visit_count: 2,
      store_name: '무신사스토어',
      category: '패션',
      last_activity_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      user_id: TARGET_USER_ID,
      cache_id: CACHE_ID,
      name: '쿠팡스토어',
      contact_name: '이준호 대표',
      contact_email: 'junho@coupang-store.com',
      url: 'https://coupang-store.com',
      crm_status: 'cold',
      max_scroll_depth: 0,
      visit_count: 0,
      store_name: '쿠팡스토어',
      category: '종합몰',
      last_activity_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const { data: insertedProspects, error: prospectError } = await supabase
    .from('prospects')
    .insert(prospects)
    .select();

  if (prospectError) {
    console.error('Prospect Insert Error:', prospectError);
    return;
  }
  
  console.log(`✅ ${insertedProspects?.length} Prospects recovered.`);

  // 3. Insert Generated Emails (Linked to first prospect)
  if (insertedProspects && insertedProspects.length > 0) {
      const p = insertedProspects[0];
      const { error: emailError } = await supabase
        .from('generated_emails')
        .insert({
            prospect_id: p.id,
            user_id: TARGET_USER_ID,
            step_number: 1,
            theme: 'Diagnosis',
            target_type: 'ceo',
            issuing_company: 'LinkPitch',
            store_name: p.store_name,
            report_title: `${p.store_name} 성장 전략 리포트`,
            report_markdown: `# ${p.store_name} 전략 제안서\n\n## 요약\n이것은 복구된 샘플 데이터입니다.\n\n## 상세 분석\n매출 상승을 위한 3가지 전략...`,
            status: 'pending'
        });
      if (emailError) console.error('Email Insert Error:', emailError);
      else console.log('✅ Sample Email generated.');
  }

}

seedRecovery();
