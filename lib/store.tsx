import { create } from 'zustand';
import { clientDb, MOCK_PROBLEMS, MOCK_SUBJECTS, MOCK_CHAPTERS, MOCK_ACHIEVEMENTS } from './supabase/client';
import { Profile, Problem, Subject, Chapter, Submission, Achievement, UserAchievement } from './supabase/types';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PrepArenaState {
  profile: Profile;
  problems: Problem[];
  subjects: Subject[];
  chapters: Chapter[];
  submissions: Submission[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  leaderboard: any[];
  isLoading: boolean;

  // Actions
  refreshState: () => void;
  submitAnswer: (
    problemId: string, 
    payload: { 
      selectedOptionId?: string; 
      answerText?: string; 
      isCorrect: boolean; 
      aiScore?: number; 
      aiFeedback?: string; 
      timeTakenSeconds: number;
    }
  ) => { submission: Submission; xpEarned: number; achievementsUnlocked: Achievement[] };
  submitAnswers: (
    submissionsPayloads: {
      problemId: string;
      payload: {
        selectedOptionId?: string;
        answerText?: string;
        isCorrect: boolean;
        aiScore?: number;
        aiFeedback?: string;
        timeTakenSeconds: number;
      };
    }[]
  ) => { submissions: Submission[]; xpEarned: number; achievementsUnlocked: Achievement[] };
  updateProfileDetails: (
    fullName: string, 
    school: string, 
    city: string,
    username?: string,
    avatarUrl?: string,
    focusSubjects?: string[]
  ) => void;
}

const SERVER_FALLBACK_PROFILE: Profile = {
  id: 'user-id-mock-student',
  clerk_user_id: 'user-id-mock-student',
  username: 'kushagra_icse',
  full_name: 'Kushagra Dev',
  school: "St. Xavier's High School",
  city: 'Mumbai',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  grade: 'Class 10',
  board: 'ICSE',
  xp: 1450,
  streak_days: 7,
  last_activity_date: '2026-06-02',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  total_solved: 14,
  total_attempted: 18,
  focus_subjects: []
};

export const usePrepArenaStore = create<PrepArenaState>((set, get) => ({
  profile: typeof window !== 'undefined' ? clientDb.getProfile() : SERVER_FALLBACK_PROFILE,
  problems: typeof window !== 'undefined' ? clientDb.getProblems() : MOCK_PROBLEMS,
  subjects: MOCK_SUBJECTS,
  chapters: typeof window !== 'undefined' ? clientDb.getChapters() : MOCK_CHAPTERS,
  submissions: typeof window !== 'undefined' ? clientDb.getSubmissions() : [],
  achievements: MOCK_ACHIEVEMENTS,
  userAchievements: typeof window !== 'undefined' ? clientDb.getUserAchievements() : [],
  leaderboard: typeof window !== 'undefined' ? clientDb.getLeaderboard() : [],
  isLoading: false,

  refreshState: () => {
    set({
      profile: clientDb.getProfile(),
      problems: typeof window !== 'undefined' ? clientDb.getProblems() : MOCK_PROBLEMS,
      chapters: typeof window !== 'undefined' ? clientDb.getChapters() : MOCK_CHAPTERS,
      submissions: clientDb.getSubmissions(),
      userAchievements: clientDb.getUserAchievements(),
      leaderboard: clientDb.getLeaderboard()
    });
  },

  submitAnswer: (problemId, payload) => {
    set({ isLoading: true });
    
    // Process submission via local db engine
    const result = clientDb.submitAnswer(problemId, payload);
    
    // Sync store with new storage values
    set({
      profile: result.newProfile,
      submissions: clientDb.getSubmissions(),
      userAchievements: clientDb.getUserAchievements(),
      leaderboard: clientDb.getLeaderboard(),
      isLoading: false
    });

    // Notify XP gain
    if (result.xpEarned > 0) {
      toast.success(`+${result.xpEarned} XP Earned!`, {
        description: 'Keep practicing to increase your rank!',
        duration: 3000
      });
    }

    // Process achievement unlocks
    if (result.achievementsUnlocked.length > 0) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      result.achievementsUnlocked.forEach((ach) => {
        toast.custom(() => (
          <div className="bg-bgSecondary border border-primary/40 rounded-2xl p-4 shadow-glow flex items-center gap-4 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
              {ach.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-space text-[9px] font-extrabold text-primary uppercase tracking-wider">
                Achievement Unlocked!
              </span>
              <h4 className="font-space text-xs font-black text-white truncate">{ach.name}</h4>
              <p className="font-space text-[10px] text-textMuted leading-snug mt-0.5">{ach.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-space text-[10px] font-black text-correct bg-correct/10 border border-correct/20 px-2 py-0.5 rounded">
                +{ach.xp_bonus} XP
              </span>
            </div>
          </div>
        ), { duration: 6000 });
      });
    }

    return {
      submission: result.submission,
      xpEarned: result.xpEarned,
      achievementsUnlocked: result.achievementsUnlocked
    };
  },

  submitAnswers: (submissionsPayloads) => {
    set({ isLoading: true });
    
    // Process submissions via local db engine in batch
    const result = clientDb.submitAnswers(submissionsPayloads);
    
    // Sync store with new storage values
    set({
      profile: result.newProfile,
      submissions: clientDb.getSubmissions(),
      userAchievements: clientDb.getUserAchievements(),
      leaderboard: clientDb.getLeaderboard(),
      isLoading: false
    });

    // Notify total XP gain once
    if (result.xpEarned > 0) {
      toast.success(`+${result.xpEarned} Total XP Earned!`, {
        description: 'Mock exam grading complete. Keep practicing!',
        duration: 4000
      });
    }

    // Process achievement unlocks
    if (result.achievementsUnlocked.length > 0) {
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      result.achievementsUnlocked.forEach((ach) => {
        toast.custom(() => (
          <div className="bg-bgSecondary border border-primary/40 rounded-2xl p-4 shadow-glow flex items-center gap-4 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
              {ach.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-space text-[9px] font-extrabold text-primary uppercase tracking-wider">
                Achievement Unlocked!
              </span>
              <h4 className="font-space text-xs font-black text-white truncate">{ach.name}</h4>
              <p className="font-space text-[10px] text-textMuted leading-snug mt-0.5">{ach.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-space text-[10px] font-black text-correct bg-correct/10 border border-correct/20 px-2 py-0.5 rounded">
                +{ach.xp_bonus} XP
              </span>
            </div>
          </div>
        ), { duration: 6000 });
      });
    }

    return {
      submissions: result.submissions,
      xpEarned: result.xpEarned,
      achievementsUnlocked: result.achievementsUnlocked
    };
  },

  updateProfileDetails: (fullName, school, city, username, avatarUrl, focusSubjects) => {
    const profile = get().profile;
    const updatedProfile = {
      ...profile,
      full_name: fullName,
      school,
      city,
      username: username || profile.username,
      avatar_url: avatarUrl || profile.avatar_url,
      focus_subjects: focusSubjects || profile.focus_subjects || [],
      updated_at: new Date().toISOString()
    };
    clientDb.saveProfile(updatedProfile);
    set({ 
      profile: updatedProfile,
      leaderboard: clientDb.getLeaderboard()
    });
  }
}));
