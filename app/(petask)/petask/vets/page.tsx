import type { Metadata } from 'next';
import { getVets } from '@/lib/petask/db/vets';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '獣医師一覧',
  description: 'PetAsk Q&Aに参加している認証済み獣医師の紹介。犬・猫・エキゾチックアニマルなど専門分野別に確認できます。',
};

export default async function VetsPage() {
  const vets = await getVets();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '獣医師一覧' },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">回答獣医師</h1>
        <p className="text-slate-500 text-sm mt-1">認証済みの獣医師がQ&Aに回答します</p>
      </div>

      {/* 認証バッジ説明 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm space-y-2">
        <div className="flex items-center gap-2 font-semibold text-green-800">
          <span className="text-green-600">✓</span>
          認証済み獣医師について
        </div>
        <ul className="text-green-700 text-xs space-y-1">
          <li>• 獣医師免許を保有し、運営側が資格証明を確認済みです</li>
          <li>• Q&Aの回答は回答者の意見であり、個別の診断・治療指示ではありません</li>
        </ul>
      </div>

      {/* 獣医師カード一覧 */}
      <div className="space-y-4">
        {vets.map(vet => (
          <div key={vet.id} className="border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-4">
              {/* アバター */}
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl shrink-0">
                🩺
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{vet.name}</span>
                  {vet.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ 認証済み
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{vet.credential}</p>

                {/* 専門分野タグ */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {vet.specialty.map(s => (
                    <span key={s}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {vet.bio && (
              <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {vet.bio}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 獣医師応募 */}
      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3">
        <p className="text-slate-600 font-medium">獣医師の方へ</p>
        <p className="text-sm text-slate-500">PetAsk Q&Aに参加して、ペットと飼い主さんをサポートしませんか？</p>
        <a href="/petask/vet/login"
          className="inline-block text-sm text-green-600 hover:underline font-medium">
          獣医師ページへ →
        </a>
      </div>
    </div>
  );
}
