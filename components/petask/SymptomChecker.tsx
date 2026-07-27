'use client';

import { useState } from 'react';
import { DOG_SYMPTOMS, CAT_SYMPTOMS } from '@/data/symptoms';
import { trackPetAskEvent } from '@/lib/petask/analytics';
import type { PetProfile, SymptomInput, CheckerResult, AnimalType } from '@/lib/petask/types';

interface Props {
  onResult: (result: CheckerResult, animalType: AnimalType) => void;
}

const TOTAL_STEPS = 4;

const defaultSymptom: SymptomInput = {
  primarySymptom: '',
  onsetDays: undefined,
  appetite: 'normal',
  canDrinkWater: 'yes',
  energy: 'normal',
  urination: 'normal',
  defecation: 'normal',
  breathing: 'normal',
  possibleIngestion: false,
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i + 1 === current ? 'bg-blue-600 text-white' : i + 1 < current ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-400'}`}
          >
            {i + 1}
          </div>
          {i < TOTAL_STEPS - 1 && (
            <div className={`h-0.5 w-8 ${i + 1 < current ? 'bg-blue-200' : 'bg-slate-100'}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs text-slate-400">{current}/{TOTAL_STEPS}</span>
    </div>
  );
}

function RadioGroup<T extends string>({
  label, name, value, onChange, options,
}: {
  label: string;
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-slate-800 text-sm">{label}</p>
      <div className="grid gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors
              ${value === opt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className={`w-4 h-4 rounded-full border-2 flex-none
              ${value === opt.value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function SymptomChecker({ onResult }: Props) {
  const [step, setStep] = useState(1);
  const [pet, setPet] = useState<PetProfile>({ animalType: 'dog' });
  const [symptom, setSymptom] = useState<SymptomInput>(defaultSymptom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const symptoms = pet.animalType === 'dog' ? DOG_SYMPTOMS : CAT_SYMPTOMS;

  function nextStep() {
    const next = step + 1;
    setStep(next);
    trackPetAskEvent('petask_symptom_checker_step', { step: next });
  }
  function prevStep() { setStep((s) => s - 1); }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/petask/checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, symptom }),
      });
      if (!res.ok) throw new Error('エラーが発生しました');
      const result = await res.json();
      trackPetAskEvent('petask_symptom_checker_complete', { urgencyLevel: result.urgencyLevel });
      onResult(result, pet.animalType);
    } catch {
      setError('送信に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <StepIndicator current={step} />

      {/* Step 1: ペットの基本情報 */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">ペットの基本情報</h2>

          <div className="space-y-2">
            <p className="font-medium text-slate-800 text-sm">ペットの種類</p>
            <div className="grid grid-cols-2 gap-3">
              {(['dog', 'cat'] as AnimalType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setPet((p) => ({ ...p, animalType: type }));
                    setSymptom((s) => ({ ...s, primarySymptom: '' }));
                  }}
                  className={`py-4 rounded-xl border-2 text-center font-semibold transition-colors
                    ${pet.animalType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <span className="text-2xl block mb-1">{type === 'dog' ? '🐶' : '🐱'}</span>
                  {type === 'dog' ? '犬' : '猫'}
                </button>
              ))}
            </div>
          </div>

          <RadioGroup
            label="性別"
            name="sex"
            value={pet.sex ?? 'unknown'}
            onChange={(v) => setPet((p) => ({ ...p, sex: v }))}
            options={[
              { value: 'male', label: 'オス' },
              { value: 'female', label: 'メス' },
              { value: 'unknown', label: 'わからない' },
            ]}
          />

          <div className="space-y-2">
            <label className="font-medium text-slate-800 text-sm" htmlFor="ageYears">年齢（歳）</label>
            <input
              id="ageYears"
              type="number"
              min={0}
              max={30}
              placeholder="例: 3"
              value={pet.ageYears ?? ''}
              onChange={(e) => setPet((p) => ({ ...p, ageYears: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="button"
            onClick={() => { nextStep(); trackPetAskEvent('petask_symptom_checker_start'); }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            次へ →
          </button>
        </div>
      )}

      {/* Step 2: 主な症状 */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">主な症状を選んでください</h2>

          <div className="space-y-2">
            <label className="font-medium text-slate-800 text-sm" htmlFor="primarySymptom">症状</label>
            <select
              id="primarySymptom"
              value={symptom.primarySymptom}
              onChange={(e) => setSymptom((s) => ({ ...s, primarySymptom: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">選択してください</option>
              {symptoms.map((s) => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-slate-800 text-sm" htmlFor="onsetDays">何日前から？</label>
            <input
              id="onsetDays"
              type="number"
              min={0}
              placeholder="例: 2"
              value={symptom.onsetDays ?? ''}
              onChange={(e) => setSymptom((s) => ({ ...s, onsetDays: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={prevStep} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors">← 戻る</button>
            <button
              type="button"
              onClick={nextStep}
              disabled={!symptom.primarySymptom}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              次へ →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 現在の状態 */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">今の状態を教えてください</h2>

          <RadioGroup
            label="元気"
            name="energy"
            value={symptom.energy}
            onChange={(v) => setSymptom((s) => ({ ...s, energy: v }))}
            options={[
              { value: 'normal', label: '普通' },
              { value: 'reduced', label: 'やや元気がない' },
              { value: 'very_low', label: '著しく元気がない' },
              { value: 'unconscious', label: '意識がない・反応しない 🚨' },
            ]}
          />

          <RadioGroup
            label="食欲"
            name="appetite"
            value={symptom.appetite}
            onChange={(v) => setSymptom((s) => ({ ...s, appetite: v }))}
            options={[
              { value: 'normal', label: '普通' },
              { value: 'reduced', label: '減っている' },
              { value: 'none', label: '全く食べない' },
            ]}
          />

          <RadioGroup
            label="水を飲めているか"
            name="canDrinkWater"
            value={symptom.canDrinkWater}
            onChange={(v) => setSymptom((s) => ({ ...s, canDrinkWater: v }))}
            options={[
              { value: 'yes', label: '飲める' },
              { value: 'reduced', label: '少し飲める' },
              { value: 'no', label: '全く飲めない' },
            ]}
          />

          <RadioGroup
            label="呼吸"
            name="breathing"
            value={symptom.breathing}
            onChange={(v) => setSymptom((s) => ({ ...s, breathing: v }))}
            options={[
              { value: 'normal', label: '普通' },
              { value: 'labored', label: '苦しそう' },
              { value: 'very_difficult', label: '著しく苦しそう 🚨' },
            ]}
          />

          <RadioGroup
            label="おしっこ"
            name="urination"
            value={symptom.urination}
            onChange={(v) => setSymptom((s) => ({ ...s, urination: v }))}
            options={[
              { value: 'normal', label: '普通' },
              { value: 'increased', label: '増えている' },
              { value: 'decreased', label: '減っている' },
              { value: 'none', label: '全く出ない 🚨' },
            ]}
          />

          <RadioGroup
            label="うんち"
            name="defecation"
            value={symptom.defecation}
            onChange={(v) => setSymptom((s) => ({ ...s, defecation: v }))}
            options={[
              { value: 'normal', label: '普通' },
              { value: 'diarrhea', label: '下痢' },
              { value: 'constipation', label: '便秘' },
              { value: 'none', label: '出ていない' },
              { value: 'blood', label: '血が混じっている' },
            ]}
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={symptom.possibleIngestion ?? false}
              onChange={(e) => setSymptom((s) => ({ ...s, possibleIngestion: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">誤飲・誤食の可能性がある（チョコレート・薬・異物など）</span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={prevStep} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors">← 戻る</button>
            <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">次へ →</button>
          </div>
        </div>
      )}

      {/* Step 4: 確認・送信 */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">入力内容を確認</h2>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">ペット:</span> {pet.animalType === 'dog' ? '犬' : '猫'}{pet.sex === 'male' ? '（オス）' : pet.sex === 'female' ? '（メス）' : ''}{pet.ageYears != null ? `・${pet.ageYears}歳` : ''}</p>
            <p><span className="font-medium">主な症状:</span> {symptoms.find((s) => s.slug === symptom.primarySymptom)?.label ?? symptom.primarySymptom}</p>
            {symptom.onsetDays != null && <p><span className="font-medium">発症:</span> {symptom.onsetDays}日前から</p>}
            <p><span className="font-medium">元気:</span> {symptom.energy === 'normal' ? '普通' : symptom.energy === 'reduced' ? 'やや元気がない' : symptom.energy === 'very_low' ? '著しく元気がない' : '意識がない'}</p>
            <p><span className="font-medium">食欲:</span> {symptom.appetite === 'normal' ? '普通' : symptom.appetite === 'reduced' ? '減っている' : '全く食べない'}</p>
            {symptom.possibleIngestion && <p className="text-red-600 font-medium">⚠️ 誤飲の可能性あり</p>}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={prevStep} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors">← 戻る</button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '判定中...' : '結果を見る →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
