/**
 * @file prospects.ts
 * @description Prospect 관련 Server Actions
 *
 * Prospect 생성, 조회, 업데이트를 위한 Server Actions
 * PRD.md의 prospects 테이블과 연동
 */

'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import type { Prospect, CreateProspectInput, UpdateProspectInput } from '@/types/prospect';

/**
 * 현재 사용자의 모든 Prospect 조회
 * 
 * @returns 현재 사용자의 Prospect 배열
 */
export async function getProspects(): Promise<Prospect[]> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: 사용자 인증이 필요합니다.');
  }

  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Prospect 조회 실패:', error);
    throw new Error(`Prospect 조회 실패: ${error.message}`);
  }

  return (data || []) as Prospect[];
}

/**
 * 특정 Prospect 조회
 * 
 * @param id Prospect ID
 * @returns Prospect 객체 또는 null
 */
export async function getProspectById(id: string): Promise<Prospect | null> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: 사용자 인증이 필요합니다.');
  }

  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 레코드를 찾을 수 없음
      return null;
    }
    console.error('Prospect 조회 실패:', error);
    throw new Error(`Prospect 조회 실패: ${error.message}`);
  }

  return data as Prospect;
}

/**
 * 새로운 Prospect 생성
 * 
 * @param input Prospect 생성 데이터
 * @returns 생성된 Prospect 객체
 */
export async function createProspect(input: CreateProspectInput): Promise<Prospect> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: 사용자 인증이 필요합니다.');
  }

  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('prospects')
    .insert({
      user_id: userId,
      name: input.name,
      contact_name: input.contact_name,
      contact_email: input.contact_email,
      url: input.url,
      memo: input.memo,
      crm_status: 'cold',
      visit_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Prospect 생성 실패:', error);
    throw new Error(`Prospect 생성 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('Prospect 생성 실패: 데이터가 반환되지 않았습니다.');
  }

  return data as Prospect;
}

/**
 * Prospect 업데이트
 * 
 * @param id Prospect ID
 * @param input 업데이트할 데이터
 * @returns 업데이트된 Prospect 객체
 */
export async function updateProspect(
  id: string,
  input: UpdateProspectInput
): Promise<Prospect> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: 사용자 인증이 필요합니다.');
  }

  const supabase = await createClerkSupabaseClient();

  // Prospect가 현재 사용자의 것인지 확인
  const { data: existing, error: checkError } = await supabase
    .from('prospects')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error(`Prospect 조회 실패: ${checkError?.message || 'Prospect를 찾을 수 없습니다.'}`);
  }

  // 업데이트 데이터 준비
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.contact_name !== undefined) updateData.contact_name = input.contact_name;
  if (input.contact_email !== undefined) updateData.contact_email = input.contact_email;
  if (input.url !== undefined) updateData.url = input.url;
  if (input.memo !== undefined) updateData.memo = input.memo;
  if (input.vision_data !== undefined) updateData.vision_data = input.vision_data;
  if (input.crm_status !== undefined) updateData.crm_status = input.crm_status;
  if (input.visit_count !== undefined) updateData.visit_count = input.visit_count;
  if (input.last_viewed_at !== undefined) updateData.last_viewed_at = input.last_viewed_at;

  const { data, error } = await supabase
    .from('prospects')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Prospect 업데이트 실패:', error);
    throw new Error(`Prospect 업데이트 실패: ${error.message}`);
  }

  if (!data) {
    throw new Error('Prospect 업데이트 실패: 데이터가 반환되지 않았습니다.');
  }

  return data as Prospect;
}
