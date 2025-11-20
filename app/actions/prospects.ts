/**
 * @file prospects.ts
 * @description Prospect 관련 Server Actions
 *
 * Prospect 생성, 조회, 업데이트를 위한 Server Actions
 * PRD.md의 prospects 테이블과 연동
 */

'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { Prospect, CreateProspectInput, UpdateProspectInput } from '@/types/prospect';

/**
 * 현재 사용자의 모든 Prospect 조회
 */
export async function getProspects(): Promise<Prospect[]> {
  const supabase = await createClerkSupabaseClient();
  // TODO: 구현 필요
  return [];
}

/**
 * 특정 Prospect 조회
 */
export async function getProspectById(id: string): Promise<Prospect | null> {
  const supabase = await createClerkSupabaseClient();
  // TODO: 구현 필요
  return null;
}

/**
 * 새로운 Prospect 생성
 */
export async function createProspect(input: CreateProspectInput): Promise<Prospect> {
  const supabase = await createClerkSupabaseClient();
  // TODO: 구현 필요
  throw new Error('Not implemented');
}

/**
 * Prospect 업데이트
 */
export async function updateProspect(
  id: string,
  input: UpdateProspectInput
): Promise<Prospect> {
  const supabase = await createClerkSupabaseClient();
  // TODO: 구현 필요
  throw new Error('Not implemented');
}
