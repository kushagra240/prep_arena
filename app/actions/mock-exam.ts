'use server';

import { supabaseServer } from '@/lib/supabase/server';

interface MockExamData {
  id: string;
  user_id: string;
  subject_id: string;
  config: any;
  questions: any[];
  answers: any;
  total_marks: number;
  scored_marks: number;
  percentage: number;
  time_taken_seconds: number;
  completed_at: string;
}

export async function saveMockExamResult(data: MockExamData) {
  if (!supabaseServer) {
    return { success: true, offline: true };
  }

  try {
    const { error } = await supabaseServer
      .from('mock_exams')
      .insert({
        id: data.id,
        user_id: data.user_id,
        subject_id: data.subject_id === 'all' ? null : data.subject_id,
        config: data.config,
        questions: data.questions,
        answers: data.answers,
        total_marks: data.total_marks,
        scored_marks: data.scored_marks,
        percentage: data.percentage,
        time_taken_seconds: data.time_taken_seconds,
        completed_at: data.completed_at
      });

    if (error) {
      console.error('Supabase write error during mock exam save:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Mock exam save action failed:', error);
    return { success: false, error: error.message || 'Saving failed' };
  }
}
