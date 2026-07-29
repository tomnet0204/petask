import { createServerSupabase } from '../supabase';
import type { VetProfile } from '../types';

function toVet(row: Record<string, unknown>): VetProfile {
  return {
    id: row.id as string,
    name: row.name as string,
    credential: row.credential as string,
    specialty: row.specialty as string[],
    bio: row.bio as string | undefined,
    avatarUrl: row.avatar_url as string | undefined,
    isVerified: row.is_verified as boolean,
  };
}

export async function getVets(): Promise<VetProfile[]> {
  const supabase = createServerSupabase();
  if (!supabase) return MOCK_VETS;

  try {
    const { data, error } = await supabase
      .from('vets')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: true });
    if (error) { console.error(error); return MOCK_VETS; }
    return (data ?? []).map(toVet);
  } catch (e) {
    console.error('Supabase接続失敗 (getVets):', e);
    return MOCK_VETS;
  }
}

export async function getVetById(id: string): Promise<VetProfile | null> {
  const supabase = createServerSupabase();
  if (!supabase) return MOCK_VETS.find(v => v.id === id) ?? null;

  const { data, error } = await supabase
    .from('vets').select('*').eq('id', id).single();

  if (error) return null;
  return toVet(data);
}

const MOCK_VETS: VetProfile[] = [
  { id: 'vet-1', name: '田中 獣医師', credential: '獣医師・獣医学博士', specialty: ['犬', '猫', '内科'], bio: '犬・猫の内科を中心に診療。消化器・泌尿器疾患専門。', isVerified: true },
  { id: 'vet-2', name: '山田 獣医師', credential: '獣医師', specialty: ['犬', '外科'], bio: '整形外科・外科手術専門。老犬の関節疾患の診療経験が豊富。', isVerified: true },
  { id: 'vet-3', name: '鈴木 獣医師', credential: '獣医師', specialty: ['猫', '皮膚科'], bio: '猫専門病院での勤務経験10年以上。皮膚疾患・アレルギー専門。', isVerified: true },
];
