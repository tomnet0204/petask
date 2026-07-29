import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | PetAsk',
    default: 'PetAsk — ペットの症状チェック・動物病院受診サポート',
  },
  description:
    '獣医師が監修した情報でペットの症状を整理。動物病院の受診準備をサポートする、犬・猫の症状チェックサービス。',
};

export default function PetAskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif" }}>

      {/* ===== ヘッダー（AskDoctors風） ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* ロゴ */}
          <Link href="/petask" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              P
            </div>
            <span className="text-xl font-bold" style={{ color: '#16a34a' }}>PetAsk</span>
          </Link>

          {/* PC ナビゲーション */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/petask/dogs" className="hover:text-green-700 transition-colors">🐶 犬の症状</Link>
            <Link href="/petask/cats" className="hover:text-green-700 transition-colors">🐱 猫の症状</Link>
            <Link href="/petask/emergency" className="text-red-600 hover:text-red-700 transition-colors font-semibold">🚨 緊急症状</Link>
            <Link href="/petask/q-and-a" className="hover:text-green-700 transition-colors">💬 獣医師Q&A</Link>
          </nav>

          {/* CTA */}
          <Link
            href="/petask/checker"
            className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shrink-0"
            style={{ backgroundColor: '#16a34a' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            症状チェッカー
          </Link>
        </div>

        {/* モバイルナビ */}
        <div className="md:hidden border-t border-gray-100 bg-gray-50">
          <div className="flex overflow-x-auto text-xs font-medium text-gray-600 px-4 gap-5 h-10 items-center">
            <Link href="/petask/dogs" className="whitespace-nowrap hover:text-green-700">🐶 犬</Link>
            <Link href="/petask/cats" className="whitespace-nowrap hover:text-green-700">🐱 猫</Link>
            <Link href="/petask/emergency" className="whitespace-nowrap text-red-600 font-semibold">🚨 緊急症状</Link>
            <Link href="/petask/checker" className="whitespace-nowrap text-green-700 font-semibold">📋 チェッカー</Link>
            <Link href="/petask/q-and-a" className="whitespace-nowrap hover:text-green-700">💬 Q&A</Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">{children}</main>

      {/* ===== フッター ===== */}
      <footer className="bg-gray-800 text-gray-400 text-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">🐾 PetAsk</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                ペットの症状を整理して、動物病院の受診をスムーズにするサポートサービスです。
              </p>
            </div>
            <div className="flex gap-10 text-xs">
              <div className="space-y-2">
                <p className="text-white font-semibold mb-3">症状を調べる</p>
                <Link href="/petask/dogs" className="block hover:text-white transition-colors">犬の症状一覧</Link>
                <Link href="/petask/cats" className="block hover:text-white transition-colors">猫の症状一覧</Link>
                <Link href="/petask/emergency" className="block hover:text-white transition-colors">緊急症状</Link>
                <Link href="/petask/checker" className="block hover:text-white transition-colors">症状チェッカー</Link>
                <Link href="/petask/q-and-a" className="block hover:text-white transition-colors">獣医師Q&A</Link>
                <Link href="/petask/vets" className="block hover:text-white transition-colors">回答獣医師一覧</Link>
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold mb-3">サービス情報</p>
                <Link href="/petask/disclaimer" className="block hover:text-white transition-colors">免責事項</Link>
                <Link href="/petask/privacy" className="block hover:text-white transition-colors">プライバシーポリシー</Link>
                <Link href="/petask/contact" className="block hover:text-white transition-colors">お問い合わせ</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs">
            <p>© 2026 PetAsk. All rights reserved.</p>
            <p className="text-gray-500">このサービスは獣医師による診断・治療の代替ではありません。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
