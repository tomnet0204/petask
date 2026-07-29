import { test, expect } from '@playwright/test'

test.describe('Q&A 質問投稿フロー', () => {
  test('3ステップで質問を投稿できる（犬）', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 })

    // Step 1: ペット情報
    await page.fill('input[placeholder*="例: ハナ"]', 'テスト犬ポチ')
    await page.click('button:has-text("🐶 犬")')
    await page.fill('input[type="number"]', '4')
    await page.click('button:has-text("オス")')
    await page.click('button:has-text("次へ")')

    // Step 2: 質問内容
    await expect(page.locator('textarea')).toBeVisible()
    await page.fill('textarea', 'テスト用の質問です。昨日から食欲が落ちており元気がありません。どのくらい様子を見てよいでしょうか？ご回答よろしくお願いします。')
    await page.click('button:has-text("次へ")')

    // Step 3: 確認・同意・送信
    await expect(page.locator('text=テスト犬ポチ')).toBeVisible()
    await page.fill('input[type="email"]', 'playwright-test@example.com')
    await page.click('input[type="checkbox"]')
    await page.click('button:has-text("質問を投稿する")')

    // 成功を確認
    await expect(page.locator('text=質問を受け付けました')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('a:has-text("質問ページを確認する")')).toBeVisible()
  })

  test('3ステップで質問を投稿できる（猫）', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')

    // Step 1
    await page.fill('input[placeholder*="例: ハナ"]', 'テスト猫ミケ')
    await page.click('button:has-text("🐱 猫")')
    await page.click('button:has-text("メス")')
    await page.click('button:has-text("次へ")')

    // Step 2
    await page.fill('textarea', 'テスト投稿です。毛玉を吐くことが増えてきたのですが正常の範囲でしょうか？毎日吐くのはさすがに多い気がします。')
    await page.click('button:has-text("次へ")')

    // Step 3
    await expect(page.locator('text=テスト猫ミケ')).toBeVisible()
    await page.click('input[type="checkbox"]')
    await page.click('button:has-text("質問を投稿する")')

    await expect(page.locator('text=質問を受け付けました')).toBeVisible({ timeout: 15000 })
  })

  test('ペット名未入力では次へ進めない', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')
    const nextBtn = page.locator('button:has-text("次へ")').first()
    await expect(nextBtn).toBeDisabled()
  })

  test('質問文10文字未満では次へ進めない', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')
    await page.fill('input[placeholder*="例: ハナ"]', 'テスト')
    await page.click('button:has-text("次へ")')

    await page.fill('textarea', '短い')
    const nextBtn = page.locator('button:has-text("次へ")').last()
    await expect(nextBtn).toBeDisabled()
  })

  test('同意チェックなしでは送信できない', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')

    await page.fill('input[placeholder*="例: ハナ"]', 'テスト')
    await page.click('button:has-text("次へ")')
    await page.fill('textarea', '同意チェックなし送信テストのための質問文です。10文字以上必要なので長めに書きます。')
    await page.click('button:has-text("次へ")')

    const submitBtn = page.locator('button:has-text("質問を投稿する")')
    await expect(submitBtn).toBeDisabled()
  })

  test('投稿後に質問詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/petask/q-and-a/new')

    await page.fill('input[placeholder*="例: ハナ"]', 'リンクテスト犬')
    await page.click('button:has-text("次へ")')
    await page.fill('textarea', '投稿後の遷移テストです。詳細ページへのリンクが正しく表示されることを確認しています。')
    await page.click('button:has-text("次へ")')
    await page.click('input[type="checkbox"]')
    await page.click('button:has-text("質問を投稿する")')

    await expect(page.locator('text=質問を受け付けました')).toBeVisible({ timeout: 15000 })

    // 詳細ページへのリンクをクリック
    await page.click('a:has-text("質問ページを確認する")')
    await expect(page).toHaveURL(/\/petask\/q-and-a\//)
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('Q&A一覧ページが表示される', async ({ page }) => {
    await page.goto('/petask/q-and-a')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    // 投稿済みの質問が少なくとも1件表示される
    await expect(page.locator('a[href*="/petask/q-and-a/"]').first()).toBeVisible({ timeout: 10000 })
  })
})
