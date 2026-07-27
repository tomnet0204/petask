import type { Metadata } from 'next';
import Link from 'next/link';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'PetAsk — ペットの症状チェック・動物病院受診サポート',
  description:
    '犬・猫の症状を整理して動物病院の受診準備をサポート。獣医師が監修した情報で、ペットの状態を正確に伝えましょう。',
};

export default function PetAskTopPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">

      {/* ヒーロー */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">
          ペットの症状、<br className="sm:hidden" />受診前に整理しましょう
        </h1>
        <p className="text-slate-600 text-lg">
          犬・猫の症状別に、受診の緊急度と<br className="sm:hidden" />獣医師への伝え方をサポートします
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/petask/dogs"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            🐶 犬の症状を調べる
          </Link>
          <Link
            href="/petask/cats"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            🐱 猫の症状を調べる
          </Link>
        </div>
        <div className="pt-2">
          <Link
            href="/petask/checker"
            className="inline-flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            📋 症状チェッカーを試す
          </Link>
        </div>
      </section>

      {/* 緊急症状CTA */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
        <p className="text-red-700 font-bold text-lg">今すぐ受診が必要なサインを確認</p>
        <p className="text-red-600 text-sm">意識がない・呼吸困難・おしっこが出ないなどの場合は今すぐ行動してください</p>
        <Link
          href="/petask/emergency"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          緊急症状一覧を見る →
        </Link>
      </section>

      {/* 使い方 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">PetAskの使い方</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '🔍', title: '症状を選ぶ', desc: '犬・猫それぞれの症状一覧から当てはまるものを選択' },
            { step: '2', icon: '📋', title: '状態を確認', desc: '緊急度と受診のタイミング、獣医師への伝え方を確認' },
            { step: '3', icon: '🏥', title: '受診する', desc: '整理した情報を持って動物病院へ。スムーズな診察をサポート' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-2xl">{icon}</div>
              <p className="font-semibold text-slate-800">Step {step}: {title}</p>
              <p className="text-slate-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
