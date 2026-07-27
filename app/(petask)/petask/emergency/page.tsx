import type { Metadata } from 'next';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '緊急症状一覧 — 今すぐ動物病院へ',
  description: '犬・猫で今すぐ動物病院に連絡すべき緊急症状の一覧。意識消失・呼吸困難・尿閉など。',
};

const EMERGENCY_SIGNS = [
  { icon: '😵', title: '意識がない・反応がない', desc: '呼びかけに反応しない、ぐったりして動かない' },
  { icon: '💨', title: '呼吸が著しく苦しそう', desc: '口を開けて息をしている、お腹を大きく動かして呼吸している' },
  { icon: '🚽', title: 'おしっこが全く出ない', desc: '特に猫の雄は尿閉で数時間で命に関わる。何度もトイレに行くが出ない場合も緊急' },
  { icon: '🤢', title: '何度も嘔吐・止まらない', desc: '1時間に3回以上の嘔吐、血が混じる嘔吐' },
  { icon: '🩸', title: '大量出血・血便', desc: '真っ赤な血便、大量の鮮血、血を吐く' },
  { icon: '⚡', title: 'けいれん・発作', desc: '全身がガクガク震える、泡を吹く、意識を失う' },
  { icon: '☠️', title: '毒物・異物の誤飲', desc: 'チョコレート・ブドウ・玉ねぎ・薬・電池・針など' },
  { icon: '🌡️', title: '熱中症（ぐったり・よだれ多量）', desc: '夏の車内放置後や散歩後にぐったりしている' },
];

export default function EmergencyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '緊急症状一覧' },
      ]} />

      <div className="bg-red-600 text-white rounded-xl p-6 text-center space-y-2">
        <p className="text-2xl font-bold">🚨 下記に当てはまる場合は今すぐ電話を</p>
        <p className="text-red-100">かかりつけの動物病院、または夜間救急動物病院に連絡してください</p>
      </div>

      <div className="grid gap-4">
        {EMERGENCY_SIGNS.map(({ icon, title, desc }) => (
          <div key={title} className="flex gap-4 p-4 border-2 border-red-200 rounded-xl bg-red-50">
            <span className="text-3xl mt-0.5">{icon}</span>
            <div>
              <p className="font-bold text-red-800">{title}</p>
              <p className="text-red-600 text-sm mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600 space-y-2">
        <p className="font-semibold text-slate-800">救急受診の前に電話で確認を</p>
        <p>夜間救急病院は処置できる症状が限られる場合があります。電話で症状を伝えてから向かうとスムーズです。</p>
      </div>
    </div>
  );
}
