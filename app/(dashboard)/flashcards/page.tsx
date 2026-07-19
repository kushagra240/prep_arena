'use client';

import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { clientDb } from '@/lib/supabase/client';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, HelpCircle, Layers, CheckCircle2, ChevronRight, Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FlashcardProgress {
  problemId: string;
  bucket: 1 | 2 | 3 | 4 | 5;   // Leitner buckets
  nextReviewDate: string;      // ISO date string
  lastRating: 'hard' | 'okay' | 'easy';
  timesReviewed: number;
}

export default function FlashcardsPage() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'setup' | 'session' | 'summary'>('setup');
  
  // Setup configuration state
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [cardCount, setCardCount] = useState<number>(10);
  const [sessionMode, setSessionMode] = useState<'new' | 'review' | 'mixed'>('mixed');
  
  // Game session state
  const [sessionCards, setSessionCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Record<string, 'hard' | 'okay' | 'easy'>>({});
  const [masteredCount, setMasteredCount] = useState(0);

  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const submissions = usePrepArenaStore((state) => state.submissions);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  // Load Leitner progress from localStorage
  const getLeitnerProgress = (): FlashcardProgress[] => {
    const saved = localStorage.getItem('preparena_flashcards');
    return saved ? JSON.parse(saved) : [];
  };

  const saveLeitnerProgress = (progress: FlashcardProgress[]) => {
    localStorage.setItem('preparena_flashcards', JSON.stringify(progress));
  };

  // Get list of chapters belonging to selected subjects
  const availableChapters = chapters.filter(ch => {
    const sub = subjects.find(s => s.id === ch.subject_id);
    return sub && selectedSubjects.includes(sub.slug);
  });

  const toggleSubject = (slug: string) => {
    setSelectedSubjects(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      // Reset chapters that don't belong to selected subjects anymore
      setSelectedChapters(chaps => chaps.filter(cId => {
        const chObj = chapters.find(c => c.id === cId);
        const subObj = chObj ? subjects.find(s => s.id === chObj.subject_id) : null;
        return subObj && next.includes(subObj.slug);
      }));
      return next;
    });
  };

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  // Start Session
  const handleStartSession = () => {
    const progressList = getLeitnerProgress();
    const today = new Date().toISOString();

    // 1. Filter problems by subjects & chapters
    let eligible = problems.filter(p => p.is_active !== false);

    if (selectedSubjects.length > 0) {
      eligible = eligible.filter(p => {
        const sub = subjects.find(s => s.id === p.subject_id);
        return sub && selectedSubjects.includes(sub.slug);
      });
    }

    if (selectedChapters.length > 0) {
      eligible = eligible.filter(p => selectedChapters.includes(p.chapter_id));
    }

    // 2. Filter based on Mode (New vs Review vs Mixed)
    let finalSelection: any[] = [];

    const newCards = eligible.filter(p => !progressList.some(pr => pr.problemId === p.id));
    const reviewCards = eligible.filter(p => {
      const prog = progressList.find(pr => pr.problemId === p.id);
      return prog && new Date(prog.nextReviewDate).getTime() <= new Date(today).getTime();
    });

    if (sessionMode === 'new') {
      finalSelection = newCards;
    } else if (sessionMode === 'review') {
      finalSelection = reviewCards;
    } else {
      // Mixed
      finalSelection = [...reviewCards, ...newCards];
    }

    if (finalSelection.length === 0) {
      // Fallback: If no cards are due or new, just grab any from eligibility
      finalSelection = eligible;
    }

    // Shuffle and slice to selected cardCount
    const shuffled = [...finalSelection].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, cardCount);

    if (selected.length === 0) {
      toast.error("No problems found matching this search criteria.");
      return;
    }

    setSessionCards(selected);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionRatings({});
    setMasteredCount(0);
    setView('session');
  };

  // Spaced Repetition Bucket Transition Logic
  const handleRateCard = (rating: 'hard' | 'okay' | 'easy') => {
    const card = sessionCards[currentIndex];
    const progressList = getLeitnerProgress();
    const existingIndex = progressList.findIndex(p => p.problemId === card.id);
    
    let currentBucket: 1 | 2 | 3 | 4 | 5 = 1;
    let timesReviewed = 0;
    
    if (existingIndex > -1) {
      currentBucket = progressList[existingIndex].bucket;
      timesReviewed = progressList[existingIndex].timesReviewed;
    }

    let newBucket: 1 | 2 | 3 | 4 | 5 = currentBucket;

    if (rating === 'hard') {
      newBucket = 1; // Stay in bucket 1
    } else if (rating === 'okay') {
      newBucket = Math.min(5, currentBucket + 1) as any;
    } else if (rating === 'easy') {
      newBucket = Math.min(5, currentBucket + 2) as any;
      if (newBucket === 5 && currentBucket !== 5) {
        setMasteredCount(prev => prev + 1);
      }
    }

    // Calculate next review date based on bucket interval
    // Bucket 1: 1 day, Bucket 2: 2 days, Bucket 3: 4 days, Bucket 4: 8 days, Bucket 5: 16 days
    const reviewIntervalDays = [0, 1, 2, 4, 8, 16][newBucket];
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + reviewIntervalDays);

    const updatedProgress: FlashcardProgress = {
      problemId: card.id,
      bucket: newBucket,
      nextReviewDate: nextReviewDate.toISOString(),
      lastRating: rating,
      timesReviewed: timesReviewed + 1
    };

    const newProgressList = [...progressList];
    if (existingIndex > -1) {
      newProgressList[existingIndex] = updatedProgress;
    } else {
      newProgressList.push(updatedProgress);
    }
    saveLeitnerProgress(newProgressList);

    setSessionRatings(prev => ({ ...prev, [card.id]: rating }));

    // Proceed to next card
    if (currentIndex < sessionCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } else {
      // Award XP
      const xpEarned = sessionCards.length * 5;
      const profile = usePrepArenaStore.getState().profile;
      const updatedProfile = { ...profile, xp: profile.xp + xpEarned };
      clientDb.saveProfile(updatedProfile);
      usePrepArenaStore.getState().refreshState();
      
      setView('summary');
    }
  };

  // Helper to extract explanation
  const getExplanation = (card: any) => {
    if (card.expected_answer) {
      return card.expected_answer;
    }
    const tagsStr = card.tags ? card.tags.join(', ') : 'this topic';
    return `This question is from the chapter: "${card.chapter_id ? chapters.find(c => c.id === card.chapter_id)?.name : 'general'}". Practice solving similar problems to master ${tagsStr}.`;
  };

  const getFrontText = (card: any) => {
    return card.question_text || '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-borderColor pb-4">
        <div>
          <h1 className="font-space text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>🃏</span>
            Flashcard Revision
          </h1>
          <p className="font-space text-xs text-textSecondary mt-0.5">
            Leitner System Spaced Repetition card decks built from the syllabus.
          </p>
        </div>

        {view !== 'setup' && (
          <button
            onClick={() => setView('setup')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-borderColor hover:bg-bgTertiary text-xs font-space font-bold text-white transition-all"
          >
            <ArrowLeft size={14} />
            <span>Quit Deck</span>
          </button>
        )}
      </div>

      {/* Setup View */}
      {view === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Deck Configuration */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Step 1: Subjects */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h3 className="font-space text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-borderColor/50 pb-2">
                <Layers size={14} className="text-primary" />
                Step 1: Choose Subjects
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {subjects.map(sub => {
                  const isSelected = selectedSubjects.includes(sub.slug);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(sub.slug)}
                      className={`p-3 rounded-xl border font-space text-xs font-bold text-left transition-all flex flex-col justify-between h-20 ${
                        isSelected 
                          ? 'border-primary bg-primary/10 shadow-glow text-white' 
                          : 'border-borderColor/60 bg-bgSecondary/40 text-textSecondary hover:text-white hover:border-borderColor'
                      }`}
                    >
                      <span className="text-lg">{sub.icon}</span>
                      <span className="truncate w-full">{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Chapters */}
            {selectedSubjects.length > 0 && availableChapters.length > 0 && (
              <div className="glass-panel rounded-2xl p-5 space-y-3 animate-fade-in">
                <h3 className="font-space text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-borderColor/50 pb-2">
                  <Layers size={14} className="text-primary" />
                  Step 2: Filter by Chapter (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {availableChapters.map(ch => {
                    const isSelected = selectedChapters.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => toggleChapter(ch.id)}
                        className={`p-2.5 rounded-lg border font-space text-[11px] text-left transition-all truncate ${
                          isSelected 
                            ? 'border-primary/80 bg-primary/10 text-white' 
                            : 'border-borderColor/40 bg-bgSecondary/20 text-textSecondary hover:text-white hover:border-borderColor/60'
                        }`}
                      >
                        {ch.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Session settings summary & CTA */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-5 space-y-5">
              <h3 className="font-space text-xs font-black text-white uppercase tracking-widest border-b border-borderColor/50 pb-2">
                Deck Configuration
              </h3>

              {/* Number of cards selector */}
              <div className="space-y-2">
                <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Deck Size</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 20, 30, 50].map(count => (
                    <button
                      key={count}
                      onClick={() => setCardCount(count)}
                      className={`py-1.5 rounded-lg font-mono text-xs font-bold ${
                        cardCount === count 
                          ? 'bg-primary text-white shadow-glow' 
                          : 'bg-bgTertiary/30 border border-borderColor text-textSecondary hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spaced Repetition Mode */}
              <div className="space-y-2">
                <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Card Select Mode</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'mixed', label: 'Mixed Revision', desc: 'Cards due review + new ones' },
                    { id: 'new', label: 'New Cards Only', desc: 'Syllabus problems you haven\'t reviewed' },
                    { id: 'review', label: 'Review Due Only', desc: 'Cards ready for Leitner refresh' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSessionMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-space transition-all ${
                        sessionMode === m.id 
                          ? 'border-primary bg-primary/5 text-white shadow-inner' 
                          : 'border-borderColor/60 bg-transparent text-textSecondary hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold">{m.label}</span>
                      <span className="block text-[9px] text-textMuted mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={handleStartSession}
                className="w-full flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-space text-xs font-black uppercase tracking-wider shadow-glow transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Launch Deck</span>
                <ChevronRight size={14} />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Session View (Active Revision) */}
      {view === 'session' && sessionCards.length > 0 && (
        <div className="space-y-6 max-w-lg mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between font-space text-[11px] text-textMuted">
            <span>Progress: <strong>{currentIndex + 1}</strong> of <strong>{sessionCards.length}</strong> cards</span>
            <span className="flex items-center gap-0.5 text-amberGold">
              <Zap size={11} className="fill-amberGold" />
              +5 XP / card
            </span>
          </div>

          <div className="h-1.5 w-full bg-bgTertiary/55 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
            ></div>
          </div>

          {/* 3D Card Animation Wrapper */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-96 [perspective:1000px] cursor-pointer"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full h-full w-full"
            >
              {/* CARD FRONT */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="absolute inset-0 bg-bgSecondary border border-borderColor rounded-2xl p-6 flex flex-col justify-between select-none shadow-glow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-borderColor/45 pb-3">
                    <div className="flex items-center gap-1.5">
                      <SubjectBadge subjectId={sessionCards[currentIndex].subject_id} />
                      <DifficultyBadge difficulty={sessionCards[currentIndex].difficulty} />
                    </div>
                    <span className="font-space text-[8px] text-textMuted uppercase font-bold">Front</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-lora text-sm text-white leading-relaxed">
                      {getFrontText(sessionCards[currentIndex])}
                    </p>
                    {sessionCards[currentIndex].problem_type === 'mcq' && (
                      <span className="inline-block text-[9px] font-space text-textMuted bg-bgPrimary/40 px-2 py-0.5 rounded border border-borderColor/30 mt-1">
                        MCQ Question (Answer is hidden)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center font-space text-[10px] text-textMuted animate-pulse border-t border-borderColor/40 pt-4">
                  Tap card to reveal correct answer & explanation
                </div>
              </div>

              {/* CARD BACK */}
              <div
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0 bg-bgSecondary border border-borderColor rounded-2xl p-6 flex flex-col justify-between select-none shadow-glow overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-borderColor/45 pb-3">
                    <span className="font-space text-[9px] font-bold text-correct uppercase bg-correct/10 border border-correct/30 px-2 py-0.5 rounded">
                      Correct Answer
                    </span>
                    <span className="font-space text-[8px] text-textMuted uppercase font-bold">Back</span>
                  </div>

                  <div className="space-y-3">
                    {/* Correct Option/Text */}
                    <div className="p-3 bg-bgPrimary/60 border border-correct/20 rounded-xl">
                      {sessionCards[currentIndex].problem_type === 'mcq' ? (
                        <p className="font-space text-xs font-black text-white">
                          Option {sessionCards[currentIndex].mcq_options?.find((o: any) => o.isCorrect)?.id}:{' '}
                          <span className="text-correct">
                            {sessionCards[currentIndex].mcq_options?.find((o: any) => o.isCorrect)?.text}
                          </span>
                        </p>
                      ) : (
                        <p className="font-mono text-xs text-correct leading-relaxed whitespace-pre-line">
                          {sessionCards[currentIndex].expected_answer}
                        </p>
                      )}
                    </div>

                    {/* Explanations */}
                    <div className="space-y-1">
                      <span className="block font-space text-[9px] text-textMuted uppercase font-bold">Explanation:</span>
                      <p className="font-lora text-[11px] text-textSecondary leading-relaxed bg-bgPrimary/20 p-2.5 rounded border border-borderColor/30">
                        {getExplanation(sessionCards[currentIndex])}
                      </p>
                    </div>

                    {/* Keywords */}
                    {sessionCards[currentIndex].answer_keywords && sessionCards[currentIndex].answer_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="font-space text-[8px] text-textMuted uppercase font-bold mr-1">Concepts:</span>
                        {sessionCards[currentIndex].answer_keywords.map((k: string, i: number) => (
                          <span key={i} className="text-[9px] font-space text-amberGold bg-amberGold/5 border border-amberGold/20 px-1.5 py-0.5 rounded">
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center font-space text-[10px] text-textMuted border-t border-borderColor/40 pt-4">
                  Tap again to flip front, or rate below.
                </div>
              </div>

            </motion.div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => handleRateCard('hard')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-wrong/30 bg-wrong/5 hover:bg-wrong/10 text-wrong transition-all"
            >
              <AlertTriangle size={16} />
              <span className="font-space text-[10px] font-black uppercase tracking-wider mt-1">Hard</span>
              <span className="text-[8px] font-space text-wrong/75 mt-0.5">Bucket 1 (Today)</span>
            </button>

            <button
              onClick={() => handleRateCard('okay')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amberGold/30 bg-amberGold/5 hover:bg-amberGold/10 text-amberGold transition-all"
            >
              <HelpCircle size={16} />
              <span className="font-space text-[10px] font-black uppercase tracking-wider mt-1">Okay</span>
              <span className="text-[8px] font-space text-amberGold/75 mt-0.5">Bucket +1 (+2 days)</span>
            </button>

            <button
              onClick={() => handleRateCard('easy')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-correct/30 bg-correct/5 hover:bg-correct/10 text-correct transition-all"
            >
              <CheckCircle2 size={16} />
              <span className="font-space text-[10px] font-black uppercase tracking-wider mt-1">Easy</span>
              <span className="text-[8px] font-space text-correct/75 mt-0.5">Bucket +2 (+4 days)</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary View */}
      {view === 'summary' && (
        <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-md mx-auto text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-correct/10 border border-correct/30 text-correct text-3xl animate-bounce">
            🎉
          </div>

          <div className="space-y-1">
            <h2 className="font-space text-xl font-black text-white uppercase tracking-wider">Deck Complete!</h2>
            <p className="font-space text-xs text-textSecondary">You&apos;ve successfully completed the review session.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 border-y border-borderColor/60 py-5 my-4">
            <div className="p-3 bg-bgPrimary/40 border border-borderColor rounded-xl text-center">
              <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Cards Reviewed</span>
              <span className="block font-space text-base font-black text-white mt-1">{sessionCards.length}</span>
            </div>

            <div className="p-3 bg-bgPrimary/40 border border-borderColor rounded-xl text-center">
              <span className="block font-space text-[10px] text-textMuted uppercase font-bold">XP Awarded</span>
              <span className="block font-space text-base font-black text-amberGold mt-1 flex items-center justify-center gap-0.5">
                <Zap size={14} className="fill-amberGold text-amberGold" />
                +{sessionCards.length * 5} XP
              </span>
            </div>

            {masteredCount > 0 && (
              <div className="col-span-2 p-3 bg-correct/5 border border-correct/20 rounded-xl text-center flex items-center justify-center gap-1 text-correct font-space text-[11px] font-bold">
                <Check size={14} />
                <span>{masteredCount} Cards moved to Bucket 5 (Mastered)!</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setView('setup')}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-space text-xs font-black uppercase tracking-wider transition-all duration-300"
            >
              Review Another Deck
            </button>

            <Link
              href="/dashboard"
              className="w-full border border-borderColor hover:bg-bgTertiary text-textSecondary hover:text-white py-3 rounded-xl font-space text-xs font-bold uppercase tracking-wider text-center block transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
