'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrepArenaStore } from '@/lib/store';
import { LayoutDashboard, BookOpen, Layers, Trophy, User, Search } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const profile = usePrepArenaStore((state) => state.profile);

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  const navItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Problems', icon: BookOpen, href: '/problems' },
    { name: 'Subjects', icon: Layers, href: '/subjects' },
    { name: 'Ranks', icon: Trophy, href: '/leaderboard' },
    { name: 'Profile', icon: User, href: `/profile/${profile.username || 'kushagra_icse'}` }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block border-t border-borderColor/60 bg-bgSecondary/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom,0.5rem)] pt-1.5">
      <div className="flex h-13 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 min-w-[54px] ${
                isActive 
                  ? 'text-primary scale-105 bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 glow-primary' 
                  : 'text-textMuted active:scale-95 p-1.5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary' : 'text-textMuted'} />
              <span className={`font-space text-[9px] font-bold tracking-wider uppercase mt-0.5 ${isActive ? 'text-primary' : 'text-textMuted'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Quick Search Mobile Action */}
        <button
          onClick={handleOpenSearch}
          aria-label="Search"
          className="flex flex-col items-center justify-center text-textMuted active:scale-95 p-1.5 min-w-[54px]"
        >
          <Search size={18} className="text-amberGold" />
          <span className="font-space text-[9px] font-bold tracking-wider uppercase text-amberGold mt-0.5">
            Search
          </span>
        </button>
      </div>
    </nav>
  );
}
