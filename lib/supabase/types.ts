export interface Profile {
  id: string;
  clerk_user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  school: string | null;
  city: string | null;
  grade: string;
  board: string;
  xp: number;
  streak_days: number;
  last_activity_date: string | null;
  total_solved: number;
  total_attempted: number;
  created_at: string;
  updated_at: string;
  focus_subjects?: string[];
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  chapter_count: number;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  order_index: number;
  syllabus_reference: string;
  created_at: string;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Problem {
  id: string;
  chapter_id: string;
  subject_id: string;
  title: string;
  slug: string;
  problem_type: 'mcq' | 'brief_writing' | 'fill_blank' | 'match';
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  question_image_url: string | null;
  marks: number;
  time_limit_seconds: number;
  tags: string[];
  mcq_options: MCQOption[] | null;
  expected_answer: string | null;
  answer_keywords: string[] | null;
  min_words: number | null;
  max_words: number | null;
  icse_year: number | null;
  is_board_question: boolean;
  total_attempts: number;
  total_correct: number;
  xp_reward: number;
  created_at: string;
  is_active: boolean;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  answer_text: string | null;
  selected_option_id: string | null;
  is_correct: boolean;
  ai_score: number | null;
  ai_feedback: string | null;
  time_taken_seconds: number;
  xp_earned: number;
  submitted_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  subject_stats: Record<string, { solved: number; attempted: number; accuracy: number }>;
  difficulty_stats: {
    easy: { solved: number };
    medium: { solved: number };
    hard: { solved: number };
  };
  weekly_xp: number;
  monthly_xp: number;
  all_time_xp: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  xp_bonus: number;
  condition_type: string;
  condition_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}
