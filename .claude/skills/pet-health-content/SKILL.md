# PetAsk ペット健康コンテンツ Skill

> このSkillは、PetAsk サービスの全コンテンツ作成・管理において **必ず参照** すること。  
> 新しい動物種・症状ページを追加するときも、このSkillを起点にすること。

---

## 1. サービスの目的

PetAsk は **動物の病気を診断するサービスではない**。

飼い主がペットの症状を適切に整理し、緊急性を理解し、動物病院を受診する際に必要な情報を準備できるよう支援する情報提供サービスである。

AIによる一般的な情報提供と、獣医師による個別相談・オンライン診療は、機能・画面・表現・データの全レイヤーで明確に分離する。

---

## 2. 医療安全の絶対原則（15箇条）

以下は例外なく遵守する。コンテンツ生成・編集・レビューのすべての場面でこの原則を適用する。

1. **AIは病名を断定しない。** 「〇〇という病気です」は絶対に書かない。
2. **AIは治療・投薬・処方・投薬量の指示をしない。** 「〇〇を飲ませてください」は絶対に書かない。
3. **「問題ない」「病院に行かなくてよい」「自宅で治る」と断定しない。**
4. **緊急症状が疑われる場合は、コンテンツ閲覧より受診案内を優先する。** ページ上部に緊急警告を表示する。
5. **人間用医薬品をペットに使用するよう勧めない。** 人間用薬品への言及自体を避ける。
6. **嘔吐を誘発するなど、危険な自宅処置を勧めない。**
7. **すべての医療系ページに免責表示を入れる。** 「この情報は一般的な情報提供であり、診断・治療の指示ではありません」
8. **公開前に事実確認と獣医師監修ステータスを確認する。** `reviewStatus` が `editorial_reviewed` 未満のものは公開しない。
9. **AI生成記事を無条件で自動公開しない。** `ai_generated` ステータスは技術的に本番公開ブロック。
10. **SEOのためだけの低品質な大量ページを作らない。** 独自情報がない組み合わせは親記事のセクションにする。
11. **症状・動物種・年齢の機械的な入れ替えページを作らない。** 内容に実質的な差異がなければ作らない。
12. **存在しない研究・統計・獣医師・病院・資格・体験談・引用元を生成しない。** 架空の情報は原則12違反として即座に rejected にする。
13. **出典を確認できない数値を掲載しない。** 確認できない場合は数値を省き「詳細は獣医師にご確認ください」とする。
14. **誇大表現を使わない。**「必ず治る」「完全に安全」「最高」「No.1」等は禁止表現として検出対象。
15. **SEOより安全性を優先する。** ランキング向上より飼い主とペットの安全を優先する。

---

## 3. ページ構造（症状ページ必須テンプレート）

症状ページは以下の順序で構成する。順序の変更は不可。

```
1. ページタイトル（H1）
2. 結論の要約（冒頭に結論 — 長い記事の前に要点を示す）
3. 緊急受診が必要なサイン（emergencyLevel が high または critical の場合は最優先表示）
4. 症状の説明
5. 一般的に考えられる原因のカテゴリー（診断ではなく分類）
6. 飼い主が確認する項目
7. 動物病院へ行く目安
8. 病院へ行くまでにできる安全な対応
9. してはいけないこと
10. 獣医師に伝える内容（症状要約テンプレート）
11. よくある質問（FAQPage 構造化データと連携）
12. 関連記事
13. 監修状況（reviewedBy・reviewStatus・medicalReviewDate）
14. 更新日（lastUpdated）
15. 免責表示
```

---

## 4. frontmatter 仕様

症状ページのコンテンツファイル（`.mdx`）の frontmatter は以下のフィールドを持つ。

```yaml
---
# 必須フィールド
title: "犬が吐いたときの受診目安"
slug: "dog-vomiting"
animalType: "dog"           # dog | cat
symptom: "vomiting"         # symptoms.ts で定義された値
ageGroup: "all"             # puppy | adult | senior | all
summary: "犬の嘔吐は様子見でよい場合とすぐに受診が必要な場合があります。回数・色・元気の有無を確認してください。"
emergencyLevel: "medium"    # low | medium | high | critical

# 緊急サイン（配列）
emergencySigns:
  - "1時間に3回以上嘔吐が続いている"
  - "嘔吐後に意識が朦朧としている"
  - "血を吐いた"
  - "お腹が急に膨らんできた"
  - "水も飲めない状態が続いている"

# 監修・公開管理（必須）
reviewedBy: null            # 実在する獣医師名または編集者名。架空の名前は絶対に入れない
reviewStatus: "draft"       # draft | ai_generated | editorial_reviewed | veterinarian_reviewed | published | rejected
medicalReviewDate: null     # ISO 8601形式。null = 未監修
lastUpdated: "2026-07-25"
author: "PetAsk Editorial"

# 出典（参考資料）
references: []              # URLと説明の配列

# コンテンツ品質管理
contentVersion: 1
generationMethod: "human"   # human | ai_assisted | ai_generated
duplicateGroup: null        # 重複グループID

# SEO
canonicalUrl: "https://www.japanflowai.com/petask/dogs/vomiting"
noindex: false

# 品質スコア（品質チェック後に更新）
qualityScores:
  medicalSafety: null
  reference: null
  duplicate: null
  seoQuality: null
  readability: null

# チェックフラグ（品質チェック後に更新）
qualityChecks:
  emergencyCheck: false     # 緊急症状の記載確認
  prohibitedClaims: null    # 禁止表現の件数（0でなければ公開不可）
  brokenLinks: null         # 壊れたリンクの件数（0でなければ公開不可）
---
```

### reviewStatus の遷移ルール

```
draft
  ↓ AI生成ツールで作成
ai_generated         ← 本番公開ブロック（技術的強制）
  ↓ 編集者レビュー完了
editorial_reviewed
  ↓ 獣医師監修完了（医療内容を含む場合は原則必須）
veterinarian_reviewed
  ↓ 全品質ゲート通過
published
  ↓ 問題発見時
rejected             ← content/rejected/ に移動
```

---

## 5. 緊急症状ルール

以下のいずれかが疑われる場合、**ページ上部（タイトル直後）** に緊急警告バナーを表示する。

```
EMERGENCY_TRIGGER_SIGNS = [
  "意識がない",
  "呼吸が苦しそう",
  "舌や歯茎が青い",
  "舌や歯茎が白い",
  "けいれんが続く",
  "大量出血",
  "何度も吐いて水も飲めない",
  "お腹が急に膨らんだ",
  "尿が出ない",
  "強い痛み",
  "有毒物質の誤飲",
  "薬物の誤飲",
  "高所からの落下",
  "交通事故",
  "急激な麻痺",
  "子犬・子猫で著しく元気がない"
]
```

緊急警告の表示文言（変更不可）:
> 「緊急性の高い状態の可能性があります。このページの情報だけで判断せず、直ちに動物病院へ電話してください。」

特定の病院名・電話番号は、実在性を確認できるデータがない限り自動生成しない。

---

## 6. 禁止表現リスト

以下の表現を含むコンテンツは品質チェックで検出し、人間が確認するまで公開しない。

```
PROHIBITED_EXPRESSIONS = [
  "絶対に",
  "必ず治る",
  "心配ありません",
  "問題ありません",
  "病院に行く必要はありません",
  "自宅で治せます",
  "この病気です",
  "確実に",
  "100%",
  "完全に安全",
  "副作用はありません",
  "No.1",
  "日本一",
  "最も優れている",
  "診断します",
  "処方します",
  "必ず回復",
  "完治します"
]
```

**注意**: 文脈上必要な場合があるため、自動削除ではなく警告として `reports/content-quality/` にレポートし、人間が確認・承認するプロセスを経ること。

---

## 7. 参考資料の扱い

### 使用可能な情報源（ティア）

| Tier | 情報源 | 用途 |
|------|--------|------|
| A | 農林水産省・環境省・日本獣医師会・大学附属動物病院・学術論文（PubMed等） | 一次確認（最優先） |
| B | 大手動物病院グループの公式サイト・獣医師監修の専門メディア | 補助確認 |
| C | 一般ペット情報サイト・個人ブログ | 参考のみ。単独では断定に使わない |

### 出典確認のルール

1. **数値・統計は Tier A または B ソースで確認する。** 確認できない数値は記載しない。
2. **URLは公開時点で実在するものに限る。** `validate-references` スクリプトで確認する。
3. **古い情報（3年以上前）は「〇〇年時点の情報」と明記する。**
4. **架空の論文・研究・専門家を生成しない。** これは最重要原則12への違反であり、即座に rejected。

### frontmatter での記載例

```yaml
references:
  - url: "https://www.maff.go.jp/..."
    title: "農林水産省：犬の飼い方について"
    tier: "A"
    retrievedAt: "2026-07-25"
  - url: "https://www.jvma.or.jp/..."
    title: "日本獣医師会：ペットの健康管理"
    tier: "A"
    retrievedAt: "2026-07-25"
```

---

## 8. 重複ページ防止

### 独立ページを作成してよい条件

以下の条件をすべて満たす場合のみ独立ページを作成する:
- その症状×動物種の組み合わせで、読者が検索する固有の意図がある
- 既存ページとは実質的に異なる情報を提供できる
- `detect-duplicate-content` スクリプトで重複スコアが 90 以下である

### 独立ページにしない場合

独自情報が十分にない組み合わせ（例: 「柴犬の嘔吐」vs「犬の嘔吐」）は、親記事内のセクションとして扱う。

---

## 9. 公開条件（Quality Gate）

記事を `content/pets/` に移動し `reviewStatus: published` にするには、以下の **全条件** を満たすこと。

| チェック項目 | 条件 |
|------------|------|
| medicalSafetyScore | >= 95 |
| referenceScore | = 100（参考資料が全て実在し整合） |
| duplicateScore | >= 90 |
| seoQualityScore | >= 85 |
| readabilityScore | >= 80 |
| emergencyCheck | passed |
| prohibitedClaims | = 0 |
| brokenLinks | = 0 |
| reviewStatus | editorial_reviewed 以上 |

医療内容を含む場合は `veterinarian_reviewed` が原則条件。未監修で公開する場合は画面上で未監修を明示する。

---

## 10. 品質チェックの実行順序

```
1. validate-medical-safety    医療安全（診断断定・投薬指示・危険処置・緊急症状漏れ）
2. validate-references        出典URLの実在確認・整合性チェック
3. detect-duplicate-content   既存記事との重複検出
4. validate-seo               title/description/canonical/見出し構造
5. validate-internal-links    内部リンクの404チェック・孤立ページ検出
6. generate-content-report    品質レポート生成（reports/content-quality/）
```

品質チェックをパスしない限り `move-approved-content` は実行できない（スクリプト設計で強制）。

---

## 11. レビュー手順

### AI 生成後の必須レビュー

```
[生成] generate-article-draft → content/drafts/
[自動] validate-medical-safety
[自動] validate-references
[自動] detect-duplicate-content
[自動] validate-seo
[自動] validate-internal-links
[自動] generate-content-report
[人間] 編集者レビュー → reviewStatus: editorial_reviewed
[人間] 獣医師監修（医療内容あり）→ reviewStatus: veterinarian_reviewed
[自動] move-approved-content → content/pets/dogs/ または content/pets/cats/
```

自動生成から本番公開までを一つのコマンドで完結させる仕組みは作らない。

### 人間または獣医師の承認が必要な条件

以下のいずれかに該当する場合は、必ず人間または獣医師の確認を経ること:

- 緊急症状に関する記述
- 特定の症状の原因として疾患名を列挙する記述
- 「動物病院へ行く目安」の時間的判断基準
- 「してはいけないこと」の記述
- 飼い主が取るべき行動指針
- 薬・サプリメントへの言及
- 数値（発症率・致死率・治癒率等）の記載
- 新しい動物種・症状カテゴリの追加

---

## 12. SEO 方針

### 基本原則

- ページ数よりページ品質を優先する
- 検索意図に正確に答えるコンテンツのみを作成する
- 機械的な組み合わせページは作らない

### 必須 SEO 要素

```
- 固有の <title>（最大 60 字）
- 固有の <meta description>（最大 160 字）
- canonical URL
- Article 構造化データ（author, datePublished, dateModified）
- BreadcrumbList 構造化データ
- FAQPage 構造化データ（FAQ セクションがある場合）
- hreflang（多言語展開時）
- 最終更新日の表示
- 著者・監修者のプロフィールリンク
```

### noindex の適用基準

以下のページには `noindex: true` を設定する:
- `reviewStatus` が `draft` または `ai_generated` のページ
- `readabilityScore` < 60 のページ
- 重複コンテンツで canonical が別ページを指しているページ
- コンテンツが 300 文字未満のページ

---

## 13. 新しい動物種・症状を追加するときの手順

1. `data/content-briefs/` に検索意図・対象ユーザー・既存記事との差異を記載したブリーフを作成する
2. `detect-duplicate-content` で既存コンテンツとの重複を確認する
3. このSkillの全ルールを適用してコンテンツブリーフを作成する
4. `generate-article-draft` で下書きを生成し `content/drafts/` に保存する
5. 品質チェックパイプラインを実行する
6. 人間・獣医師のレビューを経る
7. Quality Gate を通過したもののみ `content/pets/` に移動する

**このSkillを参照せずにコンテンツを直接 `content/pets/` に作成しないこと。**

---

## 14. ファイル・ディレクトリ構造

```
content/
├── pets/
│   ├── dogs/          # reviewStatus: published の犬記事
│   └── cats/          # reviewStatus: published の猫記事
├── emergency/         # 緊急症状一覧
├── drafts/            # レビュー待ち（本番公開不可）
└── rejected/          # 品質不合格（理由レポート付き）

scripts/content/
├── generate-content-brief.mjs
├── generate-article-draft.mjs
├── validate-medical-safety.mjs
├── validate-references.mjs
├── detect-duplicate-content.mjs
├── validate-seo.mjs
├── validate-internal-links.mjs
├── generate-content-report.mjs
└── move-approved-content.mjs

data/
├── content-briefs/    # 記事ブリーフ（JSON）
└── references/        # 検証済み出典リスト

reports/content-quality/  # 品質チェックレポート
```

---

## 改訂履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2026-07-25 | Phase 1 初版作成 |
