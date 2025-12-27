const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // 현재 로그인 유저 (Eg K)

async function checkAndFixOwners() {
  console.log('--- Checking Prospects Ownership ---');
  
  // 1. 모든 Prospects 조회 및 소유자 확인
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, name, user_id, crm_status');

  if (error) {
    console.error('Error fetching prospects:', error);
    return;
  }

  console.log(`Found ${prospects.length} prospects.`);
  
  let mismatchCount = 0;
  for (const p of prospects) {
    const isMatch = p.user_id === TARGET_USER_ID;
    console.log(`- [${p.name}] ID: ${p.id} | Owner: ${p.user_id} | Match Current User? ${isMatch ? '✅' : '❌'}`);
    
    if (!isMatch) {
        mismatchCount++;
    }
  }

  // 2. 불일치 데이터가 있다면 현재 유저로 강제 업데이트
  if (mismatchCount > 0) {
      console.log(`\nFound ${mismatchCount} prospects with wrong owner. Fixing...`);
      const { error: updateError } = await supabase
        .from('prospects')
        .update({ user_id: TARGET_USER_ID })
        .neq('user_id', TARGET_USER_ID); // 현재 유저가 아닌 것들을 모두 가져옴

      if (updateError) {
          console.error('Update failed:', updateError);
      } else {
          console.log('SUCCESS: All prospects have been transferred to the current user.');
      }
  } else {
      console.log('\nAll prospects are already owned by the current user.');
  }

  console.log('--- End of Operation ---');
}

checkAndFixOwners();
