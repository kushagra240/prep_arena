import React from 'react';
import { usePrepArenaStore } from '@/lib/store';

interface SubjectBadgeProps {
  subjectId?: string;
  subjectSlug?: string;
  className?: string;
}

export function SubjectBadge({ subjectId, subjectSlug, className = '' }: SubjectBadgeProps) {
  const subjects = usePrepArenaStore((state) => state.subjects);
  
  const subject = subjects.find(s => 
    (subjectId && s.id === subjectId) || 
    (subjectSlug && s.slug === subjectSlug)
  );

  if (!subject) return null;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-space tracking-wide border transition-all ${className}`}
      style={{
        backgroundColor: `${subject.color}15`,
        borderColor: `${subject.color}50`,
        color: subject.color,
        boxShadow: `0 0 10px ${subject.color}10`
      }}
    >
      <span>{subject.icon}</span>
      <span>{subject.name}</span>
    </span>
  );
}
