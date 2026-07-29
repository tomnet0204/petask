#!/usr/bin/env node
/**
 * 症状コンテンツブリーフを生成して data/content-briefs/ に保存する
 * Usage: node scripts/content/generate-content-brief.mjs <animal> <symptomSlug>
 */

import fs from 'fs';
import path from 'path';

const SYMPTOMS = {
  dog: [
    { slug: 'vomiting', label: '嘔吐', emergencyLevel: 'medium', keywords: ['犬 嘔吐', '犬 吐く', '犬 嘔吐 原因'] },
    { slug: 'diarrhea', label: '下痢', emergencyLevel: 'medium', keywords: ['犬 下痢', '犬 軟便', '犬 下痢 原因'] },
    { slug: 'bloody-stool', label: '血便', emergencyLevel: 'high', keywords: ['犬 血便', '犬 赤い便'] },
    { slug: 'anorexia', label: '食欲不振', emergencyLevel: 'medium', keywords: ['犬 食欲不振', '犬 ご飯食べない'] },
    { slug: 'cough', label: '咳', emergencyLevel: 'medium', keywords: ['犬 咳', '犬 咳き込む'] },
    { slug: 'breathing-difficulty', label: '呼吸異常', emergencyLevel: 'high', keywords: ['犬 呼吸困難', '犬 息が荒い'] },
    { slug: 'skin-problem', label: '皮膚異常', emergencyLevel: 'low', keywords: ['犬 皮膚病', '犬 皮膚 赤い'] },
    { slug: 'itching', label: 'かゆみ', emergencyLevel: 'low', keywords: ['犬 かゆい', '犬 体を掻く'] },
    { slug: 'urination-problem', label: '排尿異常', emergencyLevel: 'high', keywords: ['犬 排尿異常', '犬 おしっこ出ない'] },
    { slug: 'blood-urine', label: '血尿', emergencyLevel: 'high', keywords: ['犬 血尿', '犬 おしっこ 赤い'] },
    { slug: 'ingestion', label: '誤飲', emergencyLevel: 'high', keywords: ['犬 誤飲', '犬 誤食'] },
    { slug: 'seizure', label: 'けいれん', emergencyLevel: 'high', keywords: ['犬 けいれん', '犬 発作'] },
    { slug: 'limping', label: '歩行異常', emergencyLevel: 'medium', keywords: ['犬 歩けない', '犬 足をひきずる'] },
    { slug: 'eye-problem', label: '目の異常', emergencyLevel: 'medium', keywords: ['犬 目が赤い', '犬 目やに'] },
    { slug: 'ear-problem', label: '耳の異常', emergencyLevel: 'low', keywords: ['犬 耳が臭い', '犬 外耳炎'] },
  ],
  cat: [
    { slug: 'vomiting', label: '嘔吐', emergencyLevel: 'medium', keywords: ['猫 嘔吐', '猫 吐く'] },
    { slug: 'diarrhea', label: '下痢', emergencyLevel: 'medium', keywords: ['猫 下痢', '猫 軟便'] },
    { slug: 'anorexia', label: '食欲不振', emergencyLevel: 'high', keywords: ['猫 食欲不振', '猫 ご飯食べない'] },
    { slug: 'urination-problem', label: '排尿異常', emergencyLevel: 'high', keywords: ['猫 おしっこ出ない', '猫 尿閉'] },
    { slug: 'blood-urine', label: '血尿', emergencyLevel: 'high', keywords: ['猫 血尿', '猫 おしっこ 赤い'] },
    { slug: 'breathing-difficulty', label: '呼吸異常', emergencyLevel: 'high', keywords: ['猫 呼吸困難', '猫 口呼吸'] },
    { slug: 'ingestion', label: '誤飲', emergencyLevel: 'high', keywords: ['猫 誤飲', '猫 誤食'] },
    { slug: 'seizure', label: 'けいれん', emergencyLevel: 'high', keywords: ['猫 けいれん', '猫 発作'] },
    { slug: 'skin-problem', label: '皮膚異常', emergencyLevel: 'low', keywords: ['猫 皮膚病', '猫 脱毛'] },
    { slug: 'eye-problem', label: '目の異常', emergencyLevel: 'medium', keywords: ['猫 目が赤い', '猫 目やに'] },
  ],
};

const [, , animal, symptomSlug] = process.argv;
if (!animal || !symptomSlug) {
  console.error('Usage: node generate-content-brief.mjs <animal> <symptomSlug>');
  process.exit(1);
}

const list = SYMPTOMS[animal];
if (!list) { console.error('animal は dog または cat'); process.exit(1); }

const meta = list.find((s) => s.slug === symptomSlug);
if (!meta) { console.error(`症状 "${symptomSlug}" が見つかりません`); process.exit(1); }

const brief = {
  animal,
  symptomSlug,
  targetKeywords: meta.keywords,
  emergencyLevel: meta.emergencyLevel,
  requiredSections: ['緊急度を確認しましょう', '獣医師への伝え方', '持参するもの'],
  prohibitedContent: ['病名断定', '投薬指示', '自宅処置推奨'],
  referenceUrls: ['https://www.nichiju.or.jp/'],
  createdAt: new Date().toISOString(),
};

const outDir = path.join(process.cwd(), 'data', 'content-briefs');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${animal}-${symptomSlug}.json`);
fs.writeFileSync(outPath, JSON.stringify(brief, null, 2), 'utf-8');
console.log(`✅ Brief saved: ${outPath}`);
