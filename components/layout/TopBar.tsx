import React from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { StreakBadge } from '../shared/StreakBadge';
import { XPCounter } from '../shared/XPCounter';
import { usePathname } from 'next/navigation';
import { Bell, Trophy, BookOpen, GraduationCap, Search } from 'lucide-react';
import Link from 'next/link';

export function TopBar() {
  const profile = usePrepArenaStore((state) => state.profile);
  const pathname = usePathname();

  // Create human-readable title based on routing
  const getPageTitle = () => {
    if (pathname === '/dashboard') return '🏠 Dashboard';
    if (pathname === '/problems') return '📚 Practice Arena';
    if (pathname?.startsWith('/problems/')) return '📝 Problem Solver';
    if (pathname === '/subjects') return '📖 ICSE Subjects';
    if (pathname?.startsWith('/subjects/')) return '📖 Subject Syllabus';
    if (pathname === '/leaderboard') return '🏆 Global Leaderboard';
    if (pathname?.startsWith('/profile/')) return '👤 Student Profile';
    return '🎓 PrepArena';
  };

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-borderColor bg-bgSecondary/85 backdrop-blur-md px-6">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="font-space text-lg font-bold text-white md:text-xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Global Counters and Actions */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo Indicator */}
        <Link href="/" className="md:hidden mr-2 flex items-center gap-1">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-space font-bold text-white text-sm">PrepA</span>
        </Link>

        {/* Command Palette Trigger Button (Desktop search bar keyboard shortcut hint) */}
        <button
          onClick={handleOpenSearch}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-borderColor bg-bgPrimary/60 px-3 py-1.5 font-space text-[10px] font-bold text-textSecondary hover:text-white hover:border-borderColor/80 transition-all duration-300"
        >
          <Search size={12} className="text-textMuted" />
          <span>Search</span>
          <kbd className="h-4.5 select-none items-center gap-0.5 rounded border border-borderColor/80 bg-bgTertiary px-1.5 font-mono text-[9px] text-textMuted font-bold leading-none">
            ⌘K
          </kbd>
        </button>

        {/* Streak Counter */}
        <StreakBadge streak={profile.streak_days} size="md" />

        {/* XP Total */}
        <XPCounter xp={profile.xp} size="md" />

        {/* Action Buttons */}
        <div className="h-8 w-px bg-borderColor hidden sm:block"></div>

        <button className="relative p-1.5 text-textSecondary hover:text-white transition-colors duration-200 hidden sm:block">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
        </button>
      </div>
    </header>
  );
}
