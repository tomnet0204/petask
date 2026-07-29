interface Props {
  urgency?: 'emergency' | 'urgent' | 'watchful' | 'monitor';
}

export default function DisclaimerBanner({ urgency }: Props) {
  const isEmergency = urgency === 'emergency' || urgency === 'urgent';

  if (isEmergency) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-sm text-red-800">
        <p className="font-bold mb-1">🚨 緊急の可能性があります</p>
        <p>
          この質問には緊急性の高い症状が含まれている可能性があります。
          <strong>今すぐ動物病院に連絡してください。</strong>
          このサイトの回答は受診の代替にはなりません。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
      <p className="font-semibold mb-1">⚠️ ご注意</p>
      <p>
        このサイトの情報は動物病院の受診を支援するための参考情報であり、
        診断・治療の代替ではありません。ペットの症状が心配な場合は必ず獣医師にご相談ください。
      </p>
    </div>
  );
}
