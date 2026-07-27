export default function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <span className="text-xl">🚨</span>
        <div>
          <p className="font-bold text-sm">ペットの状態が急変した場合はすぐに動物病院へ</p>
          <p className="text-xs text-red-100 mt-0.5">
            意識がない・呼吸が苦しそう・おしっこが全く出ない → 今すぐ電話してください
          </p>
        </div>
      </div>
    </div>
  );
}
