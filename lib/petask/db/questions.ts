import { createServerSupabase } from '../supabase';
import type { Question, AnimalType } from '../types';

function toQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    petName: row.pet_name as string,
    animalType: row.animal_type as AnimalType,
    ageYears: row.age_years as number | undefined,
    sex: row.sex as Question['sex'],
    body: row.body as string,
    symptomSlug: row.symptom_slug as string | undefined,
    checkerResult: row.checker_result as Question['checkerResult'],
    imageUrls: row.image_urls as string[] | undefined,
    status: row.status as Question['status'],
    userEmail: row.user_email as string | undefined,
    answerCount: row.answer_count as number,
    createdAt: row.created_at as string,
  };
}

export async function getQuestions(opts?: {
  animal?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Question[]> {
  const supabase = createServerSupabase();
  if (!supabase) {
    let results = [...MOCK_QUESTIONS];
    if (opts?.animal) results = results.filter(q => q.animalType === opts.animal);
    if (opts?.status) results = results.filter(q => q.status === opts.status);
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? 10;
    return results.slice(offset, offset + limit);
  }

  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(opts?.offset ?? 0, (opts?.offset ?? 0) + (opts?.limit ?? 10) - 1);

  if (opts?.animal) query = query.eq('animal_type', opts.animal);
  if (opts?.status) query = query.eq('status', opts.status);

  try {
    const { data, error } = await query;
    if (error) { console.error(error); return mockFallback(opts); }
    return (data ?? []).map(toQuestion);
  } catch (e) {
    console.error('Supabase接続失敗 (questions):', e);
    return mockFallback(opts);
  }
}

function mockFallback(opts?: { animal?: string; status?: string; limit?: number; offset?: number }): Question[] {
  let results = [...MOCK_QUESTIONS];
  if (opts?.animal) results = results.filter(q => q.animalType === opts.animal);
  if (opts?.status) results = results.filter(q => q.status === opts.status);
  const offset = opts?.offset ?? 0;
  return results.slice(offset, offset + (opts?.limit ?? 10));
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const supabase = createServerSupabase();
  if (!supabase) return MOCK_QUESTIONS.find(q => q.id === id) ?? null;

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return MOCK_QUESTIONS.find(q => q.id === id) ?? null;
    return toQuestion(data);
  } catch (e) {
    console.error('Supabase接続失敗 (getQuestionById):', e);
    return MOCK_QUESTIONS.find(q => q.id === id) ?? null;
  }
}

export async function createQuestion(
  data: Omit<Question, 'id' | 'status' | 'answerCount' | 'createdAt'>
): Promise<Question> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return { ...data, id: crypto.randomUUID(), status: 'pending', answerCount: 0, createdAt: new Date().toISOString() };
  }

  try {
    const { data: row, error } = await supabase
      .from('questions')
      .insert({
        pet_name: data.petName,
        animal_type: data.animalType,
        age_years: data.ageYears,
        sex: data.sex,
        body: data.body,
        symptom_slug: data.symptomSlug,
        checker_result: data.checkerResult,
        image_urls: data.imageUrls ?? [],
        user_email: data.userEmail,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toQuestion(row);
  } catch (e) {
    // ネットワーク不通時はモックレスポンスを返す
    console.error('Supabase接続失敗 (createQuestion):', e);
    return { ...data, id: crypto.randomUUID(), status: 'pending', answerCount: 0, createdAt: new Date().toISOString() };
  }
}

// Supabase未設定時のフォールバック
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'mock-1', petName: 'ハナ', animalType: 'dog', ageYears: 3, sex: 'female',
    body: '昨夜から嘔吐を繰り返しています。今朝は食欲がなく元気もありません。水は少し飲みます。どのくらい様子を見てよいでしょうか？',
    symptomSlug: 'vomiting', status: 'answered', answerCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-2', petName: 'シロ', animalType: 'cat', ageYears: 5, sex: 'male',
    body: 'トイレに何度も行くのにおしっこが出ていないようです。昨日から食欲もなくぐったりしています。',
    symptomSlug: 'urination-problem', status: 'answered', answerCount: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'mock-3', petName: 'モモ', animalType: 'dog', ageYears: 8, sex: 'female',
    body: '最近後ろ足をひきずるようになりました。老犬なので心配です。',
    symptomSlug: 'limping', status: 'pending', answerCount: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];
