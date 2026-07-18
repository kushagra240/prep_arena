import { usePrepArenaStore } from '../store';
import { Problem } from '../supabase/types';

export interface ProblemFilter {
  subjectSlug?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  problemType?: 'mcq' | 'brief_writing';
  status?: 'all' | 'solved' | 'unsolved' | 'attempted';
  searchQuery?: string;
}

export function useProblems() {
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const submissions = usePrepArenaStore((state) => state.submissions);

  const getFilteredProblems = (filter: ProblemFilter): Problem[] => {
    return problems.filter((problem) => {
      // 1. Subject filter
      if (filter.subjectSlug) {
        const subject = subjects.find(s => s.slug === filter.subjectSlug);
        if (!subject || problem.subject_id !== subject.id) return false;
      }

      // 2. Difficulty filter
      if (filter.difficulty && problem.difficulty !== filter.difficulty) return false;

      // 3. Problem type filter
      if (filter.problemType && problem.problem_type !== filter.problemType) return false;

      // 4. Status filter
      if (filter.status && filter.status !== 'all') {
        const userSolved = submissions.some(s => s.problem_id === problem.id && s.is_correct);
        const userAttempted = submissions.some(s => s.problem_id === problem.id);

        if (filter.status === 'solved' && !userSolved) return false;
        if (filter.status === 'unsolved' && userSolved) return false;
        if (filter.status === 'attempted' && !userAttempted) return false;
      }

      // 5. Search query filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesText = problem.question_text.toLowerCase().includes(query);
        const matchesTags = problem.tags.some(t => t.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesText && !matchesTags) return false;
      }

      return true;
    });
  };

  const getSolvedStatus = (problemId: string): 'solved' | 'attempted' | 'unsolved' => {
    const isSolved = submissions.some(s => s.problem_id === problemId && s.is_correct);
    if (isSolved) return 'solved';
    
    const isAttempted = submissions.some(s => s.problem_id === problemId);
    if (isAttempted) return 'attempted';

    return 'unsolved';
  };

  return {
    problems,
    subjects,
    chapters,
    getFilteredProblems,
    getSolvedStatus
  };
}
