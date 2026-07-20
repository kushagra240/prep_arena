import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePrepArenaStore } from '@/lib/store';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { Zap, Timer, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function DailyChallengeWidget() {
  const [challengeData, setChallengeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const submissions = usePrepArenaStore((state) => state.submissions);

  // Fetch daily challenge
  useEffect(() => {
    async function fetchChallenge() {
      try {
        const res = await fetch('/api/daily-challenge');
        if (res.ok) {
          const data = await res.json();
          setChallengeData(data);
          if (data && data.problem_id) {
            localStorage.setItem('preparena_daily_challenge_id', data.problem_id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch daily challenge:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, []);

  // Check if solved today
  const isSolvedToday = challengeData && submissions.some(s => 
    s.problem_id === challengeData.problem_id && 
    s.is_correct
  );

  // Countdown timer to midnight IST (18:30 UTC)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setUTCHours(18, 30, 0, 0);
      
      if (now.getTime() >= target.getTime()) {
        target.setUTCDate(target.getUTCDate() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `Resets in ${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4 animate-shimmer">
        <div className="h-4 bg-borderColor/50 rounded w-1/3"></div>
        <div className="h-6 bg-borderColor/50 rounded w-3/4"></div>
        <div className="h-12 bg-borderColor/50 rounded"></div>
      </div>
    );
  }

  if (!challengeData || !challengeData.problems) {
    return null;
  }

  const problem = challengeData.problems;
  const baseXP = problem.xp_reward || 20;
  const doubledXP = baseXP * 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 shadow-glow hover-sheen ${
        isSolvedToday 
          ? 'border-correct/30 bg-gradient-to-b from-bgSecondary to-correct/5 shadow-correctGlow' 
          : 'border-amberGold/30 bg-gradient-to-b from-bgSecondary to-amberGold/5 shadow-amberGlow'
      }`}
    >
      {/* Badge Top Right */}
      <div className="absolute top-0 right-0 flex items-center">
        <div className={`rounded-bl-xl border-l border-b px-3 py-1 font-space text-[9px] font-extrabold uppercase tracking-widest ${
          isSolvedToday 
            ? 'bg-correct/15 border-correct/40 text-correct' 
            : 'bg-amberGold/15 border-amberGold/40 text-amberGold animate-pulse'
        }`}>
          {isSolvedToday ? 'Completed' : 'Daily Challenge'}
        </div>
      </div>

      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          {/* Metadata Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <SubjectBadge subjectId={problem.subject_id} />
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="font-space text-[9px] font-extrabold text-amberGold bg-amberGold/10 border border-amberGold/30 px-2 py-0.5 rounded tracking-wide animate-pulse">
              2X XP ACTIVE
            </span>
          </div>

          <h3 className="font-space text-base font-extrabold text-white leading-tight">
            {problem.title}
          </h3>

          <p className="font-lora text-xs text-textSecondary leading-relaxed line-clamp-3">
            {problem.question_text}
          </p>
        </div>

        {/* Action / State Section */}
        <div className="flex items-center justify-between border-t border-borderColor/40 pt-3 flex-wrap gap-2">
          <div className="font-space text-left">
            <span className="block text-[8px] text-textMuted uppercase font-bold">Reward</span>
            <span className={`block text-xs font-black flex items-center gap-0.5 ${isSolvedToday ? 'text-correct' : 'text-amberGold'}`}>
              <Zap size={12} className={isSolvedToday ? 'fill-correct' : 'fill-amberGold'} />
              <span>+{doubledXP} XP</span>
            </span>
          </div>

          {/* Reset Timer */}
          <div className="flex items-center gap-1 font-space text-[10px] text-textMuted bg-bgPrimary/60 border border-borderColor/45 px-2.5 py-1 rounded-lg">
            <Timer size={11} className="text-textSecondary" />
            <span>{timeLeft}</span>
          </div>

          {/* Solved state vs CTA */}
          {isSolvedToday ? (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-correct/10 border border-correct/20 text-correct font-space text-xs font-bold">
              <CheckCircle size={14} />
              <span>✅ Completed! +{doubledXP} XP</span>
            </div>
          ) : (
            <Link 
              href={`/problems/${problem.slug}`}
              className="rounded-xl bg-amberGold text-bgPrimary hover:bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] px-4 py-2 font-space text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Solve Now →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
