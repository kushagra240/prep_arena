import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrepArenaStore } from '@/lib/store';
import { getLevelInfo } from '@/lib/utils/xp';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Trophy, 
  User, 
  Settings, 
  GraduationCap
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const profile = usePrepArenaStore((state) => state.profile);
  const levelInfo = getLevelInfo(profile.xp || 0);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Problems', icon: BookOpen, href: '/problems' },
    { name: 'Subjects', icon: Layers, href: '/subjects' },
    { name: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { name: 'Profile', icon: User, href: `/profile/${profile.username || 'kushagra_icse'}` },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-borderColor bg-bgSecondary md:flex md:flex-col">
      {/* Header / Logo */}
      <div className="flex h-16 items-center px-6 gap-2 border-b border-borderColor">
        <GraduationCap className="h-8 w-8 text-primary animate-pulse-glow" />
        <Link href="/" className="font-space text-xl font-bold tracking-tight text-white">
          Prep<span className="text-primary">Arena</span>
          <span className="ml-1.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">ICSE</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-space font-medium text-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary border-l-2 border-primary glow-primary' 
                  : 'text-textSecondary hover:bg-bgTertiary hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary' : 'text-textMuted'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Level / User Card */}
      <div className="p-4 border-t border-borderColor bg-bgPrimary/50">
        <div className="mb-3 flex items-center gap-3">
          <img 
            src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
            alt="Student Avatar" 
            className="h-10 w-10 rounded-full border border-borderColor hover:border-primary transition-all duration-300"
          />
          <div className="overflow-hidden">
            <h4 className="font-space text-sm font-bold text-white truncate leading-tight">
              {profile.full_name || 'Class 10 Student'}
            </h4>
            <p className="font-space text-xs text-textSecondary truncate">
              @{profile.username || 'student'}
            </p>
          </div>
        </div>

        {/* Circular/Linear Level Stats */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-space">
            <span className="font-bold text-amberGold">Level {levelInfo.level} — {levelInfo.name}</span>
            <span className="text-textMuted">{profile.xp} / {levelInfo.maxXp} XP</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bgTertiary overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-amberGold transition-all duration-500 ease-out"
              style={{ width: `${levelInfo.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
