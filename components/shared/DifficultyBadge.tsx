import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

export function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const styles = {
    easy: {
      bg: 'bg-correct/10',
      border: 'border-correct/30',
      text: 'text-correct',
      shadow: 'shadow-correctGlow',
      label: 'Easy'
    },
    medium: {
      bg: 'bg-amberGold/10',
      border: 'border-amberGold/30',
      text: 'text-amberGold',
      shadow: 'shadow-amberGlow',
      label: 'Medium'
    },
    hard: {
      bg: 'bg-wrong/10',
      border: 'border-wrong/30',
      text: 'text-wrong',
      shadow: 'shadow-wrongGlow',
      label: 'Hard'
    }
  }[difficulty];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold font-space border tracking-wider transition-all duration-300 ${styles.bg} ${styles.border} ${styles.text} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {styles.label}
    </span>
  );
}
