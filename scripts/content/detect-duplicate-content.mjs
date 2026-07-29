#!/usr/bin/env node
/**
 * content/pets/ 配下のMDXファイルの重複コンテンツを検出する
 * Usage: node scripts/content/detect-duplicate-content.mjs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'pets');

function loadAll() {
  const files = [];
  for (const animalDir of ['dogs', 'cats']) {
    const dir = path.join(CONTENT_ROOT, animalDir);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      files.push({
        path: path.join(animalDir, file),
        animal: animalDir.replace('s', ''),
        slug: file.replace('.mdx', ''),
        title: data.title ?? '',
        excerpt: content.replace(/[#>\-*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200),
      });
    }
  }
  return files;
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = [...setA].filter((c) => setB.has(c)).length;
  return intersection / Math.max(setA.size, setB.size);
}

const files = loadAll();
const errors = [];
const warnings = [];

// スラッグ重複チェック（同一animal×slug）
const seen = new Map();
for (const f of files) {
  const key = `${f.animal}:${f.slug}`;
  if (seen.has(key)) {
    errors.push(`重複スラッグ: ${key} (${f.path} と ${seen.get(key)})`);
  } else {
    seen.set(key, f.path);
  }
}

// 本文類似度チェック
for (let i = 0; i < files.length; i++) {
  for (let j = i + 1; j < files.length; j++) {
    const sim = similarity(files[i].excerpt, files[j].excerpt);
    if (sim >= 0.8) {
      warnings.push(`類似度${Math.round(sim * 100)}%: ${files[i].path} ↔ ${files[j].path}`);
    }
  }
}

if (errors.length) {
  console.error('\n🔴 エラー:');
  errors.forEach((e) => console.error(`  - ${e}`));
}
if (warnings.length) {
  console.warn('\n🟡 警告（類似コンテンツ）:');
  warnings.forEach((w) => console.warn(`  - ${w}`));
}
if (!errors.length && !warnings.length) {
  console.log(`✅ 重複なし（${files.length}件チェック済み）`);
}

process.exit(errors.length > 0 ? 1 : 0);
