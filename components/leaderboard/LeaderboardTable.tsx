import React from 'react';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { usePrepArenaStore } from '@/lib/store';
import { Award, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardTableProps {
  activeTab?: 'all_time' | 'weekly' | 'monthly';
}

export function LeaderboardTable({ activeTab = 'all_time' }: LeaderboardTableProps) {
  const { getFullLeaderboard, getTopThree } = useLeaderboard(activeTab);
  const profile = usePrepArenaStore((state) => state.profile);

  const fullList = getFullLeaderboard();
  const topThree = getTopThree();
  const restList = fullList.slice(3);

  const podiumMedals = ['🥇', '🥈', '🥉'];
  const podiumBorders = [
    'border-amberGold bg-amberGold/5 shadow-amberGlow',
    'border-slate-300 bg-slate-300/5 shadow-[0_0_15px_rgba(203,213,225,0.1)]',
    'border-amber-700 bg-amber-700/5 shadow-[0_0_15px_rgba(180,83,9,0.1)]'
  ];
  const podiumText = ['text-amberGold', 'text-slate-300', 'text-amber-600'];

  return (
    <div className="space-y-8">
      {/* Top 3 podium cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Render 2nd place, 1st place, 3rd place for classic podium styling */}
        {[topThree[1], topThree[0], topThree[2]].map((entry, idx) => {
          if (!entry) return null;
          // Determine actual position
          const position = entry.rank - 1; // 0, 1 or 2

          return (
            <Link 
              href={`/profile/${entry.username}`}
              key={entry.username} 
              className={`rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 cursor-pointer ${
                entry.username === profile.username 
                  ? 'border-primary bg-primary/5 shadow-glow scale-[1.02]' 
                  : podiumBorders[position]
              } ${position === 0 ? 'md:py-8 md:scale-105 order-first md:order-none' : 'order-last'}`}
            >
              <div className="relative">
                <img 
                  src={entry.avatar_url} 
                  alt={entry.full_name} 
                  className={`h-16 w-16 rounded-full object-cover border-2 ${
                    position === 0 ? 'border-amberGold' : position === 1 ? 'border-slate-300' : 'border-amber-700'
                  }`}
                />
                <span className="absolute -top-3.5 -right-3 text-2xl animate-float">
                  {podiumMedals[position]}
                </span>
              </div>

              <div className="mt-3.5 space-y-1">
                <h4 className="font-space font-bold text-white text-sm truncate max-w-[150px]">
                  {entry.full_name}
                </h4>
                <p className="font-space text-xs text-textSecondary">
                  @{entry.username}
                </p>
                <div className="text-[10px] font-space text-textMuted uppercase truncate max-w-[170px]">
                  {entry.school}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between w-full border-t border-borderColor/40 pt-3">
                <div className="text-left font-space">
                  <span className={`block text-base font-black ${podiumText[position]}`}>{entry.xp.toLocaleString()}</span>
                  <span className="text-[9px] text-textMuted uppercase font-semibold">Total XP</span>
                </div>
                <div className="text-right font-space">
                  <span className="block text-xs font-bold text-white flex items-center gap-1 justify-end">
                    <Flame size={12} className="text-orange-500 fill-orange-500 shrink-0" />
                    <span>{entry.streak_days}</span>
                  </span>
                  <span className="text-[9px] text-textMuted uppercase font-semibold">Streak</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Ranks 4+ Table */}
      <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 overflow-hidden shadow-glow">
        <div className="p-4 bg-bgTertiary/30 border-b border-borderColor flex items-center gap-2">
          <Sparkles size={14} className="text-amberGold animate-pulse" />
          <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider">Top ICSE Board Practice Scholars</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-space">
            <thead>
              <tr className="border-b border-borderColor text-[10px] text-textMuted uppercase font-bold tracking-wider">
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">School</th>
                <th className="py-3.5 px-4">XP</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Solved</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Accuracy</th>
                <th className="py-3.5 px-5 text-right">Streak</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-borderColor/20 text-xs">
              {restList.map((entry) => {
                const isMe = entry.username === profile.username;
                
                return (
                  <tr 
                    key={entry.username} 
                    className={`transition-colors duration-200 ${
                      isMe 
                        ? 'bg-primary/5 text-primary font-bold border-l-2 border-l-primary' 
                        : 'hover:bg-bgTertiary/30 text-textSecondary hover:text-white'
                    }`}
                  >
                    <td className={`py-4 px-5 font-bold ${isMe ? 'text-primary' : 'text-white'}`}>
                      #{entry.rank}
                    </td>
                    <td className="py-4 px-4">
                      <Link 
                        href={`/profile/${entry.username}`}
                        className="flex items-center gap-2.5 hover:underline group cursor-pointer"
                      >
                        <img 
                          src={entry.avatar_url} 
                          alt={entry.full_name} 
                          className="h-7 w-7 rounded-full object-cover border border-borderColor group-hover:border-primary/50 transition-colors shrink-0"
                        />
                        <div className="truncate">
                          <span className="block font-bold text-white group-hover:text-primary transition-colors truncate max-w-[120px]">{entry.full_name}</span>
                          <span className="block text-[10px] text-textMuted">@{entry.username}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell truncate max-w-[150px] text-textMuted">
                      {entry.school}
                    </td>
                    <td className={`py-4 px-4 font-black ${isMe ? 'text-primary' : 'text-amberGold'}`}>
                      {entry.xp.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell font-mono text-white">
                      {entry.total_solved}
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell font-mono text-white">
                      {entry.accuracy}%
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center gap-1.5 justify-end font-bold text-white">
                        <Flame size={12} className="text-orange-500 fill-orange-500" />
                        <span>{entry.streak_days}d</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
