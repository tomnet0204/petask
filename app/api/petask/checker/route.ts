import { NextRequest, NextResponse } from 'next/server';
import { evaluateUrgency } from '@/lib/petask/emergency-rules';
import { SYMPTOMS_BY_ANIMAL } from '@/data/symptoms';
import type { PetProfile, SymptomInput, CheckerResult, UrgencyLevel } from '@/lib/petask/types';

const URGENCY_MESSAGES: Record<UrgencyLevel, string> = {
  emergency: '今すぐ動物病院に電話してください',
  urgent: '本日中に動物病院を受診してください',
  watchful: '24時間以内に変化があれば受診を検討してください',
  monitor: 'しばらく様子を観察してください。悪化したら受診を',
};

const ENERGY_LABEL: Record<SymptomInput['energy'], string> = {
  normal: '普通',
  reduced: 'やや元気がない',
  very_low: '著しく元気がない',
  unconscious: '意識がない・反応しない',
};

const APPETITE_LABEL: Record<SymptomInput['appetite'], string> = {
  normal: '普通',
  reduced: '減っている',
  none: '全く食べない',
};

const WATER_LABEL: Record<SymptomInput['canDrinkWater'], string> = {
  yes: '飲める',
  reduced: '少し飲める',
  no: '全く飲めない',
};

const BREATHING_LABEL: Record<SymptomInput['breathing'], string> = {
  normal: '普通',
  labored: '苦しそう',
  very_difficult: '著しく苦しそう',
};

const DEFECATION_LABEL: Record<SymptomInput['defecation'], string> = {
  normal: '普通',
  diarrhea: '下痢',
  constipation: '便秘',
  none: '出ていない',
  blood: '血が混じっている',
};

const BRING_TO_VET = [
  '母子手帳・ワクチン証明書',
  'ワクチン証明書',
  '普段食べているフードのパッケージ',
  '服用中の薬がある場合はその薬',
  '症状が分かる動画・写真（撮影できた場合）',
];

function buildVetGuide(symptom: SymptomInput): string {
  const lines = [
    `主な症状: ${symptom.primarySymptom}`,
    symptom.onsetDays != null ? `発症: 約${symptom.onsetDays}日前から` : null,
    `元気: ${ENERGY_LABEL[symptom.energy]}`,
    `食欲: ${APPETITE_LABEL[symptom.appetite]}`,
    `水分摂取: ${WATER_LABEL[symptom.canDrinkWater]}`,
    `呼吸: ${BREATHING_LABEL[symptom.breathing]}`,
    `排便: ${DEFECATION_LABEL[symptom.defecation]}`,
    symptom.possibleIngestion ? '誤飲の可能性あり' : null,
    symptom.additionalNotes ? `その他: ${symptom.additionalNotes}` : null,
  ].filter(Boolean);
  return lines.join('、');
}

function buildWatchPoints(urgencyLevel: UrgencyLevel, symptom: SymptomInput): string[] {
  const points: string[] = [];
  if (urgencyLevel === 'monitor' || urgencyLevel === 'watchful') {
    points.push('元気・食欲・飲水量の変化');
    points.push('嘔吐・下痢・血便などの消化器症状');
    points.push('排尿の回数・量・色の変化');
    if (symptom.breathing === 'labored') points.push('呼吸の状態（悪化したら即受診）');
  }
  if (urgencyLevel === 'urgent') {
    points.push('意識レベルの変化（ぐったりが増したら緊急）');
    points.push('呼吸の変化');
  }
  return points.length > 0 ? points : ['24時間以内に改善しない場合は受診を検討してください'];
}

function findRelatedSlugs(pet: PetProfile, symptom: SymptomInput): string[] {
  const list = SYMPTOMS_BY_ANIMAL[pet.animalType] ?? [];
  const matched = list.find((s) => s.label === symptom.primarySymptom || s.slug === symptom.primarySymptom);
  return matched ? [matched.slug] : [];
}

export async function POST(req: NextRequest) {
  let body: { pet: PetProfile; symptom: SymptomInput };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pet, symptom } = body;
  if (!pet?.animalType || !symptom?.primarySymptom) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { urgencyLevel, flags } = evaluateUrgency(symptom);

  const result: CheckerResult = {
    urgencyLevel,
    urgencyReasons: flags.length > 0 ? flags : [URGENCY_MESSAGES[urgencyLevel]],
    watchPoints: buildWatchPoints(urgencyLevel, symptom),
    vetCommunicationGuide: buildVetGuide(symptom),
    bringToVet: BRING_TO_VET,
    relatedArticleSlugs: findRelatedSlugs(pet, symptom),
    disclaimer: 'この結果は診断ではありません。必ず獣医師にご相談ください。',
    ruleBasedFlags: flags,
  };

  return NextResponse.json(result);
}
