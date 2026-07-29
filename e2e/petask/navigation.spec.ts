import { test, expect } from '@playwright/test'

test.describe('ナビゲーション', () => {
  test('トップ→犬一覧→症状ページの遷移', async ({ page }) => {
    await page.goto('/petask')
    await page.click('text=犬の症状を調べる')
    await expect(page).toHaveURL('/petask/dogs')
    await page.click('text=犬の嘔吐')
    await expect(page).toHaveURL('/petask/symptoms/dog/vomiting')
  })

  test('トップ→猫一覧への遷移', async ({ page }) => {
    await page.goto('/petask')
    await page.click('text=猫の症状を調べる')
    await expect(page).toHaveURL('/petask/cats')
  })

  test('ナビゲーションの緊急症状リンクが機能する', async ({ page }) => {
    await page.goto('/petask')
    await page.click('nav >> text=緊急症状')
    await expect(page).toHaveURL('/petask/emergency')
  })

  test('モバイル幅でヘッダーナビが表示される', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/petask')
    await expect(page.locator('header nav')).toBeVisible()
  })

  test('EmergencyBannerが全ページで表示される', async ({ page }) => {
    for (const url of ['/petask', '/petask/dogs', '/petask/emergency']) {
      await page.goto(url)
      await expect(page.locator('text=今すぐ動物病院へ')).toBeVisible()
    }
  })

  test('免責事項ページが表示される', async ({ page }) => {
    await page.goto('/petask/disclaimer')
    await expect(page.locator('h1')).toContainText('免責事項')
  })

  test('sitemap.xmlが返される', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('/petask')
  })
})
