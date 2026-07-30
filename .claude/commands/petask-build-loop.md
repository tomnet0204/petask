# PetAsk 機能実装ループ (petask-build-loop)

ペット症状Q&Aサービス「PetAsk」の機能実装ループ。
**1回の実行で未実装タスクを上から3つ選んで実装し**、テスト・push まで完結させる。

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

### ✅ Task 1: /api/petask/vets エンドポイント（実装済み）
```bash
curl -s http://localhost:3000/api/petask/vets -o /dev/null -w "%{http_code}"
# 200 → 実装済みでスキップ
```

### ✅ Task 2: ベストアンサーAPI（実装済み）
```bash
ls app/api/petask/answers/*/accept/route.ts 2>/dev/null && echo "実装済み"
```

### ✅ Task 3: 免責バナー緊急度対応（実装済み）
```bash
grep -l "urgency" components/petask/DisclaimerBanner.tsx && echo "実装済み"
```

### ✅ Task 4: 獣医師 Auth 統合（実装済み）
```bash
grep -l "handleLogin" app/\(petask\)/petask/vet/login/page.tsx && echo "実装済み"
```

---

### Task 5: 質問検索 API + UI
`app/api/petask/questions/route.ts` の GET に `?q=` キーワード検索を追加:
- `body ILIKE '%keyword%'` または `pet_name ILIKE '%keyword%'` でフィルタ
- モックフォールバックでも keyword で本文検索を実装
`app/(petask)/petask/q-and-a/page.tsx` の一覧ページ上部に検索フォームを追加（Client Component）

確認: `grep -r "searchParams.*q" app/api/petask/questions/route.ts 2>/dev/null | head -1`

### Task 6: AnswerCard に「役に立った」カウント
`supabase/migrations/` に新マイグレーションを追記:
```sql
alter table public.answers add column if not exists helpful_count integer not null default 0;
```
`app/api/petask/answers/[id]/helpful/route.ts` を作成（POST で helpful_count +1）。
`components/petask/AnswerCard.tsx` に「役に立った 👍 {count}」ボタンを追加（Client化）。

確認: `ls app/api/petask/answers/*/helpful/route.ts 2>/dev/null | head -1`

### Task 7: ペット情報 localStorage 保存
`components/petask/QuestionForm.tsx` の Step1 で、ペット名・動物種・年齢・性別を
`localStorage.setItem('petask_pet', JSON.stringify({...}))` に保存し、
次回アクセス時に `localStorage.getItem('petask_pet')` で自動補完する。

確認: `grep "localStorage" components/petask/QuestionForm.tsx 2>/dev/null | head -1`

### Task 8: 関連質問レコメンド
`app/(petask)/petask/q-and-a/[id]/page.tsx` の末尾に「関連する質問」セクションを追加:
- 同じ `symptom_slug` または同じ `animal_type` の質問を最大3件取得
- `getQuestions({ animal: question.animalType, limit: 4 })` で取得し、自分を除いた3件を表示

確認: `grep "関連する質問" app/\(petask\)/petask/q-and-a/\[id\]/page.tsx 2>/dev/null | head -1`

### Task 9: 管理者用モデレーション API
`app/api/petask/admin/questions/[id]/approve/route.ts` を作成:
- PUT: `status = 'pending'` → `'answered'` に更新（SERVICE_ROLE_KEY必須）
- `app/api/petask/admin/questions/[id]/close/route.ts`: `status = 'closed'` に更新
- 簡易認証: `Authorization: Bearer $ADMIN_SECRET` ヘッダーで保護

確認: `ls app/api/petask/admin/ 2>/dev/null`

### Task 10: 質問への緊急度タグ自動付与
`app/api/petask/questions/route.ts` の POST で、`symptomSlug` が存在する場合に
`emergencyLevel` を `data/symptoms.ts` から参照して `checker_result.urgencyLevel` に自動設定する。
これにより症状チェッカーを通さなくても緊急バナーが表示される。

確認: `grep "emergencyLevel" app/api/petask/questions/route.ts 2>/dev/null | head -1`

### Task 11: 獣医師プロフィールページ
`app/(petask)/petask/vets/[id]/page.tsx` を新規作成:
- `getVetById(id)` で獣医師情報を取得
- 専門分野・経歴・回答した質問一覧（`getAnswersByVetId(id)` 新規追加）を表示
- Person JSON-LD を追加

確認: `ls app/\(petask\)/petask/vets/\[id\]/ 2>/dev/null`

### Task 12: メール通知（回答時）
`app/api/petask/questions/[id]/notify/route.ts` を作成:
- POST: `user_email` があれば Resend API（または `nodemailer`）でメール送信
- 環境変数 `RESEND_API_KEY` が未設定ならスキップ（エラーにしない）
- vet dashboard の回答投稿後にこの API を呼び出す

確認: `ls app/api/petask/questions/*/notify/ 2>/dev/null`

---

## 実装後の必須手順

1. `cd /workspace/petask`
2. TypeScriptエラーチェック: `npx tsc --noEmit --skipLibCheck 2>&1 | grep -v ".next/" | head -20`
3. Playwright APIテスト: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/petask/qa-api.spec.ts --project=chromium --reporter=list 2>&1 | tail -10`
4. git add / commit (日本語メッセージ) / push
5. 完了報告: 実装した3タスクの番号・変更ファイル・テスト結果

## モデル使用ルール
- 実装・コード生成: claude-sonnet-4-6
- 設計判断が必要な場合: claude-opus-4-8
