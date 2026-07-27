import type { ReviewStatus } from '@/lib/petask/types';

const CONFIG: Record<ReviewStatus, { label: string; className: string }> = {
  ai_generated: { label: 'AI生成（未公開）', className: 'bg-gray-100 text-gray-500' },
  pending_review: { label: '監修待ち', className: 'bg-yellow-100 text-yellow-700' },
  supervisor_reviewed: { label: '獣医師監修済み', className: 'bg-green-100 text-green-700' },
  published: { label: '公開済み', className: 'bg-blue-100 text-blue-700' },
};

export default function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}
