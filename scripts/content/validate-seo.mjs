#!/usr/bin/env node
/**
 * MDXファイルのSEOメタデータを検証する
 * Usage: node scripts/content/validate-seo.mjs <filePath>
 */

import fs from 'fs';
import matter from 'gray-matter';

const [, , filePath] = process.argv;
if (!filePath) {
  console.error('Usage: node validate-seo.mjs <filePath>');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const { data: fm } = matter(raw);

const errors = [];
const warnings = [];

// title
if (!fm.title) {
  errors.push('title が未設定');
} else if (fm.title.length > 60) {
  errors.push(`title が60文字超（${fm.title.length}文字）`);
}

// description
if (!fm.description) {
  errors.push('description が未設定');
} else if (fm.description.length > 160) {
  errors.push(`description が160文字超（${fm.description.length}文字）`);
} else if (fm.description.length < 80) {
  warnings.push(`description が80文字未満（${fm.description.length}文字）`);
}

// keywords
if (!fm.keywords || fm.keywords.length === 0) {
  errors.push('keywords が空');
} else if (fm.keywords.length <= 1) {
  warnings.push('keywords が1件以下（2件以上推奨）');
}

// noindex × published の矛盾
if (fm.noindex === true && fm.reviewStatus === 'published') {
  errors.push('noindex: true なのに reviewStatus が published');
}

if (errors.length) {
  console.error('\n🔴 エラー:');
  errors.forEach((e) => console.error(`  - ${e}`));
}
if (warnings.length) {
  console.warn('\n🟡 警告:');
  warnings.forEach((w) => console.warn(`  - ${w}`));
}
if (!errors.length && !warnings.length) {
  console.log('✅ SEOチェック: 問題なし');
}

process.exit(errors.length > 0 ? 1 : 0);
