import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'PetAsk — ペットの症状チェック・動物病院受診サポート',
  description:
    '犬・猫の症状を整理して動物病院の受診準備をサポート。獣医師が監修した情報で、ペットの状態を正確に伝えましょう。',
};

const STATS = [
  { value: '120+', label: '対応症状数' },
  { value: '5万件', label: 'チェック実績' },
  { value: '24時間', label: 'いつでも利用可能' },
];

const CATEGORIES = [
  {
    slug: 'dogs',
    emoji: '🐶',
    label: '犬の症状',
    desc: '嘔吐・下痢・食欲不振・咳など犬に多い症状の緊急度と対応',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    textColor: 'text-amber-700',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=75',
  },
  {
    slug: 'cats',
    emoji: '🐱',
    label: '猫の症状',
    desc: '尿路問題・毛玉・食欲不振・咳など猫に多い症状の緊急度と対応',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    textColor: 'text-blue-700',
    img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=75',
  },
  {
    slug: 'emergency',
    emoji: '🚨',
    label: '緊急症状',
    desc: '意識喪失・呼吸困難・排尿困難など今すぐ受診が必要なサイン',
    color: 'bg-red-50 border-red-200 hover:border-red-400',
    textColor: 'text-red-700',
    img: 'https://images.unsplash.com/photo-1654895716780-b4664497420d?w=400&q=75',
  },
];

const STEPS = [
  {
    step: '1',
    icon: '🔍',
    title: '症状を選ぶ',
    desc: '犬・猫それぞれの症状一覧から当てはまるものを選択',
  },
  {
    step: '2',
    icon: '📋',
    title: '状態を確認',
    desc: '緊急度と受診タイミング、獣医師への伝え方を確認',
  },
  {
    step: '3',
    icon: '🏥',
    title: '受診する',
    desc: '整理した情報を持って動物病院へ。スムーズな診察をサポート',
  },
];

export default function PetAskTopPage() {
  return (
    <div>

      {/* ===== ヒーロー ===== */}
      <section style={{ backgroundColor: '#f0fdf4' }} className="border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-10">

          {/* 左: テキスト */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-1.5 text-sm font-medium" style={{ color: '#16a34a' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              獣医師監修情報でサポート
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              ペットの症状、<br />
              受診前に整理しましょう
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              犬・猫の症状別に、受診の緊急度と<br className="hidden sm:block" />
              獣医師への伝え方をわかりやすくサポートします。
            </p>

            {/* 統計 */}
            <div className="flex gap-6 flex-wrap">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#16a34a' }}>{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/petask/checker"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
                style={{ backgroundColor: '#16a34a' }}
              >
                📋 症状チェッカーを試す
              </Link>
              <Link
                href="/petask/emergency"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
              >
                🚨 緊急症状を確認
              </Link>
            </div>
          </div>

          {/* 右: 画像 */}
          <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://plus.unsplash.com/premium_photo-1661916447474-235409b19e16?w=600&q=80"
                alt="ペットを診察する獣医師"
                fill
                className="object-cover"
                priority
              />
              {/* バッジ */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 shadow">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shrink-0"
                  style={{ backgroundColor: '#16a34a' }}>
                  🩺
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">獣医師監修</p>
                  <p className="text-xs text-gray-500">正確な情報で安心サポート</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== カテゴリカード ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">症状から調べる</h2>
        <p className="text-gray-500 text-sm mb-8">ペットの種類と症状に合わせて選んでください</p>

        <div className="grid sm:grid-cols-3 gap-5">
          {CATEGORIES.map(({ slug, emoji, label, desc, color, textColor, img }) => (
            <Link
              key={slug}
              href={`/petask/${slug}`}
              className={`group rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${color}`}
            >
              <div className="relative w-full h-44 overflow-hidden">
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 bg-white">
                <div className={`flex items-center gap-2 font-bold text-lg mb-1.5 ${textColor}`}>
                  <span>{emoji}</span>
                  <span>{label}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className={`mt-3 text-xs font-semibold flex items-center gap-1 ${textColor}`}>
                  詳しく見る <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 使い方 3ステップ ===== */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">PetAskの使い方</h2>
          <p className="text-gray-500 text-sm text-center mb-10">3ステップで受診準備が整います</p>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* ステップ間の矢印（PC） */}
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-green-200 z-0"></div>

            {STEPS.map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center z-10">
                <div className="text-4xl mb-3">{icon}</div>
                <p className="font-bold text-gray-800 mb-2">{title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/petask/checker"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              style={{ backgroundColor: '#16a34a' }}
            >
              症状チェッカーを使ってみる →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== よく確認される症状 ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">よく確認される症状</h2>
        <p className="text-gray-500 text-sm mb-8">多くの方が調べている症状のランキング</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { key: 'vomit', icon: '🤮', sym: '嘔吐・吐き気', tag: '犬・猫', urgency: '要確認' },
            { key: 'diarr', icon: '💩', sym: '下痢・軟便', tag: '犬・猫', urgency: '要確認' },
            { key: 'noeat', icon: '😮', sym: '食欲不振', tag: '犬・猫', urgency: '様子見' },
            { key: 'pee', icon: '🚽', sym: 'おしっこが出ない', tag: '猫', urgency: '緊急' },
            { key: 'cough', icon: '😮‍💨', sym: '咳・くしゃみ', tag: '犬・猫', urgency: '様子見' },
            { key: 'weak', icon: '😵', sym: 'ぐったりしている', tag: '犬・猫', urgency: '緊急' },
          ].map(({ key, icon, sym, tag, urgency }) => (
            <div key={key} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
              <span className="text-2xl shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{sym}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tag}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                urgency === '緊急' ? 'bg-red-100 text-red-600' :
                urgency === '要確認' ? 'bg-amber-100 text-amber-600' :
                'bg-gray-100 text-gray-500'
              }`}>
                {urgency}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 免責バナー ===== */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <DisclaimerBanner />
      </div>

    </div>
  );
}
