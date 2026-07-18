-- Add focus_subjects to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS focus_subjects TEXT[] DEFAULT '{}';

-- Create mock_exams table
CREATE TABLE IF NOT EXISTS mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  config JSONB,                    -- {duration, difficulty, questionMix}
  questions JSONB,                 -- array of problem IDs
  answers JSONB,                   -- {problem_id: {answer, score, is_correct}}
  total_marks INTEGER,
  scored_marks NUMERIC(5,2),
  percentage NUMERIC(5,2),
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mock_exams
CREATE POLICY "Users can select their own mock exams" 
  ON mock_exams FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mock exams" 
  ON mock_exams FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mock exams" 
  ON mock_exams FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mock exams" 
  ON mock_exams FOR DELETE 
  USING (auth.uid() = user_id);

-- Leaderboard RPC for rank calculation
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT rank::INTEGER FROM (
    SELECT id, RANK() OVER (ORDER BY xp DESC) as rank
    FROM profiles
  ) ranked
  WHERE id = p_user_id;
$$ LANGUAGE SQL STABLE;
