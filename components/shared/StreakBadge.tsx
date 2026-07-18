import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, className = '', size = 'md' }: StreakBadgeProps) {
  const sizeStyles = {
    sm: {
      text: 'text-xs',
      icon: 14,
      gap: 'gap-1',
      padding: 'px-2 py-0.5'
    },
    md: {
      text: 'text-sm',
      icon: 16,
      gap: 'gap-1.5',
      padding: 'px-2.5 py-1'
    },
    lg: {
      text: 'text-lg',
      icon: 20,
      gap: 'gap-2',
      padding: 'px-4 py-1.5'
    }
  }[size];

  if (streak <= 0) return null;

  return (
    <div className={`inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding} rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 font-space font-bold ${sizeStyles.text} transition-all duration-300 hover:bg-orange-500/10 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] ${className}`}>
      <Flame size={sizeStyles.icon} className="fill-orange-500 animate-bounce" style={{ animationDuration: '2s' }} />
      <span>{streak} Day Streak</span>
    </div>
  );
}
