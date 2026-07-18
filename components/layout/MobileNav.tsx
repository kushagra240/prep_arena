import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrepArenaStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Trophy, 
  User 
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const profile = usePrepArenaStore((state) => state.profile);

  const navItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Problems', icon: BookOpen, href: '/problems' },
    { name: 'Subjects', icon: Layers, href: '/subjects' },
    { name: 'Ranks', icon: Trophy, href: '/leaderboard' },
    { name: 'Me', icon: User, href: `/profile/${profile.username || 'kushagra_icse'}` }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 block border-t border-borderColor bg-bgSecondary/95 backdrop-blur-md md:hidden pb-safe-bottom">
      <div className="flex h-14 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-lg font-space text-[10px] font-semibold transition-all duration-200 ${
                isActive 
                  ? 'text-primary scale-105' 
                  : 'text-textSecondary hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-primary animate-pulse' : 'text-textMuted'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
