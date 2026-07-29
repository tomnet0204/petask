'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DOG_SYMPTOMS, CAT_SYMPTOMS } from '@/data/symptoms';
import type { AnimalType } from '@/lib/petask/types';

type Step = 1 | 2 | 3;

interface FormData {
  petName: string;
  animalType: AnimalType;
  ageYears: string;
  sex: 'male' | 'female' | 'unknown';
  symptomSlug: string;
  body: string;
  userEmail: string;
  agreed: boolean;
}

const INITIAL: FormData = {
  petName: '',
  animalType: 'dog',
  ageYears: '',
  sex: 'unknown',
  symptomSlug: '',
  body: '',
  userEmail: '',
  agreed: false,
};

const SEX_OPTIONS = [
  { value: 'male', label: 'オス' },
  { value: 'female', label: 'メス' },
  { value: 'unknown', label: '不明' },
] as const;

export default function QuestionForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const symptoms = form.animalType === 'dog' ? DOG_SYMPTOMS : CAT_SYMPTOMS;
  const remaining = 500 - form.body.length;

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function canNext1() {
    return form.petName.trim().length > 0;
  }

  function canNext2() {
    return form.body.trim().length >= 10 && form.body.length <= 500;
  }

  async function submit() {
    if (!form.agreed) { setError('同意チェックが必要です'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/petask/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: form.petName,
          animalType: form.animalType,
          ageYears: form.ageYears ? Number(form.ageYears) : undefined,
          sex: form.sex,
          symptomSlug: form.symptomSlug || undefined,
          questionBody: form.body,
          userEmail: form.userEmail || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '投稿に失敗しました');
      setSubmittedId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : '投稿に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-slate-800">質問を受け付けました</h2>
        <p className="text-slate-500 text-sm">獣医師が確認次第、回答をお届けします（通常1〜3日）</p>
        <Link
          href={`/petask/q-and-a/${submittedId}`}
          className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          質問ページを確認する →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ステップインジケーター */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Step[]).map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${step === s ? 'bg-green-600 text-white' : step > s ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-green-400' : 'bg-slate-200'}`} />}
          </div>
        ))}
        <span className="ml-2 text-xs text-slate-500">{step} / 3</span>
      </div>

      {/* Step 1: ペット情報 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">ペットの情報</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ペットの名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.petName}
              onChange={e => set('petName', e.target.value)}
              placeholder="例: ハナ"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              動物種 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['dog', 'cat'] as AnimalType[]).map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { set('animalType', a); set('symptomSlug', ''); }}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors
                    ${form.animalType === a ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {a === 'dog' ? '🐶 犬' : '🐱 猫'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">年齢（歳）</label>
              <input
                type="number"
                min="0"
                max="30"
                value={form.ageYears}
                onChange={e => set('ageYears', e.target.value)}
                placeholder="例: 3"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">性別</label>
              <div className="flex gap-1">
                {SEX_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('sex', opt.value)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors
                      ${form.sex === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!canNext1()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            次へ →
          </button>
        </div>
      )}

      {/* Step 2: 質問内容 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">質問内容</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">関連する症状（任意）</label>
            <select
              value={form.symptomSlug}
              onChange={e => set('symptomSlug', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">選択しない</option>
              {symptoms.map(s => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              質問内容 <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-slate-400 font-normal">10〜500文字</span>
            </label>
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              rows={6}
              placeholder={`例: 昨日から${form.petName || 'ペット'}が嘔吐を繰り返しています。食欲はなく元気もありません。水は少し飲みます。いつ受診すればよいでしょうか？`}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
            <p className={`text-xs mt-1 text-right ${remaining < 0 ? 'text-red-500' : remaining < 50 ? 'text-amber-500' : 'text-slate-400'}`}>
              残り {remaining} 文字
            </p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 border border-slate-300 text-slate-600 font-medium py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              ← 戻る
            </button>
            <button type="button" onClick={() => setStep(3)} disabled={!canNext2()}
              className="flex-[2] bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              次へ →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 確認・送信 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800">確認・送信</h2>

          {/* 入力内容サマリー */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <p><span className="text-slate-500 w-20 inline-block">ペット名</span><span className="font-medium">{form.petName}</span></p>
            <p><span className="text-slate-500 w-20 inline-block">動物種</span><span>{form.animalType === 'dog' ? '犬' : '猫'}</span></p>
            {form.ageYears && <p><span className="text-slate-500 w-20 inline-block">年齢</span><span>{form.ageYears}歳</span></p>}
            {form.symptomSlug && <p><span className="text-slate-500 w-20 inline-block">症状</span><span>{form.symptomSlug}</span></p>}
            <p className="border-t border-slate-200 pt-2 text-slate-700 leading-relaxed">{form.body}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              メールアドレス（任意）
            </label>
            <input
              type="email"
              value={form.userEmail}
              onChange={e => set('userEmail', e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-xs text-slate-400 mt-1">回答が届いたらメールでお知らせします</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={e => set('agreed', e.target.checked)}
              className="mt-0.5 w-4 h-4 text-green-600 rounded"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              この回答は獣医師の意見であり診断ではないことを理解しました。ペットの状態が急変した場合は直ちに動物病院を受診します。
            </span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 border border-slate-300 text-slate-600 font-medium py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              ← 戻る
            </button>
            <button type="button" onClick={submit} disabled={submitting || !form.agreed}
              className="flex-[2] bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              {submitting ? '送信中...' : '質問を投稿する'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
