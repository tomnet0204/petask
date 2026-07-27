#!/usr/bin/env node
/**
 * 症状記事のドラフトをClaude APIで生成してdraftsフォルダに保存する
 * Usage: node scripts/content/generate-article-draft.mjs <animal> <symptomSlug>
 * Example: node scripts/content/generate-article-draft.mjs dog diarrhea
 */

import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const ANIMAL_LABEL = { dog: '犬', cat: '猫' };

const SYSTEM_PROMPT = `あなたは獣医師監修のペット健康情報ライターです。
以下のルールを厳守してください：

【絶対禁止】
- 病名の断定（「〇〇病です」「〇〇の可能性が高い」など）
- 投薬指示（「〇〇を飲ませてください」など）
- 自宅での処置推奨（「お腹をマッサージすると良い」など）
- 緊急症状の軽視（「様子を見てください」と言いすぎない）

【必須要素】
- 緊急度の明示（today/urgent/watchful/monitor のいずれか）
- 獣医師への伝え方（具体的な項目を箇条書き）
- 持参物リスト
- 免責文言（診断の代替ではない旨）

出力はMDX frontmatter付きのMarkdownで返してください。`;

async function main() {
  const [, , animal, symptomSlug] = process.argv;
  if (!animal || !symptomSlug) {
    console.error('Usage: node generate-article-draft.mjs <animal> <symptomSlug>');
    process.exit(1);
  }

  const animalLabel = ANIMAL_LABEL[animal];
  if (!animalLabel) {
    console.error('animal must be "dog" or "cat"');
    process.exit(1);
  }

  const client = new Anthropic();
  console.log(`Generating draft for ${animalLabel}/${symptomSlug}...`);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${animalLabel}の「${symptomSlug}」症状についての記事ドラフトを生成してください。
reviewStatus は必ず "ai_generated" にしてください。`,
      },
    ],
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';

  const outDir = path.join(process.cwd(), 'content', 'drafts');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${animal}-${symptomSlug}.mdx`);
  fs.writeFileSync(outPath, content, 'utf-8');

  console.log(`✅ Draft saved: ${outPath}`);
  console.log('次のステップ: node scripts/content/validate-medical-safety.mjs でレビューしてください');
}

main().catch((e) => { console.error(e); process.exit(1); });
