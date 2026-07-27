# PetAsk アーキテクチャ設計計画

> Phase 1 設計ドキュメント  
> 作成日: 2026-07-25  
> ステータス: Phase 1 完了・Phase 2 開始前に確認要

---

## 1. サービス概要

**PetAsk** は動物病院受診を支援する情報提供サービス。  
AIによる診断は行わない。飼い主がペットの症状を整理し、受診準備できるよう支援する。

対象動物: 犬・猫（MVP）  
対象症状（初期15症状）: 嘔吐・下痢・血便・食欲不振・咳・呼吸異常・皮膚異常・かゆみ・排尿異常・血尿・誤飲・けいれん・歩行異常・目の異常・耳の異常

---

## 2. ディレクトリ構造（設計）

### 2.1 Next.js App Router 構造

```
app/
└── (petask)/                    # Route Group（JapanFlowから独立）
    ├── layout.tsx               # PetAsk 専用レイアウト（SiteHeader とは別）
    ├── petask/                  # URL: /petask/
    │   ├── page.tsx             # トップページ
    │   ├── sitemap.ts           # PetAsk専用 sitemap
    │   ├── dogs/
    │   │   └── page.tsx         # 犬の症状一覧
    │   ├── cats/
    │   │   └── page.tsx         # 猫の症状一覧
    │   ├── symptoms/
    │   │   └── [animal]/
    │   │       └── [symptom]/
    │   │           └── page.tsx # 個別症状ページ（SSG）
    │   ├── emergency/
    │   │   └── page.tsx         # 緊急症状一覧
    │   ├── checker/
    │   │   └── page.tsx         # 症状チェックフォーム
    │   ├── search/
    │   │   └── page.tsx         # サイト内検索
    │   ├── supervisors/
    │   │   └── page.tsx         # 監修者情報
    │   ├── disclaimer/
    │   │   └── page.tsx         # 免責事項
    │   ├── privacy/
    │   │   └── page.tsx         # プライバシーポリシー（要専門家確認）
    │   ├── terms/
    │   │   └── page.tsx         # 利用規約（要専門家確認）
    │   └── contact/
    │       └── page.tsx         # お問い合わせ
    └── api/petask/              # PetAsk専用APIルート
        └── checker/
            └── route.ts         # 症状チェック（ルールベース判定）
```

### 2.2 コンテンツ構造

```
content/
├── pets/
│   ├── dogs/
│   │   ├── vomiting.mdx
│   │   ├── diarrhea.mdx
│   │   └── ...
│   └── cats/
│       ├── vomiting.mdx
│       ├── anorexia.mdx
│       └── ...
├── emergency/
│   └── emergency-signs.mdx
├── drafts/                      # レビュー待ち（本番公開不可）
│   └── ...
└── rejected/                    # 品質不合格
    └── <slug>-rejected-<date>.mdx

scripts/content/
├── generate-content-brief.mjs
├── generate-article-draft.mjs
├── validate-medical-safety.mjs
├── validate-references.mjs
├── detect-duplicate-content.mjs
├── validate-seo.mjs
├── validate-internal-links.mjs
├── generate-content-report.mjs
└── move-approved-content.mjs    # 全検査通過後のみ実行可能

data/
├── content-briefs/
│   ├── dog-vomiting.json
│   └── ...
├── references/
│   └── verified-sources.json
└── symptoms.ts                  # 症状・動物種のマスターデータ

reports/
└── content-quality/
    ├── dog-vomiting-medical-safety.json
    ├── dog-vomiting-references.json
    ├── dog-vomiting-seo-quality.json
    ├── dog-vomiting-content-editor.json
    └── dog-vomiting-summary.json
```

### 2.3 コンポーネント構造

```
components/petask/
├── EmergencyBanner.tsx          # 緊急警告バナー
├── SymptomPageLayout.tsx        # 症状ページの15セクション構造
├── SupervisorCard.tsx           # 監修者情報カード
├── DisclaimerBanner.tsx         # 免責表示（全ページ下部）
├── ReviewStatusBadge.tsx        # 未監修ステータス表示
├── SymptomChecker.tsx           # 症状チェックフォーム（多段階）
├── CheckerResult.tsx            # チェック結果表示（診断断定なし）
├── RelatedArticles.tsx          # 関連記事
├── Breadcrumb.tsx               # パンくずナビ
├── TableOfContents.tsx          # 目次（長い記事用）
└── SearchBox.tsx                # サイト内検索
```

---

## 3. データモデル設計

### 3.1 症状コンテンツ（MDX frontmatter）

詳細仕様は `.claude/skills/pet-health-content/SKILL.md` の Section 4 参照。

### 3.2 症状チェック結果型

```typescript
// lib/petask/types.ts
export interface PetProfile {
  animalType: 'dog' | 'cat';
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  sex?: 'male' | 'female' | 'unknown';
  weightKg?: number;
  isNeutered?: boolean;
  conditions?: string[];  // 既往症
  medications?: string[]; // 服用中の薬
}

export interface SymptomInput {
  primarySymptom: string;
  onsetDays?: number;
  frequency?: string;
  appetite: 'normal' | 'reduced' | 'none';
  canDrinkWater: 'yes' | 'no' | 'reduced';
  energy: 'normal' | 'reduced' | 'very_low' | 'unconscious';
  urination: 'normal' | 'increased' | 'decreased' | 'none';
  defecation: 'normal' | 'diarrhea' | 'constipation' | 'none' | 'blood';
  breathing: 'normal' | 'labored' | 'very_difficult';
  possibleIngestion?: boolean;
  additionalNotes?: string;
}

export type UrgencyLevel = 
  | 'emergency'   // 今すぐ動物病院へ電話
  | 'urgent'      // 今日中に受診
  | 'watchful'    // 24時間以内に変化があれば受診
  | 'monitor'     // 様子観察（悪化したら受診）;

export interface CheckerResult {
  urgencyLevel: UrgencyLevel;
  // 注意: diagnosisName は絶対に含まない
  urgencyReasons: string[];      // 緊急性の根拠（ルールベース）
  watchPoints: string[];         // 確認すべき変化
  vetCommunicationGuide: string; // 獣医師に伝える情報
  bringToVet: string[];          // 持参するもの
  relatedArticleSlugs: string[]; // 関連記事
  disclaimer: string;            // この結果は診断ではない旨の表示
  ruleBasedFlags: string[];      // 適用されたルールベースフラグ
}
```

### 3.3 緊急判定ルールベース

```typescript
// lib/petask/emergency-rules.ts
// 獣医師が検証・修正できるルールベース定義
// AI単独の判断には依存しない

export const EMERGENCY_RULES: EmergencyRule[] = [
  {
    id: 'consciousness-loss',
    condition: (input) => input.energy === 'unconscious',
    urgencyLevel: 'emergency',
    flag: '意識消失の可能性',
  },
  {
    id: 'breathing-severe',
    condition: (input) => input.breathing === 'very_difficult',
    urgencyLevel: 'emergency',
    flag: '重篤な呼吸困難',
  },
  {
    id: 'no-urination',
    condition: (input) => input.urination === 'none',
    urgencyLevel: 'emergency',
    flag: '尿閉の可能性（特に猫の雄で致命的）',
  },
  {
    id: 'blood-stool',
    condition: (input) => input.defecation === 'blood',
    urgencyLevel: 'urgent',
    flag: '血便',
  },
  {
    id: 'possible-ingestion',
    condition: (input) => input.possibleIngestion === true,
    urgencyLevel: 'emergency',
    flag: '誤飲の可能性',
  },
  // ... 獣医師監修のルールを追加
];
```

---

## 4. SEO 基盤設計

### 4.1 URL 設計

```
/petask/                                    # PetAsk トップ
/petask/dogs/                               # 犬の症状一覧
/petask/cats/                               # 猫の症状一覧
/petask/symptoms/dog/vomiting/              # 犬の嘔吐
/petask/symptoms/cat/vomiting/              # 猫の嘔吐
/petask/symptoms/dog/diarrhea/              # 犬の下痢
/petask/emergency/                          # 緊急症状一覧
/petask/checker/                            # 症状チェック
/petask/supervisors/                        # 監修者情報
/petask/disclaimer/                         # 免責事項
/petask/privacy/                            # プライバシーポリシー
/petask/terms/                              # 利用規約
/petask/contact/                            # お問い合わせ
```

### 4.2 構造化データ戦略

| ページ種別 | JSON-LD タイプ |
|-----------|--------------|
| 症状ページ | MedicalWebPage + Article + BreadcrumbList + FAQPage |
| 緊急症状一覧 | WebPage + BreadcrumbList |
| 症状チェック | WebApplication + BreadcrumbList |
| 監修者ページ | Person（実在する獣医師のみ） |
| トップページ | WebSite + Organization |

### 4.3 robots.txt 追加ルール

現在の `app/robots.ts` に PetAsk 固有のルールを追加:
- `/petask/checker/result/` のような結果ページは `disallow`（個人の入力が URL に入らないよう設計）
- `content/drafts/` へのアクセスは技術的に不可（ファイルシステム、Next.js ページとして公開しない）

---

## 5. Analytics 設計

### 5.1 PetAsk 専用イベント

```typescript
// lib/petask/analytics.ts
type PetAskEvent = 
  | 'petask_symptom_page_view'
  | 'petask_emergency_banner_view'
  | 'petask_emergency_action_click'
  | 'petask_symptom_checker_start'
  | 'petask_symptom_checker_step'     // step番号のみ（症状名は送らない）
  | 'petask_symptom_checker_complete' // urgencyLevel のみ（入力内容は送らない）
  | 'petask_related_article_click'
  | 'petask_article_helpful'
  | 'petask_article_not_helpful'
  | 'petask_hospital_prep_download'
  | 'petask_search_performed'
  | 'petask_no_search_result';

// 送信禁止パラメータ
// - 症状の具体的内容（symptom_detail, notes 等）
// - ペットの年齢・体重・品種（pet_age, pet_weight 等）
// - 飼い主の個人情報
```

---

## 6. テスト設計

### 6.1 必須テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `ai_generated` 公開ブロック | Unit | reviewStatus === 'ai_generated' のページが /petask/ 配下に表示されない |
| 緊急警告の表示 | Integration | emergencyLevel が high/critical のページで EmergencyBanner が表示 |
| 禁止表現の検出 | Unit | PROHIBITED_EXPRESSIONS の各表現が validate-medical-safety で検出される |
| 参考資料なし公開ブロック | Unit | references が空配列の場合 referenceScore = 0 |
| canonical 重複なし | Unit | 全ページの canonical が一意であること |
| sitemap に draft 含まず | Unit | sitemap.ts に reviewStatus が draft 以下のURLが含まれない |
| noindex 記事が sitemap に含まれない | Unit | noindex: true のページが sitemap に含まれない |
| 壊れた内部リンク検出 | Script | validate-internal-links が 404 を検出 |
| 症状チェック診断断定なし | Integration | CheckerResult に diagnosisName フィールドが存在しない |
| モバイル利用可能 | E2E | 320px で主要機能（症状チェック・記事閲覧）が利用できる |
| キーボード操作 | E2E | Tab/Enter のみで症状チェックを完了できる |
| TypeScript エラーなし | CI | `tsc --noEmit` が exit 0 |
| lint | CI | ESLint が pass |
| unit tests | CI | vitest が pass |
| E2E tests | CI | Playwright が pass |
| production build | CI | `next build` が成功 |

---

## 7. 必要な追加パッケージ

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",           // MDX frontmatter パース
    "next-mdx-remote": "^5.0.0"        // MDX レンダリング（Phase 2で判断）
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.47.0"
  }
}
```

---

## 8. Phase 別実装ファイル計画

### Phase 2（共通レイアウト・症状ページテンプレート・SEO基盤）

作成・変更対象:
- `app/(petask)/layout.tsx` — PetAsk専用レイアウト（新規）
- `app/(petask)/petask/page.tsx` — トップページ（新規）
- `app/(petask)/petask/dogs/page.tsx` — 犬の症状一覧（新規）
- `app/(petask)/petask/cats/page.tsx` — 猫の症状一覧（新規）
- `app/(petask)/petask/symptoms/[animal]/[symptom]/page.tsx` — 症状ページ（新規）
- `app/(petask)/petask/emergency/page.tsx` — 緊急症状一覧（新規）
- `app/(petask)/petask/disclaimer/page.tsx` — 免責事項（新規）
- `components/petask/EmergencyBanner.tsx` — 緊急警告（新規）
- `components/petask/DisclaimerBanner.tsx` — 免責表示（新規）
- `components/petask/ReviewStatusBadge.tsx` — 監修ステータス（新規）
- `components/petask/SupervisorCard.tsx` — 監修者カード（新規）
- `components/petask/Breadcrumb.tsx` — パンくず（新規）
- `lib/petask/types.ts` — 型定義（新規）
- `lib/petask/content.ts` — コンテンツ読み込みユーティリティ（新規）
- `lib/petask/emergency-rules.ts` — 緊急判定ルール（新規）
- `data/symptoms.ts` — 症状マスターデータ（新規）
- `app/robots.ts` — PetAsk ルール追記（変更）
- `app/sitemap.ts` または `app/(petask)/petask/sitemap.ts` — PetAsk URL 追加（変更）
- `package.json` — gray-matter 等追加（変更）

### Phase 3（コンテンツ生成スクリプト・品質検査）

作成対象（全て新規）:
- `scripts/content/generate-content-brief.mjs`
- `scripts/content/generate-article-draft.mjs`
- `scripts/content/validate-medical-safety.mjs`
- `scripts/content/validate-references.mjs`
- `scripts/content/detect-duplicate-content.mjs`
- `scripts/content/validate-seo.mjs`
- `scripts/content/validate-internal-links.mjs`
- `scripts/content/generate-content-report.mjs`
- `scripts/content/move-approved-content.mjs`
- ディレクトリ: `content/pets/dogs/`, `content/pets/cats/`, `content/emergency/`, `content/drafts/`, `content/rejected/`

### Phase 4（初期10記事）

作成対象:
- `data/content-briefs/dog-vomiting.json` 〜 `cat-seizure.json`（10件）
- `content/drafts/dog-vomiting.mdx` 〜 `content/drafts/cat-seizure.mdx`（10件）
- `reports/content-quality/` 配下の品質レポート（10件 × 複数ファイル）

### Phase 5（症状チェック・Analytics・テスト）

作成対象:
- `app/(petask)/petask/checker/page.tsx`
- `app/api/petask/checker/route.ts`
- `components/petask/SymptomChecker.tsx`
- `components/petask/CheckerResult.tsx`
- `lib/petask/analytics.ts`
- `test/petask/*.test.ts`（Vitest ユニットテスト）
- `e2e/petask/*.spec.ts`（Playwright E2Eテスト）
