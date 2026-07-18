import React from 'react';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { usePrepArenaStore } from '@/lib/store';
import { Trophy, Flame } from 'lucide-react';
import Link from 'next/link';

export function LeaderboardMiniWidget() {
  const { leaderboard } = useLeaderboard();
  const profile = usePrepArenaStore((state) => state.profile);

  const topFive = leaderboard.slice(0, 5);
  const podiumEmojis = ['🥇', '🥈', '🥉', '4', '5'];

  return (
    <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-4 shadow-glow space-y-4">
      <div className="flex items-center justify-between border-b border-borderColor pb-2.5">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amberGold animate-pulse" />
          <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider">Top ICSE Peers</h4>
        </div>
        <Link 
          href="/leaderboard"
          className="font-space text-[10px] font-bold text-primary hover:text-primary-hover hover:underline uppercase transition-all"
        >
          View All
        </Link>
      </div>

      <div className="space-y-2.5">
        {topFive.map((student, idx) => {
          const isMe = student.username === profile.username;
          const isPodium = idx < 3;

          return (
            <div 
              key={student.username} 
              className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 ${
                isMe 
                  ? 'border-primary bg-primary/5 shadow-glow' 
                  : 'border-borderColor/20 bg-bgPrimary/20 hover:bg-bgTertiary/30 hover:border-borderColor/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center font-space text-[10px] font-black ${
                  idx === 0 ? 'text-amberGold text-sm' : idx === 1 ? 'text-slate-300 text-sm' : idx === 2 ? 'text-amber-600 text-sm' : 'text-textMuted'
                }`}>
                  {podiumEmojis[idx]}
                </span>
                
                <img 
                  src={student.avatar_url} 
                  alt={student.full_name} 
                  className="h-6 w-6 rounded-full object-cover shrink-0 border border-borderColor"
                />
                
                <div className="min-w-0">
                  <span className="block font-space text-xs font-bold text-white truncate max-w-[100px]">
                    {student.full_name}
                  </span>
                  <span className="block font-space text-[9px] text-textMuted truncate max-w-[100px]">
                    @{student.username}
                  </span>
                </div>
              </div>

              <div className="text-right font-space shrink-0 pl-2">
                <span className="block text-[11px] font-black text-amberGold">
                  {student.xp.toLocaleString()} XP
                </span>
                <span className="block text-[8px] text-textMuted font-bold uppercase tracking-wider">
                  {student.total_solved} solved
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
