import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, X, ArrowRight, Award, Zap } from 'lucide-react';
import { Problem, MCQOption } from '@/lib/supabase/types';
import { usePrepArenaStore } from '@/lib/store';
import { XPCounter } from '../shared/XPCounter';

interface MCQSolverProps {
  problem: Problem;
  onSolved: () => void;
}

export function MCQSolver({ problem, onSolved }: MCQSolverProps) {
  const submitAnswer = usePrepArenaStore((state) => state.submitAnswer);
  const submissions = usePrepArenaStore((state) => state.submissions);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [xpWon, setXpWon] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  const [seconds, setSeconds] = useState(0);

  // Load existing submission if solved before
  const pastSubmission = submissions.find(s => s.problem_id === problem.id);

  useEffect(() => {
    if (pastSubmission) {
      setSelectedId(pastSubmission.selected_option_id);
      setIsSubmitted(true);
      setIsCorrectAnswer(pastSubmission.is_correct);
      setXpWon(pastSubmission.xp_earned);
    } else {
      setSelectedId(null);
      setIsSubmitted(false);
      setIsCorrectAnswer(false);
      setXpWon(0);
      setSeconds(0);
    }
  }, [problem.id, pastSubmission]);

  // Timer tick
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedId || isSubmitted) return;

    const selectedOption = problem.mcq_options?.find(o => o.id === selectedId);
    const isCorrect = selectedOption ? selectedOption.isCorrect : false;

    // Trigger visual confetti rewards
    if (isCorrect) {
      // Elegant school colors or gold confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#4F6EF7', '#F59E0B', '#10B981']
      });
    }

    // Submit via state store
    const result = submitAnswer(problem.id, {
      selectedOptionId: selectedId,
      isCorrect,
      timeTakenSeconds: seconds
    });

    setIsCorrectAnswer(isCorrect);
    setIsSubmitted(true);
    setXpWon(result.xpEarned);
    setUnlockedAchievements(result.achievementsUnlocked);
    
    // Callback to reveal explanation button
    onSolved();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-borderColor pb-3">
        <h3 className="font-space font-bold text-white text-base">Select the Correct Option</h3>
        <span className="font-mono text-xs text-textMuted bg-bgPrimary px-2.5 py-1 rounded-md border border-borderColor">
          Time: {Math.floor(seconds / 60)}m {seconds % 60}s
        </span>
      </div>

      {/* MCQ options list */}
      <div className="grid grid-cols-1 gap-3">
        {problem.mcq_options?.map((option) => {
          const isSelected = selectedId === option.id;
          
          let cardStyle = 'border-borderColor bg-bgSecondary/40 text-textPrimary hover:bg-bgTertiary/50 hover:border-textSecondary';
          let indicatorIcon = null;

          if (isSubmitted) {
            if (option.isCorrect) {
              // Highlight correct answer in green
              cardStyle = 'border-correct bg-correct/10 text-correct shadow-[0_0_15px_rgba(16,185,129,0.15)]';
              indicatorIcon = <Check className="h-5 w-5 text-correct shrink-0" />;
            } else if (isSelected && !option.isCorrect) {
              // Highlight wrong selected answer in red
              cardStyle = 'border-wrong bg-wrong/10 text-wrong shadow-[0_0_15px_rgba(239,68,68,0.15)]';
              indicatorIcon = <X className="h-5 w-5 text-wrong shrink-0" />;
            } else {
              cardStyle = 'border-borderColor bg-bgSecondary/20 text-textMuted opacity-60';
            }
          } else if (isSelected) {
            cardStyle = 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(79,110,247,0.2)] scale-[1.01]';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={isSubmitted}
              className={`flex items-center justify-between rounded-xl border p-4 text-left font-space transition-all duration-300 ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-bold font-space ${
                  isSelected && !isSubmitted
                    ? 'border-primary bg-primary text-white' 
                    : isSubmitted && option.isCorrect
                    ? 'border-correct bg-correct text-white'
                    : isSubmitted && isSelected && !option.isCorrect
                    ? 'border-wrong bg-wrong text-white'
                    : 'border-borderColor bg-bgPrimary text-textSecondary'
                }`}>
                  {option.id}
                </span>
                <span className="text-sm font-medium leading-relaxed">{option.text}</span>
              </div>
              {indicatorIcon}
            </button>
          );
        })}
      </div>

      {/* Submission Actions */}
      <div className="flex flex-col gap-4 pt-2">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-space font-bold text-sm tracking-wider uppercase transition-all duration-300 border ${
              selectedId 
                ? 'bg-primary text-white border-primary hover:bg-primary-hover hover:shadow-[0_0_25px_rgba(79,110,247,0.3)] hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-bgTertiary/30 text-textMuted border-borderColor cursor-not-allowed'
            }`}
          >
            <span>Submit Answer</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div className="rounded-xl border border-borderColor bg-bgSecondary/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isCorrectAnswer ? 'bg-correct/20 text-correct' : 'bg-wrong/20 text-wrong'}`}>
                  {isCorrectAnswer ? <Check size={14} /> : <X size={14} />}
                </span>
                <span className={`font-space font-bold text-sm ${isCorrectAnswer ? 'text-correct' : 'text-wrong'}`}>
                  {isCorrectAnswer ? 'Correct Answer!' : 'Incorrect Answer'}
                </span>
              </div>
              
              {xpWon > 0 && (
                <div className="relative">
                  <XPCounter xp={xpWon} size="sm" />
                  <span className="absolute -top-3 -right-2 text-[10px] text-amberGold font-black animate-xp-rise">+ {xpWon} XP</span>
                </div>
              )}
            </div>

            {/* Achievement Unlocked banner */}
            {unlockedAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center justify-between gap-2.5 rounded-lg border border-amberGold/30 bg-amberGold/10 p-3 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{ach.icon}</span>
                  <div>
                    <h5 className="font-space text-xs font-bold text-amberGold uppercase tracking-wider">Achievement Unlocked!</h5>
                    <p className="font-space text-xs font-medium text-white">{ach.name} — {ach.description}</p>
                  </div>
                </div>
                <div className="text-[10px] font-space font-extrabold text-amberGold px-2 py-0.5 border border-amberGold/30 rounded bg-bgSecondary">
                  +{ach.xp_bonus} XP
                </div>
              </div>
            ))}

            <p className="font-space text-xs text-textSecondary leading-relaxed">
              {isCorrectAnswer 
                ? 'Fantastic job! You understood this concept perfectly. You can now read the comprehensive explanation below to solidify your understanding.'
                : 'Don\'t worry! Incorrect attempts are stepping stones to mastering the ICSE boards. View the explanation below to check what you missed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
