'use client';

import React from 'react';
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
      <ProblemList />
    </div>
  );
}
