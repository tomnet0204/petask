import { describe, it, expect } from 'vitest'
import { evaluateUrgency } from '@/lib/petask/emergency-rules'
import type { SymptomInput, CheckerResult, UrgencyLevel } from '@/lib/petask/types'

const URGENCY_MESSAGES: Record<UrgencyLevel, string> = {
  emergency: '今すぐ動物病院に電話してください',
  urgent: '本日中に動物病院を受診してください',
  watchful: '24時間以内に変化があれば受診を検討してください',
  monitor: 'しばらく様子を観察してください。悪化したら受診を',
}

function buildCheckerResult(symptom: SymptomInput): CheckerResult {
  const { urgencyLevel, flags } = evaluateUrgency(symptom)
  return {
    urgencyLevel,
    urgencyReasons: flags.length > 0 ? flags : [URGENCY_MESSAGES[urgencyLevel]],
    watchPoints: ['元気・食欲・飲水量の変化'],
    vetCommunicationGuide: `主な症状: ${symptom.primarySymptom}`,
    bringToVet: ['母子手帳・ワクチン証明書', '普段食べているフードのパッケージ'],
    relatedArticleSlugs: [],
    disclaimer: 'この結果は診断ではありません。必ず獣医師にご相談ください。',
    ruleBasedFlags: flags,
  }
}

const NORMAL_INPUT: SymptomInput = {
  primarySymptom: 'vomiting',
  appetite: 'normal',
  canDrinkWater: 'yes',
  energy: 'normal',
  urination: 'normal',
  defecation: 'normal',
  breathing: 'normal',
}

describe('チェッカーAPIロジック', () => {
  it('CheckerResultにdiagnosisNameが含まれない', () => {
    const result = buildCheckerResult(NORMAL_INPUT)
    expect(result).not.toHaveProperty('diagnosisName')
  })

  it('emergencyレベルで正しいメッセージが含まれる', () => {
    const result = buildCheckerResult({ ...NORMAL_INPUT, energy: 'unconscious' })
    expect(result.urgencyLevel).toBe('emergency')
    expect(result.urgencyReasons).toContain('意識消失の可能性')
  })

  it('monitorレベルで正しいメッセージが含まれる', () => {
    const result = buildCheckerResult(NORMAL_INPUT)
    expect(result.urgencyLevel).toBe('monitor')
    expect(result.urgencyReasons).toContain(URGENCY_MESSAGES.monitor)
  })

  it('disclaimerが必ず含まれる', () => {
    const result = buildCheckerResult(NORMAL_INPUT)
    expect(result.disclaimer).toContain('診断ではありません')
  })

  it('urgentレベルで血便フラグが含まれる', () => {
    const result = buildCheckerResult({ ...NORMAL_INPUT, defecation: 'blood' })
    expect(result.urgencyLevel).toBe('urgent')
    expect(result.ruleBasedFlags).toContain('血便')
  })

  it('bringToVetが空でない', () => {
    const result = buildCheckerResult(NORMAL_INPUT)
    expect(result.bringToVet.length).toBeGreaterThan(0)
  })

  it('watchPointsが空でない', () => {
    const result = buildCheckerResult(NORMAL_INPUT)
    expect(result.watchPoints.length).toBeGreaterThan(0)
  })

  it('vetCommunicationGuideに主な症状が含まれる', () => {
    const result = buildCheckerResult({ ...NORMAL_INPUT, primarySymptom: 'diarrhea' })
    expect(result.vetCommunicationGuide).toContain('diarrhea')
  })
})
