import type { Metadata } from 'next';
import Breadcrumb from '@/components/petask/Breadcrumb';

export const metadata: Metadata = {
  title: '免責事項',
  description: 'PetAskの免責事項。本サービスは診断・治療の代替ではありません。',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '免責事項' },
      ]} />

      <h1 className="text-2xl font-bold text-slate-900">免責事項</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">医療行為の代替ではありません</h2>
          <p>
            PetAskが提供する情報は、動物病院の受診を支援するための参考情報です。
            本サービスは獣医師による診断・治療の代替を目的としておらず、
            ペットの具体的な病名の診断や治療法の提案は行いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">情報の正確性について</h2>
          <p>
            掲載情報は獣医師の監修を受けていますが、ペットの状態は個体差や環境によって異なります。
            本サービスの情報を参照した結果について、当サービスは責任を負いかねます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">緊急時の対応</h2>
          <p>
            ペットの状態が急変した場合や生命に関わる症状が見られる場合は、
            直ちにかかりつけの動物病院または夜間救急動物病院にご連絡ください。
            本サービスへの問い合わせは緊急対応には対応しておりません。
          </p>
        </section>
      </div>
    </div>
  );
}
