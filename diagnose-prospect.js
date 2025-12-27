const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_PROSPECT_ID = '1c81b7aa-8836-4a99-b2bf-31ee472842c7'; // From screenshot
const TARGET_USER_ID = '83396fb3-4a75-457a-b9e7-fb9d4d7804db'; // egk07625@gmail.com

async function diagnoseData() {
  console.log('--- DIAGNOSIS START ---');

  // 1. Check Prospect
  console.log(`\nChecking Prospect ID: ${TARGET_PROSPECT_ID}`);
  const { data: prospect, error: pError } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', TARGET_PROSPECT_ID)
    .single();

  if (pError) {
    console.error('Error fetching prospect:', pError);
  } else {
    console.log('Prospect found:');
    console.log(`- ID: ${prospect.id}`);
    console.log(`- Name: ${prospect.name}`);
    console.log(`- User ID: ${prospect.user_id}`);
    console.log(`- Match Target User?: ${prospect.user_id === TARGET_USER_ID}`);
  }

  // 2. Check Generated Emails associated with this prospect
  console.log(`\nChecking Generated Emails for this prospect...`);
  const { data: emails, error: eError } = await supabase
    .from('generated_emails')
    .select('id, user_id, prospect_id, created_at')
    .eq('prospect_id', TARGET_PROSPECT_ID);

  if (eError) {
    console.error('Error fetching emails:', eError);
  } else {
    console.log(`Found ${emails?.length} emails.`);
    emails?.forEach(email => {
        console.log(`- Email ID: ${email.id}, User ID: ${email.user_id}, Match?: ${email.user_id === TARGET_USER_ID}`);
    });
  }
    
   // 3. User Check
  console.log(`\nChecking User ID: ${TARGET_USER_ID}`);
   const { data: user, error: uError } = await supabase
    .from('users')
    .select('*')
    .eq('id', TARGET_USER_ID)
    .single();
    
    if(user) {
        console.log(`User found: ${user.email} (Clerk: ${user.clerk_id})`);
    } else {
         console.error('User not found in DB');
    }

  console.log('\n--- DIAGNOSIS END ---');
}

diagnoseData();
