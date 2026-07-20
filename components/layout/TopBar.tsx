import React from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { StreakBadge } from '../shared/StreakBadge';
import { XPCounter } from '../shared/XPCounter';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, GraduationCap, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function TopBar() {
  const profile = usePrepArenaStore((state) => state.profile);
  const pathname = usePathname();
  const router = useRouter();

  // Helper to generate dynamic breadcrumb items based on URL
  const getBreadcrumbs = () => {
    const items: { label: string; href?: string }[] = [{ label: 'Dashboard', href: '/dashboard' }];

    if (!pathname || pathname === '/dashboard') {
      return items;
    }

    if (pathname === '/problems') {
      items.push({ label: 'Practice Arena' });
    } else if (pathname.startsWith('/problems/')) {
      items.push({ label: 'Problems', href: '/problems' });
      items.push({ label: 'Problem Solver' });
    } else if (pathname === '/subjects') {
      items.push({ label: 'ICSE Subjects' });
    } else if (pathname.startsWith('/subjects/')) {
      items.push({ label: 'Subjects', href: '/subjects' });
      items.push({ label: 'Syllabus' });
    } else if (pathname === '/leaderboard') {
      items.push({ label: 'Leaderboard' });
    } else if (pathname === '/analytics') {
      items.push({ label: 'Analytics' });
    } else if (pathname === '/flashcards') {
      items.push({ label: 'Flashcards' });
    } else if (pathname.startsWith('/profile/')) {
      items.push({ label: 'Profile' });
    } else if (pathname.startsWith('/dashboard/mock-exam')) {
      items.push({ label: 'Mock Exam' });
    } else if (pathname.startsWith('/dashboard/settings')) {
      items.push({ label: 'Settings' });
    } else if (pathname.startsWith('/admin')) {
      items.push({ label: 'Admin' });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();
  const isSubPage = breadcrumbs.length > 1 && pathname !== '/dashboard';

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-borderColor bg-bgSecondary/90 backdrop-blur-md px-4 sm:px-6 transition-all">
      {/* Title & Interactive Breadcrumbs */}
      <div className="flex items-center gap-2 overflow-hidden">
        {isSubPage && (
          <button
            onClick={() => router.back()}
            title="Go back"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderColor bg-bgPrimary/60 text-textSecondary hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-space text-xs sm:text-sm font-bold truncate">
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="text-textMuted shrink-0" />}
                {isLast || !item.href ? (
                  <span className="text-white truncate max-w-[140px] sm:max-w-[220px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-textSecondary hover:text-primary transition-colors shrink-0"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Global Counters, Search & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Mobile Logo Indicator */}
        <Link href="/dashboard" className="md:hidden mr-1 flex items-center gap-1">
          <GraduationCap className="h-6 w-6 text-primary" />
        </Link>

        {/* Global Command Palette Search Button */}
        <button
          onClick={handleOpenSearch}
          className="flex items-center gap-2 rounded-xl border border-borderColor bg-bgPrimary/70 px-3 py-1.5 font-space text-xs font-bold text-textSecondary hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
        >
          <Search size={14} className="text-primary" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-borderColor/80 bg-bgTertiary px-1.5 font-mono text-[9px] text-textMuted font-bold leading-none">
            ⌘K
          </kbd>
        </button>

        {/* Streak Counter */}
        <StreakBadge streak={profile.streak_days} size="md" />

        {/* XP Total */}
        <XPCounter xp={profile.xp} size="md" />

        <div className="h-6 w-px bg-borderColor hidden sm:block"></div>

        {/* Notifications */}
        <button className="relative p-1.5 text-textSecondary hover:text-white transition-colors duration-200 hidden sm:block">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
        </button>
      </div>
    </header>
  );
}
