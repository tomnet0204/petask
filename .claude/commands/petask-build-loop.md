# PetAsk 機能実装ループ (petask-build-loop)

ペット症状Q&Aサービス「PetAsk」の機能実装ループ。
優先度順にタスクを1つ選んで実装し、テスト・push まで完結させる。

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

### Task 1: /api/petask/vets エンドポイント実装 ✅確認
```bash
curl -s http://localhost:3000/api/petask/vets -o /dev/null -w "%{http_code}"
```
200 以外なら実装する:
- `app/api/petask/vets/route.ts` を新規作成
- `getVets()` を呼び出して `{ vets: [...] }` を返す
- `/petask/vets` ページがこのAPIを使うよう修正

### Task 2: ベストアンサーAPI実装
`app/api/petask/answers/[id]/accept/route.ts` が存在しなければ実装:
- PUT リクエストで `is_accepted = true` に更新
- 同一 question_id の他回答を `is_accepted = false` にリセット
- 質問の `status` を `answered` に更新
- `AnswerCard.tsx` に「ベストアンサーに選ぶ」ボタンを追加

### Task 3: 免責表示の強化
`app/(petask)/petask/q-and-a/[id]/page.tsx` に以下を追加:
- ページ上部に黄色い免責バナー「この回答は獣医師の意見であり診断ではありません」
- 緊急症状（urgencyLevel === 'emergency'）の場合は赤バナーに格上げ

### Task 4: 獣医師 Auth 統合（Supabase Auth）
`app/(petask)/petask/vet/login/page.tsx` を Supabase Auth のメール認証で実動作にする:
- `@supabase/ssr` を使ってサーバーサイドセッション管理
- ログイン成功後 `/petask/vet/dashboard` へリダイレクト
- ダッシュボードをセッション必須ページに変更（未認証は login にリダイレクト）

---

## 実装後の必須手順

1. `cd /workspace/petask`
2. TypeScriptエラーチェック: `npx tsc --noEmit 2>&1 | head -20`
3. Playwright APIテスト: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/petask/qa-api.spec.ts --project=chromium --reporter=list 2>&1`
4. git add / commit / push
5. 完了報告: 実装したTask番号・変更ファイル・テスト結果

## モデル使用ルール
- 実装・コード生成: claude-sonnet-4-6
- 設計判断が必要な場合: claude-opus-4-8
