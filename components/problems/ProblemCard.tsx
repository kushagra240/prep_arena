import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { SubjectBadge } from '../shared/SubjectBadge';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { XPCounter } from '../shared/XPCounter';
import { Problem, Subject, Chapter } from '@/lib/supabase/types';
import { CheckCircle2, CircleDot, FileText, ClipboardList } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  index: number;
  status: 'solved' | 'attempted' | 'unsolved';
  subject?: Subject;
  chapter?: Chapter;
}

export const ProblemCard = memo(function ProblemCard({ problem, index, status, subject, chapter }: ProblemCardProps) {

  // Calculate mock acceptance rate
  const acceptance = problem.total_attempts > 0 
    ? Math.round((problem.total_correct / problem.total_attempts) * 100)
    : 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, scale: 1.006 }}
      whileTap={{ scale: 0.994 }}
      className="glass-panel-hover hover-sheen flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-borderColor bg-bgSecondary/40 p-4 sm:p-5 gap-4 transition-all duration-300"
    >
      {/* Title + Index + Status */}
      <div className="flex items-start gap-3">
        <span className="mt-1 shrink-0">
          {status === 'solved' ? (
            <CheckCircle2 className="h-5 w-5 text-correct fill-correct/10 animate-scale-in" />
          ) : status === 'attempted' ? (
            <CircleDot className="h-5 w-5 text-amberGold animate-pulse-glow" />
          ) : (
            <span className="block h-5 w-5 rounded-full border border-borderColor bg-bgPrimary transition-colors hover:border-primary/50"></span>
          )}
        </span>
        
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-textMuted font-bold">#{index}</span>
            <Link 
              href={`/problems/${problem.slug}`}
              className="font-space text-sm font-bold text-white hover:text-primary transition-colors"
            >
              {problem.title}
            </Link>

            {problem.is_board_question && problem.icse_year && (
              <span className="inline-flex items-center rounded-md bg-amberGold/15 border border-amberGold/40 px-2 py-0.5 text-[9px] font-bold font-space text-amberGold uppercase tracking-widest animate-pulse-glow">
                ICSE Board {problem.icse_year}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-space text-xs text-textSecondary">{chapter?.name || 'Syllabus Chapter'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-borderColor"></span>
            <span className="font-space text-xs text-textMuted flex items-center gap-1">
              {problem.problem_type === 'mcq' ? (
                <>
                  <ClipboardList size={12} className="text-primary" />
                  <span>MCQ</span>
                </>
              ) : (
                <>
                  <FileText size={12} className="text-amberGold" />
                  <span>Brief Essay</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Badges + Metrics + XP */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3.5 border-t border-borderColor/40 pt-3 sm:border-0 sm:pt-0">
        {/* Subject tag */}
        <SubjectBadge subjectId={problem.subject_id} />

        {/* Difficulty */}
        <DifficultyBadge difficulty={problem.difficulty} />

        {/* Acceptance rate */}
        <div className="flex flex-col items-end hidden lg:flex font-space min-w-[70px]">
          <span className="text-[11px] font-bold text-white">{acceptance}%</span>
          <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider">Acceptance</span>
        </div>

        {/* XP counter */}
        <XPCounter xp={problem.xp_reward} size="sm" />
      </div>
    </motion.div>
  );
}
