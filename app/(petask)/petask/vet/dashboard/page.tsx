import type { Metadata } from 'next';
import Link from 'next/link';
import { getQuestions } from '@/lib/petask/db/questions';
import QuestionCard from '@/components/petask/QuestionCard';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '獣医師ダッシュボード',
  description: '未回答の質問に回答する獣医師向けページ',
  robots: 'noindex',
};

export default async function VetDashboardPage() {
  const pendingQuestions = await getQuestions({ status: 'pending', limit: 10 });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '獣医師ダッシュボード' },
      ]} />

      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">獣医師ダッシュボード</h1>
          <p className="text-slate-500 text-sm mt-1">未回答の質問に回答できます</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 font-medium">
          ⚙️ モックモード
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '未回答', value: pendingQuestions.length, color: 'text-amber-600' },
          { label: '今日の回答', value: 0, color: 'text-green-600' },
          { label: '累計回答', value: 3, color: 'text-slate-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border border-slate-200 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* 未回答質問一覧 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800">
            未回答の質問
            <span className="ml-2 text-sm font-normal text-slate-500">（{pendingQuestions.length}件）</span>
          </h2>
          <Link href="/petask/q-and-a?status=pending"
            className="text-xs text-green-600 hover:underline">
            Q&A一覧で確認 →
          </Link>
        </div>

        {pendingQuestions.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 space-y-2">
            <p className="text-2xl">✅</p>
            <p className="text-sm">未回答の質問はありません</p>
          </div>
        ) : (
          pendingQuestions.map(q => (
            <div key={q.id} className="relative">
              <QuestionCard question={q} />
              <div className="absolute top-3 right-3">
                <Link
                  href={`/petask/q-and-a/${q.id}`}
                  className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  回答する →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 回答フォームへの案内 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
        <p className="font-semibold text-green-800 text-sm">回答の手順</p>
        <ol className="space-y-2 text-xs text-green-700">
          <li className="flex gap-2"><span className="font-bold shrink-0">1.</span><span>上記の質問リンクをクリックして質問詳細を確認</span></li>
          <li className="flex gap-2"><span className="font-bold shrink-0">2.</span><span>ページ下部の「回答を投稿」フォームから回答を送信</span></li>
          <li className="flex gap-2"><span className="font-bold shrink-0">3.</span><span>診断・投薬指示は行わず、一般的な医療情報として回答してください</span></li>
        </ol>
        <div className="border-t border-green-200 pt-3 text-xs text-green-600 leading-relaxed">
          ⚠️ 回答は個別診断ではなく、一般的な参考情報として提供してください。緊急と判断した場合は「すぐに受診を」と明記してください。
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4 text-center">
        <Link href="/petask/vet/login" className="text-sm text-slate-400 hover:text-slate-600">
          ← ログインページに戻る
        </Link>
      </div>
    </div>
  );
}
