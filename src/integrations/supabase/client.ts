// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iywpzcogmjnlleyjyjoy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5d3B6Y29nbWpubGxleWp5am95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTM4NjIsImV4cCI6MjA1ODA2OTg2Mn0.ZBK9sty5vaEfMhwF6RQVa-w4k_mibFxkv-LF5K6EAkg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);