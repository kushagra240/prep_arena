import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isRealSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl.includes('supabase.co') && 
  supabaseServiceKey && 
  !supabaseServiceKey.includes('mock_service_key');

export const supabaseServer = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;
