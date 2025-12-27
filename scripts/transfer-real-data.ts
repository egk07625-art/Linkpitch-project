import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CURRENT_USER_ID = '0f1976cf-68ee-4b7f-9753-644c50b5e7fb'; // Eg K (egk07625@gmail.com)
const OLD_USER_ID = '17303ec6-7da7-4268-a3ed-da2826f9d589'; // Master Admin

async function transferRealData() {
  console.log('🔄 Transferring REAL data to current user account...\n');
  console.log(`From: Master Admin (${OLD_USER_ID})`);
  console.log(`To: Eg K (${CURRENT_USER_ID})\n`);

  // 1. Delete dummy data first
  console.log('🗑️  Step 1: Deleting dummy data...');
  const { error: deleteProspectsError } = await supabase
    .from('prospects')
    .delete()
    .eq('user_id', CURRENT_USER_ID)
    .in('name', ['올리브영스토어', '무신사스토어', '쿠팡스토어']);

  if (deleteProspectsError) {
    console.error('❌ Failed to delete dummy prospects:', deleteProspectsError);
  } else {
    console.log('✅ Deleted dummy prospects');
  }

  // 2. Transfer generated_emails
  console.log('\n📧 Step 2: Transferring generated_emails...');
  const { data: updatedEmails, error: emailsError } = await supabase
    .from('generated_emails')
    .update({ user_id: CURRENT_USER_ID })
    .eq('user_id', OLD_USER_ID)
    .eq('store_name', '주영엔에스')
    .select();

  if (emailsError) {
    console.error('❌ Failed to transfer emails:', emailsError);
    return;
  }
  console.log(`✅ Transferred ${updatedEmails?.length} emails`);

  // 3. Transfer prospects
  console.log('\n🏢 Step 3: Transferring prospects...');
  const { data: updatedProspects, error: prospectsError } = await supabase
    .from('prospects')
    .update({ user_id: CURRENT_USER_ID })
    .eq('user_id', OLD_USER_ID)
    .eq('name', '주영엔에스')
    .select();

  if (prospectsError) {
    console.error('❌ Failed to transfer prospects:', prospectsError);
    return;
  }
  console.log(`✅ Transferred ${updatedProspects?.length} prospects`);

  // 4. Verify
  console.log('\n🔍 Step 4: Verifying transfer...');
  const { data: verifyProspects } = await supabase
    .from('prospects')
    .select('id, name, user_id')
    .eq('user_id', CURRENT_USER_ID);

  const { data: verifyEmails } = await supabase
    .from('generated_emails')
    .select('id, store_name, user_id')
    .eq('user_id', CURRENT_USER_ID);

  console.log('\n📊 Current user now has:');
  console.log(`   - ${verifyProspects?.length || 0} prospects`);
  console.log(`   - ${verifyEmails?.length || 0} generated_emails`);

  if (verifyProspects && verifyProspects.length > 0) {
    console.log('\n✅ Prospects:');
    verifyProspects.forEach(p => console.log(`   - ${p.name}`));
  }

  console.log('\n🎉 Transfer complete! Refresh your dashboard to see the real data.');
}

transferRealData();
