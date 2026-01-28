import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfvfrgplqtvfwwhawcmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdmZyZ3BscXR2Znd3aGF3Y21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTMyMzYsImV4cCI6MjA4NTEyOTIzNn0.tVSOtsnVKSeBdaUg9nb_Zp9n3B4puUUIkEMs-9Akehc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);