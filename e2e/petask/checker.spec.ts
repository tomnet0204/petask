import { test, expect } from '@playwright/test'

test.describe('症状チェッカー', () => {
  test('トップページからチェッカーに遷移できる', async ({ page }) => {
    await page.goto('/petask')
    await page.click('text=症状チェッカーを試す')
    await expect(page).toHaveURL('/petask/checker')
  })

  test('チェッカーページが表示される', async ({ page }) => {
    await page.goto('/petask/checker')
    await expect(page.locator('h1')).toContainText('チェッカー')
  })

  test('4ステップを完了して結果を確認できる', async ({ page }) => {
    await page.goto('/petask/checker')

    // Step 1: 犬を選択
    await page.click('button:has-text("🐶"), [data-value="dog"], label:has-text("犬")')
    await page.click('button:has-text("次へ")')

    // Step 2: 症状を選択（selectがある場合）
    const select = page.locator('select').first()
    if (await select.isVisible()) {
      await select.selectOption({ index: 1 })
    }
    await page.click('button:has-text("次へ")')

    // Step 3: 状態を入力（デフォルト値のまま進む）
    await page.click('button:has-text("次へ")')

    // Step 4: 確認して送信
    await page.click('button:has-text("結果を見る")')

    await expect(page.locator('[data-testid="checker-result"]')).toBeVisible({ timeout: 10000 })
  })

  test('緊急症状（尿閉）でemergencyが表示される', async ({ page }) => {
    await page.goto('/petask/checker')

    // Step 1
    await page.click('button:has-text("🐱"), [data-value="cat"], label:has-text("猫")')
    await page.click('button:has-text("次へ")')

    // Step 2
    const select = page.locator('select').first()
    if (await select.isVisible()) {
      await select.selectOption({ index: 1 })
    }
    await page.click('button:has-text("次へ")')

    // Step 3: 排尿「全く出ない」を選択
    const urinationNone = page.locator('label:has-text("全く出ない"), [value="none"]').nth(0)
    if (await urinationNone.isVisible()) {
      await urinationNone.click()
    }
    await page.click('button:has-text("次へ")')

    // Step 4
    await page.click('button:has-text("結果を見る")')

    const result = page.locator('[data-testid="checker-result"]')
    await expect(result).toBeVisible({ timeout: 10000 })
    await expect(result).toContainText('緊急')
  })
})

test.describe('症状ページ', () => {
  test('犬の嘔吐ページが表示される', async ({ page }) => {
    await page.goto('/petask/symptoms/dog/vomiting')
    await expect(page).toHaveTitle(/犬の嘔吐/)
  })

  test('パンくずに犬の症状一覧リンクが表示される', async ({ page }) => {
    await page.goto('/petask/symptoms/dog/vomiting')
    await expect(page.locator('nav[aria-label="パンくず"]')).toContainText('犬の症状一覧')
  })

  test('緊急度バッジが表示される', async ({ page }) => {
    await page.goto('/petask/symptoms/dog/bloody-stool')
    await expect(page.locator('text=緊急')).toBeVisible()
  })
})

test.describe('緊急ページ', () => {
  test('緊急症状一覧が表示される', async ({ page }) => {
    await page.goto('/petask/emergency')
    await expect(page.locator('h1')).toContainText('緊急')
  })

  test('EmergencyBannerが表示される', async ({ page }) => {
    await page.goto('/petask/emergency')
    await expect(page.locator('text=今すぐ動物病院へ')).toBeVisible()
  })
})
