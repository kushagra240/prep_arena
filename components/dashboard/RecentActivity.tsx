'use client';

import React from 'react';
import Link from 'next/link';
import { usePrepArenaStore } from '@/lib/store';
import { CheckCircle2, XCircle, ArrowRight, Clock } from 'lucide-react';

export function RecentActivity() {
  const submissions = usePrepArenaStore((state) => state.submissions);
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);

  // Sort by submitted_at descending, take 5
  const recent = [...submissions]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5);

  const getRelativeTime = (isoString: string) => {
    try {
      const past = new Date(isoString).getTime();
      const now = Date.now();
      const diffMs = now - past;
      
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 shadow-glow space-y-4">
      <div className="flex items-center gap-2 border-b border-borderColor pb-3">
        <Clock size={16} className="text-primary" />
        <h3 className="font-space font-bold text-white text-sm">Recent Activity</h3>
      </div>

      {recent.length > 0 ? (
        <div className="space-y-1">
          {recent.map((sub) => {
            const problem = problems.find(p => p.id === sub.problem_id);
            const subject = subjects.find(s => s.id === problem?.subject_id);

            if (!problem) return null;

            return (
              <Link 
                key={sub.id}
                href={`/problems/${problem.slug}`}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-transparent hover:border-borderColor hover:bg-bgPrimary/30 transition-all duration-200 gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">
                    {sub.is_correct ? (
                      <CheckCircle2 size={16} className="text-correct animate-pulse-glow" />
                    ) : (
                      <XCircle size={16} className="text-wrong" />
                    )}
                  </span>
                  
                  <div className="min-w-0">
                    <span className="block font-space text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                      {problem.title}
                    </span>
                    <div className="flex items-center gap-1.5 font-space text-[10px] text-textMuted uppercase mt-0.5">
                      <span style={{ color: subject?.color }}>{subject?.name}</span>
                      <span>•</span>
                      <span>{getRelativeTime(sub.submitted_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-space text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                    sub.is_correct ? 'bg-correct/10 text-correct' : 'bg-wrong/10 text-wrong'
                  }`}>
                    {sub.xp_earned > 0 ? `+${sub.xp_earned} XP` : '0 XP'}
                  </span>
                  <span className="p-1 rounded-lg bg-bgPrimary text-textMuted group-hover:text-white group-hover:bg-primary/20 transition-all duration-200">
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-8 text-center font-space text-xs text-textMuted">
          No answers submitted yet. Pick a subject below to begin practicing!
        </div>
      )}
    </div>
  );
}
