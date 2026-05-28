'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="message-ai px-4 py-4">
        {/* Avatar + label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-900">F</span>
          </div>
          <span className="text-xs font-medium text-amber-400">FinOrchestra is analyzing...</span>
        </div>

        {/* Skeleton lines */}
        <div className="space-y-2">
          <SkeletonLine width="82%" delay={0} />
          <SkeletonLine width="64%" delay={150} />
          <SkeletonLine width="48%" delay={280} />
        </div>
      </div>
    </div>
  );
}

function SkeletonLine({ width, delay }: { width: string; delay: number }) {
  return (
    <div
      className="h-3 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
      style={{
        width,
        animation: `skeleton-pulse 1.6s ease-in-out infinite`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
