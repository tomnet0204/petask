#!/usr/bin/env node
/**
 * 記事の品質レポートを生成して reports/content-quality/ に保存する
 * Usage: node scripts/content/generate-content-report.mjs <animal> <symptomSlug>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const [, , animal, symptomSlug] = process.argv;
if (!animal || !symptomSlug) {
  console.error('Usage: node generate-content-report.mjs <animal> <symptomSlug>');
  process.exit(1);
}

const filePath = path.join(process.cwd(), 'content', 'pets', `${animal}s`, `${symptomSlug}.mdx`);
if (!fs.existsSync(filePath)) {
  console.error(`ファイルが見つかりません: ${filePath}`);
  process.exit(1);
}

function runScript(script, args) {
  try {
    const out = execSync(`node scripts/content/${script} ${args}`, { encoding: 'utf-8', stdio: 'pipe' });
    const lines = out.trim().split('\n');
    const errors = lines.filter((l) => l.includes('🔴')).map((l) => l.replace('🔴', '').trim());
    const warnings = lines.filter((l) => l.includes('🟡')).map((l) => l.replace('🟡', '').trim());
    return { passed: errors.length === 0, errors, warnings: warnings ?? [] };
  } catch (e) {
    const out = (e.stdout ?? '') + (e.stderr ?? '');
    const lines = out.split('\n');
    const errors = lines.filter((l) => l.includes('🔴')).map((l) => l.replace('🔴', '').trim());
    const warnings = lines.filter((l) => l.includes('🟡')).map((l) => l.replace('🟡', '').trim());
    return { passed: false, errors: errors.length ? errors : [e.message.split('\n')[0]], warnings };
  }
}

console.log(`📋 ${animal}/${symptomSlug} の品質レポートを生成中...`);

const medicalSafety = runScript('validate-medical-safety.mjs', filePath);
const seo = runScript('validate-seo.mjs', filePath);
const references = runScript('validate-references.mjs', filePath);

const report = {
  animal,
  symptomSlug,
  generatedAt: new Date().toISOString(),
  medicalSafety,
  seo,
  references: { passed: references.passed, errors: references.errors },
  overallPassed: medicalSafety.passed && seo.passed && references.passed,
};

const outDir = path.join(process.cwd(), 'reports', 'content-quality');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${animal}-${symptomSlug}-summary.json`);
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');

const icon = report.overallPassed ? '✅' : '❌';
console.log(`${icon} レポート保存: ${outPath}`);
console.log(`  医療安全: ${medicalSafety.passed ? 'PASS' : 'FAIL'}`);
console.log(`  SEO:      ${seo.passed ? 'PASS' : 'FAIL'}`);
console.log(`  参考資料: ${references.passed ? 'PASS' : 'FAIL'}`);
