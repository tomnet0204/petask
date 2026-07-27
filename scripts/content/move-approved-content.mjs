#!/usr/bin/env node
/**
 * 全検査通過後にdrafts → pets/{animal}s/ へ移動する
 * Usage: node scripts/content/move-approved-content.mjs <draftFilePath>
 *
 * 移動条件: reviewStatus が "supervisor_reviewed" または "published" であること
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const [, , draftPath] = process.argv;
if (!draftPath) {
  console.error('Usage: node move-approved-content.mjs <draftFilePath>');
  process.exit(1);
}

const raw = fs.readFileSync(draftPath, 'utf-8');
const { data: frontmatter } = matter(raw);

const APPROVED_STATUSES = ['supervisor_reviewed', 'published'];
if (!APPROVED_STATUSES.includes(frontmatter.reviewStatus)) {
  console.error(`❌ 移動拒否: reviewStatus="${frontmatter.reviewStatus}" は承認済みではありません`);
  console.error('  supervisor_reviewed または published のみ移動できます');
  process.exit(1);
}

const { animal, symptomSlug } = frontmatter;
if (!animal || !symptomSlug) {
  console.error('❌ frontmatter に animal または symptomSlug が未設定です');
  process.exit(1);
}

const destDir = path.join(process.cwd(), 'content', 'pets', `${animal}s`);
fs.mkdirSync(destDir, { recursive: true });
const destPath = path.join(destDir, `${symptomSlug}.mdx`);

fs.copyFileSync(draftPath, destPath);
fs.unlinkSync(draftPath);

console.log(`✅ 移動完了: ${draftPath} → ${destPath}`);
