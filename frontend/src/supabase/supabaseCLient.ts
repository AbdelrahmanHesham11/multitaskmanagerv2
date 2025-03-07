import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xozoyskpunqygvaddboc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvem95c2twdW5xeWd2YWRkYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTY1NTMsImV4cCI6MjA1NjY5MjU1M30.h6VMizg9xaI342LH9dP-40zrWfgZdTI515JE-Y6g-IU';


export const supabase = createClient(supabaseUrl, supabaseKey);