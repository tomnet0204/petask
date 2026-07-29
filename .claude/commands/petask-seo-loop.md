# PetAsk SEO・品質改善ループ (petask-seo-loop)

PetAskのSEO強化・コンテンツ品質向上を自動実行するループ。
優先度順にタスクを1つ選んで実装し、push まで完結させる。

## プロジェクトルート確認（必須）

```bash
cd /workspace/petask && pwd
```

## 一時停止スイッチ確認

```bash
cat docs/loop-control.json 2>/dev/null || echo '{"paused":false}'
```

`"paused": true` の場合は即停止。

---

## 優先タスクキュー（インパクト順）

以下を **上から順に** 確認し、未実装のものを1つ選んで実装する。

### Task 1: Q&Aページの JSON-LD 構造化データ
`app/(petask)/petask/q-and-a/[id]/page.tsx` に QAPage schema を追加:
```json
{
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": "<質問タイトル>",
    "text": "<質問本文>",
    "answerCount": <回答数>,
    "acceptedAnswer": { "@type": "Answer", "text": "<ベスト回答>" }
  }
}
```
Q&A一覧ページにも `FAQPage` スキーマを追加する。

### Task 2: サイトマップに Q&A ページを追加
`app/sitemap.ts`（または `public/sitemap.xml`）を確認:
- `/petask/q-and-a` エントリを追加（changefreq: daily）
- `/petask/q-and-a/[id]` の動的エントリを Supabase から取得して追加
- `/petask/checker` `/petask/vets` もサイトマップに含める

### Task 3: 症状記事のメタデータ強化
`app/(petask)/petask/symptoms/[slug]/page.tsx` の generateMetadata を確認:
- title: `{症状名}の症状 | ペットの{犬/猫}の症状チェック - PetAsk`
- description: 150文字以内で症状説明＋緊急度目安
- og:image を症状カテゴリ別画像に設定
- Article JSON-LD を追加（datePublished, author: PetAsk編集部）

### Task 4: コンテンツ拡充（症状記事追加）
`content/symptoms/` 配下の記事数を確認:
```bash
ls /workspace/petask/content/symptoms/ | wc -l
```
25件未満なら不足分を追加。優先すべき症状:
- 犬: 皮膚のかゆみ・目やに・下痢・体重減少・発熱
- 猫: 咳・くしゃみ・目が開かない・毛並みが悪い・食欲不振

### Task 5: Core Web Vitals 改善
`next.config.ts` を確認してパフォーマンス設定を最適化:
- 画像最適化 (`next/image` 使用確認)
- フォント最適化 (`next/font` 使用確認)
- 不要な `use client` ディレクティブをServer Componentに戻す

---

## 実装後の必須手順

1. `cd /workspace/petask`
2. TypeScriptエラーチェック: `npx tsc --noEmit 2>&1 | head -20`
3. git add / commit / push
4. 完了報告: 実装したTask番号・変更ファイル・期待されるSEO効果

## モデル使用ルール
- コンテンツ生成・実装: claude-sonnet-4-6
- SEO戦略判断: claude-opus-4-8
