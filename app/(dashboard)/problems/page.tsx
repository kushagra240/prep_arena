import React, { Suspense } from 'react';
import { ProblemList } from '@/components/problems/ProblemList';
import { Sparkles } from 'lucide-react';

export default function ProblemsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider font-space">
          <Sparkles size={14} className="animate-pulse" />
          <span>ICSE Class 10 Board Practice</span>
        </div>
        <h2 className="font-space text-2xl font-black text-white leading-tight">
          Select Your Challenge
        </h2>
        <p className="font-space text-xs text-textSecondary max-w-xl leading-relaxed">
          Filter through 10 official subjects and chapters to find past board exam questions or target weak topics. Track solved statuses in real-time.
        </p>
      </div>

      {/* Embedded Filters and Table Grid */}
      <Suspense fallback={
        <div className="space-y-4">
          <div className="h-12 w-full rounded-xl bg-bgSecondary/60 animate-shimmer border border-borderColor/50" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 w-full rounded-xl bg-bgSecondary/40 animate-shimmer border border-borderColor/40" />
            ))}
          </div>
        </div>
      }>
        <ProblemList />
      </Suspense>
    </div>
  );
}
