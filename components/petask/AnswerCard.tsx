import type { Answer } from '@/lib/petask/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '1時間以内';
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default function AnswerCard({ answer }: { answer: Answer }) {
  const { vet } = answer;
  return (
    <div className={`border rounded-xl p-5 space-y-4 ${answer.isAccepted ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
      {answer.isAccepted && (
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
          <span>⭐</span>
          <span>ベストアンサー</span>
        </div>
      )}

      {/* 獣医師情報 */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
          {vet.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">{vet.name}</span>
            {vet.isVerified && (
              <span className="inline-flex items-center gap-0.5 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                ✓ 獣医師確認済み
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{vet.credential}</p>
          {vet.specialty.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {vet.specialty.map(s => (
                <span key={s} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 回答本文 */}
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{answer.body}</p>

      <p className="text-xs text-slate-400">{timeAgo(answer.createdAt)}</p>
    </div>
  );
}
