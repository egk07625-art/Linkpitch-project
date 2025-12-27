
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProspects() {
  console.log('🔍 Checking Prospects Data...');

  // 1. Check Total Prospects
  const { count, error: countError } = await supabase
    .from('prospects')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Failed to count prospects:', countError);
    return;
  }
  console.log(`📊 Total Prospects in DB: ${count}`);

  // 2. Check Users and their Prospect counts
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, clerk_id, email, name');

  if (usersError) {
    console.error('❌ Failed to fetch users:', usersError);
    return;
  }

  console.log(`\n👥 Found ${users.length} Users:`);
  
  for (const user of users) {
    const { count: userProspectCount } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    console.log(`   - [${user.name || 'No Name'}] (Email: ${user.email}, ID: ${user.id})`);
    console.log(`     CLERK_ID: ${user.clerk_id}`);
    console.log(`     Prospects: ${userProspectCount}`);
    
    if (userProspectCount && userProspectCount > 0) {
        // Show sample prospect
        const { data: samplePropsFromUser } = await supabase
            .from('prospects')
            .select('id, name, created_at')
            .eq('user_id', user.id)
            .limit(3);
        console.log('     Samples:', samplePropsFromUser);
    }
  }

  // 3. Check for Orphaned Prospects (no valid user_id)
  // Converting user IDs to a list string for query is tricky with simple query builder if not using raw SQL/RPC
  // But we can check if there are prospects where user_id is NOT in the list of user IDs we just fetched.
  
  // A simpler check: retrieve a few prospects and see their user_ids
  const { data: prospects } = await supabase
    .from('prospects')
    .select('id, name, user_id')
    .limit(10);
    
  if (prospects && prospects.length > 0) {
      console.log('\n👻 Checking first 10 prospects for user validity:');
      const userIds = new Set(users.map(u => u.id));
      for (const p of prospects) {
          const isValid = userIds.has(p.user_id);
          if (!isValid) {
              console.warn(`   ⚠️ Orphaned Prospect Found! ID: ${p.id}, Name: ${p.name}, Invalid UserID: ${p.user_id}`);
          }
      }
  }
}

checkProspects();
