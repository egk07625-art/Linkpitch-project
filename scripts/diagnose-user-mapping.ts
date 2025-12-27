import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function diagnoseUserMapping() {
  console.log('🔍 Diagnosing User Mapping Issue\n');
  console.log('=' .repeat(60));

  // 1. Check all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');

  if (usersError) {
    console.error('❌ Failed to fetch users:', usersError);
    return;
  }

  console.log('\n📋 ALL USERS IN DATABASE:');
  console.log('-'.repeat(60));
  users?.forEach((user, idx) => {
    console.log(`\n${idx + 1}. ${user.name || 'No Name'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Supabase ID: ${user.id}`);
    console.log(`   Clerk ID: ${user.clerk_id}`);
  });

  // 2. Check generated_emails and their user_ids
  const { data: emails, error: emailsError } = await supabase
    .from('generated_emails')
    .select('id, user_id, store_name, issuing_company, theme, created_at')
    .order('created_at', { ascending: false });

  if (emailsError) {
    console.error('❌ Failed to fetch emails:', emailsError);
    return;
  }

  console.log('\n\n📧 GENERATED EMAILS DATA:');
  console.log('-'.repeat(60));
  emails?.forEach((email, idx) => {
    const owner = users?.find(u => u.id === email.user_id);
    console.log(`\n${idx + 1}. ${email.store_name || email.issuing_company}`);
    console.log(`   Theme: ${email.theme}`);
    console.log(`   User ID: ${email.user_id}`);
    console.log(`   Owner: ${owner?.name || '❌ NO MATCHING USER'} (${owner?.email || 'N/A'})`);
    console.log(`   Created: ${new Date(email.created_at).toLocaleString()}`);
  });

  // 3. Check prospects
  const { data: prospects, error: prospectsError } = await supabase
    .from('prospects')
    .select('id, name, user_id, created_at')
    .order('created_at', { ascending: false });

  if (prospectsError) {
    console.error('❌ Failed to fetch prospects:', prospectsError);
    return;
  }

  console.log('\n\n🏢 PROSPECTS DATA:');
  console.log('-'.repeat(60));
  prospects?.forEach((prospect, idx) => {
    const owner = users?.find(u => u.id === prospect.user_id);
    console.log(`\n${idx + 1}. ${prospect.name}`);
    console.log(`   User ID: ${prospect.user_id}`);
    console.log(`   Owner: ${owner?.name || '❌ NO MATCHING USER'} (${owner?.email || 'N/A'})`);
    console.log(`   Created: ${new Date(prospect.created_at).toLocaleString()}`);
  });

  console.log('\n\n' + '='.repeat(60));
  console.log('🎯 DIAGNOSIS SUMMARY:');
  console.log('='.repeat(60));
  
  const realDataEmails = emails?.filter(e => e.store_name === '주영엔에스') || [];
  if (realDataEmails.length > 0) {
    const realDataUserId = realDataEmails[0].user_id;
    const realDataUser = users?.find(u => u.id === realDataUserId);
    
    console.log('\n✅ Found REAL data (주영엔에스):');
    console.log(`   - ${realDataEmails.length} emails`);
    console.log(`   - Linked to User ID: ${realDataUserId}`);
    console.log(`   - User: ${realDataUser?.name} (${realDataUser?.email})`);
    console.log(`   - Clerk ID: ${realDataUser?.clerk_id}`);
    
    console.log('\n💡 TO FIX: You need to log in with this Clerk ID to see the real data.');
    console.log(`   Current login should match: ${realDataUser?.email}`);
  }

  const dummyProspects = prospects?.filter(p => 
    p.name === '올리브영스토어' || p.name === '무신사스토어' || p.name === '쿠팡스토어'
  ) || [];
  
  if (dummyProspects.length > 0) {
    console.log('\n⚠️  Found DUMMY data:');
    console.log(`   - ${dummyProspects.length} dummy prospects`);
    const dummyUserId = dummyProspects[0].user_id;
    const dummyUser = users?.find(u => u.id === dummyUserId);
    console.log(`   - Linked to User ID: ${dummyUserId}`);
    console.log(`   - User: ${dummyUser?.name} (${dummyUser?.email})`);
  }

  console.log('\n');
}

diagnoseUserMapping();
