import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mkkblunwukwdxpxqwavd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ra2JsdW53dWt3ZHhweHF3YXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NDUwMjUsImV4cCI6MjA2MjQyMTAyNX0.CLJLfp3cjrtCYc6FxxCKmaNpn6VVbMtFjuLjK5kOhC4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

