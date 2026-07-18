import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get date for tomorrow in IST (UTC+5.5)
    // Date.now() + 24 hours + 5.5 hours
    const tomorrow = new Date(Date.now() + 29.5 * 60 * 60 * 1000);
    const dateStr = tomorrow.toISOString().split('T')[0];

    // Fetch problems that have been active and NOT in the last 30 days of challenges
    // 1. Get recent challenge problem IDs
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: recentChallenges, error: chalError } = await supabase
      .from('daily_challenges')
      .select('problem_id')
      .gte('challenge_date', thirtyDaysAgo);

    if (chalError) throw chalError;
    const excludedIds = recentChallenges?.map(c => c.problem_id) || [];

    // 2. Fetch active problems
    const { data: problems, error: probError } = await supabase
      .from('problems')
      .select('id')
      .eq('is_active', true);

    if (probError) throw probError;
    if (!problems || problems.length === 0) {
      return new Response(JSON.stringify({ error: 'No active problems found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter out excluded ones
    let eligibleProblems = problems.filter(p => !excludedIds.includes(p.id));
    // If all problems were used, fallback to any active problem
    if (eligibleProblems.length === 0) {
      eligibleProblems = problems;
    }

    // Pick random
    const randomProblem = eligibleProblems[Math.floor(Math.random() * eligibleProblems.length)];

    // Insert daily challenge
    const { data: inserted, error: insertError } = await supabase
      .from('daily_challenges')
      .insert({
        problem_id: randomProblem.id,
        challenge_date: dateStr
      })
      .select()
      .single();

    if (insertError) {
      // If it already exists (e.g. duplicate trigger), just return it or handle gracefully
      if (insertError.code === '23505') { // unique violation
        return new Response(JSON.stringify({ message: 'Daily challenge already exists for date: ' + dateStr }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true, challenge: inserted }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
