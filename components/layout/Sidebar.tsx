import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrepArenaStore } from '@/lib/store';
import { getLevelInfo } from '@/lib/utils/xp';
import { useUser } from '@clerk/nextjs';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Trophy, 
  User, 
  Settings, 
  GraduationCap,
  BarChart2,
  Copy,
  Shield
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const profile = usePrepArenaStore((state) => state.profile);
  const levelInfo = getLevelInfo(profile.xp || 0);

  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.username === 'admin';

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Problems', icon: BookOpen, href: '/problems' },
    { name: 'Subjects', icon: Layers, href: '/subjects' },
    { name: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { name: 'Analytics', icon: BarChart2, href: '/analytics' },
    { name: 'Flashcards', icon: Copy, href: '/flashcards' },
    { name: 'Profile', icon: User, href: `/profile/${profile.username || 'kushagra_icse'}` },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Admin Panel', icon: Shield, href: '/admin' });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-borderColor bg-bgSecondary/95 backdrop-blur-md md:flex md:flex-col">
      {/* Header / Logo */}
      <div className="flex h-16 items-center px-6 gap-2 border-b border-borderColor">
        <GraduationCap className="h-8 w-8 text-primary animate-pulse-glow" />
        <Link href="/" className="font-space text-xl font-bold tracking-tight text-white group">
          Prep<span className="text-primary transition-colors group-hover:text-primary-hover">Arena</span>
          <span className="ml-1.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase border border-primary/20">ICSE</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/'));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-space font-medium text-sm transition-colors duration-200 group ${
                isActive 
                  ? 'text-primary' 
                  : 'text-textSecondary hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarTab"
                  className="absolute inset-0 rounded-xl bg-primary/10 border-l-2 border-primary glow-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={18} className={`relative z-10 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-textMuted group-hover:text-white'}`} />
              <span className="relative z-10">{item.name}</span>
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
            className="h-10 w-10 rounded-full border border-borderColor hover:border-primary transition-all duration-300 transform hover:scale-105"
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
