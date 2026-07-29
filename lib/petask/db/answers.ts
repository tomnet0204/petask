import { createServerSupabase } from '../supabase';
import type { Answer, VetProfile } from '../types';

function toAnswer(row: Record<string, unknown>): Answer {
  const vet = row.vets as Record<string, unknown> | null;
  return {
    id: row.id as string,
    questionId: row.question_id as string,
    vet: vet ? {
      id: vet.id as string,
      name: vet.name as string,
      credential: vet.credential as string,
      specialty: vet.specialty as string[],
      bio: vet.bio as string | undefined,
      avatarUrl: vet.avatar_url as string | undefined,
      isVerified: vet.is_verified as boolean,
    } : MOCK_VET,
    body: row.body as string,
    isAccepted: row.is_accepted as boolean,
    createdAt: row.created_at as string,
  };
}

export async function getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
  const supabase = createServerSupabase();
  if (!supabase) return MOCK_ANSWERS.filter(a => a.questionId === questionId);

  const { data, error } = await supabase
    .from('answers')
    .select('*, vets(*)')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true });

  if (error) { console.error(error); return []; }
  return (data ?? []).map(toAnswer);
}

export async function createAnswer(
  data: Omit<Answer, 'id' | 'createdAt'>
): Promise<Answer> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  }

  const { data: row, error } = await supabase
    .from('answers')
    .insert({ question_id: data.questionId, vet_id: data.vet.id, body: data.body })
    .select('*, vets(*)')
    .single();

  if (error) throw new Error(error.message);
  return toAnswer(row);
}

const MOCK_VET: VetProfile = { id: 'vet-1', name: '田中 獣医師', credential: '獣医師', specialty: ['犬', '猫'], isVerified: true };

const MOCK_ANSWERS: Answer[] = [
  {
    id: 'ans-1', questionId: 'mock-1', vet: MOCK_VET,
    body: '嘔吐が続いている場合は脱水に注意が必要です。水を飲めているとのことで少し安心ですが、1日以上続く場合や血が混じる場合は早めに受診してください。',
    isAccepted: true, createdAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: 'ans-2', questionId: 'mock-2', vet: MOCK_VET,
    body: '雄猫の排尿困難は尿閉の可能性があり、非常に緊急度が高い症状です。今すぐ動物病院に電話してください。',
    isAccepted: true, createdAt: new Date(Date.now() - 170000000).toISOString(),
  },
];
