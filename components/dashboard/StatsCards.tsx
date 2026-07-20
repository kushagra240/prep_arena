import React from 'react';
import { motion } from 'framer-motion';
import { usePrepArenaStore } from '@/lib/store';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { CheckCircle2, Percent, Trophy, CalendarDays } from 'lucide-react';

export function StatsCards() {
  const profile = usePrepArenaStore((state) => state.profile);
  const submissions = usePrepArenaStore((state) => state.submissions);
  const { getUserRank } = useLeaderboard();

  // Metrics calculations
  const totalSub = submissions.length;
  const correctSub = submissions.filter(s => s.is_correct).length;
  const accuracy = totalSub > 0 ? Math.round((correctSub / totalSub) * 100) : 0;
  const userRank = getUserRank() || 6; // default rank placeholder

  // Dynamic active days (unique submission days)
  const uniqueDays = new Set(
    submissions.map(s => s.submitted_at.split('T')[0])
  ).size;

  const stats = [
    {
      name: 'Questions Solved',
      value: profile.total_solved || 0,
      subText: `out of ${profile.total_attempted || 0} attempted`,
      icon: CheckCircle2,
      color: 'text-correct border-correct/20 bg-correct/5 shadow-correctGlow'
    },
    {
      name: 'Board Accuracy',
      value: `${accuracy}%`,
      subText: `${correctSub} correct submissions`,
      icon: Percent,
      color: 'text-primary border-primary/20 bg-primary/5 shadow-glow'
    },
    {
      name: 'Global Board Rank',
      value: `#${userRank}`,
      subText: 'among all ICSE competitors',
      icon: Trophy,
      color: 'text-amberGold border-amberGold/20 bg-amberGold/5 shadow-amberGlow'
    },
    {
      name: 'Active Study Days',
      value: uniqueDays || 1,
      subText: `Current streak: ${profile.streak_days} days`,
      icon: CalendarDays,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -3 }}
            className={`rounded-2xl border bg-bgSecondary/40 p-4 sm:p-5 flex flex-col justify-between transition-colors duration-200 hover-sheen ${stat.color.split(' ').slice(1).join(' ')}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-[10px] sm:text-xs font-bold text-textSecondary uppercase tracking-wider">{stat.name}</span>
              <Icon size={16} className={stat.color.split(' ')[0]} />
            </div>
            
            <div>
              <h3 className="font-space text-xl sm:text-2xl font-black text-white leading-tight">
                {stat.value}
              </h3>
              <p className="font-space text-[10px] sm:text-xs text-textMuted mt-0.5">
                {stat.subText}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
