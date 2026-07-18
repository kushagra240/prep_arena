'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase/server';

interface OnboardingData {
  userId: string;
  username: string;
  fullName: string;
  school: string;
  city: string;
  avatarUrl: string;
  focusSubjects: string[];
}

export async function completeOnboarding(data: OnboardingData) {
  const { userId, username, fullName, school, city, avatarUrl, focusSubjects } = data;

  try {
    // 1. Update Clerk publicMetadata
    const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboarded: true,
        school,
        city
      }
    });

    // 2. Write to Supabase if configured
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from('profiles')
        .upsert({
          id: userId,
          clerk_user_id: userId,
          username,
          full_name: fullName,
          school,
          city,
          avatar_url: avatarUrl,
          focus_subjects: focusSubjects,
          grade: '10',
          board: 'ICSE',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase write error during onboarding:', error);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Onboarding action failed:', error);
    return { success: false, error: error.message || 'Onboarding failed' };
  }
}

export async function checkUsernameUniqueness(username: string): Promise<boolean> {
  if (!supabaseServer) {
    // Mock local uniqueness checks against static competitors
    const mockCompetitors = [
      'arjun_mehta',
      'priya_sharma',
      'soham_roy',
      'ananya_sen',
      'rahul_verma',
      'kushagra_icse'
    ];
    return !mockCompetitors.includes(username.toLowerCase().trim());
  }

  try {
    const { data, error } = await supabaseServer
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;
    return data === null;
  } catch (err) {
    console.error('Uniqueness check error:', err);
    return true; // Fallback to safe true
  }
}

export async function updateUserSettings(data: {
  userId: string;
  username: string;
  fullName: string;
  school: string;
  city: string;
  avatarUrl: string;
  focusSubjects: string[];
}) {
  const { userId, username, fullName, school, city, avatarUrl, focusSubjects } = data;

  try {
    // 1. Update Clerk publicMetadata
    const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        school,
        city
      }
    });

    // 2. Write to Supabase if configured
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from('profiles')
        .upsert({
          id: userId,
          clerk_user_id: userId,
          username,
          full_name: fullName,
          school,
          city,
          avatar_url: avatarUrl,
          focus_subjects: focusSubjects,
          grade: '10',
          board: 'ICSE',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase write error during settings update:', error);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Settings update action failed:', error);
    return { success: false, error: error.message || 'Settings update failed' };
  }
}
