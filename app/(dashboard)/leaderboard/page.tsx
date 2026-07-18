'use client';

import React, { useState } from 'react';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { Sparkles, Trophy, Calendar, Globe, GraduationCap } from 'lucide-react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'all_time' | 'weekly' | 'monthly'>('all_time');

  const tabs = [
    { id: 'all_time', label: 'All Time', icon: Globe },
    { id: 'weekly', label: 'This Week', icon: Calendar },
    { id: 'monthly', label: 'This Month', icon: GraduationCap }
  ];

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amberGold font-bold uppercase tracking-wider font-space">
            <Trophy size={14} className="animate-pulse" />
            <span>Competitive Board Rankings</span>
          </div>
          <h2 className="font-space text-2xl font-black text-white leading-tight">
            Scholastic Leaderboard
          </h2>
          <p className="font-space text-xs text-textSecondary max-w-xl leading-relaxed">
            Practice daily, earn XP, maintain streaks, and compete with Class 10 ICSE students across prestigious board institutions in India.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex bg-bgSecondary border border-borderColor rounded-xl p-1 shrink-0 self-start md:self-auto select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-space text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Renders global standings */}
      <LeaderboardTable activeTab={activeTab} />
    </div>
  );
}
