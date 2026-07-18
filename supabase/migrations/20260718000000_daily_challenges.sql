-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  challenge_date DATE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read daily challenges
CREATE POLICY "Anyone reads daily challenges" 
  ON daily_challenges FOR SELECT 
  USING (true);
