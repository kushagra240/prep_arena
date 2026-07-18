import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { MOCK_PROBLEMS } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*, problems(*)')
        .eq('challenge_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily challenge from Supabase:', error);
      } else if (data) {
        return NextResponse.json(data);
      }
    }

    // Fallback: Deterministic offline mock daily challenge using today's date as a seed
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    // Filter problems to active ones (if any) or use all mock problems
    const activeMockProblems = MOCK_PROBLEMS.filter(p => p.is_active !== false);
    const sourceProblems = activeMockProblems.length > 0 ? activeMockProblems : MOCK_PROBLEMS;
    
    const index = hashCode(today) % sourceProblems.length;
    const selectedProblem = sourceProblems[index];

    // Format matches the output of the select('*, problems(*)') query
    return NextResponse.json({
      id: `daily-challenge-${today}`,
      problem_id: selectedProblem.id,
      challenge_date: today,
      problems: selectedProblem
    });

  } catch (error: any) {
    console.error('Unhandled error in daily-challenge API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
