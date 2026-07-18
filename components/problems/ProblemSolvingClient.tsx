'use client';

import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { MCQSolver } from '@/components/problems/MCQSolver';
import { BriefWritingSolver } from '@/components/problems/BriefWritingSolver';
import { AIExplanationPanel } from '@/components/problems/AIExplanationPanel';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { ArrowLeft, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';

export function ProblemSolvingClient({ slug }: { slug: string }) {
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const submissions = usePrepArenaStore((state) => state.submissions);

  const problem = problems.find(p => p.slug === slug);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  // Hydration state check
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Reveal explanation automatically if solved or attempted
  useEffect(() => {
    if (problem) {
      const isAlreadySolved = submissions.some(s => s.problem_id === problem.id && s.is_correct);
      if (isAlreadySolved) {
        setShowExplanation(true);
      } else {
        setShowExplanation(false);
      }
    }
  }, [problem, submissions]);

  if (!isClientReady) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="font-space text-xs text-textSecondary uppercase tracking-widest">Constructing Workspace...</p>
      </div>
    );
  }

  if (!problem) {
    return notFound();
  }

  const subject = subjects.find(s => s.id === problem.subject_id);
  const chapter = chapters.find(c => c.id === problem.chapter_id);

  return (
    <div className="space-y-6">
      {/* Back link & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link 
          href="/problems" 
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-borderColor bg-bgSecondary/85 text-textSecondary hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={16} />
        </Link>
        
        <div className="flex flex-wrap items-center gap-1.5 font-space text-[11px] text-textMuted uppercase tracking-wider font-bold">
          <Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link>
          <span>/</span>
          <Link href={`/subjects/${subject?.slug || ''}`} className="hover:text-primary transition-colors">{subject?.name || 'Subject'}</Link>
          <span>/</span>
          <span className="text-textSecondary truncate max-w-[120px] sm:max-w-[200px]">{chapter?.name || 'Chapter'}</span>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Problem details */}
        <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 md:p-8 space-y-6 shadow-glow">
          
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            
            <span className="inline-flex items-center rounded bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold font-space text-primary uppercase">
              {problem.problem_type === 'mcq' ? 'MCQ' : 'Brief Answer'}
            </span>

            <span className="inline-flex items-center rounded bg-bgPrimary border border-borderColor px-2.5 py-0.5 text-[10px] font-bold font-space text-textSecondary">
              Marks: {problem.marks}
            </span>

            {problem.is_board_question && problem.icse_year && (
              <span className="inline-flex items-center rounded bg-amberGold/15 border border-amberGold/30 px-2.5 py-0.5 text-[10px] font-black font-space text-amberGold uppercase tracking-widest animate-pulse-glow">
                ICSE {problem.icse_year}
              </span>
            )}

            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/problems/${problem.slug}`;
                navigator.clipboard.writeText(shareUrl);
                toast.success('Problem link copied to clipboard!');
              }}
              className="inline-flex items-center gap-1 hover:text-white rounded bg-bgPrimary border border-borderColor hover:border-primary/80 px-2.5 py-0.5 text-[10px] font-bold font-space text-textSecondary transition-all cursor-pointer"
            >
              <Share2 size={11} />
              Share
            </button>
          </div>

          {/* Problem Title */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-textMuted uppercase">Problem Sheet</span>
            <h2 className="font-space text-lg md:text-xl font-black text-white leading-tight uppercase">
              {problem.title}
            </h2>
          </div>

          {/* Core Question text (Lora Serif for premium academic touch) */}
          <div className="border-t border-borderColor/40 pt-4 text-xs sm:text-sm md:text-base text-textSecondary font-lora leading-relaxed whitespace-pre-wrap selection:bg-primary/20 select-text">
            {problem.question_text}
          </div>

          {/* Related Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="border-t border-borderColor/40 pt-4 space-y-2">
              <span className="block font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Concept Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map(t => (
                  <span 
                    key={t}
                    className="inline-flex items-center rounded bg-bgTertiary/30 border border-borderColor/40 px-2 py-0.5 text-[9px] font-space text-textMuted font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenge a Friend Box */}
          {submissions.some(s => s.problem_id === problem.id && s.is_correct) && (
            <div className="border-t border-borderColor/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 p-4 rounded-xl border border-primary/20 animate-fade-in">
              <div className="space-y-0.5 text-left">
                <span className="block font-space text-[10px] font-extrabold text-primary uppercase tracking-wider">Problem Mastered</span>
                <span className="block font-space text-[11px] text-textSecondary">Challenge your classmates to solve this question!</span>
              </div>
              <button
                onClick={() => {
                  const text = `🎯 I just solved "${problem.title}" (${problem.difficulty} level) on PrepArena! Can you solve it too? Try here: ${window.location.origin}/problems/${problem.slug}`;
                  navigator.clipboard.writeText(text);
                  toast.success('Challenge text copied! Share it with friends.');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-space text-xs font-bold transition-all cursor-pointer"
              >
                Challenge Friend 🎯
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Solvers */}
        <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 md:p-8 shadow-glow">
          {problem.problem_type === 'mcq' ? (
            <MCQSolver 
              problem={problem} 
              onSolved={() => setShowExplanation(true)} 
            />
          ) : (
            <BriefWritingSolver 
              problem={problem} 
              onSolved={() => setShowExplanation(true)} 
            />
          )}
        </div>

      </div>

      {/* Expanded Accordion: streaming AI Explanation */}
      {showExplanation && (
        <div className="pt-2 animate-fade-in">
          <AIExplanationPanel 
            problem={problem} 
            isActive={showExplanation} 
          />
        </div>
      )}

    </div>
  );
}
