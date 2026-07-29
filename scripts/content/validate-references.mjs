#!/usr/bin/env node
/**
 * MDXファイルのfrontmatter.referencesのURLを検証する
 * Usage: node scripts/content/validate-references.mjs <filePath>
 */

import fs from 'fs';
import matter from 'gray-matter';

const VALID_STATUSES = [200, 301, 302, 303, 307, 308];

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(timer);
    return { url, status: res.status, ok: VALID_STATUSES.includes(res.status) };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message };
  }
}

const [, , filePath] = process.argv;
if (!filePath) {
  console.error('Usage: node validate-references.mjs <filePath>');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const { data: frontmatter } = matter(raw);
const refs = frontmatter.references ?? [];

if (refs.length === 0) {
  console.warn('⚠️  references が空です');
  process.exit(0);
}

const results = await Promise.all(refs.map((r) => checkUrl(r.url)));
const errors = results.filter((r) => !r.ok);

results.forEach((r) => {
  const icon = r.ok ? '✅' : '🔴';
  console.log(`${icon} [${r.status}] ${r.url}${r.error ? ` (${r.error})` : ''}`);
});

if (errors.length > 0) {
  console.error(`\n🔴 ${errors.length}件のURLが無効です`);
  process.exit(1);
}
console.log('\n✅ 全URLが有効です');
