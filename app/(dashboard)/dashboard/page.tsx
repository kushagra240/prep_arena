'use client';

import React from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { getLevelInfo } from '@/lib/utils/xp';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar';
import { SubjectProgress } from '@/components/dashboard/SubjectProgress';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LeaderboardMiniWidget } from '@/components/leaderboard/LeaderboardMiniWidget';
import { DailyChallengeWidget } from '@/components/dashboard/DailyChallengeWidget';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { Award, Flame, Sparkles, BookOpen, ChevronRight, Zap, Target, Timer } from 'lucide-react';
import Link from 'next/link';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';

export default function DashboardPage() {
  const profile = usePrepArenaStore((state) => state.profile);
  const problems = usePrepArenaStore((state) => state.problems);
  const submissions = usePrepArenaStore((state) => state.submissions);
  const userAchievements = usePrepArenaStore((state) => state.userAchievements);
  const achievements = usePrepArenaStore((state) => state.achievements);
  const subjects = usePrepArenaStore((state) => state.subjects);

  const levelInfo = getLevelInfo(profile.xp || 0);
  const { getUserRank } = useLeaderboard();
  const userRank = getUserRank() || 6;
  const leaderboardList = usePrepArenaStore((state) => state.leaderboard);
  const totalCompetitors = leaderboardList.length || 10;
  const topPercent = Math.max(1, Math.round((userRank / totalCompetitors) * 100));

  // Recommended Practice: find 3 unsolved problems based on focus subjects
  const focusSubjects = profile.focus_subjects || [];
  
  let recommendedProblems = problems.filter(prob => {
    const subject = subjects.find(s => s.id === prob.subject_id);
    const subjectSlug = subject ? subject.slug : '';
    const isFocus = focusSubjects.includes(subjectSlug);
    const isSolved = submissions.some(s => s.problem_id === prob.id && s.is_correct);
    return isFocus && !isSolved;
  });

  // Fallback if not enough focus problems
  if (recommendedProblems.length < 3) {
    const generalUnsolved = problems.filter(prob => {
      const isSolved = submissions.some(s => s.problem_id === prob.id && s.is_correct);
      const isAlreadyRecommended = recommendedProblems.some(rp => rp.id === prob.id);
      return !isSolved && !isAlreadyRecommended;
    });
    recommendedProblems = [...recommendedProblems, ...generalUnsolved];
  }

  const unsolved = recommendedProblems.slice(0, 3);

  // Today's featured challenge problem
  const todaysChallenge = recommendedProblems[0] || problems[0];

  // Filter achievements recently earned
  const earnedBadges = achievements.filter(ach => 
    userAchievements.some(ua => ua.achievement_id === ach.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Columns (Main Dashboard Area) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl border border-borderColor bg-gradient-to-r from-bgSecondary to-bgTertiary/40 p-6 md:p-8 shadow-glow">
          {/* Glowing gradient circles */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amberGold/10 blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amberGold animate-pulse" />
                <span className="font-space text-[10px] font-bold text-amberGold uppercase tracking-widest bg-amberGold/10 border border-amberGold/30 px-2 py-0.5 rounded">
                  ICSE Scholar
                </span>
              </div>
              <h2 className="font-space text-2xl font-black text-white leading-tight">
                Welcome back, {profile.full_name?.split(' ')[0] || 'Scholar'}!
              </h2>
              <p className="font-space text-xs text-textSecondary max-w-md leading-relaxed">
                You are currently in the top <strong className="text-primary">{topPercent}%</strong> of all Class 10 candidates. Solve today's physical or computer questions to keep your streak!
              </p>
            </div>

            {/* Streak Milestone badge */}
            <div className="flex items-center gap-3 bg-bgPrimary/60 border border-borderColor rounded-xl p-4 shrink-0 w-full md:w-auto">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-xl animate-bounce">
                🔥
              </div>
              <div>
                <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Study Streak</span>
                <span className="block font-space text-sm font-black text-white">{profile.streak_days} Days Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Exam Entrance Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
              <Timer size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider">
                Simulate Your Board Exam Room
              </h4>
              <p className="font-space text-[11px] text-textSecondary leading-normal max-w-md">
                Launch a timed, 10-minute scholastic test with random syllabus questions to practice under exam conditions.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/mock-exam"
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1 bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl font-space text-xs font-bold shadow-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Start Mock Exam</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Stats Row Cards */}
        <StatsCards />

        {/* Practice heat map calendar */}
        <ActivityCalendar />

        {/* Subject progress modules */}
        <SubjectProgress />

        {/* Recommended Practice problems */}
        <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 shadow-glow space-y-4">
          <div className="flex items-center justify-between border-b border-borderColor pb-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <h3 className="font-space font-bold text-white text-sm">Recommended Unsolved Problems</h3>
            </div>
            <Link 
              href="/problems" 
              className="font-space text-[10px] font-bold text-textMuted hover:text-white uppercase tracking-wider flex items-center gap-0.5 transition-all"
            >
              <span>View All</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {unsolved.map((prob) => (
              <Link 
                key={prob.id}
                href={`/problems/${prob.slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-borderColor/50 bg-bgPrimary/20 hover:bg-bgTertiary/30 hover:border-primary transition-all duration-300"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <h4 className="font-space text-xs font-bold text-white truncate leading-snug">
                    {prob.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <SubjectBadge subjectId={prob.subject_id} className="scale-90" />
                    <DifficultyBadge difficulty={prob.difficulty} className="scale-90" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-space text-[10px] font-black text-amberGold">+{prob.xp_reward} XP</span>
                  <span className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200">
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column (Side Widgets) */}
      <div className="space-y-6">
        
        {/* Today's featured challenge */}
        <DailyChallengeWidget />

        {/* Global mini widget rank leaderboard */}
        <LeaderboardMiniWidget />

        {/* Student Recent submissions list */}
        <RecentActivity />

        {/* Achievements list */}
        <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-4 shadow-glow space-y-3">
          <div className="flex items-center justify-between border-b border-borderColor pb-2.5">
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-amberGold" />
              <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider">Achievements ({earnedBadges.length} / 5)</h4>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {achievements.map((ach) => {
              const isEarned = earnedBadges.some(b => b.id === ach.id);
              
              return (
                <div 
                  key={ach.id} 
                  title={`${ach.name} — ${ach.description}`}
                  className={`h-11 rounded-lg border flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 cursor-pointer ${
                    isEarned 
                      ? 'border-amberGold/30 bg-amberGold/10' 
                      : 'border-borderColor/20 bg-bgPrimary/30 opacity-30 filter grayscale'
                  }`}
                >
                  {ach.icon}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
