/**
 * @file prospects.ts
 * @description Prospect 관련 서버 함수
 *
 * Prospect 생성, 조회, 업데이트 등의 서버 사이드 로직
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { Prospect, CreateProspectInput, UpdateProspectInput } from "@/types/prospect";

/**
 * Prospect 생성
 */
export async function createProspect(
  userId: string,
  input: CreateProspectInput
): Promise<Prospect> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("prospects")
    .insert({
      user_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create prospect: ${error.message}`);
  }

  return data;
}

/**
 * 사용자의 모든 Prospect 조회
 */
export async function listProspectsByUser(userId: string): Promise<Prospect[]> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list prospects: ${error.message}`);
  }

  return data || [];
}

/**
 * Prospect 조회 (ID로)
 */
export async function getProspectById(
  userId: string,
  prospectId: string
): Promise<Prospect | null> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", prospectId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to get prospect: ${error.message}`);
  }

  return data;
}

/**
 * Prospect 업데이트
 */
export async function updateProspect(
  userId: string,
  prospectId: string,
  input: UpdateProspectInput
): Promise<Prospect> {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("prospects")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", prospectId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update prospect: ${error.message}`);
  }

  return data;
}

