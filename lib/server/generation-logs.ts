/**
 * @file generation-logs.ts
 * @description Generation Log 관련 서버 함수
 *
 * 생성 로그 저장, 조회 등의 서버 사이드 로직
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { GenerationLog, GenerationRequest, GenerationResult } from "@/types/generation";

/**
 * Generation Log 생성
 */
export async function createGenerationLog(
  userId: string,
  requestData: GenerationRequest,
  resultData: GenerationResult
): Promise<GenerationLog> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("generation_logs")
    .insert({
      user_id: userId,
      request_data: requestData,
      result_data: resultData,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create generation log: ${error.message}`);
  }

  return data;
}

/**
 * 사용자의 모든 Generation Log 조회
 */
export async function listGenerationLogsByUser(
  userId: string
): Promise<GenerationLog[]> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("generation_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list generation logs: ${error.message}`);
  }

  return data || [];
}

/**
 * 이번 달 생성 로그 카운트 조회
 */
export async function getMonthlyGenerationCount(
  userId: string
): Promise<number> {
  const supabase = createClerkSupabaseClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from("generation_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if (error) {
    throw new Error(`Failed to get monthly generation count: ${error.message}`);
  }

  return count || 0;
}

