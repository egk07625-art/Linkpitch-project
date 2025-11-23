import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('Checking users table...');
  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log(`Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`- ID: ${u.id}, ClerkID: ${u.clerk_id}, Email: ${u.email}, Credits: ${u.credits}`);
  });
}

checkUsers();
