import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function reconstructProspects() {
  console.log('🔍 Fetching existing generated_emails data...\n');

  // 1. Fetch all generated_emails
  const { data: emails, error: emailsError } = await supabase
    .from('generated_emails')
    .select('*')
    .order('created_at', { ascending: false });

  if (emailsError) {
    console.error('❌ Failed to fetch emails:', emailsError);
    return;
  }

  if (!emails || emails.length === 0) {
    console.log('⚠️  No generated_emails found in database.');
    return;
  }

  console.log(`📧 Found ${emails.length} generated_emails\n`);

  // 2. Group by prospect_id (if exists) or by store_name
  const prospectMap = new Map<string, any>();

  for (const email of emails) {
    const key = email.prospect_id || email.store_name || email.issuing_company;
    
    if (!prospectMap.has(key)) {
      prospectMap.set(key, {
        prospect_id: email.prospect_id,
        user_id: email.user_id,
        store_name: email.store_name || email.issuing_company,
        category: email.category || '기타',
        issuing_company: email.issuing_company,
        theme: email.theme,
        emails: []
      });
    }
    
    prospectMap.get(key)!.emails.push(email);
  }

  console.log(`🏢 Identified ${prospectMap.size} unique prospects\n`);

  // 3. Create prospects for each group
  const prospectsToInsert = [];

  for (const [key, data] of prospectMap.entries()) {
    const prospect = {
      id: data.prospect_id || undefined, // Use existing ID if available
      user_id: data.user_id,
      name: data.store_name,
      store_name: data.store_name,
      category: data.category,
      crm_status: 'cold' as const,
      max_scroll_depth: 0,
      max_duration_seconds: 0,
      visit_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    prospectsToInsert.push(prospect);
    
    console.log(`   📋 Prospect: ${prospect.name}`);
    console.log(`      - User ID: ${prospect.user_id}`);
    console.log(`      - Category: ${prospect.category}`);
    console.log(`      - Linked Emails: ${data.emails.length}`);
    console.log('');
  }

  // 4. Insert prospects (upsert to avoid duplicates)
  const { data: insertedProspects, error: insertError } = await supabase
    .from('prospects')
    .upsert(prospectsToInsert, { onConflict: 'id' })
    .select();

  if (insertError) {
    console.error('❌ Failed to insert prospects:', insertError);
    return;
  }

  console.log(`\n✅ Successfully reconstructed ${insertedProspects?.length} prospects!`);

  // 5. Update generated_emails to link to prospects (if prospect_id was null)
  for (const prospect of insertedProspects || []) {
    const { error: updateError } = await supabase
      .from('generated_emails')
      .update({ prospect_id: prospect.id })
      .eq('store_name', prospect.store_name)
      .is('prospect_id', null);

    if (updateError) {
      console.warn(`⚠️  Failed to link emails to ${prospect.name}:`, updateError);
    }
  }

  console.log('\n🔗 Linked generated_emails to prospects');
  console.log('\n🎉 Data reconstruction complete! Check your dashboard.');
}

reconstructProspects();
