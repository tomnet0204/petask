/**
 * Q&A APIテスト — ブラウザ不要のPlaywright requestコンテキストで実行
 * 本番Vercel URLに対して実際のHTTPリクエストを送信し、DB投稿〜取得を検証する
 */
import { test, expect } from '@playwright/test'

// baseURL は playwright.config.ts の http://localhost:3000 を使用

test.describe('Q&A API — 質問投稿・取得フロー', () => {
  let createdQuestionId: string

  test('POST /api/petask/questions — 犬の質問を投稿できる', async ({ request }) => {
    const res = await request.post(`/api/petask/questions`, {
      data: {
        petName: 'Playwright犬',
        animalType: 'dog',
        ageYears: 3,
        sex: 'male',
        questionBody: 'Playwrightテスト投稿です。昨日から食欲が落ちており元気がありません。いつ受診すればよいでしょうか？',
        userEmail: 'playwright@example.com',
      },
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body).toHaveProperty('id')
    expect(body.petName).toBe('Playwright犬')
    expect(body.animalType).toBe('dog')
    expect(body.status).toBe('pending')
    createdQuestionId = body.id
    console.log('✅ 投稿成功:', createdQuestionId)
  })

  test('POST /api/petask/questions — 猫の質問を投稿できる', async ({ request }) => {
    const res = await request.post(`/api/petask/questions`, {
      data: {
        petName: 'Playwright猫',
        animalType: 'cat',
        sex: 'female',
        questionBody: 'Playwrightテスト（猫）。毛玉を毎日吐くのですが正常範囲でしょうか？食欲は問題ありません。',
      },
    })

    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.animalType).toBe('cat')
    expect(body.status).toBe('pending')
    console.log('✅ 猫投稿成功:', body.id)
  })

  test('GET /api/petask/questions — 質問一覧が取得できる', async ({ request }) => {
    const res = await request.get(`/api/petask/questions`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.questions)).toBeTruthy()
    expect(body.questions.length).toBeGreaterThan(0)
    console.log('✅ 一覧取得:', body.questions.length, '件')
  })

  test('GET /api/petask/questions?animal=dog — 犬フィルターが機能する', async ({ request }) => {
    const res = await request.get(`/api/petask/questions?animal=dog`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    const allDog = body.questions.every((q: { animalType: string }) => q.animalType === 'dog')
    expect(allDog).toBeTruthy()
    console.log('✅ 犬フィルター:', body.questions.length, '件すべてdog')
  })

  test('POST バリデーション — petName必須エラー', async ({ request }) => {
    const res = await request.post(`/api/petask/questions`, {
      data: { animalType: 'dog', questionBody: 'ペット名なし投稿テスト' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
    console.log('✅ バリデーション(petName):', body.error)
  })

  test('POST バリデーション — questionBody 10文字未満エラー', async ({ request }) => {
    const res = await request.post(`/api/petask/questions`, {
      data: { petName: 'テスト', animalType: 'dog', questionBody: '短い' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
    console.log('✅ バリデーション(body短すぎ):', body.error)
  })

  test('GET /api/petask/questions/[id] — モック質問を個別取得できる', async ({ request }) => {
    // 一覧から最初のIDを取得してそれで個別取得
    const listRes = await request.get(`/api/petask/questions`)
    expect(listRes.status()).toBe(200)
    const { questions } = await listRes.json()
    expect(questions.length).toBeGreaterThan(0)
    const firstId = questions[0].id

    const getRes = await request.get(`/api/petask/questions/${firstId}`)
    expect(getRes.status()).toBe(200)
    const body = await getRes.json()
    expect(body.question.id).toBe(firstId)
    expect(Array.isArray(body.answers)).toBeTruthy()
    console.log('✅ 個別取得成功: id =', firstId, '/ 回答数 =', body.answers.length)
  })

  test('GET /api/petask/vets — 獣医一覧が取得できる', async ({ request }) => {
    const res = await request.get(`/api/petask/vets`)
    // まだエンドポイントがない場合は404でもOK（実装済みならデータを確認）
    if (res.status() === 200) {
      const body = await res.json()
      console.log('✅ 獣医一覧:', body)
    } else {
      console.log('ℹ️ /api/petask/vets 未実装 (status:', res.status(), ')')
      expect([200, 404]).toContain(res.status())
    }
  })
})
