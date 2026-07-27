interface SupervisorCardProps {
  name: string;
  credential: string;
  reviewedAt?: string;
}

export default function SupervisorCard({ name, credential, reviewedAt }: SupervisorCardProps) {
  return (
    <div className="flex items-start gap-3 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-sm">
      <div className="mt-0.5 text-2xl">🩺</div>
      <div>
        <p className="font-semibold text-slate-800">{name}</p>
        <p className="text-slate-500 text-xs">{credential}</p>
        {reviewedAt && (
          <p className="text-slate-400 text-xs mt-1">監修日: {reviewedAt}</p>
        )}
      </div>
    </div>
  );
}
