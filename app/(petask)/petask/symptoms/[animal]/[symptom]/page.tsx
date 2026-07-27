import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SYMPTOMS_BY_ANIMAL } from '@/data/symptoms';
import { getSymptomData, getAllSymptomSlugs } from '@/lib/petask/content';
import type { AnimalType } from '@/lib/petask/types';
import Breadcrumb from '@/components/petask/Breadcrumb';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';
import SupervisorCard from '@/components/petask/SupervisorCard';
import ReviewStatusBadge from '@/components/petask/ReviewStatusBadge';

interface Props {
  params: Promise<{ animal: string; symptom: string }>;
}

export async function generateStaticParams() {
  const animals: AnimalType[] = ['dog', 'cat'];
  return animals.flatMap((animal) =>
    getAllSymptomSlugs(animal).map((symptom) => ({ animal, symptom }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animal, symptom } = await params;
  const meta = SYMPTOMS_BY_ANIMAL[animal as AnimalType]?.find((s) => s.slug === symptom);
  if (!meta) return {};
  const animalLabel = animal === 'dog' ? '犬' : '猫';
  return {
    title: `${animalLabel}の${meta.label}`,
    description: `${animalLabel}が${meta.label}のとき、緊急度と動物病院への受診タイミング、獣医師への伝え方を解説します。`,
  };
}

const URGENCY_CONFIG = {
  high: { label: '緊急 — 今すぐ動物病院へ', className: 'bg-red-600 text-white', icon: '🚨' },
  medium: { label: '要注意 — 当日〜翌日に受診を', className: 'bg-yellow-500 text-white', icon: '⚠️' },
  low: { label: '様子観察 — 悪化したら受診を', className: 'bg-green-600 text-white', icon: '👀' },
};

export default async function SymptomPage({ params }: Props) {
  const { animal, symptom } = await params;

  if (animal !== 'dog' && animal !== 'cat') notFound();

  const meta = SYMPTOMS_BY_ANIMAL[animal as AnimalType]?.find((s) => s.slug === symptom);
  if (!meta) notFound();

  const data = getSymptomData(animal as AnimalType, symptom);
  const animalLabel = animal === 'dog' ? '犬' : '猫';
  const animalEmoji = animal === 'dog' ? '🐶' : '🐱';
  const urgency = URGENCY_CONFIG[meta.emergencyLevel];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: `${animalLabel}の症状一覧`, href: `/petask/${animal}s` },
        { label: `${animalLabel}の${meta.label}` },
      ]} />

      {/* タイトル */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-slate-900">
          {animalEmoji} {animalLabel}の{meta.label}
        </h1>
        {data && (
          <ReviewStatusBadge status={data.frontmatter.reviewStatus} />
        )}
      </div>

      {/* 緊急度バッジ */}
      <div className={`rounded-xl px-5 py-4 ${urgency.className}`}>
        <p className="font-bold text-lg">{urgency.icon} {urgency.label}</p>
      </div>

      {/* コンテンツがある場合 */}
      {data ? (
        <div className="space-y-6">
          <div
            className="prose prose-slate max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
          {data.frontmatter.supervisorName && (
            <SupervisorCard
              name={data.frontmatter.supervisorName}
              credential={data.frontmatter.supervisorCredential ?? '獣医師'}
              reviewedAt={data.frontmatter.lastReviewedAt}
            />
          )}
          {data.frontmatter.references.length > 0 && (
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold">参考資料</p>
              {data.frontmatter.references.map((ref) => (
                <p key={ref.url}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                    {ref.title}
                  </a>
                  （参照: {ref.accessedAt}）
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* コンテンツ未作成時のプレースホルダー */
        <div className="space-y-4 text-slate-600 text-sm">
          <p>
            <strong>{animalLabel}の{meta.label}</strong>は、様々な原因で起こります。
            以下のポイントを獣医師に伝えると診察がスムーズです。
          </p>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-slate-800">獣医師に伝えること</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>いつから（発症した日時）</li>
              <li>どのくらいの頻度か</li>
              <li>食欲・飲水の変化</li>
              <li>排泄（おしっこ・うんち）の様子</li>
              <li>元気の程度</li>
              <li>最近の食事・散歩・環境変化</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-slate-800">持参するもの</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>母子手帳・ワクチン証明書</li>
              <li>普段食べているフードのパッケージ</li>
              <li>服用中の薬がある場合はその薬</li>
              <li>症状の動画（撮影できた場合）</li>
            </ul>
          </div>
        </div>
      )}

      <DisclaimerBanner />

      {/* 関連ページ */}
      <div className="border-t border-slate-200 pt-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">他の{animalLabel}の症状も確認する</p>
        <a
          href={`/petask/${animal}s`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← {animalLabel}の症状一覧に戻る
        </a>
      </div>
    </div>
  );
}
