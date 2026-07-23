import { usePrepArenaStore } from '../store';
import { Problem } from '../supabase/types';
import { useMemo, useCallback } from 'react';

export interface ProblemFilter {
  subjectSlug?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  problemType?: 'mcq' | 'brief_writing';
  status?: 'all' | 'solved' | 'unsolved' | 'attempted';
  searchQuery?: string;
  chapterIds?: string[];
  chapterName?: string;
}

export function useProblems() {
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const submissions = usePrepArenaStore((state) => state.submissions);

  // Precompute solvedStatusMap for O(1) lookups
  const solvedStatusMap = useMemo(() => {
    const statusMap = new Map<string, 'solved' | 'attempted'>();
    for (let i = submissions.length - 1; i >= 0; i--) {
      const s = submissions[i];
      if (s.is_correct) {
        statusMap.set(s.problem_id, 'solved');
      } else if (statusMap.get(s.problem_id) !== 'solved') {
        statusMap.set(s.problem_id, 'attempted');
      }
    }
    return statusMap;
  }, [submissions]);

  const getFilteredProblems = useCallback((filter: ProblemFilter): Problem[] => {
    // Cache subject ID and chapter ID lookup outside the filter loop
    let filterSubjectId: string | undefined = undefined;
    if (filter.subjectSlug) {
      const subject = subjects.find(s => s.slug === filter.subjectSlug);
      filterSubjectId = subject?.id;
    }

    let filterChapterId: string | undefined = undefined;
    if (filter.chapterName) {
      const chapter = chapters.find(c => c.name.toLowerCase() === filter.chapterName?.toLowerCase());
      filterChapterId = chapter?.id;
    }

    return problems.filter((problem) => {
      // 1. Subject filter
      if (filter.subjectSlug) {
        if (!filterSubjectId || problem.subject_id !== filterSubjectId) return false;
      }

      // 2. Difficulty filter
      if (filter.difficulty && problem.difficulty !== filter.difficulty) return false;

      // 3. Problem type filter
      if (filter.problemType && problem.problem_type !== filter.problemType) return false;

      // 4. Status filter
      if (filter.status && filter.status !== 'all') {
        const currentStatus = solvedStatusMap.get(problem.id) || 'unsolved';

        if (filter.status === 'solved' && currentStatus !== 'solved') return false;
        if (filter.status === 'unsolved' && currentStatus === 'solved') return false;
        if (filter.status === 'attempted' && currentStatus === 'unsolved') return false;
      }

      // 5. Search query filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesText = problem.question_text.toLowerCase().includes(query);
        const matchesTags = problem.tags.some(t => t.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesText && !matchesTags) return false;
      }

      // 6. Chapter IDs filter
      if (filter.chapterIds && filter.chapterIds.length > 0 && !filter.chapterIds.includes(problem.chapter_id)) {
        return false;
      }

      // 7. Chapter Name filter
      if (filter.chapterName) {
        if (!filterChapterId || problem.chapter_id !== filterChapterId) return false;
      }

      return true;
    });
  }, [problems, subjects, chapters, solvedStatusMap]);

  const getSolvedStatus = useCallback((problemId: string): 'solved' | 'attempted' | 'unsolved' => {
    return solvedStatusMap.get(problemId) || 'unsolved';
  }, [solvedStatusMap]);

  return {
    problems,
    subjects,
    chapters,
    getFilteredProblems,
    getSolvedStatus
  };
}
