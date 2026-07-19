'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProblems, ProblemFilter } from '@/lib/hooks/useProblems';
import { ProblemCard } from './ProblemCard';
import { Search, Filter, RefreshCw, XCircle } from 'lucide-react';

export function ProblemList() {
  const { getFilteredProblems, subjects } = useProblems();
  const searchParams = useSearchParams();

  // Filters state
  const [filterState, setFilterState] = useState<ProblemFilter>({
    subjectSlug: '',
    difficulty: undefined,
    problemType: undefined,
    status: 'all',
    searchQuery: '',
    chapterIds: [],
    chapterName: ''
  });

  // Sync parameters from URL on mount
  useEffect(() => {
    const subjectParam = searchParams.get('subject') || searchParams.get('subjectSlug');
    const chaptersParam = searchParams.get('chapters');
    const chapterNameParam = searchParams.get('chapter');

    if (subjectParam || chaptersParam || chapterNameParam) {
      setFilterState(prev => ({
        ...prev,
        subjectSlug: subjectParam || prev.subjectSlug,
        chapterIds: chaptersParam ? chaptersParam.split(',') : prev.chapterIds,
        chapterName: chapterNameParam || prev.chapterName
      }));
    }
  }, [searchParams]);

  const filteredProblems = getFilteredProblems(filterState);

  const handleResetFilters = () => {
    setFilterState({
      subjectSlug: '',
      difficulty: undefined,
      problemType: undefined,
      status: 'all',
      searchQuery: '',
      chapterIds: [],
      chapterName: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/60 p-5 shadow-glow space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-textMuted" />
            <input
              type="text"
              placeholder="Search problems by name, keywords, or board year (e.g., '#board-2023')..."
              value={filterState.searchQuery}
              onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full rounded-xl border border-borderColor bg-bgPrimary/60 py-2.5 pl-11 pr-4 font-space text-sm text-white placeholder-textMuted focus:border-primary focus:outline-none transition-all duration-300"
            />
          </div>
          
          {/* Reset Filters button */}
          {(filterState.subjectSlug || filterState.difficulty || filterState.problemType || filterState.status !== 'all' || filterState.searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-borderColor/80 bg-bgTertiary/30 px-4 py-2.5 font-space text-xs font-bold text-textSecondary hover:bg-bgTertiary hover:text-white transition-all duration-300 shrink-0"
            >
              <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Subject Filter */}
          <div className="space-y-1">
            <label className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Subject</label>
            <select
              value={filterState.subjectSlug || ''}
              onChange={(e) => setFilterState(prev => ({ ...prev, subjectSlug: e.target.value || undefined }))}
              className="w-full rounded-xl border border-borderColor bg-bgPrimary/60 p-2.5 font-space text-xs text-white focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.slug}>{sub.icon} {sub.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <label className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Difficulty</label>
            <select
              value={filterState.difficulty || ''}
              onChange={(e) => setFilterState(prev => ({ ...prev, difficulty: (e.target.value as any) || undefined }))}
              className="w-full rounded-xl border border-borderColor bg-bgPrimary/60 p-2.5 font-space text-xs text-white focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          {/* Problem Type Filter */}
          <div className="space-y-1">
            <label className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Question Type</label>
            <select
              value={filterState.problemType || ''}
              onChange={(e) => setFilterState(prev => ({ ...prev, problemType: (e.target.value as any) || undefined }))}
              className="w-full rounded-xl border border-borderColor bg-bgPrimary/60 p-2.5 font-space text-xs text-white focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="mcq">📋 MCQ</option>
              <option value="brief_writing">📝 Brief Essay</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider">Status</label>
            <select
              value={filterState.status || 'all'}
              onChange={(e) => setFilterState(prev => ({ ...prev, status: (e.target.value as any) || 'all' }))}
              className="w-full rounded-xl border border-borderColor bg-bgPrimary/60 p-2.5 font-space text-xs text-white focus:border-primary focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="solved">✅ Solved</option>
              <option value="unsolved">⭕ Unsolved</option>
              <option value="attempted">🟡 Attempted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Counter Banner */}
      <div className="flex items-center justify-between font-space text-xs text-textSecondary px-2">
        <span>Showing <strong className="text-white">{filteredProblems.length}</strong> ICSE Board standard questions</span>
      </div>

      {/* Problems List Grid */}
      {filteredProblems.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredProblems.map((problem, idx) => (
            <ProblemCard 
              key={problem.id} 
              problem={problem} 
              index={idx + 1} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-borderColor bg-bgSecondary/20 p-8 space-y-4">
          <XCircle size={48} className="text-textMuted" />
          <div className="space-y-1 max-w-md">
            <h4 className="font-space text-sm font-bold text-white uppercase tracking-wider">No matching problems found</h4>
            <p className="font-space text-xs text-textSecondary leading-relaxed">
              We couldn&apos;t find any questions matching your active filters. Try refining your keyword search, resetting difficulty levels, or selecting another subject.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="rounded-xl border border-primary/50 bg-primary/10 px-6 py-2.5 font-space text-xs font-bold text-primary hover:bg-primary hover:text-white hover:shadow-glow transition-all duration-300"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
