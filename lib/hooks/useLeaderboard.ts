import { usePrepArenaStore } from '../store';

export function useLeaderboard(activeTab: 'all_time' | 'weekly' | 'monthly' = 'all_time') {
  const leaderboard = usePrepArenaStore((state) => state.leaderboard);
  const profile = usePrepArenaStore((state) => state.profile);
  const submissions = usePrepArenaStore((state) => state.submissions);

  // Helper to get XP in specified timeframe
  const getTimeframeLeaderboard = () => {
    const now = new Date();
    
    // User timeframe XP
    let userXp = 0;
    if (activeTab === 'all_time') {
      userXp = profile.xp;
    } else {
      const days = activeTab === 'weekly' ? 7 : 30;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      // Calculate from submissions
      const submissionXp = submissions
        .filter(s => new Date(s.submitted_at) >= cutoff)
        .reduce((sum, s) => sum + s.xp_earned, 0);
        
      userXp = submissionXp;

      // Ensure some base showcase XP if the profile has XP
      if (userXp === 0 && profile.xp > 0) {
        userXp = Math.round(profile.xp * (activeTab === 'weekly' ? 0.15 : 0.45));
      }
    }

    // Map the leaderboard list based on timeframe
    const updatedList = leaderboard.map(entry => {
      if (entry.username === profile.username) {
        return { ...entry, xp: userXp };
      }
      
      // Mock student XP scaling for weekly/monthly
      let entryXp = entry.xp;
      const seed = entry.username.length;
      if (activeTab === 'weekly') {
        const factor = 0.06 + ((seed % 5) * 0.025);
        entryXp = Math.round(entry.xp * factor) + (entry.streak_days * 12);
      } else if (activeTab === 'monthly') {
        const factor = 0.28 + ((seed % 5) * 0.045);
        entryXp = Math.round(entry.xp * factor) + (entry.streak_days * 45);
      }

      return { ...entry, xp: entryXp };
    });

    // Re-sort and re-rank
    return updatedList
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  };

  const currentLeaderboard = getTimeframeLeaderboard();

  const getTopThree = () => {
    return currentLeaderboard.slice(0, 3);
  };

  const getFullLeaderboard = () => {
    return currentLeaderboard;
  };

  const getUserRank = () => {
    const entry = currentLeaderboard.find(e => e.username === profile.username);
    return entry ? entry.rank : null;
  };

  return {
    leaderboard: currentLeaderboard,
    getTopThree,
    getFullLeaderboard,
    getUserRank
  };
}
