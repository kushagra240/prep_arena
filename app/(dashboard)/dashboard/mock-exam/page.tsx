'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { Problem } from '@/lib/supabase/types';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { completeOnboarding } from '@/app/actions/onboarding';
import { saveMockExamResult } from '@/app/actions/mock-exam';
import { 
  Award, Flame, Sparkles, Timer, FileText, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, RotateCcw, Flag, Check, Trash2, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkKeywordMatch } from '@/lib/utils/keyword-matcher';
import { clientDb } from '@/lib/supabase/client';

export default function MockExamPage() {
  const router = useRouter();
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const profile = usePrepArenaStore((state) => state.profile);

  // States
  const [examRunning, setExamRunning] = useState(false);
  
  // Configuration States
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(30); // 30 mins
  const [questionMix, setQuestionMix] = useState<'all' | 'mcq' | 'brief'>('all');
  const [difficulty, setDifficulty] = useState<'balanced' | 'easy' | 'hard'>('balanced');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Run States
  const [activeProblems, setActiveProblems] = useState<Problem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds
  const [answers, setAnswers] = useState<Record<string, { optionId?: string; text?: string }>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warnedAboutOneMinute = useRef<boolean>(false);

  // Filter chapters whenever subject changes
  const subjectChapters = chapters.filter(c => selectedSubject === 'all' ? false : c.subject_id === selectedSubject);

  const handleSelectChapter = (chapterId: string) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(selectedChapters.filter(id => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const handleSelectAllChapters = () => {
    if (selectedChapters.length === subjectChapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(subjectChapters.map(c => c.id));
    }
  };

  // Start exam session
  const startExam = () => {
    let pool = problems;

    // 1. Subject filter
    if (selectedSubject !== 'all') {
      pool = pool.filter(p => p.subject_id === selectedSubject);
      
      // 2. Chapters filter
      if (selectedChapters.length > 0) {
        pool = pool.filter(p => selectedChapters.includes(p.chapter_id));
      }
    }

    // 3. Question mix filter
    if (questionMix === 'mcq') {
      pool = pool.filter(p => p.problem_type === 'mcq');
    } else if (questionMix === 'brief') {
      pool = pool.filter(p => p.problem_type === 'brief_writing');
    }

    // 4. Difficulty filter
    if (difficulty === 'easy') {
      pool = pool.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
    } else if (difficulty === 'hard') {
      pool = pool.filter(p => p.difficulty === 'hard' || p.difficulty === 'medium');
    }

    if (pool.length === 0) {
      toast.error('No questions found matching this configuration. Try general syllabus or different difficulty.');
      return;
    }

    // Shuffle and grab the count
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);

    setActiveProblems(selected);
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setTimeLeft(duration * 60);
    setExamRunning(true);
    warnedAboutOneMinute.current = false;

    // Timer trigger
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          triggerAutoSubmit();
          return 0;
        }

        // Warning at 1 minute remaining
        if (prev === 61 && !warnedAboutOneMinute.current) {
          toast.warning('Warning: 1 minute remaining! Your answers will be auto-submitted.', { duration: 5000 });
          warnedAboutOneMinute.current = true;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const triggerAutoSubmit = () => {
    toast.error('Time is up! Submitting your exam...');
    submitExamSheet(true);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleMCQSelect = (problemId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: { ...prev[problemId], optionId }
    }));
  };

  const handleTextAnswerChange = (problemId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: { ...prev[problemId], text }
    }));
  };

  const handleClearAnswer = (problemId: string) => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[problemId];
      return copy;
    });
    toast.info('Answer cleared.');
  };

  const toggleFlagged = (problemId: string) => {
    setFlagged(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const submitExamSheet = async (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirmSubmit(false);

    // Grade each answer
    const gradedAnswers: Record<string, { answer?: string; optionId?: string; score: number; is_correct: boolean; explanation?: string }> = {};
    let totalScored = 0;
    let totalMax = 0;

    const batchPayloads: {
      problemId: string;
      payload: {
        selectedOptionId?: string;
        answerText?: string;
        isCorrect: boolean;
        aiScore?: number;
        aiFeedback?: string;
        timeTakenSeconds: number;
      };
    }[] = [];

    activeProblems.forEach(prob => {
      const ans = answers[prob.id];
      let score = 0;
      let isCorrect = false;

      if (prob.problem_type === 'mcq') {
        const selectedOpt = prob.mcq_options?.find(o => o.id === ans?.optionId);
        isCorrect = selectedOpt ? selectedOpt.isCorrect : false;
        score = isCorrect ? prob.marks : 0;
      } else {
        // Descriptive keyword matching
        const studentText = ans?.text || '';
        const keywords = prob.answer_keywords || [];
        const found = keywords.filter(kw => checkKeywordMatch(kw, studentText));
        const keywordRatio = keywords.length > 0 ? found.length / keywords.length : 0.0;
        const lengthRatio = Math.min(studentText.split(/\s+/).length / (prob.min_words || 30), 1.0);
        
        let calculated = (keywordRatio * 0.7 + lengthRatio * 0.3) * prob.marks;
        score = Math.round(Math.max(0, Math.min(calculated, prob.marks)) * 2) / 2; // nearest half mark
        isCorrect = score >= prob.marks * 0.5;
      }

      totalScored += score;
      totalMax += prob.marks;

      gradedAnswers[prob.id] = {
        answer: ans?.text,
        optionId: ans?.optionId,
        score,
        is_correct: isCorrect
      };

      batchPayloads.push({
        problemId: prob.id,
        payload: {
          selectedOptionId: ans?.optionId,
          answerText: ans?.text,
          isCorrect,
          aiScore: prob.problem_type === 'brief_writing' ? score : undefined,
          timeTakenSeconds: Math.round((duration * 60 - timeLeft) / activeProblems.length)
        }
      });
    });

    // Add actual submissions history inside local storage using standard store method
    // (This updates user XP, streak details, unlocks achievements etc.)
    usePrepArenaStore.getState().submitAnswers(batchPayloads);

    const percentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;
    const timeTaken = duration * 60 - timeLeft;
    const examId = 'exam_' + Math.random().toString(36).substring(2, 11);

    const examData = {
      id: examId,
      user_id: profile.id,
      subject_id: selectedSubject,
      config: { duration, difficulty, questionMix, count: questionCount },
      questions: activeProblems.map(p => p.id),
      answers: gradedAnswers,
      total_marks: totalMax,
      scored_marks: totalScored,
      percentage,
      time_taken_seconds: timeTaken,
      completed_at: new Date().toISOString()
    };

    // Save locally
    clientDb.saveMockExam(examData);

    // Save to Supabase (Server Action call)
    await saveMockExamResult(examData);

    toast.success('Exam graded successfully!');
    setExamRunning(false);
    router.push(`/dashboard/mock-exam/results/${examId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = activeProblems.length - answeredCount;

  return (
    <div className="space-y-6">
      {/* 1. Exam Configuration Screen */}
      {!examRunning && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider font-space">
              <Timer size={14} className="animate-pulse" />
              <span>Simulated Testing Engine</span>
            </div>
            <h2 className="font-space text-2xl font-black text-white leading-tight uppercase">
              Timed Mock Board Exams
            </h2>
            <p className="font-space text-xs text-textSecondary max-w-xl leading-relaxed">
              Launch a simulated exam environment strictly matching ICSE board paper distributions and formats. Auto-grades descriptive essays instantly.
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-borderColor bg-bgSecondary/40 p-6 md:p-8 space-y-6 shadow-glow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Settings */}
              <div className="space-y-4">
                {/* Subject Selection */}
                <div className="space-y-1.5">
                  <label className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider">
                    Target Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedChapters([]);
                    }}
                    className="w-full rounded-xl border border-borderColor/80 bg-bgPrimary p-3 font-space text-xs text-white focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="all">All ICSE Subjects (General Test)</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.icon} {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider block">
                    Duration limit
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 30, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDuration(mins)}
                        className={`py-2 px-3 rounded-lg border font-space text-xs font-bold transition-all ${
                          duration === mins 
                            ? 'border-primary bg-primary/10 text-white shadow-glow' 
                            : 'border-borderColor bg-bgPrimary/40 text-textSecondary hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Mix */}
                <div className="space-y-1.5">
                  <label className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider block">
                    Question Format mix
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'Mixed' },
                      { id: 'mcq', label: 'MCQs' },
                      { id: 'brief', label: 'Brief' }
                    ].map((mix) => (
                      <button
                        key={mix.id}
                        type="button"
                        onClick={() => setQuestionMix(mix.id as any)}
                        className={`py-2 px-3 rounded-lg border font-space text-xs font-bold transition-all ${
                          questionMix === mix.id 
                            ? 'border-primary bg-primary/10 text-white shadow-glow' 
                            : 'border-borderColor bg-bgPrimary/40 text-textSecondary hover:text-white'
                        }`}
                      >
                        {mix.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div className="space-y-1.5">
                  <label className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider block">
                    Question Count
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`py-2 px-3 rounded-lg border font-space text-xs font-bold transition-all ${
                          questionCount === cnt 
                            ? 'border-primary bg-primary/10 text-white shadow-glow' 
                            : 'border-borderColor bg-bgPrimary/40 text-textSecondary hover:text-white'
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider block">
                    Exam Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'easy', label: 'Easy' },
                      { id: 'balanced', label: 'Balanced' },
                      { id: 'hard', label: 'Hard' }
                    ].map((diff) => (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setDifficulty(diff.id as any)}
                        className={`py-2 px-3 rounded-lg border font-space text-xs font-bold transition-all ${
                          difficulty === diff.id 
                            ? 'border-primary bg-primary/10 text-white shadow-glow' 
                            : 'border-borderColor bg-bgPrimary/40 text-textSecondary hover:text-white'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Settings (Chapters selection - only if subject is not "all") */}
              <div className="border-t md:border-t-0 md:border-l border-borderColor/40 pt-4 md:pt-0 md:pl-6 flex flex-col">
                <span className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider block mb-2">
                  Chapter Scope
                </span>
                
                {selectedSubject === 'all' ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-borderColor/60 rounded-2xl bg-bgPrimary/20">
                    <FileText className="h-8 w-8 text-textMuted mb-2" />
                    <p className="font-space text-xs text-textMuted leading-relaxed max-w-[200px]">
                      General tests cover the entire syllabus across all subjects.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col min-h-[250px]">
                    <button
                      onClick={handleSelectAllChapters}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-borderColor/60 bg-bgPrimary/40 hover:bg-bgPrimary text-[10px] font-space font-bold uppercase tracking-wider text-textSecondary mb-3 transition-colors"
                    >
                      <span>{selectedChapters.length === subjectChapters.length ? 'Deselect All' : 'Select All Chapters'}</span>
                      <Check className="h-3 w-3" />
                    </button>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[240px] pr-1.5">
                      {subjectChapters.map((ch) => {
                        const isChecked = selectedChapters.includes(ch.id);
                        return (
                          <button
                            key={ch.id}
                            onClick={() => handleSelectChapter(ch.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left font-space transition-colors ${
                              isChecked
                                ? 'border-primary/60 bg-primary/5 text-white'
                                : 'border-borderColor bg-bgPrimary/20 text-textSecondary hover:border-borderColor/80'
                            }`}
                          >
                            <span className="text-[11px] font-bold leading-tight line-clamp-1">{ch.name}</span>
                            <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-primary border-primary text-white' : 'border-borderColor bg-bgPrimary'
                            }`}>
                              {isChecked && <Check size={10} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Start Exam Action */}
            <div className="border-t border-borderColor/40 pt-5 flex justify-end">
              <button
                onClick={startExam}
                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow px-8 py-4 font-space font-extrabold text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Launch Exam Simulator</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Full-Screen Focus Exam Simulator */}
      {examRunning && activeProblems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-bgPrimary flex flex-col w-full h-full select-none overflow-hidden">
          
          {/* Top Bar Navigation */}
          <header className="h-16 border-b border-borderColor bg-bgSecondary/95 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-wrong/10 border border-wrong/20 hidden sm:flex items-center justify-center text-wrong animate-pulse text-sm">
                ⚠️
              </span>
              <div>
                <span className="hidden sm:block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Exam Simulator</span>
                <span className="block font-space text-xs font-black text-white uppercase tracking-wide truncate max-w-[120px] sm:max-w-none">
                  {selectedSubject === 'all' ? 'General test' : subjects.find(s => s.id === selectedSubject)?.name}
                </span>
              </div>
            </div>

            {/* Central Counter */}
            <div className="flex items-center gap-1 font-space text-xs font-bold text-textSecondary bg-bgPrimary/60 border border-borderColor rounded-xl px-3 py-1.5">
              <span>Question</span>
              <span className="font-mono text-white text-sm">{currentIdx + 1}</span>
              <span>of</span>
              <span className="font-mono text-white text-sm">{activeProblems.length}</span>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-bgPrimary/60 border border-borderColor rounded-xl px-4 py-2 shrink-0">
                <Timer size={16} className={`${timeLeft < 300 ? 'text-wrong animate-pulse' : 'text-primary'}`} />
                <span className={`font-mono text-sm font-black tracking-wide ${timeLeft < 300 ? 'text-wrong animate-ping-glow' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="rounded-xl bg-wrong hover:bg-red-600 hover:shadow-wrongGlow px-5 py-2 font-space text-xs font-extrabold text-white uppercase tracking-wider transition-all duration-300"
              >
                Submit Exam
              </button>
            </div>
          </header>

          {/* Main workspace container */}
          <div className="flex-1 flex overflow-hidden w-full flex-col md:flex-row">
            
            {/* Left Nav pane (Navigator) */}
            <aside className="hidden md:flex w-64 border-r border-borderColor bg-bgSecondary/30 p-5 flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-4">
                <span className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider block">
                  Question Sheet
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {activeProblems.map((prob, idx) => {
                    const isCurrent = currentIdx === idx;
                    const isAnswered = !!answers[prob.id]?.optionId || (answers[prob.id]?.text && answers[prob.id].text!.trim().length > 0);
                    const isFlagged = !!flagged[prob.id];

                    return (
                      <button
                        key={prob.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-11 rounded-xl font-space text-xs font-bold transition-all relative ${
                          isCurrent
                            ? 'bg-primary text-white border border-primary shadow-glow'
                            : isFlagged
                            ? 'bg-amber-500/10 border-2 border-amberGold text-amberGold'
                            : isAnswered
                            ? 'bg-correct/10 border border-correct text-correct'
                            : 'bg-bgPrimary border border-borderColor/60 text-textMuted hover:text-white'
                        }`}
                      >
                        <span>Q{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amberGold text-bgPrimary flex items-center justify-center text-[7px] font-black">
                            ⚑
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions badge */}
              <div className="p-4 rounded-xl border border-borderColor bg-bgPrimary/60 text-[10px] font-space text-textMuted leading-relaxed space-y-2">
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-textSecondary">
                  <AlertCircle size={12} />
                  <span>Exam Hall Rules</span>
                </div>
                <p>
                  No tabs shifting. Answers are auto-scored locally using fuzzy keywords matcher. Ensure descriptions are detailed.
                </p>
              </div>
            </aside>

            {/* Middle Question Solver Workspace */}
            <main className="flex-1 bg-bgPrimary p-4 sm:p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
              <div className="max-w-3xl w-full mx-auto space-y-6 md:space-y-8">
                
                {/* Horizontal Question Navigator Strip for Mobile */}
                <div className="flex md:hidden overflow-x-auto pb-2 gap-2 select-none border-b border-borderColor/40 scrollbar-thin">
                  {activeProblems.map((prob, idx) => {
                    const isCurrent = currentIdx === idx;
                    const isAnswered = !!answers[prob.id]?.optionId || (answers[prob.id]?.text && answers[prob.id].text!.trim().length > 0);
                    const isFlagged = !!flagged[prob.id];

                    return (
                      <button
                        key={prob.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 w-9 shrink-0 rounded-lg font-space text-xs font-bold transition-all relative flex items-center justify-center ${
                          isCurrent
                            ? 'bg-primary text-white border border-primary shadow-glow'
                            : isFlagged
                            ? 'bg-amber-500/10 border border-amberGold text-amberGold'
                            : isAnswered
                            ? 'bg-correct/10 border border-correct text-correct'
                            : 'bg-bgSecondary border border-borderColor/60 text-textMuted hover:text-white'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-amberGold block" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between border-b border-borderColor/40 pb-4">
                  <div className="flex items-center gap-2">
                    <SubjectBadge subjectId={activeProblems[currentIdx].subject_id} />
                    <DifficultyBadge difficulty={activeProblems[currentIdx].difficulty} />
                  </div>
                  <span className="font-space text-xs font-bold text-textMuted uppercase tracking-wider">
                    Marks: {activeProblems[currentIdx].marks} M
                  </span>
                </div>

                {/* Prompt block */}
                <div className="space-y-4">
                  <h3 className="font-space text-xl font-black text-white leading-tight uppercase">
                    {activeProblems[currentIdx].title}
                  </h3>
                  <p className="font-lora text-base md:text-lg text-textSecondary leading-relaxed whitespace-pre-wrap select-text selection:bg-primary/30">
                    {activeProblems[currentIdx].question_text}
                  </p>
                </div>

                {/* Solving component ( एमसीक्यू / एस्से ) */}
                <div className="border-t border-borderColor/40 pt-8">
                  {activeProblems[currentIdx].problem_type === 'mcq' ? (
                    <div className="grid grid-cols-1 gap-3">
                      {activeProblems[currentIdx].mcq_options?.map((opt) => {
                        const isSelected = answers[activeProblems[currentIdx].id]?.optionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleMCQSelect(activeProblems[currentIdx].id, opt.id)}
                            className={`flex items-center gap-3.5 p-4 text-left font-space rounded-2xl border text-xs font-bold tracking-wide transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary shadow-glow scale-[1.01]'
                                : 'border-borderColor bg-bgSecondary/20 text-textSecondary hover:bg-bgTertiary/30'
                            }`}
                          >
                            <span className={`flex h-7 w-7 items-center justify-center rounded-xl border text-[10px] font-black ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-borderColor bg-bgPrimary'
                            }`}>
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-space text-textMuted uppercase font-bold tracking-wider">
                        <span>Answer Sheet</span>
                        <span>Requires minimum {activeProblems[currentIdx].min_words || 30} words</span>
                      </div>
                      <textarea
                        value={answers[activeProblems[currentIdx].id]?.text || ''}
                        onChange={(e) => handleTextAnswerChange(activeProblems[currentIdx].id, e.target.value)}
                        placeholder="Write your comprehensive board explanation here..."
                        className="w-full min-h-[180px] rounded-2xl border border-borderColor bg-bgSecondary/30 p-5 font-lora text-xs leading-relaxed text-white placeholder-textMuted focus:border-primary focus:outline-none focus:bg-bgSecondary/50 transition-colors resize-y select-text"
                      ></textarea>
                      <div className="flex justify-between items-center text-[10px] font-space text-textMuted">
                        <span>Keywords expected: {activeProblems[currentIdx].answer_keywords?.length || 0}</span>
                        <span>
                          Word count:{' '}
                          <strong className="text-white">
                            {(answers[activeProblems[currentIdx].id]?.text || '').trim() === ''
                              ? 0
                              : (answers[activeProblems[currentIdx].id]?.text || '').trim().split(/\s+/).length}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Navigators */}
              <div className="max-w-3xl w-full mx-auto border-t border-borderColor/40 pt-6 mt-8 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFlagged(activeProblems[currentIdx].id)}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-space text-xs font-bold border transition-colors ${
                      flagged[activeProblems[currentIdx].id]
                        ? 'border-amberGold bg-amberGold/10 text-amberGold'
                        : 'border-borderColor/60 bg-bgSecondary/20 text-textSecondary hover:text-white'
                    }`}
                  >
                    <Flag size={13} className={flagged[activeProblems[currentIdx].id] ? 'fill-amberGold' : ''} />
                    <span>{flagged[activeProblems[currentIdx].id] ? 'Flagged' : 'Flag for Review'}</span>
                  </button>

                  <button
                    onClick={() => handleClearAnswer(activeProblems[currentIdx].id)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-space text-xs font-bold border border-borderColor/60 bg-bgSecondary/20 text-textSecondary hover:text-white hover:bg-wrong/10 hover:border-wrong transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Clear Answer</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(c => c - 1)}
                    className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-space text-xs font-bold border ${
                      currentIdx === 0
                        ? 'border-borderColor/30 text-textMuted bg-bgSecondary/10 cursor-not-allowed'
                        : 'border-borderColor bg-bgSecondary/60 hover:bg-bgSecondary text-white transition-colors'
                    }`}
                  >
                    <ArrowLeft size={14} />
                    <span>Prev</span>
                  </button>

                  <button
                    disabled={currentIdx === activeProblems.length - 1}
                    onClick={() => setCurrentIdx(c => c + 1)}
                    className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-space text-xs font-bold border ${
                      currentIdx === activeProblems.length - 1
                        ? 'border-borderColor/30 text-textMuted bg-bgSecondary/10 cursor-not-allowed'
                        : 'border-borderColor bg-bgSecondary/60 hover:bg-bgSecondary text-white transition-colors'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </main>
          </div>

          {/* Confirm submit dialog overlay */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 z-50 bg-bgPrimary/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-bgSecondary border border-borderColor rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
                <div className="h-14 w-14 rounded-full bg-wrong/10 border border-wrong/20 flex items-center justify-center text-wrong mx-auto text-xl animate-pulse">
                  <ShieldAlert size={24} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-space text-lg font-black text-white uppercase tracking-wider">Submit Exam Sheet?</h3>
                  <p className="font-space text-xs text-textSecondary leading-relaxed">
                    You have answered <strong className="text-correct">{answeredCount}</strong> questions, with <strong className="text-wrong">{unansweredCount}</strong> remaining. Are you sure you want to finalize your board sheet?
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 py-3.5 border border-borderColor bg-bgPrimary/40 hover:bg-bgPrimary rounded-xl font-space text-xs font-bold text-textSecondary uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitExamSheet(false)}
                    className="flex-1 py-3.5 bg-wrong hover:bg-red-600 hover:shadow-wrongGlow rounded-xl font-space text-xs font-extrabold text-white uppercase tracking-wider transition-all duration-200"
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
