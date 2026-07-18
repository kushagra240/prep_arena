import { usePrepArenaStore } from '../store';

export function useSubmissions() {
  const submissions = usePrepArenaStore((state) => state.submissions);
  const isLoading = usePrepArenaStore((state) => state.isLoading);
  const submitAnswer = usePrepArenaStore((state) => state.submitAnswer);

  const getSubmissionsForProblem = (problemId: string) => {
    return submissions.filter(s => s.problem_id === problemId);
  };

  const getRecentSubmissions = (limit: number = 5) => {
    return submissions.slice(0, limit);
  };

  return {
    submissions,
    isLoading,
    submitAnswer,
    getSubmissionsForProblem,
    getRecentSubmissions
  };
}
