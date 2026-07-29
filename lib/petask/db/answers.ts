import type { Answer } from '../types';

export async function getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
  return MOCK_ANSWERS.filter(a => a.questionId === questionId);
}

export async function createAnswer(
  data: Omit<Answer, 'id' | 'createdAt'>
): Promise<Answer> {
  return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
}

const MOCK_ANSWERS: Answer[] = [
  {
    id: 'ans-1',
    questionId: 'mock-1',
    vet: {
      id: 'vet-1',
      name: '田中 獣医師',
      credential: '獣医師・獣医学博士',
      specialty: ['犬', '猫', '内科'],
      isVerified: true,
    },
    body: '嘔吐が続いている場合は脱水に注意が必要です。水を飲めているとのことで少し安心ですが、1日以上嘔吐が続く場合や、血が混じる・ぐったりする場合は早めに受診してください。嘔吐した内容物（色・量）と最後に何を食べたかを記録しておくと診察がスムーズです。',
    isAccepted: true,
    createdAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: 'ans-3',
    questionId: 'mock-1',
    vet: {
      id: 'vet-2',
      name: '山田 獣医師',
      credential: '獣医師',
      specialty: ['犬', '外科'],
      isVerified: true,
    },
    body: '食欲低下・元気消失を伴う嘔吐は消化器系の異常サインです。異物誤飲の可能性がある場合は特に早急な受診をおすすめします。',
    isAccepted: false,
    createdAt: new Date(Date.now() - 80000000).toISOString(),
  },
  {
    id: 'ans-2',
    questionId: 'mock-2',
    vet: {
      id: 'vet-1',
      name: '田中 獣医師',
      credential: '獣医師・獣医学博士',
      specialty: ['犬', '猫', '内科'],
      isVerified: true,
    },
    body: '雄猫の排尿困難は尿閉の可能性があり、非常に緊急度が高い症状です。数時間で腎不全につながる危険があります。今すぐ動物病院に電話して状況を伝えてください。',
    isAccepted: true,
    createdAt: new Date(Date.now() - 170000000).toISOString(),
  },
];
