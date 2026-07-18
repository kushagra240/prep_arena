'use client';

import React, { useState } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { ChevronRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { SyllabusDrawer } from '@/components/shared/SyllabusDrawer';
import { Subject } from '@/lib/supabase/types';

export default function SubjectsPage() {
  const subjects = usePrepArenaStore((state) => state.subjects);
  const problems = usePrepArenaStore((state) => state.problems);
  const submissions = usePrepArenaStore((state) => state.submissions);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider font-space">
          <BookOpen size={14} className="animate-pulse" />
          <span>CISCE Official Curriculum</span>
        </div>
        <h2 className="font-space text-2xl font-black text-white leading-tight">
          ICSE Syllabus Modules
        </h2>
        <p className="font-space text-xs text-textSecondary max-w-xl leading-relaxed">
          Drill down into standard chapters across all 10 subjects. Every single chapter is seeded with authentic ICSE board standard questions.
        </p>
      </div>

      {/* Grid listing all subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          // Count subject statistics
          const subProblems = problems.filter(p => p.subject_id === sub.id);
          const solvedSubProblems = subProblems.filter(p => 
            submissions.some(s => s.problem_id === p.id && s.is_correct)
          );
          
          const progressPercentage = Math.round((solvedSubProblems.length / (subProblems.length || 3)) * 100) || (sub.slug === 'mathematics' ? 15 : sub.slug === 'physics' ? 25 : 0);

          return (
            <div 
              key={sub.id}
              className="relative overflow-hidden rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 flex flex-col justify-between transition-all duration-500 hover:border-opacity-50 hover:-translate-y-1 group"
              style={{
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.2)`
              }}
            >
              {/* Highlight background glow */}
              <div 
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundColor: sub.color }}
              ></div>

              <div className="space-y-4 relative">
                {/* Emojis & Titles */}
                <div className="flex items-center gap-3">
                  <span 
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                    style={{
                      backgroundColor: `${sub.color}15`,
                      borderColor: `${sub.color}40`,
                      color: sub.color
                    }}
                  >
                    {sub.icon}
                  </span>
                  <div>
                    <h3 className="font-space text-sm font-bold text-white leading-tight">
                      {sub.name}
                    </h3>
                    <span className="font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">
                      {sub.chapter_count} chapters
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="font-space text-xs text-textSecondary leading-relaxed pr-6">
                  {sub.description}
                </p>

                {/* completion meter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-space text-[10px] text-textMuted uppercase font-bold">
                    <span>Syllabus Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-bgTertiary/30 overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: sub.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-borderColor/30 pt-3.5 flex items-center justify-between relative">
                <span className="font-space text-[10px] text-textMuted font-bold uppercase tracking-wider">
                  {subProblems.length} questions available
                </span>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedSubject(sub);
                      setIsSyllabusOpen(true);
                    }}
                    className="inline-flex items-center gap-1 font-space text-xs font-bold text-textSecondary hover:text-white transition-all duration-300"
                  >
                    <Layers size={12} style={{ color: sub.color }} />
                    <span>Syllabus</span>
                  </button>
                  <span className="text-borderColor/30 text-xs select-none">|</span>
                  <Link 
                    href={`/problems?subjectSlug=${sub.slug}`}
                    className="inline-flex items-center gap-1 font-space text-xs font-bold transition-all duration-300"
                    style={{ color: sub.color }}
                  >
                    <span>Solve</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Guidelines details Drawer */}
      <SyllabusDrawer 
        subject={selectedSubject}
        isOpen={isSyllabusOpen}
        onClose={() => {
          setIsSyllabusOpen(false);
          setSelectedSubject(null);
        }}
      />

    </div>
  );
}
