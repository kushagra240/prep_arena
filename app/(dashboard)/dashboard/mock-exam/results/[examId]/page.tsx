'use client';

import React, { useEffect, useState } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { clientDb } from '@/lib/supabase/client';
import { Problem } from '@/lib/supabase/types';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { AIExplanationPanel } from '@/components/problems/AIExplanationPanel';
import { 
  Trophy, Calendar, Clock, CheckCircle2, XCircle, ChevronDown, 
  ChevronUp, ArrowRight, RotateCcw, Share2, Sparkles, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GradedExam {
  id: string;
  user_id: string;
  subject_id: string;
  config: {
    duration: number;
    difficulty: string;
    questionMix: string;
    count: number;
  };
  questions: string[];
  answers: Record<string, {
    answer?: string;
    optionId?: string;
    score: number;
    is_correct: boolean;
  }>;
  total_marks: number;
  scored_marks: number;
  percentage: number;
  time_taken_seconds: number;
  completed_at: string;
}

export default function MockExamResultsPage({ params }: { params: { examId: string } }) {
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const profile = usePrepArenaStore((state) => state.profile);

  const [exam, setExam] = useState<GradedExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  useEffect(() => {
    // Load mock exam from local clientDb
    const allExams = clientDb.getMockExams();
    const currentExam = allExams.find(e => e.id === params.examId);
    
    if (currentExam) {
      setExam(currentExam);
    }
    setLoading(false);
  }, [params.examId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="h-8 w-8 text-primary animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-xs font-space text-textSecondary uppercase tracking-widest">Loading exam transcript...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-wrong/10 border border-wrong/20 flex items-center justify-center text-wrong">
          <AlertCircle size={24} />
        </div>
        <h3 className="font-space text-lg font-black text-white uppercase">Exam Session Not Found</h3>
        <p className="font-space text-xs text-textSecondary leading-relaxed">
          The requested mock exam session does not exist in local storage or has been cleared.
        </p>
        <Link
          href="/dashboard/mock-exam"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover px-5 py-2.5 font-space text-xs font-bold transition-all"
        >
          <span>Start New Mock Exam</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // CISCE Scholastic Grading Schema mapping
  const getIcseGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A1', label: 'Outstanding', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (pct >= 80) return { grade: 'A2', label: 'Excellent', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' };
    if (pct >= 70) return { grade: 'B1', label: 'Very Good', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (pct >= 60) return { grade: 'B2', label: 'Good', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (pct >= 50) return { grade: 'C1', label: 'Fair', color: 'text-amberGold bg-amberGold/10 border-amberGold/30' };
    if (pct >= 40) return { grade: 'C2', label: 'Pass', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    if (pct >= 30) return { grade: 'D', label: 'Needs Improvement', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    return { grade: 'E', label: 'Ungraded', color: 'text-red-500 bg-red-500/10 border-red-500/30' };
  };

  const grading = getIcseGrade(exam.percentage);

  // Time formatter
  const formatTimeTaken = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleShareScore = () => {
    const subjectName = exam.subject_id === 'all' 
      ? 'General Syllabus Test' 
      : subjects.find(s => s.id === exam.subject_id)?.name || 'ICSE Prep';

    const textToCopy = `🏆 PrepArena timed mock exam result 🏆\n` +
      `Subject: ${subjectName}\n` +
      `Score: ${exam.scored_marks} / ${exam.total_marks} Marks (${exam.percentage}%)\n` +
      `Grade: ${grading.grade} - ${grading.label}\n` +
      `Time Taken: ${formatTimeTaken(exam.time_taken_seconds)}\n` +
      `Practice Class 10 ICSE Boards at PrepArena! 🚀`;

    navigator.clipboard.writeText(textToCopy);
    toast.success('Score card copied to clipboard!');
  };

  const toggleExpandProblem = (problemId: string) => {
    if (expandedProblemId === problemId) {
      setExpandedProblemId(null);
    } else {
      setExpandedProblemId(problemId);
    }
  };

  // Find weak chapters (wrong answers) to pass to filters
  const wrongProblemIds = Object.keys(exam.answers).filter(pid => !exam.answers[pid].is_correct);
  const weakChapters = problems
    .filter(p => wrongProblemIds.includes(p.id))
    .map(p => p.chapter_id);
  const weakChaptersQuery = Array.from(new Set(weakChapters)).join(',');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider font-space">
            <Trophy size={14} className="text-amberGold animate-pulse" />
            <span>Official CISCE Simulated Grading sheet</span>
          </div>
          <h2 className="font-space text-2xl font-black text-white leading-tight uppercase">
            Exam Results Report
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShareScore}
            className="flex items-center gap-1.5 rounded-xl border border-borderColor bg-bgSecondary/40 hover:bg-bgSecondary px-4 py-2.5 font-space text-xs font-bold text-white transition-colors"
          >
            <Share2 size={14} />
            <span>Share Score</span>
          </button>

          <Link
            href="/dashboard/mock-exam"
            className="flex items-center gap-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover px-4 py-2.5 font-space text-xs font-bold transition-all shadow-glow hover:-translate-y-0.5"
          >
            <RotateCcw size={14} />
            <span>Try Another</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Score Card */}
      <div className="relative overflow-hidden rounded-3xl border border-borderColor bg-gradient-to-r from-bgSecondary to-bgTertiary/40 p-6 md:p-8 shadow-glow space-y-6">
        
        {/* Glow rings */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl -z-10 animate-pulse"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Score ring or huge display */}
          <div className="space-y-1 text-center md:text-left">
            <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Total Marks</span>
            <h3 className="font-space text-3xl font-black text-white">
              <span className="text-amberGold">{exam.scored_marks}</span>
              <span className="text-textMuted text-base"> / {exam.total_marks}</span>
            </h3>
          </div>

          {/* Percentage */}
          <div className="space-y-1 text-center md:text-left">
            <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Percentage</span>
            <h3 className="font-space text-3xl font-black text-white">{exam.percentage}%</h3>
          </div>

          {/* Time taken */}
          <div className="space-y-1 text-center md:text-left">
            <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Time Taken</span>
            <h3 className="font-space text-2xl font-black text-white">{formatTimeTaken(exam.time_taken_seconds)}</h3>
          </div>

          {/* Grade Badge */}
          <div className="flex flex-col items-center md:items-end justify-center">
            <span className="font-space text-[10px] text-textMuted uppercase font-bold tracking-wider mb-1 block">Scholastic Grade</span>
            <div className={`rounded-2xl border px-5 py-2 text-center ${grading.color}`}>
              <span className="block font-space text-xl font-black">{grading.grade}</span>
              <span className="block font-space text-[8px] uppercase tracking-wider font-bold">{grading.label}</span>
            </div>
          </div>
        </div>

        {/* Student metadata */}
        <div className="border-t border-borderColor/40 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-space">
          <div>
            <span className="block text-[9px] text-textMuted uppercase font-bold">Candidate</span>
            <span className="block font-bold text-white truncate">{profile.full_name || 'Anonymous Student'}</span>
          </div>
          <div>
            <span className="block text-[9px] text-textMuted uppercase font-bold">Institution Affiliation</span>
            <span className="block font-bold text-white truncate">{profile.school || 'ICSE Scholar'}</span>
          </div>
          <div>
            <span className="block text-[9px] text-textMuted uppercase font-bold">Subject Module</span>
            <span className="block font-bold text-white truncate uppercase">
              {exam.subject_id === 'all' ? 'All Subjects' : subjects.find(s => s.id === exam.subject_id)?.name}
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-textMuted uppercase font-bold">Completed Date</span>
            <span className="block font-bold text-white">
              {new Date(exam.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

      </div>

      {/* Detailed Question Review Logs */}
      <div className="space-y-4">
        <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">
          Detailed Question Sheet Review
        </h3>

        <div className="space-y-3">
          {exam.questions.map((probId, index) => {
            const prob = problems.find(p => p.id === probId);
            const ansDetails = exam.answers[probId] || { score: 0, is_correct: false };
            const isExpanded = expandedProblemId === probId;

            if (!prob) return null;

            return (
              <div 
                key={probId}
                className={`rounded-2xl border transition-all duration-300 bg-bgSecondary/20 ${
                  isExpanded ? 'border-borderColor bg-bgSecondary/40' : 'border-borderColor/60 hover:border-borderColor'
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => toggleExpandProblem(probId)}
                  className="w-full flex items-center justify-between p-4 font-space text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                      ansDetails.is_correct 
                        ? 'bg-correct/10 text-correct border border-correct/30' 
                        : 'bg-wrong/10 text-wrong border border-wrong/30'
                    }`}>
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <span className="block font-bold text-white truncate text-xs sm:text-sm">
                        {prob.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 scale-90 origin-left">
                        <SubjectBadge subjectId={prob.subject_id} />
                        <DifficultyBadge difficulty={prob.difficulty} />
                        <span className="text-[10px] text-textMuted uppercase">
                          {prob.problem_type === 'mcq' ? 'MCQ Choice' : 'Descriptive Brief'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold text-white">
                      {ansDetails.score} / {prob.marks} M
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-textMuted" /> : <ChevronDown size={16} className="text-textMuted" />}
                  </div>
                </button>

                {/* Expanded review workspace */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-borderColor/40 space-y-6">
                    {/* Prompt */}
                    <div className="space-y-1.5 bg-bgPrimary/30 rounded-xl p-4 border border-borderColor/30">
                      <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider">Question Context</span>
                      <p className="font-lora text-xs sm:text-sm text-textSecondary leading-relaxed whitespace-pre-wrap">
                        {prob.question_text}
                      </p>
                    </div>

                    {/* Compare Answers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Student submitted */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                        ansDetails.is_correct 
                          ? 'border-correct/20 bg-correct/5 text-correct' 
                          : 'border-wrong/20 bg-wrong/5 text-wrong'
                      }`}>
                        <div className="space-y-2">
                          <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider">Your Answered Sheet</span>
                          {prob.problem_type === 'mcq' ? (
                            <div className="text-xs font-space font-bold">
                              Option {ansDetails.optionId || 'None Selected'} — {prob.mcq_options?.find(o => o.id === ansDetails.optionId)?.text || 'No Answer Submit'}
                            </div>
                          ) : (
                            <p className="font-lora text-xs leading-relaxed whitespace-pre-wrap break-words text-white">
                              {ansDetails.answer || 'Empty Sheet Submitted.'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Correct marking model */}
                      <div className="p-4 rounded-xl border border-borderColor/60 bg-bgPrimary/20 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="block text-[9px] text-textMuted uppercase font-bold tracking-wider">Marking Scheme / Model Answer</span>
                          {prob.problem_type === 'mcq' ? (
                            <div className="text-xs font-space font-bold text-correct">
                              Option {prob.mcq_options?.find(o => o.isCorrect)?.id} — {prob.mcq_options?.find(o => o.isCorrect)?.text}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="font-lora text-xs leading-relaxed text-textSecondary">
                                {prob.expected_answer}
                              </p>
                              <div className="flex flex-wrap gap-1.5 pt-1.5">
                                {prob.answer_keywords?.map(kw => (
                                  <span key={kw} className="text-[9px] font-space font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI explanation streaming block */}
                    <AIExplanationPanel problem={prob} isActive={isExpanded} />

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Review actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-borderColor/40">
        {weakChaptersQuery && (
          <Link
            href={`/problems?chapters=${weakChaptersQuery}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-amberGold hover:bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] py-4 font-space font-black text-xs text-bgPrimary uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Practice Weak Areas</span>
            <Sparkles size={14} className="fill-bgPrimary text-bgPrimary" />
          </Link>
        )}

        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-borderColor bg-bgSecondary/40 hover:bg-bgSecondary py-4 font-space font-bold text-xs text-white uppercase tracking-wider transition-all"
        >
          <span>Back to Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
