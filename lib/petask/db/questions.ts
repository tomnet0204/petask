import type { Question } from '../types';

// Supabase接続前のモック — 後でSupabaseクライアントに差し替える
export async function getQuestions(opts?: {
  animal?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Question[]> {
  let results = [...MOCK_QUESTIONS];
  if (opts?.animal) results = results.filter(q => q.animalType === opts.animal);
  if (opts?.status) results = results.filter(q => q.status === opts.status);
  return results.slice(opts?.offset ?? 0, (opts?.offset ?? 0) + (opts?.limit ?? 10));
}

export async function getQuestionById(id: string): Promise<Question | null> {
  return MOCK_QUESTIONS.find(q => q.id === id) ?? null;
}

export async function createQuestion(
  data: Omit<Question, 'id' | 'status' | 'answerCount' | 'createdAt'>
): Promise<Question> {
  return {
    ...data,
    id: crypto.randomUUID(),
    status: 'pending',
    answerCount: 0,
    createdAt: new Date().toISOString(),
  };
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'mock-1',
    petName: 'ハナ',
    animalType: 'dog',
    ageYears: 3,
    sex: 'female',
    body: '昨夜から嘔吐を繰り返しています。今朝は食欲がなく元気もありません。水は少し飲みます。どのくらい様子を見てよいでしょうか？',
    symptomSlug: 'vomiting',
    status: 'answered',
    answerCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-2',
    petName: 'シロ',
    animalType: 'cat',
    ageYears: 5,
    sex: 'male',
    body: 'トイレに何度も行くのにおしっこが出ていないようです。昨日から食欲もなくぐったりしています。',
    symptomSlug: 'urination-problem',
    status: 'answered',
    answerCount: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'mock-3',
    petName: 'モモ',
    animalType: 'dog',
    ageYears: 8,
    sex: 'female',
    body: '最近後ろ足をひきずるようになりました。痛がっている様子もあります。老犬なので心配です。',
    symptomSlug: 'limping',
    status: 'pending',
    answerCount: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'mock-4',
    petName: 'クロ',
    animalType: 'cat',
    ageYears: 2,
    sex: 'female',
    body: '2日前から下痢が続いています。食欲はあり元気もありますが、便が水っぽく心配しています。',
    symptomSlug: 'diarrhea',
    status: 'pending',
    answerCount: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];
