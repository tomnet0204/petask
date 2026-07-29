import type { Metadata } from 'next';
import QuestionForm from '@/components/petask/QuestionForm';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '獣医師に質問する',
  description: 'ペットの症状・健康について獣医師に無料で質問できます。',
  robots: 'noindex',
};

export default function NewQuestionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: 'Q&A', href: '/petask/q-and-a' },
        { label: '質問を投稿' },
      ]} />

      <div className="mt-6 grid md:grid-cols-[1fr_280px] gap-8">
        {/* フォーム */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">獣医師に質問する</h1>
          <QuestionForm />
        </div>

        {/* サイド説明 */}
        <aside className="space-y-4 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-green-800">Q&Aについて</p>
            <ul className="space-y-2 text-green-700 text-xs">
              <li className="flex gap-2"><span>🩺</span><span>認証済み獣医師が回答</span></li>
              <li className="flex gap-2"><span>⏱️</span><span>回答まで通常1〜3日</span></li>
              <li className="flex gap-2"><span>🆓</span><span>無料・登録不要</span></li>
              <li className="flex gap-2"><span>🔒</span><span>個人情報は公開されません</span></li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-red-700 text-xs">⚠️ 緊急時はすぐに受診を</p>
            <p className="text-red-600 text-xs leading-relaxed">
              意識がない・呼吸困難・おしっこが出ないなどの症状は、Q&Aを待たずに今すぐ動物病院へ連絡してください。
            </p>
            <a href="/petask/emergency" className="block text-xs text-red-600 hover:underline font-medium">
              緊急症状一覧を確認 →
            </a>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-500">
            <p className="font-medium text-slate-700">回答は診断ではありません</p>
            <p className="leading-relaxed">
              獣医師の回答はあくまで意見・参考情報です。具体的な治療・投薬については必ずかかりつけの動物病院にご相談ください。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
