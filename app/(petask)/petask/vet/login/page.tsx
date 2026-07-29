import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '獣医師ログイン',
  description: 'PetAsk Q&A 獣医師向けログインページ',
  robots: 'noindex',
};

export default function VetLoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '獣医師ログイン' },
      ]} />

      <div className="text-center space-y-2">
        <div className="text-5xl">🩺</div>
        <h1 className="text-2xl font-bold text-slate-900">獣医師ページ</h1>
        <p className="text-slate-500 text-sm">認証済み獣医師の方はログインしてください</p>
      </div>

      {/* ログインフォーム（UI mockup — Supabase Auth 連携後に動作） */}
      <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">メールアドレス</label>
          <input
            type="email"
            placeholder="vet@example.com"
            disabled
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">パスワード</label>
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* 準備中バナー */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
          <p className="font-semibold mb-1">⚙️ 認証システム設定中</p>
          <p>現在、獣医師向けログイン機能の設定を進めています。参加をご希望の獣医師の方は、お問い合わせよりご連絡ください。</p>
        </div>

        <button
          type="button"
          disabled
          className="w-full bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm cursor-not-allowed"
        >
          ログイン（準備中）
        </button>
      </div>

      <div className="text-center space-y-2 text-sm text-slate-500">
        <p>参加をご希望の獣医師の方は</p>
        <Link href="/petask/contact" className="text-green-600 hover:underline">
          お問い合わせフォームへ →
        </Link>
      </div>

      <div className="border-t border-slate-200 pt-4 text-center">
        <Link href="/petask/vets" className="text-sm text-slate-400 hover:text-slate-600">
          回答獣医師一覧を見る
        </Link>
      </div>
    </div>
  );
}
