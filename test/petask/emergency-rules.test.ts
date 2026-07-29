import { describe, it, expect } from 'vitest'
import { evaluateUrgency } from '@/lib/petask/emergency-rules'
import type { SymptomInput } from '@/lib/petask/types'

const BASE_INPUT: SymptomInput = {
  primarySymptom: 'vomiting',
  appetite: 'normal',
  canDrinkWater: 'yes',
  energy: 'normal',
  urination: 'normal',
  defecation: 'normal',
  breathing: 'normal',
}

describe('evaluateUrgency', () => {
  it('全て正常ならmonitor', () => {
    const { urgencyLevel, flags } = evaluateUrgency(BASE_INPUT)
    expect(urgencyLevel).toBe('monitor')
    expect(flags).toHaveLength(0)
  })

  it('意識消失はemergency', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, energy: 'unconscious' })
    expect(urgencyLevel).toBe('emergency')
    expect(flags).toContain('意識消失の可能性')
  })

  it('重篤な呼吸困難はemergency', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, breathing: 'very_difficult' })
    expect(urgencyLevel).toBe('emergency')
    expect(flags).toContain('重篤な呼吸困難')
  })

  it('尿閉はemergency', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, urination: 'none' })
    expect(urgencyLevel).toBe('emergency')
    expect(flags).toContain('尿閉の可能性（特に猫の雄で致命的）')
  })

  it('誤飲はemergency', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, possibleIngestion: true })
    expect(urgencyLevel).toBe('emergency')
    expect(flags).toContain('誤飲の可能性')
  })

  it('血便はurgent', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, defecation: 'blood' })
    expect(urgencyLevel).toBe('urgent')
    expect(flags).toContain('血便')
  })

  it('水分摂取不能はurgent', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, canDrinkWater: 'no' })
    expect(urgencyLevel).toBe('urgent')
    expect(flags).toContain('水分摂取不能')
  })

  it('食欲廃絶はwatchful', () => {
    const { urgencyLevel, flags } = evaluateUrgency({ ...BASE_INPUT, appetite: 'none' })
    expect(urgencyLevel).toBe('watchful')
    expect(flags).toContain('完全な食欲廃絶')
  })

  it('複数条件でも最高レベルが返る（blood + unconscious → emergency）', () => {
    const { urgencyLevel } = evaluateUrgency({
      ...BASE_INPUT,
      defecation: 'blood',
      energy: 'unconscious',
    })
    expect(urgencyLevel).toBe('emergency')
  })

  it('flagsに全マッチしたルールが含まれる', () => {
    const { flags } = evaluateUrgency({
      ...BASE_INPUT,
      defecation: 'blood',
      canDrinkWater: 'no',
    })
    expect(flags).toContain('血便')
    expect(flags).toContain('水分摂取不能')
    expect(flags).toHaveLength(2)
  })

  it('努力性呼吸はurgent', () => {
    const { urgencyLevel } = evaluateUrgency({ ...BASE_INPUT, breathing: 'labored' })
    expect(urgencyLevel).toBe('urgent')
  })

  it('著しい元気消失はwatchful', () => {
    const { urgencyLevel } = evaluateUrgency({ ...BASE_INPUT, energy: 'very_low' })
    expect(urgencyLevel).toBe('watchful')
  })
})
