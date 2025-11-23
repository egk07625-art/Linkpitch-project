import { clerkClient } from "@clerk/nextjs/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export async function syncUserToSupabase(userId: string) {
  // Clerk에서 사용자 정보 가져오기
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  if (!clerkUser) {
    throw new Error("User not found in Clerk");
  }

  // Supabase에 사용자 정보 동기화
  const supabase = getServiceRoleClient();

  // Clerk에서 이메일 추출 (필수 필드)
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  
  if (!email) {
    throw new Error("User email not found in Clerk");
  }

  // 1. clerk_id로 기존 사용자 조회
  const { data: existingByClerkId } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  // 2. email로도 조회 (다른 clerk_id로 같은 email이 있는지 확인)
  const { data: existingByEmail } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  let data;
  let error;

  if (existingByClerkId) {
    // clerk_id가 일치하는 경우: 업데이트
    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({
        email: email,
        name:
          clerkUser.fullName ||
          clerkUser.username ||
          email ||
          "Unknown",
      })
      .eq("clerk_id", clerkUser.id)
      .select()
      .single();
    
    data = updatedData;
    error = updateError;
  } else if (existingByEmail) {
    // email이 일치하지만 clerk_id가 다른 경우: clerk_id 업데이트
    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({
        clerk_id: clerkUser.id,
        name:
          clerkUser.fullName ||
          clerkUser.username ||
          email ||
          "Unknown",
      })
      .eq("email", email)
      .select()
      .single();
    
    data = updatedData;
    error = updateError;
  } else {
    // 새 사용자 생성
    const { data: insertedData, error: insertError } = await supabase
      .from("users")
      .insert({
        clerk_id: clerkUser.id,
        email: email,
        name:
          clerkUser.fullName ||
          clerkUser.username ||
          email ||
          "Unknown",
      })
      .select()
      .single();
    
    data = insertedData;
    error = insertError;
  }

  if (error) {
    throw new Error(`Supabase sync error: ${error.message}`);
  }

  return data;
}
