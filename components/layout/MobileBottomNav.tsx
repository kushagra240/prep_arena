'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrepArenaStore } from '@/lib/store';
import { LayoutDashboard, BookOpen, Layers, Trophy, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const profile = usePrepArenaStore((state) => state.profile);

  const navItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Problems', icon: BookOpen, href: '/problems' },
    { name: 'Subjects', icon: Layers, href: '/subjects' },
    { name: 'Ranks', icon: Trophy, href: '/leaderboard' },
    { name: 'Profile', icon: User, href: `/profile/${profile.username || 'kushagra_icse'}` }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block border-t border-borderColor/60 bg-bgSecondary/90 backdrop-blur-lg md:hidden pb-[env(safe-area-inset-bottom,0.5rem)] pt-2">
      <div className="flex h-12 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                isActive 
                  ? 'text-primary scale-105 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20' 
                  : 'text-textMuted hover:text-white p-2'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary' : 'text-textMuted'} />
              {isActive && (
                <span className="font-space text-[9px] font-extrabold tracking-wider uppercase mt-0.5">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
