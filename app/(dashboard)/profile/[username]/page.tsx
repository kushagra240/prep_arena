'use client';

import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { SubjectBadge } from '@/components/shared/SubjectBadge';
import { DifficultyBadge } from '@/components/shared/DifficultyBadge';
import { XPCounter } from '@/components/shared/XPCounter';
import { clientDb, MOCK_PROBLEMS } from '@/lib/supabase/client';
import { 
  ArrowLeft, School, MapPin, Edit3, Sparkles, ClipboardList, 
  Award, Trophy, History, ShieldAlert, BookOpen, Clock, Loader2, Calendar 
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  school: string;
  city: string;
  grade: string;
  board: string;
  xp: number;
  streak_days: number;
  total_solved: number;
  total_attempted: number;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const currentProfile = usePrepArenaStore((state) => state.profile);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const problems = usePrepArenaStore((state) => state.problems);
  const achievements = usePrepArenaStore((state) => state.achievements);
  const storeSubmissions = usePrepArenaStore((state) => state.submissions);
  const storeUserAchievements = usePrepArenaStore((state) => state.userAchievements);
  const leaderboard = usePrepArenaStore((state) => state.leaderboard);

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'submissions' | 'mock_exams'>('overview');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [mockExams, setMockExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch / Resolve profile details
  useEffect(() => {
    const resolveProfile = () => {
      setLoading(true);
      const isMe = currentProfile.username === params.username;
      
      if (isMe) {
        setProfile(currentProfile as any);
        setSubmissions(storeSubmissions);
        setUserAchievements(storeUserAchievements);
        if (typeof window !== 'undefined') {
          setMockExams(clientDb.getMockExams());
        }
      } else {
        // Try to find the mock student in the leaderboard
        const boardMember = leaderboard.find(u => u.username === params.username);
        
        if (boardMember) {
          const resolvedProfile: ProfileData = {
            id: `mock-${boardMember.username}`,
            username: boardMember.username,
            full_name: boardMember.full_name,
            avatar_url: boardMember.avatar_url,
            school: boardMember.school,
            city: boardMember.city,
            grade: '10',
            board: 'ICSE',
            xp: boardMember.xp,
            streak_days: boardMember.streak_days,
            total_solved: boardMember.total_solved,
            total_attempted: Math.round(boardMember.total_solved / ((boardMember.accuracy || 85) / 100)),
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(resolvedProfile);
          
          // Generate mock submissions for display
          const mockSubs = MOCK_PROBLEMS.slice(0, 4).map((p, idx) => ({
            id: `sub-mock-${idx}`,
            problem_id: p.id,
            is_correct: idx !== 2,
            xp_earned: idx !== 2 ? p.xp_reward : 0,
            submitted_at: new Date(Date.now() - idx * 24 * 3600 * 1000).toISOString(),
            selected_option_id: p.problem_type === 'mcq' ? 'A' : null,
            answer_text: p.problem_type === 'brief_writing' ? 'Mock answers for candidate inspection.' : null
          }));
          setSubmissions(mockSubs);

          // Generate mock achievements for display
          const mockEarned = achievements.slice(0, 2).map((ach) => ({
            id: `ua-mock-${ach.id}`,
            achievement_id: ach.id,
            earned_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
          }));
          setUserAchievements(mockEarned);
          setMockExams([]);
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    };

    resolveProfile();
  }, [params.username, currentProfile, storeSubmissions, storeUserAchievements, leaderboard, achievements]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="font-space text-xs text-textSecondary uppercase tracking-widest">Resolving Candidate File...</p>
      </div>
    );
  }

  if (!profile) {
    return notFound();
  }

  // Calculate Level Progression
  const getLevelInfo = (xp: number) => {
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const currentLevelXp = (level - 1) * (level - 1) * 100;
    const nextLevelXp = level * level * 100;
    const progressInLevel = xp - currentLevelXp;
    const levelRange = nextLevelXp - currentLevelXp;
    const percentage = Math.min(Math.max((progressInLevel / levelRange) * 100, 0), 100);
    
    // Level Badge Names
    let levelName = 'Novice Scribe';
    if (level >= 10) levelName = 'Grand ICSE Scholar 👑';
    else if (level >= 7) levelName = 'Elite Sage';
    else if (level >= 5) levelName = 'High Academician';
    else if (level >= 3) levelName = 'Adept Adept';

    return {
      level,
      percentage,
      name: levelName,
      currentProgressXp: progressInLevel,
      xpNeededForNext: levelRange
    };
  };

  const levelInfo = getLevelInfo(profile.xp);
  const accuracy = profile.total_attempted > 0 
    ? Math.round((profile.total_solved / profile.total_attempted) * 100)
    : 0;

  // Retrieve user ranking from leaderboard
  const userRankEntry = leaderboard.find(e => e.username === profile.username);
  const userRank = userRankEntry ? userRankEntry.rank : 'N/A';

  // Radar chart data prep
  const getRadarData = () => {
    return subjects.slice(0, 5).map(sub => {
      const solved = submissions.filter(s => {
        const prob = problems.find(p => p.id === s.problem_id) || MOCK_PROBLEMS.find(p => p.id === s.problem_id);
        return prob && prob.subject_id === sub.id && s.is_correct;
      }).length;
      return {
        subject: sub.name.split(' ')[0], // short name
        Solved: solved + 0.1, // small offset to prevent layout bugs
        total: 5
      };
    });
  };

  const radarData = getRadarData();

  return (
    <div className="space-y-6">
      
      {/* Back to leaderboard link */}
      <div className="flex items-center gap-3">
        <Link 
          href="/leaderboard" 
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-borderColor bg-bgSecondary/85 text-textSecondary hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Candidate Profile</span>
      </div>

      {/* Header Profile Info Panel */}
      <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 md:p-8 shadow-glow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
            <div className="relative">
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name} 
                className="h-20 w-20 rounded-full border-2 border-primary/50 object-cover bg-bgPrimary p-1"
              />
              <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] font-mono font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-bgSecondary">
                {levelInfo.level}
              </span>
            </div>
            
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-space text-xs font-bold text-textMuted font-mono">@{profile.username}</span>
                <span className="inline-flex items-center gap-1 rounded bg-amberGold/15 border border-amberGold/30 px-2 py-0.5 text-[9px] font-bold font-space text-amberGold uppercase tracking-widest">
                  <Trophy size={10} className="fill-amberGold text-amberGold" />
                  <span>Rank #{userRank}</span>
                </span>
              </div>
              
              <h2 className="font-space text-xl md:text-2xl font-black text-white leading-tight truncate">
                {profile.full_name || 'Scholar Student'}
              </h2>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-textSecondary font-space">
                <span className="flex items-center gap-1">
                  <School size={14} className="text-textMuted" />
                  <span className="truncate max-w-[200px]">{profile.school || 'Unspecified Board School'}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-borderColor hidden sm:inline-block"></span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-textMuted" />
                  <span>{profile.city || 'India'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit Settings trigger for own profile */}
          {profile.username === currentProfile.username && (
            <div className="w-full md:w-auto flex justify-center shrink-0">
              <Link
                href="/dashboard/settings"
                className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-borderColor bg-bgTertiary/30 hover:bg-bgTertiary text-white px-5 py-3 font-space text-xs font-bold transition-all duration-300"
              >
                <Edit3 size={14} />
                <span>Configure Profile</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Horizontally Scrollable Tab Navigation Bar */}
      <div className="flex overflow-x-auto pb-1 mb-6 gap-2 border-b border-borderColor/40 scrollbar-none select-none">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'submissions', label: 'Submissions', icon: History },
          { id: 'mock_exams', label: 'Mock Exams', icon: ClipboardList }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-space text-xs font-bold shrink-0 transition-all ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20 text-white' 
                  : 'text-textSecondary hover:text-white border border-transparent'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Col: stats + level */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Level Progress */}
              <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4 shadow-glow">
                <div className="flex items-center gap-2 border-b border-borderColor pb-3">
                  <Sparkles size={16} className="text-amberGold animate-pulse" />
                  <h3 className="font-space font-bold text-white text-sm">Level Progress</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Class Standing</span>
                      <span className="block font-space text-base font-black text-amberGold uppercase leading-tight">{levelInfo.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-space text-[10px] text-textMuted uppercase font-bold">Progress</span>
                      <span className="block font-space text-xs font-bold text-white">Level {levelInfo.level} • {profile.xp} XP</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-bgTertiary overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-amberGold transition-all duration-500"
                        style={{ width: `${levelInfo.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-space text-textMuted font-bold">
                      <span>{levelInfo.currentProgressXp} XP</span>
                      <span>{levelInfo.xpNeededForNext - levelInfo.currentProgressXp} XP to Level {levelInfo.level + 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid: Responsive 2x3 on mobile, 3x2 on tablet, 6-col on desktop */}
              <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4 shadow-glow">
                <div className="flex items-center gap-2 border-b border-borderColor pb-3">
                  <ClipboardList size={16} className="text-primary" />
                  <h3 className="font-space font-bold text-white text-sm">Scholastic Statistics</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Rank', value: `#${userRank}`, color: 'text-amberGold' },
                    { label: 'Total XP', value: profile.xp.toLocaleString(), color: 'text-white' },
                    { label: 'Solved', value: profile.total_solved, color: 'text-correct' },
                    { label: 'Attempted', value: profile.total_attempted, color: 'text-white' },
                    { label: 'Accuracy', value: `${accuracy}%`, color: 'text-primary' },
                    { label: 'Streak', value: `${profile.streak_days}d`, color: 'text-orange-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-bgPrimary/30 rounded-xl border border-borderColor/40 text-center font-space">
                      <span className="block text-[9px] font-bold text-textMuted uppercase tracking-wider">{stat.label}</span>
                      <span className={`block text-base font-black mt-1 ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Radar Strength Chart */}
            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 shadow-glow flex flex-col items-center">
              <div className="flex items-center gap-2 border-b border-borderColor pb-3 w-full mb-4">
                <Trophy size={16} className="text-amberGold" />
                <h3 className="font-space font-bold text-white text-sm">Subject Strengths</h3>
              </div>

              {mounted ? (
                <div className="w-full max-w-[300px] h-[260px] mx-auto flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Grotesk' }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 5]} 
                        tick={{ fill: '#475569', fontSize: 8 }}
                      />
                      <Radar
                        name="Solved"
                        dataKey="Solved"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[260px] w-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}
            </div>

          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 shadow-glow space-y-4">
            <div className="flex items-center gap-2 border-b border-borderColor pb-3">
              <Award size={18} className="text-amberGold animate-pulse-glow" />
              <h3 className="font-space font-bold text-white text-sm">Scholar Medals</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((ach) => {
                const isEarned = userAchievements.some(ua => ua.achievement_id === ach.id);
                const earnedRecord = userAchievements.find(ua => ua.achievement_id === ach.id);

                return (
                  <div 
                    key={ach.id} 
                    className={`rounded-xl border p-4 flex gap-3.5 items-start transition-all duration-300 ${
                      isEarned 
                        ? 'border-amberGold/30 bg-amberGold/5 shadow-amberGlow' 
                        : 'border-borderColor/20 bg-bgPrimary/30 opacity-40 filter grayscale'
                    }`}
                  >
                    <span className="text-3xl shrink-0 select-none animate-float" style={{ animationDelay: `${ach.xp_bonus % 3}s` }}>
                      {ach.icon}
                    </span>
                    
                    <div className="space-y-1 overflow-hidden">
                      <h4 className={`font-space text-xs font-bold truncate leading-snug ${isEarned ? 'text-amberGold' : 'text-textSecondary'}`}>
                        {ach.name}
                      </h4>
                      <p className="font-space text-[10px] text-textMuted leading-snug">
                        {ach.description}
                      </p>
                      
                      {isEarned && earnedRecord && (
                        <span className="inline-block font-space text-[8px] text-amberGold font-extrabold uppercase bg-amberGold/10 px-1.5 py-0.5 rounded tracking-wide mt-1.5">
                          Earned {new Date(earnedRecord.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBMISSIONS TAB */}
        {activeTab === 'submissions' && (
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 shadow-glow space-y-4">
            <div className="flex items-center gap-2 border-b border-borderColor pb-3">
              <History size={18} className="text-primary" />
              <h3 className="font-space font-bold text-white text-sm">Chronological Submission Ledger</h3>
            </div>

            {submissions.length > 0 ? (
              <div className="space-y-3.5">
                {submissions.map((sub) => {
                  const prob = problems.find(p => p.id === sub.problem_id) || MOCK_PROBLEMS.find(p => p.id === sub.problem_id);
                  if (!prob) return null;

                  return (
                    <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-borderColor/60 bg-bgPrimary/20 gap-3.5 hover:border-borderColor transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${sub.is_correct ? 'bg-correct animate-pulse' : 'bg-wrong'}`} />
                        <div className="space-y-1">
                          <Link 
                            href={`/problems/${prob.slug}`}
                            className="font-space text-xs font-bold text-white hover:text-primary hover:underline transition-colors block"
                          >
                            {prob.title}
                          </Link>
                          <span className="block font-space text-[10px] text-textMuted flex items-center gap-1">
                            <span>Solved on {new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-borderColor/20 pt-2 sm:border-0 sm:pt-0">
                        <SubjectBadge subjectId={prob.subject_id} />
                        <DifficultyBadge difficulty={prob.difficulty} />
                        {sub.is_correct ? (
                          <XPCounter xp={sub.xp_earned || prob.xp_reward} size="sm" />
                        ) : (
                          <span className="font-space text-[10px] font-extrabold uppercase text-wrong px-2 py-1 rounded bg-wrong/10 border border-wrong/20">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-borderColor/40 rounded-xl bg-bgPrimary/10">
                <BookOpen className="h-8 w-8 text-textMuted mx-auto mb-2" />
                <p className="font-space text-xs text-textMuted uppercase tracking-wide">No submissions found</p>
              </div>
            )}
          </div>
        )}

        {/* MOCK EXAMS TAB */}
        {activeTab === 'mock_exams' && (
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 shadow-glow space-y-4">
            <div className="flex items-center gap-2 border-b border-borderColor pb-3">
              <ClipboardList size={18} className="text-amberGold" />
              <h3 className="font-space font-bold text-white text-sm">Completed Mock Exams</h3>
            </div>

            {mockExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockExams.map((exam) => (
                  <div key={exam.id} className="border border-borderColor/60 bg-bgPrimary/20 rounded-xl p-4.5 space-y-3 hover:border-borderColor transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-space text-[10px] font-bold text-textMuted uppercase">
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black font-space border ${
                        exam.grade.startsWith('A') 
                          ? 'bg-correct/10 border-correct text-correct' 
                          : exam.grade.startsWith('E')
                          ? 'bg-wrong/10 border-wrong text-wrong'
                          : 'bg-amberGold/10 border-amberGold text-amberGold'
                      }`}>
                        Grade {exam.grade}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-space text-xs font-bold text-white leading-tight">
                        {exam.subjectId === 'all' ? 'General ICSE Test' : subjects.find(s => s.id === exam.subjectId)?.name || 'ICSE Exam'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-textSecondary font-space">
                        <span className="flex items-center gap-0.5">
                          <BookOpen size={12} className="text-textMuted" />
                          <span>{exam.totalQuestions} Questions</span>
                        </span>
                        <span className="h-1 w-1 bg-borderColor rounded-full" />
                        <span className="flex items-center gap-0.5">
                          <Clock size={12} className="text-textMuted" />
                          <span>{Math.round(exam.timeTakenSeconds / 60)} mins</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-borderColor/30 pt-3 text-[10px] font-space font-bold uppercase">
                      <span className="text-textMuted">Score: {exam.score} / {exam.totalQuestions}</span>
                      <Link 
                        href={`/dashboard/mock-exam/results/${exam.id}`}
                        className="text-primary hover:underline hover:text-primary-hover flex items-center gap-0.5"
                      >
                        <span>View Diagnostics</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-borderColor/40 rounded-xl bg-bgPrimary/10">
                <ShieldAlert className="h-8 w-8 text-textMuted mx-auto mb-2" />
                <p className="font-space text-xs text-textMuted uppercase tracking-wide">No mock exams recorded yet</p>
                {profile.username === currentProfile.username && (
                  <Link
                    href="/dashboard/mock-exam"
                    className="inline-block mt-3 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all font-space uppercase tracking-wider"
                  >
                    Take A Mock Exam
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
