import React from 'react';
import { Award } from 'lucide-react';

interface XPCounterProps {
  xp: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function XPCounter({ xp, className = '', size = 'md' }: XPCounterProps) {
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

  return (
    <div className={`inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding} rounded-full border border-amberGold/30 bg-amberGold/5 text-amberGold font-space font-bold ${sizeStyles.text} transition-all duration-300 hover:bg-amberGold/10 hover:border-amberGold/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] ${className}`}>
      <Award size={sizeStyles.icon} className="animate-pulse" />
      <span>{(xp || 0).toLocaleString()} XP</span>
    </div>
  );
}
