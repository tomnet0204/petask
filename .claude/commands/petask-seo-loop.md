# PetAsk SEO・品質改善ループ (petask-seo-loop)

PetAskのSEO強化・コンテンツ品質向上を自動実行するループ。
**1回の実行で未実装タスクを上から3つ選んで実装し**、push まで完結させる。

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

**実装済みチェック方法**: 各タスクの確認コマンドを実行して実装済みか判定する。
未実装のものを **上から3つ** 選んで、この1回の実行で3つすべて実装する。

---

### ✅ Task 1: Q&A詳細 JSON-LD（実装済み）
```bash
grep "QAPage" app/\(petask\)/petask/q-and-a/\[id\]/page.tsx && echo "実装済み"
```

### ✅ Task 2: サイトマップ Q&A追加（実装済み）
```bash
grep "q-and-a" app/sitemap.ts && echo "実装済み"
```

### ✅ Task 3: 症状ページメタデータ強化（実装済み）
```bash
grep "openGraph" app/\(petask\)/petask/symptoms/\[animal\]/\[symptom\]/page.tsx 2>/dev/null && echo "実装済み"
```

### ✅ Task 4: Core Web Vitals 最適化（実装済み）
```bash
grep "compress" next.config.ts && echo "実装済み"
```

### ✅ Task 5: 獣医師ログイン Auth（実装済み）
```bash
grep "handleLogin" app/\(petask\)/petask/vet/login/page.tsx && echo "実装済み"
```

---

### Task 6: Q&A一覧ページの FAQPage JSON-LD
`app/(petask)/petask/q-and-a/page.tsx` を確認・更新:
- 上位10件の質問を `getQuestions({ limit: 10, status: 'answered' })` で取得
- FAQPage JSON-LD を追加（`mainEntity: [{@type: Question, name, acceptedAnswer}...]`）
- `<h1>` タグが存在しなければ追加（SEO必須）

確認: `grep "FAQPage" app/\(petask\)/petask/q-and-a/page.tsx 2>/dev/null | head -1`

### Task 7: トップページ Organization JSON-LD
`app/(petask)/petask/page.tsx` に Organization スキーマを追加:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PetAsk",
  "description": "ペットの症状を獣医師に相談できるQ&Aサービス",
  "url": "https://petask-gules.vercel.app/petask",
  "serviceType": "獣医師Q&Aサービス"
}
```
WebSite スキーマ（SearchAction）も合わせて追加する。

確認: `grep "Organization" app/\(petask\)/petask/page.tsx 2>/dev/null | head -1`

### Task 8: BreadcrumbList JSON-LD を全ページに追加
`components/petask/Breadcrumb.tsx` を更新して、受け取った `items` から
BreadcrumbList JSON-LD を自動生成して `<script>` タグで出力する。
これにより Breadcrumb を使っているすべてのページに一括適用される。

確認: `grep "BreadcrumbList" components/petask/Breadcrumb.tsx 2>/dev/null | head -1`

### Task 9: robots.txt 強化
`app/robots.ts` を確認・作成:
```ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/petask/', disallow: ['/petask/vet/dashboard', '/api/'] },
    ],
    sitemap: 'https://petask-gules.vercel.app/sitemap.xml',
  };
}
```
`public/robots.txt` が存在すれば削除（App Router の robots.ts と競合）。

確認: `ls app/robots.ts 2>/dev/null`

### Task 10: 症状ページのコンテンツ量強化
`app/(petask)/petask/symptoms/[animal]/[symptom]/page.tsx` を Read して:
- 各症状ページに「この症状に関連するQ&A」セクションを追加
  （`getQuestions({ animal, limit: 3 })` + `symptomSlug` でフィルタ）
- 「症状チェッカーで確認する」CTAボタンをページ内に追加
- 「すぐに受診が必要な症状」「様子見でよい症状」の判断基準テキストを追加

確認: `grep "関連するQ&A" app/\(petask\)/petask/symptoms/\[animal\]/\[symptom\]/page.tsx 2>/dev/null | head -1`

### Task 11: Open Graph 画像の統一
`app/(petask)/layout.tsx` の metadata に defaultOpenGraph を設定:
```ts
openGraph: {
  siteName: 'PetAsk',
  locale: 'ja_JP',
  type: 'website',
  images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PetAsk' }],
},
twitter: { card: 'summary_large_image', site: '@petask_jp' },
```
`public/og-image.png` が存在しなければ、Unsplash の犬猫画像URLを OG 画像として設定する。

確認: `grep "openGraph" app/\(petask\)/layout.tsx 2>/dev/null | head -1`

### Task 12: 内部リンク強化（症状→Q&A誘導）
`app/(petask)/petask/symptoms/[animal]/[symptom]/page.tsx` の末尾に追加:
- 「{symptom.label} に関するQ&Aを見る」リンク → `/petask/q-and-a?symptom={slug}`
- 「獣医師に質問する」ボタン → `/petask/q-and-a/new?symptom={slug}&animal={animal}`
  （QuestionForm の symptomSlug を URL パラメータから自動設定）

確認: `grep "q-and-a/new" app/\(petask\)/petask/symptoms/\[animal\]/\[symptom\]/page.tsx 2>/dev/null | head -1`

### Task 13: 症状ページに緊急度バッジを追加
`app/(petask)/petask/symptoms/[animal]/[symptom]/page.tsx` の h1 付近に:
- `emergencyLevel === 'high'` → 赤バッジ「🚨 緊急度：高」
- `emergencyLevel === 'medium'` → 黄バッジ「⚠️ 緊急度：中」
- `emergencyLevel === 'low'` → 緑バッジ「✅ 緊急度：低」

確認: `grep "emergencyLevel.*badge\|緊急度.*バッジ\|緊急度：高" app/\(petask\)/petask/symptoms/\[animal\]/\[symptom\]/page.tsx 2>/dev/null | head -1`

### Task 14: Q&A一覧ページのページネーション
`app/(petask)/petask/q-and-a/page.tsx` に `?page=` パラメータ対応を追加:
- 1ページ10件、URLパラメータで制御
- 前へ/次へボタン追加（シンプルなオフセット方式）

確認: `grep "page.*pagination\|pagination\|前へ\|次へ" app/\(petask\)/petask/q-and-a/page.tsx 2>/dev/null | head -1`

### Task 15: PetAsk コンテンツ記事の追加
`app/(petask)/petask/` 配下に新規ページとして以下を作成:
- `/petask/guide` — 「PetAskの使い方」ガイドページ（Q&A投稿方法・症状チェッカーの使い方）
- `/petask/about` — 「PetAskについて」（サービス説明・獣医師監修について）
これらのページには Article JSON-LD を追加する。

確認: `ls app/\(petask\)/petask/guide/ 2>/dev/null`

---

## 実装後の必須手順

1. `cd /workspace/petask`
2. TypeScriptエラーチェック: `npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/" | head -20`
3. git add / commit (日本語メッセージ) / push
4. 完了報告: 実装した3タスクの番号・変更ファイル・期待されるSEO効果

## モデル使用ルール
- コンテンツ生成・実装: claude-sonnet-4-6
- SEO戦略判断: claude-opus-4-8
