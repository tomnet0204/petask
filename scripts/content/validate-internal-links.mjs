#!/usr/bin/env node
/**
 * content/pets/ 配下のMDX内の内部リンクを検証する
 * Usage: node scripts/content/validate-internal-links.mjs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'pets');
const APP_ROOT = path.join(process.cwd(), 'app', '(petask)', 'petask');

const VALID_SLUGS = {
  dog: ['vomiting','diarrhea','bloody-stool','anorexia','cough','breathing-difficulty','skin-problem','itching','urination-problem','blood-urine','ingestion','seizure','limping','eye-problem','ear-problem'],
  cat: ['vomiting','diarrhea','anorexia','urination-problem','blood-urine','breathing-difficulty','ingestion','seizure','skin-problem','eye-problem'],
};

const LINK_RE = /href="(\/petask\/[^"]+)"/g;

const errors = [];
let checked = 0;

for (const animalDir of ['dogs', 'cats']) {
  const dir = path.join(CONTENT_ROOT, animalDir);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { content } = matter(raw);
    const links = [...content.matchAll(LINK_RE)].map((m) => m[1]);
    for (const link of links) {
      checked++;
      // /petask/symptoms/<animal>/<slug> のリンクを検証
      const m = link.match(/^\/petask\/symptoms\/(dog|cat)\/(.+)$/);
      if (m) {
        const [, animal, slug] = m;
        if (!VALID_SLUGS[animal]?.includes(slug)) {
          errors.push(`無効なリンク: ${link} (in ${path.join(animalDir, file)})`);
        }
        continue;
      }
      // /petask/dogs, /petask/cats, /petask/emergency などの静的ページ確認
      const staticMap = {
        '/petask': 'page.tsx',
        '/petask/dogs': 'dogs/page.tsx',
        '/petask/cats': 'cats/page.tsx',
        '/petask/emergency': 'emergency/page.tsx',
        '/petask/checker': 'checker/page.tsx',
        '/petask/disclaimer': 'disclaimer/page.tsx',
      };
      if (staticMap[link] !== undefined) {
        const pagePath = path.join(APP_ROOT, staticMap[link]);
        if (!fs.existsSync(pagePath)) {
          errors.push(`ページが存在しない: ${link} → ${pagePath}`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error(`\n🔴 ${errors.length}件のリンクエラー:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ 内部リンクチェック完了（${checked}件チェック、エラーなし）`);
}
