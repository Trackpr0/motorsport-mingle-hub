
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// These values should match the ones in your Supabase project settings
const SUPABASE_URL = "https://izdxmyglyqbvhhhrtwln.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZHhteWdseXFidmhoaHJ0d2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5OTEyMTYsImV4cCI6MjA1MDU2NzIxNn0.tfwDDWQOpon22Ly3qa_QzYADHsowWbtXZyca3D9gDyE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
