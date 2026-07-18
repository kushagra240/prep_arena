export const XP_TABLE = {
  mcq: { easy: 10, medium: 20, hard: 35 },
  brief_writing: { easy: 15, medium: 30, hard: 50 },
  streak_bonus: 5,        // per day streak
  first_solve_bonus: 5,   // first time solving a problem
  perfect_score: 10,      // 100% on brief writing
};

export const LEVELS = [
  { level: 1, name: 'Beginner', min_xp: 0 },
  { level: 2, name: 'Learner', min_xp: 100 },
  { level: 3, name: 'Student', min_xp: 300 },
  { level: 4, name: 'Scholar', min_xp: 700 },
  { level: 5, name: 'Expert', min_xp: 1500 },
  { level: 6, name: 'Master', min_xp: 3000 },
  { level: 7, name: 'Champion', min_xp: 6000 },
  { level: 8, name: 'Legend', min_xp: 12000 },
];

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  currentProgressXp: number;
  xpNeededForNext: number;
  percentage: number;
}

export function getLevelInfo(xp: number): LevelInfo {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min_xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i]; // Cap at last level
    } else {
      break;
    }
  }

  const isMaxLevel = currentLevel.level === LEVELS[LEVELS.length - 1].level;
  const minXp = currentLevel.min_xp;
  const maxXp = isMaxLevel ? currentLevel.min_xp + 5000 : nextLevel.min_xp;
  const currentProgressXp = xp - minXp;
  const xpNeededForNext = maxXp - minXp;
  
  let percentage = Math.round((currentProgressXp / xpNeededForNext) * 100);
  if (isMaxLevel) percentage = 100;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    minXp,
    maxXp,
    currentProgressXp,
    xpNeededForNext,
    percentage
  };
}
