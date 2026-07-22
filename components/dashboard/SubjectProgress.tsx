'use client';

import React from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function SubjectProgress() {
  const subjects = usePrepArenaStore((state) => state.subjects);
  const problems = usePrepArenaStore((state) => state.problems);
  const submissions = usePrepArenaStore((state) => state.submissions);

  return (
    <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 shadow-glow space-y-4">
      <div className="flex items-center gap-2 border-b border-borderColor pb-3">
        <BookOpen size={16} className="text-primary" />
        <h3 className="font-space font-bold text-white text-sm">Syllabus Breakdown</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {subjects.map((sub) => {
          // Count subject problems
          const subProblems = problems.filter(p => p.subject_id === sub.id);
          const totalCount = subProblems.length || 3; // fallback if no problems yet
          
          // Count attempted problems in this subject
          const attemptedProblems = subProblems.filter(p => 
            submissions.some(s => s.problem_id === p.id)
          );
          const attemptedCount = attemptedProblems.length;

          // Solve count
          const solvedSubProblems = subProblems.filter(p => 
            submissions.some(s => s.problem_id === p.id && s.is_correct)
          );
          const solvedCount = solvedSubProblems.length;

          // Progress calculation: attempted vs total problems
          const progressPercentage = Math.min(100, Math.round((attemptedCount / totalCount) * 100)) || 0;

          // SVG settings
          const radius = 24;
          const strokeWidth = 3;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

          return (
            <Link 
              key={sub.id} 
              href={`/subjects/${sub.slug}`}
              className="group p-4 rounded-2xl border border-borderColor/50 bg-bgPrimary/30 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-primary hover:bg-bgTertiary/30 hover:scale-[1.03] select-none cursor-pointer space-y-3"
            >
              {/* Circular Progress Ring */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 56 56">
                  {/* Background Track */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className="stroke-bgTertiary/40"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Foreground Progress */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke={sub.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 4px ${sub.color}aa)`
                    }}
                  />
                </svg>
                {/* Subject Icon in middle */}
                <span className="text-xl relative z-10 transition-transform group-hover:scale-110">{sub.icon}</span>
              </div>
              
              <div className="space-y-0.5 min-w-0 w-full">
                <span className="font-space text-[10px] font-black text-white block uppercase tracking-wide truncate">
                  {sub.name}
                </span>
                <span className="font-space text-[9px] text-textMuted uppercase font-bold block">
                  {attemptedCount} / {totalCount} Practice
                </span>
                <span className="font-space text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-bgSecondary border border-borderColor/40 inline-block text-textSecondary group-hover:text-primary transition-colors">
                  {progressPercentage}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
