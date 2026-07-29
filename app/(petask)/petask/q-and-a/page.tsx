import type { Metadata } from 'next';
import Link from 'next/link';
import { getQuestions } from '@/lib/petask/db/questions';
import QuestionCard from '@/components/petask/QuestionCard';
import Breadcrumb from '@/components/petask/Breadcrumb';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';

export const metadata: Metadata = {
  title: '獣医師に質問する — Q&A',
  description: 'ペットの症状・健康について獣医師に無料で質問できます。犬・猫の症状別Q&Aを検索・投稿。',
};

interface Props {
  searchParams: Promise<{ animal?: string; status?: string }>;
}

export default async function QAListPage({ searchParams }: Props) {
  const { animal, status } = await searchParams;
  const questions = await getQuestions({ animal, status, limit: 20 });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: 'Q&A' },
      ]} />

      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">獣医師に質問する</h1>
          <p className="text-slate-500 text-sm mt-1">ペットの症状・健康の悩みを獣医師が回答します</p>
        </div>
        <Link
          href="/petask/q-and-a/new"
          className="shrink-0 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          ✏️ 質問する
        </Link>
      </div>

      {/* サービス説明 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 space-y-1">
        <p className="font-semibold">🩺 PetAsk Q&Aについて</p>
        <ul className="space-y-0.5 text-green-700 text-xs">
          <li>• 認証済みの獣医師が回答します</li>
          <li>• 回答まで通常1〜3日</li>
          <li>• 無料・登録不要で質問できます</li>
          <li>• 回答は獣医師の意見であり診断ではありません</li>
        </ul>
      </div>

      {/* フィルタ */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-slate-500 self-center text-xs">絞り込み:</span>
        {[
          { label: 'すべて', href: '/petask/q-and-a' },
          { label: '🐶 犬', href: '/petask/q-and-a?animal=dog' },
          { label: '🐱 猫', href: '/petask/q-and-a?animal=cat' },
          { label: '回答受付中', href: '/petask/q-and-a?status=pending' },
          { label: '回答済み', href: '/petask/q-and-a?status=answered' },
        ].map(f => {
          const isActive = (animal ? `?animal=${animal}` : status ? `?status=${status}` : '') === (f.href.includes('?') ? '?' + f.href.split('?')[1] : '');
          return (
            <Link
              key={f.href}
              href={f.href}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors
                ${isActive ? 'bg-green-600 text-white border-green-600' : 'border-slate-300 text-slate-600 hover:border-green-400'}`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Q&A一覧 */}
      {questions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 space-y-3">
          <p className="text-4xl">💬</p>
          <p>まだ質問がありません</p>
          <Link href="/petask/q-and-a/new"
            className="inline-block text-sm text-green-600 hover:underline">
            最初に質問してみましょう →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => <QuestionCard key={q.id} question={q} />)}
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
