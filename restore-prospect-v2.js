const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_PROSPECT_ID = '1c81b7aa-8836-4a99-b2bf-31ee472842c7';
const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // egk07625@gmail.com
const CORRECT_NAME = '주영엔에스';

async function restoreProspectCorrectly() {
  console.log(`Updating prospect: ${TARGET_PROSPECT_ID} -> Name: ${CORRECT_NAME}`);
  
  // Upsert using the ID
  const { data, error } = await supabase
    .from('prospects')
    .upsert({
        id: TARGET_PROSPECT_ID,
        user_id: TARGET_USER_ID,
        name: CORRECT_NAME, // User requested name
        crm_status: 'cold',
        updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating prospect:', error);
  } else {
    console.log('Successfully updated prospect to:', CORRECT_NAME);
    console.log(data);
  }
}

restoreProspectCorrectly();
