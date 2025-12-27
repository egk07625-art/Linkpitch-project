const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Fetching columns for generated_emails...');
  
  // generated_emails의 레코드 하나를 가져와서 키를 확인하는 꼼수 (Service Role이라 information_schema 접근 권한이 없을 수도 있음)
  const { data, error } = await supabase
    .from('generated_emails')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns found in record:', Object.keys(data[0]));
    console.log('Sample data:', data[0]);
  } else {
    console.log('No data found in generated_emails.');
  }
}

checkSchema();
