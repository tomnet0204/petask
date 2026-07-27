import type { Metadata } from 'next';
import Link from 'next/link';
import { CAT_SYMPTOMS } from '@/data/symptoms';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '猫の症状一覧',
  description: '猫の嘔吐・食欲不振・排尿異常など10症状の緊急度と受診タイミングをまとめました。',
};

const LEVEL_CONFIG = {
  high: { label: '緊急', className: 'bg-red-100 text-red-700' },
  medium: { label: '要注意', className: 'bg-yellow-100 text-yellow-700' },
  low: { label: '様子観察', className: 'bg-green-100 text-green-700' },
};

export default function CatsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '猫の症状一覧' },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">猫の症状一覧</h1>
        <p className="text-slate-500 mt-1 text-sm">症状を選ぶと、緊急度と受診準備の方法を確認できます</p>
      </div>

      <div className="grid gap-3">
        {CAT_SYMPTOMS.map((symptom) => {
          const level = LEVEL_CONFIG[symptom.emergencyLevel];
          return (
            <Link
              key={symptom.slug}
              href={`/petask/symptoms/cat/${symptom.slug}`}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐱</span>
                <span className="font-medium text-slate-800 group-hover:text-blue-700">
                  猫の{symptom.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${level.className}`}>
                  {level.label}
                </span>
                <span className="text-slate-400">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
