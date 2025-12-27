const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_NAME = '주영엔에스';
const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // Eg K

async function mergeDuplicates() {
  console.log(`Searching for duplicates of: ${TARGET_NAME}...`);

  // 1. 해당 이름의 모든 Prospect 조회
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, name, created_at')
    .eq('name', TARGET_NAME)
    .eq('user_id', TARGET_USER_ID)
    .order('created_at', { ascending: true }); // 가장 오래된 것을 원본으로 삼음

  if (error) {
    console.error('Error fetching prospects:', error);
    return;
  }

  if (prospects.length <= 1) {
    console.log('No duplicates found or only one record exists.');
    return;
  }

  console.log(`Found ${prospects.length} duplicate records.`);
  
  // 2. 병합 대상 선정 (첫 번째가 Master, 나머지는 Duplicate)
  const masterProspect = prospects[0];
  const duplicates = prospects.slice(1);
  const duplicateIds = duplicates.map(p => p.id);

  console.log(`Master Prospect ID: ${masterProspect.id}`);
  console.log(`Duplicate IDs to merge: ${duplicateIds.join(', ')}`);

  // 3. generated_emails 연결 이동
  console.log('Moving generated_emails to Master Prospect...');
  const { error: updateError } = await supabase
    .from('generated_emails')
    .update({ prospect_id: masterProspect.id })
    .in('prospect_id', duplicateIds);

  if (updateError) {
    console.error('Failed to move emails:', updateError);
    return;
  }
  console.log('Emails successfully moved.');

  // 4. 중복 Prospect 삭제
  console.log('Deleting duplicate prospects...');
  const { error: deleteError } = await supabase
    .from('prospects')
    .delete()
    .in('id', duplicateIds);

  if (deleteError) {
    console.error('Failed to delete duplicates:', deleteError);
  } else {
    console.log('Successfully deleted duplicate prospects.');
  }

  console.log('Merge operation complete!');
}

mergeDuplicates();
