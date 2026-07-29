import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuestionById } from '@/lib/petask/db/questions';
import { getAnswersByQuestionId } from '@/lib/petask/db/answers';
import AnswerCard from '@/components/petask/AnswerCard';
import Breadcrumb from '@/components/petask/Breadcrumb';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getQuestionById(id);
  if (!question) return {};
  const animalLabel = question.animalType === 'dog' ? '犬' : '猫';
  return {
    title: `${question.petName}（${animalLabel}）への質問`,
    description: question.body.slice(0, 120),
  };
}

const ANIMAL_LABEL = { dog: '🐶 犬', cat: '🐱 猫' };
const SEX_LABEL = { male: 'オス', female: 'メス', unknown: '不明' };
const STATUS_CONFIG = {
  pending: { label: '回答受付中', className: 'bg-yellow-100 text-yellow-700' },
  answered: { label: '回答済み', className: 'bg-green-100 text-green-700' },
  closed: { label: 'クローズ', className: 'bg-gray-100 text-gray-500' },
};

export default async function QADetailPage({ params }: Props) {
  const { id } = await params;
  const [question, answers] = await Promise.all([
    getQuestionById(id),
    getAnswersByQuestionId(id),
  ]);
  if (!question) notFound();

  const status = STATUS_CONFIG[question.status];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: 'Q&A', href: '/petask/q-and-a' },
        { label: '質問詳細' },
      ]} />

      {/* 質問カード */}
      <div className="border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-slate-800 text-base">{question.petName}</span>
            <span className="text-slate-500">{ANIMAL_LABEL[question.animalType]}</span>
            {question.ageYears !== undefined && (
              <span className="text-slate-500">{question.ageYears}歳</span>
            )}
            {question.sex && question.sex !== 'unknown' && (
              <span className="text-slate-500">{SEX_LABEL[question.sex]}</span>
            )}
            {question.symptomSlug && (
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                {question.symptomSlug.replace(/-/g, ' ')}
              </span>
            )}
          </div>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{question.body}</p>
        <p className="text-xs text-slate-400">
          {new Date(question.createdAt).toLocaleDateString('ja-JP')} 投稿
        </p>
      </div>

      {/* 回答セクション */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-800">
          獣医師からの回答
          {answers.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-500">（{answers.length}件）</span>
          )}
        </h2>

        {answers.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 space-y-2">
            <p className="text-2xl">🩺</p>
            <p className="text-sm font-medium">獣医師が回答中です</p>
            <p className="text-xs">通常1〜3日以内に回答が届きます</p>
          </div>
        ) : (
          // ベストアンサーを先に表示
          [...answers]
            .sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0))
            .map(answer => <AnswerCard key={answer.id} answer={answer} />)
        )}
      </div>

      <DisclaimerBanner />

      <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-sm">
        <Link href="/petask/q-and-a" className="text-green-600 hover:underline">
          ← Q&A一覧に戻る
        </Link>
        <Link href="/petask/q-and-a/new"
          className="text-green-600 hover:underline">
          新しく質問する →
        </Link>
      </div>
    </div>
  );
}
