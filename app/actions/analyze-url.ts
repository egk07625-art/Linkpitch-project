'use server';

import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { auth } from '@clerk/nextjs/server';

export async function analyzeUrl(url: string) {
  // Use Service Role client to bypass RLS (no RLS policies needed)
  const supabase = getServiceRoleClient();
  
  // 1. Get current user from Clerk
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return {
      success: false,
      error: 'UNAUTHORIZED',
      message: '로그인이 필요합니다.',
    };
  }

  // 2. Fetch user's UUID from database (or create if missing)
  let userUuid: string;
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  if (userError || !userData) {
    console.log('User not found in Supabase. Creating new user...');
    // Fetch user details from Clerk to insert
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { success: false, error: 'NO_EMAIL', message: '이메일 정보를 찾을 수 없습니다.' };
    }

    // Use existing Service Role client (already bypasses RLS)
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        email: email,
        name: clerkUser.fullName || clerkUser.username || email,
      })
      .select('id')
      .single();

    if (createError || !newUser) {
      console.error('Failed to create user:', createError);
      return { success: false, error: 'USER_CREATION_FAILED', message: '사용자 생성에 실패했습니다.' };
    }
    userUuid = newUser.id;
  } else {
    userUuid = userData.id;
  }



  // Mock data
  const MOCK_VISION_DATA = {
    summary: "This is a mock summary of the URL analysis.",
    keywords: ["mock", "analysis", "data"],
  };

  const extractDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    } catch { return url; }
  };

  // 4. Create Prospect (Real Insert)
  const { data: prospect, error: prospectError } = await supabase
    .from('prospects')
    .insert({
      user_id: userUuid,
      name: extractDomain(url),
      contact_email: 'info@' + extractDomain(url), // Placeholder
      url,
      vision_data: MOCK_VISION_DATA,
    })
    .select()
    .single();

  if (prospectError) {
    console.error('Failed to create prospect:', prospectError);
    return {
      success: false,
      error: 'DATABASE_ERROR',
      message: '프로스펙트 생성에 실패했습니다.',
    };
  }

  return {
    success: true,
    redirectUrl: `/prospects/${prospect.id}/mix`,
  };
}
