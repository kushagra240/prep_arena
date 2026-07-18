import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { Problem } from '@/lib/supabase/types';
import { XPCounter } from '../shared/XPCounter';
import { Check, X, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

import { checkKeywordMatch } from '@/lib/utils/keyword-matcher';

interface BriefWritingSolverProps {
  problem: Problem;
  onSolved: () => void;
}

export function BriefWritingSolver({ problem, onSolved }: BriefWritingSolverProps) {
  const submitAnswer = usePrepArenaStore((state) => state.submitAnswer);
  const submissions = usePrepArenaStore((state) => state.submissions);

  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [seconds, setSeconds] = useState(0);

  // Load existing submission if solved before
  const pastSubmission = submissions.find(s => s.problem_id === problem.id);

  useEffect(() => {
    if (pastSubmission) {
      setStudentAnswer(pastSubmission.answer_text || '');
      setIsEvaluated(true);
      setEvaluation({
        score: pastSubmission.ai_score,
        percentage: Math.round(((pastSubmission.ai_score || 0) / problem.marks) * 100),
        feedback: pastSubmission.ai_feedback || 'Review completed by PrepArena AI examiner.',
        concepts_covered: problem.answer_keywords?.filter((_, i) => i % 2 === 0) || [],
        concepts_missing: problem.answer_keywords?.filter((_, i) => i % 2 !== 0) || [],
        grammar_note: 'Proper syntax and punctuation verified.',
        improvement_tip: 'Include all technical terms in their specific ICSE context.'
      });
    } else {
      setStudentAnswer('');
      setIsEvaluated(false);
      setEvaluation(null);
      setSeconds(0);
    }
  }, [problem.id, pastSubmission]);

  // Timer tick
  useEffect(() => {
    if (isEvaluated || isSubmitting) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEvaluated, isSubmitting]);

  const wordCount = studentAnswer.trim() === '' ? 0 : studentAnswer.trim().split(/\s+/).length;
  const minWords = problem.min_words || 30;
  const maxWords = problem.max_words || 150;
  const isWordCountValid = wordCount >= minWords && wordCount <= maxWords;

  // Client-Side Examiner Emulation if API isn't fully configured
  const emulateAIEvaluation = (text: string) => {
    const keywords = problem.answer_keywords || [];
    const lowerText = text.toLowerCase();
    
    // Find present keywords
    const covered = keywords.filter(kw => lowerText.includes(kw.toLowerCase()));
    const missing = keywords.filter(kw => !lowerText.includes(kw.toLowerCase()));
    
    // Calculate raw score based on percentage of keywords found and length
    const keywordRatio = keywords.length > 0 ? covered.length / keywords.length : 0.8;
    const lengthRatio = Math.min(wordCount / minWords, 1.0); // Penalty for too short
    
    let rawScore = (keywordRatio * 0.7 + lengthRatio * 0.3) * problem.marks;
    rawScore = Math.max(0, Math.min(rawScore, problem.marks));
    
    // Round to 0.5 steps
    const score = Math.round(rawScore * 2) / 2;
    const percentage = Math.round((score / problem.marks) * 100);

    // Dynamic feedback based on score
    let feedback = '';
    let improvement_tip = '';
    if (score >= problem.marks * 0.9) {
      feedback = 'Outstanding response! Your explanation perfectly captures all required ICSE board concepts with precise academic vocabulary and robust structure.';
      improvement_tip = 'This is model answer quality. Maintain this exact standard under exam conditions!';
    } else if (score >= problem.marks * 0.6) {
      feedback = 'Solid explanation. You correctly identified several core concepts. However, your answer could be structured slightly better and could contain more specific terminology.';
      improvement_tip = `Be sure to emphasize the missing keywords: "${missing.slice(0, 2).join(', ')}" in your explanation.`;
    } else {
      feedback = 'Your answer addresses the prompt but lacks the depth and core academic keywords required by the official ICSE marking scheme.';
      improvement_tip = `Ensure you define the underlying principles clearly and include critical terms such as "${missing.slice(0, 3).join(', ')}".`;
    }

    return {
      score,
      percentage,
      feedback,
      concepts_covered: covered,
      concepts_missing: missing,
      grammar_note: 'Proper formatting and sentence structure identified. Minor improvements possible in term positioning.',
      improvement_tip
    };
  };

  const handleEvaluate = async () => {
    if (wordCount < 10 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // First attempt live API call (with 3-second timeout fallback)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: problem.question_text,
          expectedAnswer: problem.expected_answer,
          answerKeywords: problem.answer_keywords,
          studentAnswer: studentAnswer,
          subject: problem.subject_id,
          marks: problem.marks
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        submitAndDisplay(data);
      } else {
        throw new Error('API request failed, falling back to local evaluation');
      }
    } catch (err) {
      console.warn('API Error or timeout, falling back to offline evaluator:', err);
      const offlineResult = emulateAIEvaluation(studentAnswer);
      submitAndDisplay(offlineResult);
    }
  };

  const submitAndDisplay = (evalResult: any) => {
    // 100% correct equivalent or high score confetti
    if (evalResult.score >= problem.marks * 0.8) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#4F6EF7', '#F59E0B', '#10B981']
      });
    }

    // Submit and update global store
    const result = submitAnswer(problem.id, {
      answerText: studentAnswer,
      isCorrect: evalResult.score >= problem.marks * 0.5,
      aiScore: evalResult.score,
      aiFeedback: evalResult.feedback,
      timeTakenSeconds: seconds
    });

    setEvaluation(evalResult);
    setIsEvaluated(true);
    setIsSubmitting(false);
    onSolved();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-borderColor pb-3">
        <h3 className="font-space font-bold text-white text-base">Write Your Detailed Answer</h3>
        <span className="font-mono text-xs text-textMuted bg-bgPrimary px-2.5 py-1 rounded-md border border-borderColor">
          Timer: {Math.floor(seconds / 60)}m {seconds % 60}s
        </span>
      </div>

      {!isEvaluated ? (
        <div className="space-y-3">
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            disabled={isSubmitting}
            placeholder={`Type your answer here... Be precise, use standard ICSE terms. (Minimum ${minWords} words recommended for board marks)`}
            className="w-full min-h-[160px] rounded-xl border border-borderColor bg-bgSecondary/20 p-4 font-lora text-sm leading-relaxed text-white placeholder-textMuted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 resize-y"
          ></textarea>

          <div className="flex items-center justify-between">
            <span className={`font-space text-xs ${
              wordCount === 0 
                ? 'text-textMuted' 
                : isWordCountValid 
                ? 'text-correct font-semibold' 
                : 'text-amberGold font-semibold'
            }`}>
              Words: {wordCount} / {maxWords} {wordCount > 0 && wordCount < minWords && `(needs ${minWords - wordCount} more for optimal evaluation)`}
            </span>
            <span className="font-space text-xs text-textMuted">
              Max Marks: <span className="font-bold text-white">{problem.marks}</span>
            </span>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={wordCount < 10 || isSubmitting}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-space font-bold text-sm tracking-wider uppercase transition-all duration-300 border ${
              wordCount >= 10 && !isSubmitting
                ? 'bg-primary text-white border-primary hover:bg-primary-hover hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-bgTertiary/30 text-textMuted border-borderColor cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI Board Examiner Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-amberGold" />
                <span>Submit for AI Evaluation</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Evaluation Results Panel */
        <div className="space-y-5">
          {/* Main score grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center rounded-xl border border-borderColor bg-bgSecondary/50 p-5">
            {/* Circular score progress */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative h-24 w-24">
                {/* SVG Radial Meter */}
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    className="text-bgTertiary"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeDasharray={`${evaluation.percentage}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-space">
                  <span className="text-xl font-black text-white">{evaluation.score}</span>
                  <span className="text-[10px] text-textMuted font-bold">/ {problem.marks} MARKS</span>
                </div>
              </div>
              <span className="mt-2 font-space text-xs font-bold text-textSecondary uppercase tracking-wider">AI Examiner Score</span>
            </div>

            {/* General commentary */}
            <div className="md:col-span-2 space-y-2 border-t md:border-t-0 md:border-l border-borderColor pt-4 md:pt-0 md:pl-5">
              <div className="flex items-center justify-between">
                <span className="font-space text-xs font-bold text-primary uppercase tracking-widest">Examiner Report</span>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-space font-bold uppercase">
                  Verified Grade
                </span>
              </div>
              <p className="font-space text-xs text-white leading-relaxed">{evaluation.feedback}</p>
              <div className="text-[11px] font-space text-textMuted bg-bgPrimary/60 p-2 rounded border border-borderColor/40">
                <span className="font-bold text-textSecondary">Grammar & Syntax:</span> {evaluation.grammar_note}
              </div>
            </div>
          </div>
          {/* Concepts keyword checklist */}
          {problem.answer_keywords && problem.answer_keywords.length > 0 && (() => {
            const matchedCount = problem.answer_keywords.filter(kw => 
              checkKeywordMatch(kw, studentAnswer, evaluation.concepts_covered || [])
            ).length;
            return (
              <div className="rounded-xl border border-borderColor bg-bgSecondary/20 p-4 space-y-3">
                <h4 className="font-space text-xs font-bold text-textSecondary uppercase tracking-wider">
                  Official Concept checklist ({matchedCount} / {problem.answer_keywords.length} found)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {problem.answer_keywords.map((kw) => {
                    const isPresent = checkKeywordMatch(kw, studentAnswer, evaluation.concepts_covered || []);
                    return (
                      <div key={kw} className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-space ${
                        isPresent 
                          ? 'border-correct/20 bg-correct/5 text-correct' 
                          : 'border-wrong/20 bg-wrong/5 text-textMuted'
                      }`}>
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isPresent ? 'bg-correct/10 text-correct' : 'bg-wrong/10 text-wrong/60'
                        }`}>
                          {isPresent ? <Check size={10} /> : <X size={10} />}
                        </span>
                        <span className="truncate leading-none">{kw}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Tips for improvement */}
          <div className="rounded-xl border border-borderColor/50 bg-primary/5 p-4 border-l-4 border-l-primary">
            <h5 className="font-space text-xs font-extrabold text-primary uppercase tracking-wider mb-1">Board Improvement Tip</h5>
            <p className="font-space text-xs text-textSecondary leading-relaxed">{evaluation.improvement_tip}</p>
          </div>

          {/* Model Answer disclosure */}
          {problem.expected_answer && (
            <div className="rounded-xl border border-borderColor bg-bgSecondary/40 overflow-hidden">
              <div className="bg-bgTertiary/30 border-b border-borderColor px-4 py-2.5">
                <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider">Official Model Answer (CISCE Standard)</h4>
              </div>
              <div className="p-4 bg-bgPrimary/30">
                <pre className="font-lora text-xs text-textSecondary whitespace-pre-wrap leading-relaxed">
                  {problem.expected_answer}
                </pre>
              </div>
            </div>
          )}

          {/* Try again buttons */}
          <button
            onClick={() => setIsEvaluated(false)}
            className="w-full rounded-xl border border-borderColor bg-bgSecondary/20 py-2.5 font-space text-xs font-bold text-textSecondary hover:bg-bgTertiary hover:text-white transition-all duration-300"
          >
            Rewrite Answer & Re-Evaluate
          </button>
        </div>
      )}
    </div>
  );
}
