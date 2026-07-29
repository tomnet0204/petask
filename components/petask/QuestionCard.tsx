import Link from 'next/link';
import type { Question } from '@/lib/petask/types';

const STATUS_CONFIG = {
  pending: { label: '回答受付中', className: 'bg-yellow-100 text-yellow-700' },
  answered: { label: '回答済み', className: 'bg-green-100 text-green-700' },
  closed: { label: 'クローズ', className: 'bg-gray-100 text-gray-500' },
};

const ANIMAL_LABEL = { dog: '🐶 犬', cat: '🐱 猫' };
const SEX_LABEL = { male: 'オス', female: 'メス', unknown: '不明' };

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '1時間以内';
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default function QuestionCard({ question }: { question: Question }) {
  const status = STATUS_CONFIG[question.status];
  return (
    <Link
      href={`/petask/q-and-a/${question.id}`}
      className="block border border-slate-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* ペット情報 */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{question.petName}</span>
            <span>{ANIMAL_LABEL[question.animalType]}</span>
            {question.ageYears !== undefined && <span>{question.ageYears}歳</span>}
            {question.sex && question.sex !== 'unknown' && <span>{SEX_LABEL[question.sex]}</span>}
            {question.symptomSlug && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                {question.symptomSlug.replace(/-/g, ' ')}
              </span>
            )}
          </div>
          {/* 質問本文 */}
          <p className="text-sm text-slate-800 line-clamp-2 leading-relaxed">{question.body}</p>
          {/* フッター */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{timeAgo(question.createdAt)}</span>
            {question.answerCount > 0 && (
              <span className="text-green-600 font-medium">💬 {question.answerCount}件の回答</span>
            )}
          </div>
        </div>
        {/* ステータスバッジ */}
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>
    </Link>
  );
}
