import type { Metadata } from 'next';
import EmergencyBanner from '@/components/petask/EmergencyBanner';

export const metadata: Metadata = {
  title: {
    template: '%s | PetAsk',
    default: 'PetAsk — ペットの症状チェック・動物病院受診サポート',
  },
  description:
    'AIではなく、獣医師が監修した情報でペットの症状を整理。動物病院の受診準備をサポートします。',
};

export default function PetAskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/petask" className="font-bold text-lg text-slate-800">
            🐾 PetAsk
          </a>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <a href="/petask/dogs" className="hover:text-slate-900">犬</a>
            <a href="/petask/cats" className="hover:text-slate-900">猫</a>
            <a href="/petask/checker" className="text-blue-600 font-medium hover:text-blue-700">チェッカー</a>
            <a href="/petask/emergency" className="text-red-600 font-medium hover:text-red-700">緊急症状</a>
          </nav>
        </div>
      </header>

      {/* 緊急バナー */}
      <EmergencyBanner />

      {/* メインコンテンツ */}
      <main className="flex-1">{children}</main>

      {/* フッター */}
      <footer className="border-t border-slate-200 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-xs text-slate-400 space-y-2">
          <p>
            このサイトの情報は医療行為・診断の代替ではありません。ペットの状態が心配な場合は必ず獣医師にご相談ください。
          </p>
          <div className="flex gap-4">
            <a href="/petask/disclaimer" className="hover:text-slate-600">免責事項</a>
            <a href="/petask/privacy" className="hover:text-slate-600">プライバシーポリシー</a>
            <a href="/petask/contact" className="hover:text-slate-600">お問い合わせ</a>
          </div>
          <p>© 2026 PetAsk</p>
        </div>
      </footer>
    </div>
  );
}
