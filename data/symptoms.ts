import type { SymptomMeta } from '@/lib/petask/types';

export const DOG_SYMPTOMS: SymptomMeta[] = [
  { slug: 'vomiting', label: '嘔吐', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 嘔吐', '犬 吐く', '犬 嘔吐 原因'] },
  { slug: 'diarrhea', label: '下痢', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 下痢', '犬 軟便', '犬 下痢 原因'] },
  { slug: 'bloody-stool', label: '血便', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 血便', '犬 赤い便', '犬 血が混じる'] },
  { slug: 'anorexia', label: '食欲不振', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 食欲不振', '犬 ご飯食べない', '犬 食欲がない'] },
  { slug: 'cough', label: '咳', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 咳', '犬 咳き込む', '犬 咳 原因'] },
  { slug: 'breathing-difficulty', label: '呼吸異常', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 呼吸困難', '犬 息が荒い', '犬 呼吸がおかしい'] },
  { slug: 'skin-problem', label: '皮膚異常', animal: 'dog', emergencyLevel: 'low', keywords: ['犬 皮膚病', '犬 皮膚 赤い', '犬 皮膚 ただれ'] },
  { slug: 'itching', label: 'かゆみ', animal: 'dog', emergencyLevel: 'low', keywords: ['犬 かゆい', '犬 体を掻く', '犬 アレルギー かゆみ'] },
  { slug: 'urination-problem', label: '排尿異常', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 排尿異常', '犬 おしっこ出ない', '犬 頻尿'] },
  { slug: 'blood-urine', label: '血尿', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 血尿', '犬 おしっこ 赤い', '犬 尿に血'] },
  { slug: 'ingestion', label: '誤飲', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 誤飲', '犬 異物を食べた', '犬 誤食'] },
  { slug: 'seizure', label: 'けいれん', animal: 'dog', emergencyLevel: 'high', keywords: ['犬 けいれん', '犬 てんかん', '犬 発作'] },
  { slug: 'limping', label: '歩行異常', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 歩けない', '犬 足をひきずる', '犬 跛行'] },
  { slug: 'eye-problem', label: '目の異常', animal: 'dog', emergencyLevel: 'medium', keywords: ['犬 目が赤い', '犬 目やに', '犬 目の病気'] },
  { slug: 'ear-problem', label: '耳の異常', animal: 'dog', emergencyLevel: 'low', keywords: ['犬 耳が臭い', '犬 耳 掻く', '犬 外耳炎'] },
];

export const CAT_SYMPTOMS: SymptomMeta[] = [
  { slug: 'vomiting', label: '嘔吐', animal: 'cat', emergencyLevel: 'medium', keywords: ['猫 嘔吐', '猫 吐く', '猫 嘔吐 原因'] },
  { slug: 'diarrhea', label: '下痢', animal: 'cat', emergencyLevel: 'medium', keywords: ['猫 下痢', '猫 軟便', '猫 下痢 原因'] },
  { slug: 'anorexia', label: '食欲不振', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 食欲不振', '猫 ご飯食べない', '猫 食欲がない'] },
  { slug: 'urination-problem', label: '排尿異常', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 おしっこ出ない', '猫 排尿困難', '猫 尿閉'] },
  { slug: 'blood-urine', label: '血尿', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 血尿', '猫 おしっこ 赤い', '猫 尿に血'] },
  { slug: 'breathing-difficulty', label: '呼吸異常', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 呼吸困難', '猫 息が荒い', '猫 口呼吸'] },
  { slug: 'ingestion', label: '誤飲', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 誤飲', '猫 異物を食べた', '猫 誤食'] },
  { slug: 'seizure', label: 'けいれん', animal: 'cat', emergencyLevel: 'high', keywords: ['猫 けいれん', '猫 てんかん', '猫 発作'] },
  { slug: 'skin-problem', label: '皮膚異常', animal: 'cat', emergencyLevel: 'low', keywords: ['猫 皮膚病', '猫 皮膚 赤い', '猫 脱毛'] },
  { slug: 'eye-problem', label: '目の異常', animal: 'cat', emergencyLevel: 'medium', keywords: ['猫 目が赤い', '猫 目やに', '猫 目の病気'] },
];

export const SYMPTOMS_BY_ANIMAL = {
  dog: DOG_SYMPTOMS,
  cat: CAT_SYMPTOMS,
} as const;
