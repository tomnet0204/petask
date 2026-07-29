import { describe, it, expect } from 'vitest'

const PROHIBITED_PATTERNS = [
  { pattern: /(?:飲ませて|投与して)ください/u, message: '投薬指示の疑い' },
  { pattern: /自宅で(?:治療|処置)/u, message: '自宅処置推奨の疑い' },
  { pattern: /心配(?:いり|あり)ません/u, message: '不適切な安心表現の疑い' },
  { pattern: /人間用の薬/u, message: '人間用薬品への言及' },
]

function detectProhibited(text: string) {
  return PROHIBITED_PATTERNS.filter(({ pattern }) => pattern.test(text))
}

describe('禁止表現チェック', () => {
  it('投薬指示を検出する', () => {
    expect(detectProhibited('この薬を飲ませてください')).toHaveLength(1)
    expect(detectProhibited('薬を投与してください')).toHaveLength(1)
  })

  it('自宅処置推奨を検出する', () => {
    expect(detectProhibited('自宅で治療できます')).toHaveLength(1)
    expect(detectProhibited('自宅で処置してみましょう')).toHaveLength(1)
  })

  it('不適切な安心表現を検出する', () => {
    expect(detectProhibited('心配いりません')).toHaveLength(1)
    expect(detectProhibited('心配ありません')).toHaveLength(1)
  })

  it('人間用薬品への言及を検出する', () => {
    expect(detectProhibited('人間用の薬は与えないでください')).toHaveLength(1)
  })

  it('正常なテキストは通過する', () => {
    const safeText = '獣医師にご相談ください。動物病院を受診することをお勧めします。'
    expect(detectProhibited(safeText)).toHaveLength(0)
  })

  it('複数の禁止表現を同時に検出する', () => {
    const text = '自宅で処置して薬を飲ませてください'
    expect(detectProhibited(text)).toHaveLength(2)
  })
})

const REQUIRED_PATTERNS = [
  { pattern: /獣医師に伝え|伝え方/u, message: '獣医師への伝え方の記載がない' },
  { pattern: /持参|持って/u, message: '持参物リストの記載がない' },
  { pattern: /診断.*代替ではない|参考.*情報/u, message: '免責文言の記載がない' },
]

function checkRequired(text: string) {
  return REQUIRED_PATTERNS.filter(({ pattern }) => !pattern.test(text))
}

describe('必須要素チェック', () => {
  it('全要素が揃ったテキストはエラーなし', () => {
    const text = `
      獣医師に伝え方として以下を参考にしてください。
      持参するものは母子手帳です。
      このページの情報は参考情報です。診断の代替ではありません。
    `
    expect(checkRequired(text)).toHaveLength(0)
  })

  it('獣医師への伝え方がない場合を検出', () => {
    const text = '持参するもの: 母子手帳。このページは参考情報です。'
    const missing = checkRequired(text)
    expect(missing.map((m) => m.message)).toContain('獣医師への伝え方の記載がない')
  })

  it('持参物リストがない場合を検出', () => {
    const text = '獣医師に伝え方として元気の状態を伝えましょう。このページは参考情報です。'
    const missing = checkRequired(text)
    expect(missing.map((m) => m.message)).toContain('持参物リストの記載がない')
  })
})
