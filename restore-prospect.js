const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_PROSPECT_ID = '1c81b7aa-8836-4a99-b2bf-31ee472842c7';
const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // egk07625@gmail.com

async function restoreProspect() {
  console.log(`Restoring missing prospect: ${TARGET_PROSPECT_ID}`);
  
  // 1. generated_emails 중 하나를 가져와서 정보 추출 (예: issuing_company)
  const { data: emailData, error: eError } = await supabase
    .from('generated_emails')
    .select('issuing_company')
    .eq('prospect_id', TARGET_PROSPECT_ID)
    .limit(1)
    .single();
    
  if(eError || !emailData) {
      console.error('Failed to get email data source for restoration');
      return;
  }
  
  const companyName = emailData.issuing_company || '복구된 고객사';
  console.log(`Recovered Name: ${companyName}`);

  // 2. Insert missing prospect
  const { data: newProspect, error: pError } = await supabase
    .from('prospects')
    .insert({
        id: TARGET_PROSPECT_ID, // Use the SAME ID to link correctly
        user_id: TARGET_USER_ID,
        name: companyName,
        crm_status: 'cold', // Default
        url: 'https://restored-from-backup.com', // Placeholder
        contact_email: 'unknown@restored.com', // Placeholder
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (pError) {
    console.error('Error creating prospect:', pError);
  } else {
    console.log('Successfully restored prospect!');
    console.log(newProspect);
  }
}

restoreProspect();
