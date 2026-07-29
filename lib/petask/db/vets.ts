import type { VetProfile } from '../types';

export async function getVets(): Promise<VetProfile[]> {
  return MOCK_VETS;
}

export async function getVetById(id: string): Promise<VetProfile | null> {
  return MOCK_VETS.find(v => v.id === id) ?? null;
}

const MOCK_VETS: VetProfile[] = [
  {
    id: 'vet-1',
    name: '田中 獣医師',
    credential: '獣医師・獣医学博士',
    specialty: ['犬', '猫', '内科'],
    bio: '犬・猫の内科を中心に診療。特に消化器疾患と泌尿器疾患を専門としています。',
    isVerified: true,
  },
  {
    id: 'vet-2',
    name: '山田 獣医師',
    credential: '獣医師',
    specialty: ['犬', '外科'],
    bio: '整形外科・外科手術を専門。老犬の関節疾患の診療経験が豊富です。',
    isVerified: true,
  },
  {
    id: 'vet-3',
    name: '鈴木 獣医師',
    credential: '獣医師',
    specialty: ['猫', '皮膚科'],
    bio: '猫の皮膚疾患・アレルギー専門。猫専門病院での勤務経験10年以上。',
    isVerified: true,
  },
];
