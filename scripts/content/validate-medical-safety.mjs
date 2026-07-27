#!/usr/bin/env node
/**
 * MDXファイルの医療安全チェック
 * Usage: node scripts/content/validate-medical-safety.mjs <filePath>
 */

import fs from 'fs';
import matter from 'gray-matter';

// 禁止表現パターン
const PROHIBITED_PATTERNS = [
  { pattern: /(?:〇〇病|□□症)です(?:。|$)/u, message: '病名断定の疑い' },
  { pattern: /(?:飲ませて|投与して|塗って)ください/u, message: '投薬指示の疑い' },
  { pattern: /自宅で(?:治療|処置|対処)/u, message: '自宅処置推奨の疑い' },
  { pattern: /心配(?:いり|あり)ません/u, message: '不適切な安心表現の疑い' },
  { pattern: /人間用の薬/u, message: '人間用薬品への言及' },
  { pattern: /様子を見て(?:ください|いれば)/u, message: '緊急症状を軽視している可能性' },
];

// 必須要素チェック
const REQUIRED_ELEMENTS = [
  { pattern: /獣医師に伝え|伝え方/u, message: '獣医師への伝え方の記載がない' },
  { pattern: /持参|持って/u, message: '持参物リストの記載がない' },
  { pattern: /診断.*代替ではない|参考.*情報/u, message: '免責文言の記載がない' },
];

function validate(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  const errors = [];
  const warnings = [];

  // frontmatter チェック
  if (!frontmatter.reviewStatus) errors.push('frontmatter: reviewStatus が未設定');
  if (!frontmatter.emergencyLevel) errors.push('frontmatter: emergencyLevel が未設定');
  if (!frontmatter.references || frontmatter.references.length === 0) {
    warnings.push('frontmatter: references が空（出典なし）');
  }

  // 禁止表現チェック
  for (const { pattern, message } of PROHIBITED_PATTERNS) {
    if (pattern.test(content)) errors.push(`禁止表現: ${message}`);
  }

  // 必須要素チェック
  for (const { pattern, message } of REQUIRED_ELEMENTS) {
    if (!pattern.test(content)) warnings.push(`要素不足: ${message}`);
  }

  return { errors, warnings };
}

const [, , filePath] = process.argv;
if (!filePath) {
  console.error('Usage: node validate-medical-safety.mjs <filePath>');
  process.exit(1);
}

const { errors, warnings } = validate(filePath);

if (errors.length > 0) {
  console.error('\n🔴 エラー（修正必須）:');
  errors.forEach((e) => console.error(`  - ${e}`));
}
if (warnings.length > 0) {
  console.warn('\n🟡 警告（要確認）:');
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 医療安全チェック: 問題なし');
  process.exit(0);
} else if (errors.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
