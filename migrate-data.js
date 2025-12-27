const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // egk07625@gmail.com

async function migrateData() {
  console.log(`Migrating all test data to user: ${TARGET_USER_ID}...`);

  const tables = ['prospects', 'sequences', 'step', 'generated_emails', 'generated_proposals'];

  for (const table of tables) {
    console.log(`Updating table: ${table}...`);
    const { count, error } = await supabase
      .from(table)
      .update({ user_id: TARGET_USER_ID })
      .neq('user_id', TARGET_USER_ID); // 현재 유저가 아닌 모든 데이터를 현재 유저 것으로 변경 (주의: 실제 서비스 시에는 절대 금물)

    if (error) {
      console.error(`Error updating ${table}:`, error);
    } else {
      console.log(`Successfully updated ${table}.`);
    }
  }

  console.log('Migration complete!');
}

migrateData();
