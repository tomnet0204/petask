'use client';

import type { CheckerResult, UrgencyLevel, AnimalType } from '@/lib/petask/types';

interface Props {
  result: CheckerResult;
  animalType: AnimalType;
  onReset: () => void;
}

const URGENCY_CONFIG: Record<UrgencyLevel, { bg: string; icon: string; title: string }> = {
  emergency: { bg: 'bg-red-600 text-white', icon: '🚨', title: '今すぐ動物病院へ電話を' },
  urgent: { bg: 'bg-orange-500 text-white', icon: '⚠️', title: '本日中に受診を' },
  watchful: { bg: 'bg-yellow-400 text-yellow-900', icon: '👀', title: '24時間様子を見て変化があれば受診を' },
  monitor: { bg: 'bg-green-500 text-white', icon: '✅', title: '様子観察' },
};

export default function CheckerResult({ result, animalType, onReset }: Props) {
  const config = URGENCY_CONFIG[result.urgencyLevel];

  return (
    <div className="space-y-6">
      {/* 緊急度バッジ */}
      <div className={`rounded-xl px-5 py-5 text-center space-y-1 ${config.bg}`}>
        <p className="text-3xl">{config.icon}</p>
        <p className="text-xl font-bold">{config.title}</p>
      </div>

      {/* 判定理由 */}
      {result.urgencyReasons.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-slate-800 text-sm">判定の根拠</p>
          <ul className="space-y-1">
            {result.urgencyReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-slate-400 mt-0.5">•</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 獣医師への伝え方 */}
      <div className="bg-blue-50 rounded-xl p-4 space-y-2">
        <p className="font-semibold text-blue-900 text-sm">獣医師に伝える情報</p>
        <p className="text-sm text-blue-800">{result.vetCommunicationGuide}</p>
      </div>

      {/* 観察ポイント */}
      {result.watchPoints.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-slate-800 text-sm">注意して見るポイント</p>
          <ul className="space-y-1">
            {result.watchPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-slate-400 mt-0.5">•</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 持参物 */}
      <div className="space-y-2">
        <p className="font-semibold text-slate-800 text-sm">持参するもの</p>
        <ul className="space-y-1">
          {result.bringToVet.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-slate-400 mt-0.5">•</span>{item}
            </li>
          ))}
        </ul>
      </div>

      {/* 免責 */}
      <p className="text-xs text-slate-400">{result.disclaimer}</p>

      {/* アクション */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          もう一度チェック
        </button>
        <a
          href={`/petask/${animalType}s`}
          className="flex-1 text-center bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {animalType === 'dog' ? '犬' : '猫'}の症状一覧に戻る
        </a>
      </div>
    </div>
  );
}
